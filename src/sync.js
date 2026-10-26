import { supabase } from './supabase.js';

/* ---------------------------------------------------------------- */
/* Échanges avec Supabase : conversion des lignes et envoi/réception. */
/* ---------------------------------------------------------------- */

export const TABLES = ['chantiers', 'entrees', 'sorties'];

const dateOrNull = (s) => (s ? s : null);
const dateOrEmpty = (s) => s || '';

// L'auteur (user_id) n'est jamais envoyé : la base le remplit à la création
// et le conserve lors des modifications.
const toRow = {
  chantiers: (c, entrepriseId) => ({
    entreprise_id: entrepriseId, id: c.id, nom: c.nom || '', client: c.client || '', adresse: c.adresse || '',
    date_debut: dateOrNull(c.dateDebut), date_fin: dateOrNull(c.dateFin), date_fin_reelle: dateOrNull(c.dateFinReelle),
    budget: Number(c.budget || 0), statut: c.statut || 'En cours',
  }),
  entrees: (e, entrepriseId) => ({
    entreprise_id: entrepriseId, id: e.id, chantier_id: e.chantierId, date: dateOrNull(e.date),
    verse_par: e.versePar || '', description: e.description || '', mode: e.mode || '', montant: Number(e.montant || 0),
  }),
  sorties: (s, entrepriseId) => ({
    entreprise_id: entrepriseId, id: s.id, chantier_id: s.chantierId, date: dateOrNull(s.date),
    beneficiaire: s.beneficiaire || '', type: s.type || '', description: s.description || '', mode: s.mode || '',
    montant_du: Number(s.montantDu || 0), paiements: s.paiements || [],
  }),
};

const fromRow = {
  chantiers: (r) => ({
    id: r.id, nom: r.nom, client: r.client, adresse: r.adresse,
    dateDebut: dateOrEmpty(r.date_debut), dateFin: dateOrEmpty(r.date_fin), dateFinReelle: dateOrEmpty(r.date_fin_reelle),
    budget: Number(r.budget), statut: r.statut, creePar: r.user_id,
  }),
  entrees: (r) => ({
    id: r.id, chantierId: r.chantier_id, date: dateOrEmpty(r.date),
    versePar: r.verse_par, description: r.description, mode: r.mode, montant: Number(r.montant), creePar: r.user_id,
  }),
  sorties: (r) => ({
    id: r.id, chantierId: r.chantier_id, date: dateOrEmpty(r.date),
    beneficiaire: r.beneficiaire, type: r.type, description: r.description, mode: r.mode,
    montantDu: Number(r.montant_du), paiements: Array.isArray(r.paiements) ? r.paiements : [], creePar: r.user_id,
  }),
};

// Erreur réseau (à retenter plus tard) ou refus définitif de la base ?
function isNetworkError(error) {
  return !error?.code || /fetch|network/i.test(error?.message || '');
}

// Récupère toutes les lignes visibles par l'utilisateur dans son entreprise
// (la RLS filtre côté serveur selon son rôle et ses chantiers attribués).
// PostgREST limite chaque réponse à 1000 lignes : on pagine.
async function fetchAll(table) {
  const PAGE = 1000;
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase.from(table).select('*').order('id').range(from, from + PAGE - 1);
    if (error) throw error;
    rows.push(...data);
    if (data.length < PAGE) return rows;
  }
}

export async function pullAll() {
  const [chantiers, entrees, sorties] = await Promise.all(TABLES.map(fetchAll));
  return {
    chantiers: chantiers.map(fromRow.chantiers),
    entrees: entrees.map(fromRow.entrees),
    sorties: sorties.map(fromRow.sorties),
  };
}

// Envoie un lot d'opérations en attente. Renvoie { done, error } : `done` liste les
// clés traitées (envoyées, ou rejetées définitivement par la base) ; le reste reste en attente.
export async function pushOps(ops, entrepriseId) {
  const done = [];
  const byTable = (table, op) => ops.filter((o) => o.table === table && o.op === op);

  const upsert = async (table, list) => {
    if (!list.length) return;
    const { error } = await supabase.from(table).upsert(list.map((o) => toRow[table](o.row, entrepriseId)), { onConflict: 'entreprise_id,id' });
    if (!error) { done.push(...list.map((o) => o.key)); return; }
    if (isNetworkError(error)) throw error;
    // Lot refusé : on réessaie ligne par ligne pour isoler la ou les lignes invalides
    // (ex. entrée d'un chantier supprimé depuis un autre téléphone).
    for (const o of list) {
      const { error: e } = await supabase.from(table).upsert(toRow[table](o.row, entrepriseId), { onConflict: 'entreprise_id,id' });
      if (e && isNetworkError(e)) throw e;
      if (e) console.warn(`Ligne ${table}/${o.row.id} ignorée par la base :`, e.message);
      done.push(o.key);
    }
  };

  const remove = async (table, list) => {
    if (!list.length) return;
    const { error } = await supabase.from(table).delete().eq('entreprise_id', entrepriseId).in('id', list.map((o) => o.id));
    if (error) throw error;
    done.push(...list.map((o) => o.key));
  };

  try {
    // Les chantiers d'abord pour les créations (clé étrangère), en dernier pour les suppressions.
    await upsert('chantiers', byTable('chantiers', 'upsert'));
    await upsert('entrees', byTable('entrees', 'upsert'));
    await upsert('sorties', byTable('sorties', 'upsert'));
    await remove('entrees', byTable('entrees', 'delete'));
    await remove('sorties', byTable('sorties', 'delete'));
    await remove('chantiers', byTable('chantiers', 'delete'));
    return { done, error: null };
  } catch (error) {
    return { done, error };
  }
}
