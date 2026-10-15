import React, { useState } from 'react';
import { supabase } from './supabase.js';

/* ---------------------------------------------------------------- */
/* Écrans d'authentification : connexion, inscription, mot de passe  */
/* oublié, et choix d'un nouveau mot de passe (après le lien e-mail).  */
/* ---------------------------------------------------------------- */

const C = {
  bg: '#F5F7FA', surface: '#FFFFFF', border: '#E6EAF0', text: '#0F172A', textMuted: '#64748B',
  brand: '#1D4ED8', brandDark: '#172554', red: '#B91C1C', redTint: '#FEF2F2', green: '#047857', greenTint: '#ECFDF5',
};

const inputStyle = {
  width: '100%', padding: '12px 13px', borderRadius: 11, border: `1px solid ${C.border}`,
  background: C.surface, fontSize: 15, color: C.text, outline: 'none',
};

// Messages d'erreur Supabase traduits pour l'utilisateur.
function messageErreur(error) {
  const m = (error?.message || '').toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-mail ou mot de passe incorrect.';
  if (m.includes('email not confirmed')) return 'Confirmez d’abord votre adresse : ouvrez le lien reçu par e-mail.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'Un compte existe déjà avec cet e-mail. Connectez-vous.';
  if (m.includes('password should be at least') || m.includes('weak')) return 'Mot de passe trop court : 6 caractères minimum.';
  if (m.includes('rate limit') || m.includes('security purposes')) return 'Trop de tentatives. Patientez une minute puis réessayez.';
  if (m.includes('invalid email') || m.includes('unable to validate email')) return 'Adresse e-mail invalide.';
  if (m.includes('failed to fetch') || m.includes('network')) return 'Pas de connexion internet. Réessayez une fois connecté.';
  return error?.message || 'Une erreur est survenue.';
}

function Shell({ title, subtitle, children }) {
  return (
    <div className="gc-root min-h-screen flex flex-col" style={{ background: C.bg }}>
      <header className="px-5 pt-5 pb-8" style={{ background: `linear-gradient(145deg, ${C.brandDark} 0%, #1E3A8A 55%, ${C.brand} 100%)`, color: '#fff' }}>
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] font-bold" style={{ color: '#BFDBFE' }}>Pilotage financier</p>
            <p className="gc-display text-xl mt-1">Gestion Chantiers</p>
          </div>
          <img src="./icons/gc-icon-v12-128.png" alt="" width="44" height="44" />
        </div>
      </header>
      <main className="flex-1 px-4" style={{ marginTop: -18 }}>
        <div className="max-w-md mx-auto rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 12px 30px rgba(15,23,42,.08)' }}>
          <h1 className="gc-display text-[24px] leading-tight">{title}</h1>
          {subtitle && <p className="text-sm mt-1 mb-4" style={{ color: C.textMuted }}>{subtitle}</p>}
          {children}
        </div>
      </main>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block mb-3">
      <span className="block text-xs font-medium mb-1" style={{ color: C.textMuted }}>{label}</span>
      <input {...props} style={inputStyle} />
    </label>
  );
}

function Notice({ tone, children }) {
  const s = tone === 'error' ? { bg: C.redTint, fg: C.red } : { bg: C.greenTint, fg: C.green };
  return <p className="text-sm px-3 py-2.5 rounded-xl mb-3" style={{ background: s.bg, color: s.fg }}>{children}</p>;
}

function SubmitButton({ busy, children }) {
  return (
    <button type="submit" disabled={busy} style={{ background: C.brand, color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 16px', borderRadius: 11, width: '100%', opacity: busy ? 0.6 : 1, boxShadow: '0 8px 20px rgba(29,78,216,.18)' }}>
      {busy ? 'Patientez…' : children}
    </button>
  );
}

function LinkButton({ onClick, children }) {
  return <button type="button" onClick={onClick} className="text-sm font-bold" style={{ color: C.brand, background: 'none' }}>{children}</button>;
}

export function AuthScreen() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const go = (m) => { setMode(m); setError(''); setInfo(''); };
  // Adresse de retour des liens envoyés par e-mail : l'app elle-même.
  const redirectTo = window.location.origin + window.location.pathname;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(''); setInfo('');
    try {
      if (mode === 'login') {
        const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (err) throw err;
      } else if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: redirectTo } });
        if (err) throw err;
        // Sans session, la confirmation par e-mail est requise.
        if (!data.session) setInfo('Compte créé ! Ouvrez le lien reçu par e-mail pour l’activer, puis connectez-vous.');
      } else {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
        if (err) throw err;
        setInfo('Si un compte existe pour cette adresse, un e-mail de réinitialisation vient d’être envoyé.');
      }
    } catch (err) {
      setError(messageErreur(err));
    } finally {
      setBusy(false);
    }
  };

  const titles = {
    login: ['Connexion', 'Retrouvez vos chantiers sur n’importe quel téléphone.'],
    signup: ['Créer un compte', 'Vos données seront sauvegardées en ligne et liées à ce compte.'],
    forgot: ['Mot de passe oublié', 'Recevez un lien par e-mail pour en choisir un nouveau.'],
  };

  return (
    <Shell title={titles[mode][0]} subtitle={titles[mode][1]}>
      <form onSubmit={submit}>
        {error && <Notice tone="error">{error}</Notice>}
        {info && <Notice>{info}</Notice>}
        <Field label="Adresse e-mail" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" />
        {mode !== 'forgot' && (
          <Field label="Mot de passe" type="password" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === 'signup' ? '6 caractères minimum' : ''} />
        )}
        <div className="mt-2">
          <SubmitButton busy={busy}>{mode === 'login' ? 'Se connecter' : mode === 'signup' ? 'Créer mon compte' : 'Envoyer le lien'}</SubmitButton>
        </div>
      </form>
      <div className="flex flex-col items-center gap-3 mt-5">
        {mode === 'login' && <>
          <LinkButton onClick={() => go('signup')}>Pas encore de compte ? Créer un compte</LinkButton>
          <LinkButton onClick={() => go('forgot')}>Mot de passe oublié ?</LinkButton>
        </>}
        {mode !== 'login' && <LinkButton onClick={() => go('login')}>J’ai déjà un compte — me connecter</LinkButton>}
      </div>
    </Shell>
  );
}

// Affiché après un clic sur le lien « réinitialiser le mot de passe ».
export function NewPasswordScreen({ onDone }) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) setError(messageErreur(err));
    else onDone();
  };

  return (
    <Shell title="Nouveau mot de passe" subtitle="Choisissez le mot de passe que vous utiliserez désormais.">
      <form onSubmit={submit}>
        {error && <Notice tone="error">{error}</Notice>}
        <Field label="Nouveau mot de passe" type="password" autoComplete="new-password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 caractères minimum" />
        <div className="mt-2"><SubmitButton busy={busy}>Enregistrer</SubmitButton></div>
      </form>
    </Shell>
  );
}
