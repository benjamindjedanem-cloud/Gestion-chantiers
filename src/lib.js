/* ---------------------------------------------------------------- */
/* Constantes métier + helpers purs (formatage, dates, calculs)       */
/* ---------------------------------------------------------------- */

export const STATUTS = ['En cours', 'Terminé', 'En pause'];
export const MODES = ['Espèces', 'Mobile Money', 'Virement bancaire', 'Chèque'];
export const TYPES_SORTIE = ["Main d'œuvre", 'Matériaux', 'Transport', 'Location matériel', 'Autre'];
export const FONCTIONS_BENEFICIAIRE = ['Maçon', 'Carreleur', 'Électricien', 'Plombier', 'Ferrailleur', 'Peintre', 'Menuisier', 'Chef de chantier', 'Fournisseur', 'Transporteur', 'Autre'];

const nf = new Intl.NumberFormat('fr-FR');

export function fcfa(n) {
  return nf.format(Math.round(n || 0)) + ' FCFA';
}

// Les dates sont stockées en 'AAAA-MM-JJ'. On les lit sans passer par new Date(s),
// qui les interprète en UTC et peut décaler d'un jour selon le fuseau.
export function dateFR(s) {
  if (!s) return '—';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : s;
}

// Date du jour en heure locale (toISOString() donnerait la date UTC).
export function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Identifiants uniques globaux : indispensables pour fusionner les données
// de plusieurs appareils lors de la synchronisation.
export function uid(prefix) {
  const id = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
  return `${prefix}_${id}`;
}

export function paye(sortie) {
  return (sortie.paiements || []).reduce((a, p) => a + Number(p.montant || 0), 0);
}
export function reste(sortie) {
  return Number(sortie.montantDu || 0) - paye(sortie);
}
export function statutSortie(sortie) {
  const r = reste(sortie);
  if (r <= 0) return 'Soldé';
  return paye(sortie) > 0 ? 'Partiel' : 'À régler';
}

export function byDateDesc(a, b) {
  return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
}
