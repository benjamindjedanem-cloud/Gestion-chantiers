import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthScreen, NewPasswordScreen } from './Auth.jsx';
import { supabase } from './supabase.js';
import './responsive.css';

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

  if (session === undefined) {
    return (
      <div className="gc-root min-h-screen flex items-center justify-center">
        <p className="gc-display text-lg" style={{ color: '#64748B' }}>Chargement…</p>
      </div>
    );
  }
  if (session && recovery) return <NewPasswordScreen onDone={() => setRecovery(false)} />;
  if (!session) return <AuthScreen />;
  // key : changer de compte repart d'un état propre.
  return <App key={session.user.id} user={session.user} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
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
