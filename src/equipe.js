import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase.js';
import { clearLocalUserData } from './store.js';

/* ---------------------------------------------------------------- */
/* Entreprise, membres, rôles et invitations.                         */
/* Les droits sont vérifiés par la base (règles RLS + fonctions) ;    */
/* l'app se contente de masquer ce qui n'est pas permis.              */
/* ---------------------------------------------------------------- */

export const ROLES = {
  proprietaire: { label: 'Propriétaire', description: 'Accès complet. Ne peut pas être retiré.' },
  associe: { label: 'Associé', description: 'Accès complet, y compris l’ajout de membres.' },
  comptable: { label: 'Comptable', description: 'Voit et saisit les entrées et sorties de tous les chantiers.' },
  employe: { label: 'Employé', description: 'Voit et saisit uniquement sur les chantiers qui lui sont attribués.' },
};
export const ROLES_INVITABLES = ['associe', 'comptable', 'employe'];

export const peutGerer = (role) => role === 'proprietaire' || role === 'associe';
export const voitTousLesChantiers = (role) => role !== 'employe';

const membreKey = (userId) => `gestion-chantiers-membre:${userId}`;
const equipeKey = (userId) => `gestion-chantiers-equipe:${userId}`;

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // mémoire pleine : sans conséquence, on relira en ligne
  }
}

export function clearLocalEquipe(userId) {
  try {
    localStorage.removeItem(membreKey(userId));
    localStorage.removeItem(equipeKey(userId));
  } catch (e) {
    // rien à faire
  }
}

// Déconnexion : efface aussi la copie locale (téléphone partagé).
export async function deconnecter(userId) {
  clearLocalUserData(userId);
  clearLocalEquipe(userId);
  await supabase.auth.signOut({ scope: 'local' });
}

// Erreurs Supabase → messages lisibles.
function message(error) {
  const m = error?.message || '';
  if (/fetch|network/i.test(m)) return 'Pas de connexion internet. Réessayez une fois connecté.';
  return m || 'Une erreur est survenue.';
}

async function rpc(name, args) {
  const { data, error } = await supabase.rpc(name, args);
  if (error) throw new Error(message(error));
  return data;
}

// Appartenance de l'utilisateur : { entrepriseId, entrepriseNom, role, nomAffiche }
// ou null s'il n'a pas encore d'entreprise. Hors ligne, on reprend la dernière connue.
export async function chargerMembre(userId) {
  const { data, error } = await supabase
    .from('membres')
    .select('entreprise_id, role, nom_affiche, entreprises(nom)')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    const cached = readJSON(membreKey(userId));
    if (cached) return cached;
    throw new Error(message(error));
  }
  const membre = data
    ? { entrepriseId: data.entreprise_id, entrepriseNom: data.entreprises?.nom || '', role: data.role, nomAffiche: data.nom_affiche }
    : null;
  if (membre) writeJSON(membreKey(userId), membre);
  else clearLocalEquipe(userId);
  return membre;
}

// Invitations reçues par l'utilisateur connecté.
export async function chargerMesInvitations(email) {
  const { data, error } = await supabase
    .from('invitations')
    .select('id, entreprise_id, role, entreprise_nom, invite_par_nom, created_at')
    .eq('email', (email || '').toLowerCase())
    .order('created_at', { ascending: false });
  if (error) throw new Error(message(error));
  return data;
}

export const actionsEquipe = {
  creerEntreprise: (nom) => rpc('creer_entreprise', { p_nom: nom }),
  renommerEntreprise: (nom) => rpc('renommer_entreprise', { p_nom: nom }),
  definirMonNom: (nom) => rpc('definir_mon_nom', { p_nom: nom }),
  inviter: (email, role) => rpc('inviter_membre', { p_email: email, p_role: role }),
  annulerInvitation: (id) => rpc('annuler_invitation', { p_id: id }),
  accepterInvitation: (id, transferer) => rpc('accepter_invitation', { p_id: id, p_transferer: Boolean(transferer) }),
  refuserInvitation: (id) => rpc('refuser_invitation', { p_id: id }),
  changerRole: (userId, role) => rpc('changer_role', { p_user: userId, p_role: role }),
  retirerMembre: (userId) => rpc('retirer_membre', { p_user: userId }),
  definirAffectations: (userId, chantierIds) => rpc('definir_affectations', { p_user: userId, p_chantiers: chantierIds }),
};

// Membres, chantiers attribués et invitations envoyées par l'entreprise.
export function useEquipe(userId, email, role) {
  const [equipe, setEquipe] = useState(() => readJSON(equipeKey(userId)) || { membres: [], affectations: [], invitations: [] });
  const [mesInvitations, setMesInvitations] = useState([]);
  const [erreur, setErreur] = useState('');

  const recharger = useCallback(async () => {
    try {
      const [m, a, inv, mesInv] = await Promise.all([
        supabase.from('membres').select('user_id, role, nom_affiche, email, created_at').order('created_at'),
        supabase.from('affectations').select('chantier_id, user_id'),
        peutGerer(role)
          ? supabase.from('invitations').select('id, email, role, created_at').neq('email', (email || '').toLowerCase()).order('created_at', { ascending: false })
          : Promise.resolve({ data: [] }),
        chargerMesInvitations(email),
      ]);
      const err = m.error || a.error || inv.error;
      if (err) throw err;
      const next = { membres: m.data, affectations: a.data, invitations: inv.data };
      setEquipe(next);
      writeJSON(equipeKey(userId), next);
      setMesInvitations(mesInv);
      setErreur('');
    } catch (e) {
      setErreur(message(e));
    }
  }, [userId, email, role]);

  useEffect(() => {
    recharger();
    const onVisible = () => { if (document.visibilityState === 'visible') recharger(); };
    window.addEventListener('online', recharger);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('online', recharger);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [recharger]);

  return { ...equipe, mesInvitations, erreur, recharger };
}
