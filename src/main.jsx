import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthScreen, NewPasswordScreen } from './Auth.jsx';
import { OnboardingScreen } from './Equipe.jsx';
import { chargerMembre, deconnecter } from './equipe.js';
import { ConfirmHost } from './confirm.jsx';
import { supabase } from './supabase.js';
import './responsive.css';

function Loading({ children = 'Chargement…' }) {
  return (
    <div className="gc-root min-h-screen flex items-center justify-center px-5">
      <p className="gc-display text-lg text-center" style={{ color: '#64748B' }}>{children}</p>
    </div>
  );
}

// Charge l'entreprise et le rôle de l'utilisateur connecté.
function Espace({ user }) {
  const [membre, setMembre] = useState(undefined); // undefined = chargement, null = pas d'entreprise
  const [erreur, setErreur] = useState('');

  const charger = () => {
    setErreur('');
    chargerMembre(user.id).then(setMembre).catch((e) => setErreur(e.message));
  };
  useEffect(charger, [user.id]);

  // Changement d'entreprise (invitation acceptée, départ…) : on repart de zéro.
  const recommencer = () => window.location.reload();

  if (erreur) {
    return (
      <Loading>
        {erreur}
        <br />
        <button onClick={charger} className="text-sm font-bold mt-4" style={{ color: '#1D4ED8' }}>Réessayer</button>
      </Loading>
    );
  }
  if (membre === undefined) return <Loading />;
  if (membre === null) return <OnboardingScreen user={user} onDone={recommencer} onLogout={() => deconnecter(user.id)} />;
  return (
    <App
      key={membre.entrepriseId}
      user={user}
      membre={membre}
      onMembreUpdated={(patch) => setMembre((m) => ({ ...m, ...patch }))}
      onMembershipChanged={recommencer}
    />
  );
}

// Choisit l'écran selon la session : connexion, nouveau mot de passe, ou l'app.
function Root() {
  const [session, setSession] = useState(undefined); // undefined = en cours de lecture
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) return <Loading />;
  if (session && recovery) return <NewPasswordScreen onDone={() => setRecovery(false)} />;
  if (!session) return <AuthScreen />;
  // key : changer de compte repart d'un état propre.
  return <Espace key={session.user.id} user={session.user} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
    <ConfirmHost />
  </React.StrictMode>
);

// En dev, le service worker mettrait en cache des fichiers en cours de modification.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // L'app fonctionne normalement même si le service worker échoue à s'enregistrer
    });
  });
}
