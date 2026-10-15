import { useState, useEffect, useRef, useMemo } from 'react';
import { uid, today, fcfa } from './lib.js';
import { TABLES, pullAll, pushOps } from './sync.js';

/* ---------------------------------------------------------------- */
/* Couche données : chargement, migration, sauvegarde et mutations.   */
/* Toute l'UI passe par useAppData(userId). Les données vivent sur le  */
/* téléphone (fonctionne hors ligne) et sont synchronisées avec       */
/* Supabase dès que le réseau est disponible.                         */
/*                                                                    */
/* Modèle v3 : entrées et sorties référencent leur chantier par       */
/* `chantierId` (et non plus par son nom).                            */
/* ---------------------------------------------------------------- */

// Copie locale des données, une par compte : deux personnes qui se connectent
// sur le même téléphone ne voient jamais les données l'une de l'autre.
const dataKey = (userId) => `gestion-chantiers-data-v3:${userId}`;
// Modifications faites sur ce téléphone et pas encore envoyées à Supabase.
const pendingKey = (userId) => `gestion-chantiers-pending:${userId}`;

// Anciennes données (avant les comptes), importées dans le premier compte
// qui se connecte sur ce téléphone. La clé v2 est conservée comme sauvegarde.
const LEGACY_KEY_V3 = 'gestion-chantiers-data-v3';
const LEGACY_KEY_V2 = 'gestion-chantiers-data-v2';
const LEGACY_IMPORTED_FLAG = 'gestion-chantiers-legacy-imported';

const EMPTY_DATA = { chantiers: [], entrees: [], sorties: [] };

// v2 liait les entrées/sorties au chantier par son nom : on convertit en chantierId.
function migrateV2(v2) {
  const idByNom = new Map((v2.chantiers || []).map((c) => [c.nom, c.id]));
  const relink = ({ chantier, ...rest }) => ({ ...rest, chantierId: idByNom.get(chantier) ?? null });
  return {
    chantiers: v2.chantiers || [],
    entrees: (v2.entrees || []).map(relink),
    sorties: (v2.sorties || []).map(relink),
  };
}

function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function readLegacyData() {
  if (localStorage.getItem(LEGACY_IMPORTED_FLAG)) return null;
  const v3 = readJSON(LEGACY_KEY_V3);
  if (v3) return v3;
  const v2 = readJSON(LEGACY_KEY_V2);
  return v2 ? migrateV2(v2) : null;
}

const opKey = (table, id) => `${table}:${id}`;

// Opérations à envoyer pour passer de `prev` à `next`. Les mises à jour étant
// immuables, une ligne inchangée garde la même référence : la comparaison est rapide.
function diffOps(prev, next) {
  const ops = [];
  for (const table of TABLES) {
    const before = new Map(prev[table].map((r) => [r.id, r]));
    const afterIds = new Set();
    for (const row of next[table]) {
      afterIds.add(row.id);
      if (before.get(row.id) !== row) ops.push({ key: opKey(table, row.id), table, op: 'upsert', id: row.id, row });
    }
    for (const id of before.keys()) {
      if (!afterIds.has(id)) ops.push({ key: opKey(table, id), table, op: 'delete', id });
    }
  }
  return ops;
}

// Données du serveur + modifications locales pas encore envoyées.
function overlay(remote, pendingOps) {
  const out = {};
  for (const table of TABLES) {
    const rows = new Map(remote[table].map((r) => [r.id, r]));
    for (const o of pendingOps) {
      if (o.table !== table) continue;
      if (o.op === 'upsert') rows.set(o.id, o.row);
      else rows.delete(o.id);
    }
    out[table] = [...rows.values()];
  }
  return out;
}

function loadInitial(userId) {
  const cached = readJSON(dataKey(userId));
  if (cached) return { data: cached, pending: readJSON(pendingKey(userId)) || {}, legacy: false };
  const legacy = readLegacyData();
  if (legacy) {
    // Tout ce qui était sur le téléphone est à envoyer vers le compte.
    const pending = {};
    for (const o of diffOps(EMPTY_DATA, legacy)) pending[o.key] = o;
    return { data: legacy, pending, legacy: true };
  }
  return { data: EMPTY_DATA, pending: {}, legacy: false };
}

// Efface la copie locale d'un compte (à la déconnexion).
export function clearLocalUserData(userId) {
  try {
    localStorage.removeItem(dataKey(userId));
    localStorage.removeItem(pendingKey(userId));
  } catch (e) {
    // rien à faire
  }
}

