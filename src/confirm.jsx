import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { C } from './ui.jsx';

/* ---------------------------------------------------------------- */
/* Fenêtre de confirmation aux couleurs de l'app, à la place de       */
/* window.confirm() (qui affiche l'adresse du site).                  */
/*                                                                    */
/*   if (!(await demanderConfirmation({ titre, message }))) return;   */
/* ---------------------------------------------------------------- */

let ouvrir = null;

export function demanderConfirmation({ titre, message, confirmer = 'Supprimer', danger = true }) {
  return new Promise((resolve) => {
    if (!ouvrir) { resolve(window.confirm(message)); return; } // repli si la fenêtre n'est pas montée
    ouvrir({ titre, message, confirmer, danger, resolve });
  });
}

// À monter une seule fois, à la racine de l'app.
export function ConfirmHost() {
  const [demande, setDemande] = useState(null);

  useEffect(() => {
    ouvrir = setDemande;
    return () => { ouvrir = null; };
  }, []);

  const repondre = (ok) => {
    demande?.resolve(ok);
    setDemande(null);
  };

  useEffect(() => {
    if (!demande) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') repondre(false);
      if (e.key === 'Enter') repondre(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!demande) return null;
  const accent = demande.danger ? C.red : C.brand;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-5" style={{ zIndex: 80, background: 'rgba(15,23,42,0.52)', backdropFilter: 'blur(5px)', fontFamily: "'DM Sans', sans-serif", color: C.text }} onClick={() => repondre(false)}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="gc-confirm-titre" className="w-full rounded-2xl p-5" style={{ maxWidth: 360, background: C.surface, boxShadow: '0 24px 60px rgba(15,23,42,.25)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-center rounded-full mx-auto mb-3" style={{ width: 48, height: 48, background: demande.danger ? C.redTint : C.brandTint, color: accent }}>
          <AlertTriangle size={22} />
        </div>
        <h3 id="gc-confirm-titre" className="gc-display text-lg text-center">{demande.titre}</h3>
        {demande.message && <p className="text-sm text-center mt-2" style={{ color: C.textMuted, whiteSpace: 'pre-line' }}>{demande.message}</p>}
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button onClick={() => repondre(false)} className="text-sm font-bold py-3 rounded-xl" style={{ background: C.surfaceSoft, color: C.text, border: `1px solid ${C.border}` }}>Annuler</button>
          <button autoFocus onClick={() => repondre(true)} className="text-sm font-bold py-3 rounded-xl" style={{ background: accent, color: '#fff' }}>{demande.confirmer}</button>
        </div>
      </div>
    </div>
  );
}