// syncStatus : 'syncing' | 'synced' | 'offline' | 'error'
export function useAppData(userId) {
  const [initial] = useState(() => loadInitial(userId));
  const [data, setData] = useState(initial.data);
  const [saveError, setSaveError] = useState(false);
  const [syncStatus, setSyncStatus] = useState('syncing');
  const [pendingCount, setPendingCount] = useState(Object.keys(initial.pending).length);
  const dataRef = useRef(data);
  dataRef.current = data;
  const pendingRef = useRef(initial.pending);
  const lastSeenRef = useRef(initial.data); // dernier état déjà pris en compte pour la synchro
  const syncingRef = useRef(false);
  const syncAgainRef = useRef(false);
  const timerRef = useRef(null);

  const savePending = () => {
    setPendingCount(Object.keys(pendingRef.current).length);
    try {
      localStorage.setItem(pendingKey(userId), JSON.stringify(pendingRef.current));
    } catch (e) {
      setSaveError(true);
    }
  };

  const syncRef = useRef(null);
  syncRef.current = async () => {
    if (syncingRef.current) { syncAgainRef.current = true; return; }
    if (!navigator.onLine) { setSyncStatus('offline'); return; }
    syncingRef.current = true;
    setSyncStatus('syncing');
    try {
      const ops = Object.values(pendingRef.current);
      if (ops.length) {
        const { done, error } = await pushOps(ops, userId);
        const sent = new Map(ops.map((o) => [o.key, o]));
        // On ne retire que les opérations restées identiques pendant l'envoi.
        for (const key of done) if (pendingRef.current[key] === sent.get(key)) delete pendingRef.current[key];
        savePending();
        if (error) throw error;
      }
      const remote = await pullAll();
      const next = overlay(remote, Object.values(pendingRef.current));
      const expected = lastSeenRef.current;
      setData((prev) => {
        // Une modification locale n'a pas encore été prise en compte : on ne l'écrase
        // pas ; elle déclenchera elle-même une nouvelle synchro.
        if (prev !== expected) return prev;
        lastSeenRef.current = next; // état venant du serveur : rien à renvoyer
        return next;
      });
      setSyncStatus('synced');
    } catch (e) {
      console.warn('Synchronisation impossible :', e?.message || e);
      setSyncStatus(navigator.onLine ? 'error' : 'offline');
    } finally {
      syncingRef.current = false;
      if (syncAgainRef.current) { syncAgainRef.current = false; syncRef.current(); }
    }
  };

  const scheduleSync = (delay = 600) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => syncRef.current(), delay);
  };

  // Chaque modification locale : copie sur le téléphone + mise en file d'attente.
  useEffect(() => {
    try {
      localStorage.setItem(dataKey(userId), JSON.stringify(data));
      setSaveError(false);
    } catch (e) {
      setSaveError(true);
    }
    if (data === lastSeenRef.current) return;
    for (const o of diffOps(lastSeenRef.current, data)) pendingRef.current[o.key] = o;
    lastSeenRef.current = data;
    savePending();
    scheduleSync();
  }, [data, userId]);

  // Synchro au démarrage, au retour du réseau et quand l'app revient au premier plan.
  useEffect(() => {
    if (initial.legacy) {
      savePending();
      try {
        localStorage.setItem(LEGACY_IMPORTED_FLAG, userId);
        localStorage.removeItem(LEGACY_KEY_V3);
      } catch (e) {
        // sans importance : l'import sera simplement retenté
      }
    }
    syncRef.current();
    const onOnline = () => syncRef.current();
    const onOffline = () => setSyncStatus('offline');
    const onVisible = () => { if (document.visibilityState === 'visible') syncRef.current(); };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [userId]);

  const actions = useMemo(() => {
    // Mises à jour fonctionnelles : jamais d'écrasement par un état périmé.
    const update = (fn) => setData((prev) => ({ ...prev, ...fn(prev) }));
    const mapById = (list, id, fn) => list.map((x) => (x.id === id ? fn(x) : x));
    const current = () => dataRef.current;

    return {
      addChantier: (c) => update((d) => ({ chantiers: [...d.chantiers, { ...c, id: uid('c') }] })),
      updateChantier: (id, patch) => update((d) => ({ chantiers: mapById(d.chantiers, id, (c) => ({ ...c, ...patch })) })),
      updateStatutChantier: (id, statut) => update((d) => ({
        chantiers: mapById(d.chantiers, id, (c) => ({ ...c, statut, dateFinReelle: statut === 'Terminé' ? (c.dateFinReelle || today()) : '' })),
      })),
      updateDateFinReelle: (id, dateFinReelle) => update((d) => ({ chantiers: mapById(d.chantiers, id, (c) => ({ ...c, dateFinReelle })) })),
      removeChantier: (id) => {
        const d = current();
        const chantier = d.chantiers.find((c) => c.id === id);
        if (!chantier) return;
        const nbLignes = d.entrees.filter((e) => e.chantierId === id).length + d.sorties.filter((s) => s.chantierId === id).length;
        const detail = nbLignes > 0 ? `\n\nSes ${nbLignes} entrée(s)/sortie(s) seront aussi supprimées.` : '';
        if (!window.confirm(`Supprimer le chantier « ${chantier.nom} » ? Cette action est irréversible.${detail}`)) return;
        update((d2) => ({
          chantiers: d2.chantiers.filter((c) => c.id !== id),
          entrees: d2.entrees.filter((e) => e.chantierId !== id),
          sorties: d2.sorties.filter((s) => s.chantierId !== id),
        }));
      },

      addEntree: (e) => update((d) => ({ entrees: [{ ...e, id: uid('e') }, ...d.entrees] })),
      updateEntree: (id, patch) => update((d) => ({ entrees: mapById(d.entrees, id, (e) => ({ ...e, ...patch })) })),
      removeEntree: (id) => {
        const entree = current().entrees.find((e) => e.id === id);
        if (!entree) return;
        if (!window.confirm(`Supprimer cet encaissement de ${fcfa(entree.montant)} ? Cette action est irréversible.`)) return;
        update((d) => ({ entrees: d.entrees.filter((e) => e.id !== id) }));
      },

      addSortie: (s) => update((d) => ({
        sorties: [{ ...s, id: uid('s'), paiements: (s.paiements || []).map((p) => ({ ...p, id: uid('p') })) }, ...d.sorties],
      })),
      updateSortie: (id, patch) => update((d) => ({
        sorties: mapById(d.sorties, id, (current) => {
          const hasMontant = Object.prototype.hasOwnProperty.call(patch, 'montantDu');
          const nextMontantDu = hasMontant ? Number(patch.montantDu) : Number(current.montantDu || 0);
          const paiements = current.paiements || [];
          // Une sortie créée comme « payée en totalité » contient un seul paiement
          // égal à la somme due : modifier la somme doit aussi modifier ce paiement,
          // sinon « Total payé » reste sur l'ancienne valeur.
          const payeeEnTotalite = paiements.length === 1 && Number(paiements[0].montant || 0) === Number(current.montantDu || 0);
          const nextPaiements = payeeEnTotalite && hasMontant ? [{ ...paiements[0], montant: nextMontantDu }] : paiements;
          return { ...current, ...patch, montantDu: nextMontantDu, paiements: nextPaiements };
        }),
      })),
      removeSortie: (id) => {
        const sortie = current().sorties.find((s) => s.id === id);
        if (!sortie) return;
        if (!window.confirm(`Supprimer cette sortie de ${fcfa(sortie.montantDu)} pour « ${sortie.beneficiaire || 'ce bénéficiaire'} » ? Cette action est irréversible.`)) return;
        update((d) => ({ sorties: d.sorties.filter((s) => s.id !== id) }));
      },

      addPaiement: (sortieId, p) => update((d) => ({
        sorties: mapById(d.sorties, sortieId, (s) => ({ ...s, paiements: [...(s.paiements || []), { ...p, id: uid('p') }] })),
      })),
      updatePaiement: (sortieId, paiementId, patch) => update((d) => ({
        sorties: mapById(d.sorties, sortieId, (s) => ({ ...s, paiements: mapById(s.paiements || [], paiementId, (p) => ({ ...p, ...patch })) })),
      })),
      removePaiement: (sortieId, paiementId) => {
        const paiement = current().sorties.find((s) => s.id === sortieId)?.paiements?.find((p) => p.id === paiementId);
        if (!paiement) return;
        if (!window.confirm(`Supprimer ce versement de ${fcfa(paiement.montant)} ? Cette action est irréversible.`)) return;
        update((d) => ({
          sorties: mapById(d.sorties, sortieId, (s) => ({ ...s, paiements: (s.paiements || []).filter((p) => p.id !== paiementId) })),
        }));
      },
    };
  }, []);

  const syncNow = () => syncRef.current();
  return { data, saveError, syncStatus, pendingCount, syncNow, actions };
}
