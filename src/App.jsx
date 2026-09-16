import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LayoutDashboard, Building2, ArrowDownCircle, ArrowUpCircle,
  Plus, X, Search, AlertTriangle, ChevronDown, ChevronRight, ChevronLeft, Trash2, CheckCircle2, Pencil, Check,
} from 'lucide-react';

/* ---------------------------------------------------------------- */
/* Design tokens                                                     */
/* ---------------------------------------------------------------- */

const C = {
  bg: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F8FAFC',
  border: '#E6EAF0',
  borderStrong: '#CBD5E1',
  text: '#0F172A',
  textMuted: '#64748B',
  brand: '#1D4ED8',
  brandDark: '#172554',
  brandTint: '#EFF6FF',
  green: '#047857',
  greenTint: '#ECFDF5',
  amber: '#B45309',
  amberTint: '#FFFBEB',
  red: '#B91C1C',
  redTint: '#FEF2F2',
};

const FONT_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
.gc-root { font-family: 'DM Sans', sans-serif; color: ${C.text}; background: ${C.bg}; }
.gc-display { font-family: 'Space Grotesk', sans-serif; font-weight: 700; letter-spacing: -0.02em; }
.gc-tabular { font-variant-numeric: tabular-nums; }
.gc-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
.gc-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 999px; }
.gc-scroll { scrollbar-width: thin; scrollbar-color: #CBD5E1 transparent; }
button, input, select { -webkit-tap-highlight-color: transparent; }
.gc-card { box-shadow: 0 5px 18px rgba(15,23,42,0.035); }
.gc-card-hover { transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease; }
.gc-card-hover:active { transform: scale(.992); }
.gc-section-label { letter-spacing: .12em; text-transform: uppercase; font-size: 10px; font-weight: 700; }
.gc-divider { border-top: 1px solid ${C.border}; }
`;

const STATUTS = ['En cours', 'Terminé', 'En pause'];
const MODES = ['Espèces', 'Mobile Money', 'Virement bancaire', 'Chèque'];
const TYPES_SORTIE = ["Main d'œuvre", 'Matériaux', 'Transport', 'Location matériel', 'Autre'];
const FONCTIONS_BENEFICIAIRE = ['Maçon', 'Carreleur', 'Électricien', 'Plombier', 'Ferrailleur', 'Peintre', 'Menuisier', 'Chef de chantier', 'Fournisseur', 'Transporteur', 'Autre'];
const STORAGE_KEY = 'gestion-chantiers-data-v2';

/* ---------------------------------------------------------------- */
/* Seed data — reprend les 3 chantiers du fichier Excel               */
/* Chaque sortie est modélisée comme une dette : montantDu + paiements */
/* ---------------------------------------------------------------- */

function paidInFull(date, montant) {
  return { montantDu: montant, paiements: [{ id: uid('p'), date, montant }] };
}

const SEED_DATA = {
  chantiers: [
    { id: 'c1', nom: 'ANGABO', client: 'Commissaire Mht', adresse: '', dateDebut: '2026-03-25', dateFin: '', budget: 6500000, statut: 'En cours' },
    { id: 'c2', nom: 'ROND-POINT HAMAM', client: 'ABDERAMANE', adresse: '', dateDebut: '2026-05-10', dateFin: '', budget: 20000000, statut: 'En cours' },
    { id: 'c3', nom: 'CHARI-BAB', client: 'Dr ABDELSALAM', adresse: '', dateDebut: '2026-07-31', dateFin: '', budget: 15750000, statut: 'En cours' },
  ],
  entrees: [
    { id: 'e1', date: '2026-03-25', chantier: 'ANGABO', versePar: 'Commissaire Mht', description: 'Total signature devis', mode: 'Espèces', montant: 6500000 },
    { id: 'e2', date: '2026-05-10', chantier: 'ROND-POINT HAMAM', versePar: 'ABDERAMANE', description: '1er paiement', mode: 'Espèces', montant: 500000 },
    { id: 'e3', date: '2026-07-31', chantier: 'CHARI-BAB', versePar: 'Dr ABDELSALAM', description: '1er paiement', mode: 'Espèces', montant: 4725000 },
  ],
  sorties: [
    { id: 's1', date: '2026-01-20', chantier: 'ANGABO', beneficiaire: 'HERVE (maçon)', type: "Main d'œuvre", description: 'Semaine 1,2,3,4 et 5', mode: 'Espèces', ...paidInFull('2026-01-20', 1760000) },
    { id: 's2', date: '2026-01-25', chantier: 'ANGABO', beneficiaire: 'OLIVIER (maçon)', type: 'Matériaux', description: 'Semaine 1,2,3 et 4', mode: 'Espèces', ...paidInFull('2026-01-25', 684000) },
    { id: 's3', date: '2026-02-05', chantier: 'ANGABO', beneficiaire: 'YOUSSOUF (électricien)', type: "Main d'œuvre", description: 'Installation électrique', mode: 'Espèces', ...paidInFull('2026-02-05', 400000) },
    { id: 's4', date: '2026-02-05', chantier: 'ANGABO', beneficiaire: 'ANICET (plombier)', type: "Main d'œuvre", description: 'Installation tuyau PVC et PPR', mode: 'Espèces', ...paidInFull('2026-02-05', 100000) },
    { id: 's5', date: '2026-02-05', chantier: 'ANGABO', beneficiaire: 'HASSAN (crépissage)', type: "Main d'œuvre", description: 'Semaine 1,2,3,4', mode: 'Espèces', ...paidInFull('2026-02-05', 1950000) },
    { id: 's6', date: '2026-02-15', chantier: 'ROND-POINT HAMAM', beneficiaire: 'HERVE (maçon)', type: "Main d'œuvre", description: 'Semaine 1,2', mode: 'Espèces', ...paidInFull('2026-02-15', 160000) },
    { id: 's7', date: '2026-02-15', chantier: 'ROND-POINT HAMAM', beneficiaire: 'ERIC (maçon)', type: "Main d'œuvre", description: 'Semaine 1,2,3', mode: 'Espèces', ...paidInFull('2026-02-15', 400000) },
    { id: 's8', date: '2026-07-31', chantier: 'CHARI-BAB', beneficiaire: 'OLIVIER (maçon)', type: "Main d'œuvre", description: 'Semaine 1,2,3', mode: 'Espèces', ...paidInFull('2026-07-31', 560000) },
  ],
};

/* ---------------------------------------------------------------- */
/* Helpers                                                            */
/* ---------------------------------------------------------------- */

function fcfa(n) {
  return new Intl.NumberFormat('fr-FR').format(Math.round(n || 0)) + ' FCFA';
}
function dateFR(s) {
  if (!s) return '—';
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function uid(p) {
  return p + '_' + Math.random().toString(36).slice(2, 9);
}
function today() {
  return new Date().toISOString().slice(0, 10);
}
function paye(sortie) {
  return (sortie.paiements || []).reduce((a, p) => a + Number(p.montant || 0), 0);
}
function reste(sortie) {
  return Number(sortie.montantDu || 0) - paye(sortie);
}
function statutSortie(sortie) {
  const r = reste(sortie);
  if (r <= 0) return 'Soldé';
  return paye(sortie) > 0 ? 'Partiel' : 'À régler';
}

/* ---------------------------------------------------------------- */
/* Small reusable UI bits                                            */
/* ---------------------------------------------------------------- */

function Field({ label, children }) {
  return (
    <label className="block mb-3">
      <span className="block text-xs font-medium mb-1" style={{ color: C.textMuted }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: '100%',
  padding: '11px 12px',
  borderRadius: 10,
  border: `1px solid ${C.border}`,
  background: C.surface,
  fontSize: 14,
  color: C.text,
  outline: 'none',
};

function TextInput(props) {
  return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} onFocus={(e) => { e.target.style.borderColor = C.brand; props.onFocus && props.onFocus(e); }} onBlur={(e) => { e.target.style.borderColor = C.border; props.onBlur && props.onBlur(e); }} />;
}
function Select(props) {
  return <select {...props} style={{ ...inputStyle, ...(props.style || {}) }}>{props.children}</select>;
}

function StatusPill({ statut }) {
  const map = {
    'En cours': { bg: C.greenTint, fg: C.green },
    'Terminé': { bg: C.border, fg: C.textMuted },
    'En pause': { bg: C.amberTint, fg: C.amber },
  };
  const s = map[statut] || map['En cours'];
  return <span style={{ background: s.bg, color: s.fg, fontSize: 11, fontWeight: 600, padding: '4px 9px', borderRadius: 999 }}>{statut}</span>;
}

function PaiementPill({ statut }) {
  const map = {
    'Soldé': { bg: C.greenTint, fg: C.green },
    'Partiel': { bg: C.amberTint, fg: C.amber },
    'À régler': { bg: C.redTint, fg: C.red },
  };
  const s = map[statut];
  return <span style={{ background: s.bg, color: s.fg, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>{statut}</span>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(15,23,42,0.52)', backdropFilter: 'blur(5px)' }} onClick={onClose}>
      <div className="w-full sm:max-w-md overflow-y-auto gc-scroll" style={{ background: C.surface, borderRadius: '24px 24px 0 0', maxHeight: '92vh', boxShadow: '0 -20px 60px rgba(15,23,42,.18)' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 sticky top-0 z-10" style={{ background: 'rgba(255,255,255,.96)', borderBottom: `1px solid ${C.border}`, backdropFilter: 'blur(10px)' }}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] font-bold" style={{ color: C.brand }}>GESTION CHANTIERS</p>
            <h3 className="gc-display text-xl mt-0.5">{title}</h3>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ color: C.textMuted, background: C.surfaceSoft }}><X size={19} /></button>
        </div>
        <div className="px-5 py-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function PrimaryButton({ children, ...props }) {
  return (
    <button {...props} className="shadow-sm" style={{ background: C.brand, color: '#fff', fontWeight: 700, fontSize: 14, padding: '12px 16px', borderRadius: 11, width: '100%', boxShadow: '0 8px 20px rgba(29,78,216,.18)', ...(props.style || {}) }}>
      {children}
    </button>
  );
}

function ToggleGroup({ options, value, onChange }) {
  return (
    <div className="flex p-1 gap-1 rounded-xl" style={{ background: C.surfaceSoft, border: `1px solid ${C.border}` }}>
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)} className="flex-1 text-xs font-bold py-2.5 rounded-lg" style={{ border: 'none', background: value === o ? C.surface : 'transparent', color: value === o ? C.brand : C.textMuted, boxShadow: value === o ? '0 2px 7px rgba(15,23,42,.07)' : 'none' }}>{o}</button>
      ))}
    </div>
  );
}

function EmptyState({ text, cta, onCta }) {
  return (
    <div className="text-center py-12 px-5 rounded-2xl" style={{ color: C.textMuted, background: C.surface, border: `1px dashed ${C.borderStrong}` }}>
      <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: C.brandTint, color: C.brand }}><Building2 size={22} /></div>
      <p className="text-sm leading-relaxed">{text}</p>
      {cta && <button onClick={onCta} className="mt-4 text-sm font-bold" style={{ color: C.brand }}>{cta}</button>}
    </div>
  );
}

function BackBar({ title, onBack }) {
  return (
    <button onClick={onBack} className="flex items-center gap-1.5 mb-4 -mx-1 px-1 py-1 text-sm font-bold" style={{ color: C.brand }}><ChevronLeft size={18} /> {title}</button>
  );
}

/* Liste des chantiers, utilisée comme écran d'entrée pour Entrées et Sorties */
function ChantierPicker({ chantiers, getSubtitle, onSelect, emptyText }) {
  if (chantiers.length === 0) return <EmptyState text={emptyText} />;
  return (
    <div className="flex flex-col gap-2.5">
      {chantiers.map((c) => {
        const sub = getSubtitle(c);
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.nom)}
            className="text-left p-4 flex items-center justify-between rounded-2xl"
            style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 4px 16px rgba(15,23,42,.025)' }}
          >
            <div>
              <p className="gc-display text-lg leading-tight">{c.nom}</p>
              <p className="text-xs" style={{ color: C.textMuted }}>{c.client}</p>
            </div>
            <div className="text-right">
              {sub.map((line, i) => (
                <p key={i} className="text-xs gc-tabular font-semibold" style={{ color: line.color || C.textMuted }}>{line.label}</p>
              ))}
              <ChevronRight size={16} style={{ color: C.textMuted, marginLeft: 'auto', marginTop: 2 }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* App                                                                */
/* ---------------------------------------------------------------- */

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [selEntree, setSelEntree] = useState('');
  const [selSortie, setSelSortie] = useState('');
  const [paiementFor, setPaiementFor] = useState(null); // sortie id
  const [editSortieId, setEditSortieId] = useState(null); // sortie id en cours de modification

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw));
      else {
        setData(SEED_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
      }
    } catch (e) {
      setData(SEED_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = useCallback((next) => {
    setData(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaveError(false);
    } catch (e) {
      setSaveError(true);
    }
  }, []);

  const addChantier = (c) => persist({ ...data, chantiers: [...data.chantiers, { ...c, id: uid('c') }] });
  const removeChantier = (id) => persist({ ...data, chantiers: data.chantiers.filter((c) => c.id !== id) });
  const updateStatutChantier = (id, statut) =>
    persist({
      ...data,
      chantiers: data.chantiers.map((c) =>
        c.id === id ? { ...c, statut, dateFinReelle: statut === 'Terminé' ? (c.dateFinReelle || today()) : '' } : c
      ),
    });
  const updateDateFinReelle = (id, dateFinReelle) => persist({ ...data, chantiers: data.chantiers.map((c) => (c.id === id ? { ...c, dateFinReelle } : c)) });
  const addEntree = (e) => persist({ ...data, entrees: [{ ...e, id: uid('e') }, ...data.entrees] });
  const removeEntree = (id) => persist({ ...data, entrees: data.entrees.filter((e) => e.id !== id) });
  const addSortie = (s) => persist({ ...data, sorties: [{ ...s, id: uid('s') }, ...data.sorties] });
  const removeSortie = (id) => persist({ ...data, sorties: data.sorties.filter((s) => s.id !== id) });
  const addPaiement = (sortieId, p) =>
    persist({ ...data, sorties: data.sorties.map((s) => (s.id === sortieId ? { ...s, paiements: [...(s.paiements || []), { ...p, id: uid('p') }] } : s)) });
  const updateSortie = (id, patch) => persist({ ...data, sorties: data.sorties.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  const updatePaiement = (sortieId, paiementId, patch) =>
    persist({ ...data, sorties: data.sorties.map((s) => (s.id === sortieId ? { ...s, paiements: (s.paiements || []).map((p) => (p.id === paiementId ? { ...p, ...patch } : p)) } : s)) });
  const removePaiement = (sortieId, paiementId) =>
    persist({ ...data, sorties: data.sorties.map((s) => (s.id === sortieId ? { ...s, paiements: (s.paiements || []).filter((p) => p.id !== paiementId) } : s)) });

  const stats = useMemo(() => {
    if (!data) return [];
    return data.chantiers.map((c) => {
      const sortiesC = data.sorties.filter((s) => s.chantier === c.nom);
      const totalEntrees = data.entrees.filter((e) => e.chantier === c.nom).reduce((a, e) => a + Number(e.montant || 0), 0);
      const totalSorties = sortiesC.reduce((a, s) => a + paye(s), 0);
      const totalReste = sortiesC.reduce((a, s) => a + Math.max(reste(s), 0), 0);
      const solde = totalEntrees - totalSorties;
      const pct = c.budget > 0 ? totalSorties / c.budget : 0;
      return { ...c, totalEntrees, totalSorties, totalReste, solde, pct };
    });
  }, [data]);

  const totaux = useMemo(
    () => stats.reduce((a, s) => ({ budget: a.budget + Number(s.budget || 0), entrees: a.entrees + s.totalEntrees, sorties: a.sorties + s.totalSorties, solde: a.solde + s.solde, reste: a.reste + s.totalReste }), { budget: 0, entrees: 0, sorties: 0, solde: 0, reste: 0 }),
    [stats]
  );

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
        <style>{FONT_STYLE}</style>
        <p className="gc-display text-lg" style={{ color: C.textMuted }}>Chargement…</p>
      </div>
    );
  }

  const paiementForSortie = paiementFor ? data.sorties.find((s) => s.id === paiementFor) : null;
  const editSortieObj = editSortieId ? data.sorties.find((s) => s.id === editSortieId) : null;
  const existingBeneficiaires = selSortie
    ? [...new Set(data.sorties.filter((s) => s.chantier === selSortie).map((s) => s.beneficiaire).filter(Boolean))].sort()
    : [];

  return (
    <div className="gc-root min-h-screen" style={{ background: C.bg }}>
      <style>{FONT_STYLE}</style>
      <div className="max-w-md lg:max-w-6xl mx-auto min-h-screen lg:flex" style={{ background: C.bg }}>
        <Sidebar tab={tab} setTab={(t) => { setTab(t); setSearch(''); if (t !== 'entrees') setSelEntree(''); if (t !== 'sorties') setSelSortie(''); }} />

        <div className="flex flex-col min-h-screen lg:flex-1 lg:min-w-0" style={{ background: C.bg, borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}` }}>
          {tab === 'dashboard' && <Header totaux={totaux} saveError={saveError} />}

          <main className="flex-1 overflow-y-auto gc-scroll pb-24 lg:pb-10 px-4" style={{ paddingTop: 18 }}>
            <div className="lg:max-w-2xl lg:mx-auto">
            {tab === 'dashboard' && <Dashboard stats={stats} search={search} setSearch={setSearch} />}

            {tab === 'chantiers' && (
              <ChantiersTab chantiers={data.chantiers} stats={stats} onAdd={() => setModal('chantier')} onRemove={removeChantier} onChangeStatut={updateStatutChantier} onChangeDateFin={updateDateFinReelle} />
            )}

            {tab === 'entrees' && (
              selEntree === '' ? (
                <div>
                  <PageIntro eyebrow="Suivi financier" title="Entrées" subtitle="Les paiements reçus, chantier par chantier" />
                  <ChantierPicker
                    chantiers={data.chantiers}
                    emptyText="Ajoutez un chantier pour commencer à enregistrer des entrées."
                    getSubtitle={(c) => {
                      const total = data.entrees.filter((e) => e.chantier === c.nom).reduce((a, e) => a + Number(e.montant || 0), 0);
                      const lines = [{ label: fcfa(total), color: C.green }];
                      if (c.budget > 0 && total >= c.budget) lines.push({ label: 'Soldé', color: C.green });
                      return lines;
                    }}
                    onSelect={setSelEntree}
                  />
                </div>
              ) : (
                <EntreeDetail
                  chantier={selEntree}
                  budget={data.chantiers.find((c) => c.nom === selEntree)?.budget || 0}
                  entrees={data.entrees.filter((e) => e.chantier === selEntree).sort((a, b) => (a.date < b.date ? 1 : -1))}
                  onBack={() => setSelEntree('')}
                  onAdd={() => setModal('entree')}
                  onRemove={removeEntree}
                />
              )
            )}

            {tab === 'sorties' && (
              selSortie === '' ? (
                <div>
                  <PageIntro eyebrow="Suivi financier" title="Sorties" subtitle="Les dépenses et paiements à suivre" />
                  <ChantierPicker
                    chantiers={data.chantiers}
                    emptyText="Ajoutez un chantier pour commencer à enregistrer des sorties."
                    getSubtitle={(c) => {
                      const st = stats.find((s) => s.id === c.id);
                      const lines = [{ label: fcfa(st?.totalSorties || 0), color: C.textMuted }];
                      if (st?.totalReste > 0) lines.push({ label: `Reste ${fcfa(st.totalReste)}`, color: C.red });
                      return lines;
                    }}
                    onSelect={setSelSortie}
                  />
                </div>
              ) : (
                <SortieDetail
                  chantier={selSortie}
                  sorties={data.sorties.filter((s) => s.chantier === selSortie)}
                  onBack={() => setSelSortie('')}
                  onAdd={() => setModal('sortie')}
                  onRemove={removeSortie}
                  onPay={(id) => setPaiementFor(id)}
                  onEdit={(id) => setEditSortieId(id)}
                  onEditPaiement={updatePaiement}
                  onRemovePaiement={removePaiement}
                />
              )
            )}
            </div>
          </main>

          <BottomNav tab={tab} setTab={(t) => { setTab(t); setSearch(''); if (t !== 'entrees') setSelEntree(''); if (t !== 'sorties') setSelSortie(''); }} />
        </div>
      </div>

      {modal === 'chantier' && <ChantierForm onClose={() => setModal(null)} onSave={(c) => { addChantier(c); setModal(null); }} />}
      {modal === 'entree' && (
        <EntreeForm chantier={selEntree} onClose={() => setModal(null)} onSave={(e) => { addEntree(e); setModal(null); }} />
      )}
      {modal === 'sortie' && (
        <SortieForm chantier={selSortie} existingBeneficiaires={existingBeneficiaires} onClose={() => setModal(null)} onSave={(s) => { addSortie(s); setModal(null); }} />
      )}
      {paiementForSortie && (
        <PaiementForm sortie={paiementForSortie} onClose={() => setPaiementFor(null)} onSave={(p) => { addPaiement(paiementForSortie.id, p); setPaiementFor(null); }} />
      )}
      {editSortieObj && (
        <SortieEditForm sortie={editSortieObj} onClose={() => setEditSortieId(null)} onSave={(patch) => { updateSortie(editSortieObj.id, patch); setEditSortieId(null); }} />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Page framing                                                       */
/* ---------------------------------------------------------------- */

function PageIntro({ eyebrow, title, subtitle, action, onAction }) {
  return (
    <div className="mb-5">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          {eyebrow && <p className="gc-section-label" style={{ color: C.brand }}>{eyebrow}</p>}
          <h1 className="gc-display text-[24px] leading-tight mt-1">{title}</h1>
          {subtitle && <p className="text-xs mt-1.5" style={{ color: C.textMuted }}>{subtitle}</p>}
        </div>
        {action && onAction && (
          <button onClick={onAction} className="shrink-0 flex items-center gap-1 text-sm font-bold px-3 py-2 rounded-xl" style={{ color: C.brand, background: C.brandTint }}><Plus size={15} /> {action}</button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Header + Nav                                                      */
/* ---------------------------------------------------------------- */

function Header({ totaux, saveError }) {
  const balancePositive = totaux.solde >= 0;
  return (
    <header className="px-5 pt-5 pb-4" style={{ background: `linear-gradient(145deg, ${C.brandDark} 0%, #1E3A8A 55%, ${C.brand} 100%)`, color: '#fff' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] font-bold" style={{ color: '#BFDBFE' }}>Pilotage financier</p>
          <p className="gc-display text-xl mt-1">Gestion Chantiers</p>
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center p-1.5" style={{ background: '#fff' }}>
          <img src="./icons/logo-icon.svg" alt="Gestion Chantiers" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
      <div className="mt-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.12)', backdropFilter: 'blur(8px)' }}>
        <p className="text-xs" style={{ color: '#BFDBFE' }}>{saveError ? 'Synchronisation indisponible' : 'Solde global'}</p>
        <p className="gc-display gc-tabular text-3xl mt-1" style={{ color: balancePositive ? '#D1FAE5' : '#FECACA' }}>{fcfa(totaux.solde)}</p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <MiniHeaderStat label="Entrées" value={totaux.entrees} />
          <MiniHeaderStat label="Sorties" value={totaux.sorties} />
          <MiniHeaderStat label="Dettes" value={totaux.reste} danger={totaux.reste > 0} />
        </div>
      </div>
    </header>
  );
}

function MiniHeaderStat({ label, value, danger }) {
  return <div className="rounded-xl p-2.5" style={{ background: 'rgba(255,255,255,.07)' }}><p className="text-[10px]" style={{ color: '#BFDBFE' }}>{label}</p><p className="gc-tabular text-xs font-bold mt-0.5" style={{ color: danger ? '#FECACA' : '#fff' }}>{fcfa(value)}</p></div>;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
  { id: 'chantiers', label: 'Chantiers', icon: Building2 },
  { id: 'entrees', label: 'Entrées', icon: ArrowDownCircle },
  { id: 'sorties', label: 'Sorties', icon: ArrowUpCircle },
];

function BottomNav({ tab, setTab }) {
  return (
    <nav className="lg:hidden max-w-md mx-auto w-full fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pointer-events-none">
      <div className="pointer-events-auto rounded-2xl shadow-lg" style={{ background: 'rgba(255,255,255,.96)', border: `1px solid ${C.border}`, boxShadow: '0 12px 30px rgba(15,23,42,.10)', backdropFilter: 'blur(14px)' }}>
        <div className="flex p-1.5">
          {NAV_ITEMS.map((it) => { const Icon = it.icon; const active = tab === it.id; return (
            <button key={it.id} onClick={() => setTab(it.id)} className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl" style={{ color: active ? C.brand : C.textMuted, background: active ? C.brandTint : 'transparent' }}>
              <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 600 }}>{it.label}</span>
            </button>
          ); })}
        </div>
      </div>
    </nav>
  );
}

function Sidebar({ tab, setTab }) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen px-4 py-6" style={{ borderRight: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center p-1.5" style={{ background: C.brandTint }}>
          <img src="./icons/logo-icon.svg" alt="Gestion Chantiers" style={{ width: '100%', height: '100%' }} />
        </div>
        <div>
          <p className="gc-display text-base leading-tight">Gestion Chantiers</p>
          <p className="text-[11px]" style={{ color: C.textMuted }}>Pilotage financier</p>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((it) => { const Icon = it.icon; const active = tab === it.id; return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left"
            style={{ color: active ? C.brand : C.textMuted, background: active ? C.brandTint : 'transparent' }}
          >
            <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
            {it.label}
          </button>
        ); })}
      </nav>
    </aside>
  );
}

/* ---------------------------------------------------------------- */
/* Dashboard                                                          */
/* ---------------------------------------------------------------- */

function Dashboard({ stats, search, setSearch }) {
  const filtered = stats.filter((s) => {
    const q = search.trim().toLowerCase();
    return !q || s.nom.toLowerCase().includes(q) || s.client.toLowerCase().includes(q);
  });
  const active = stats.filter((s) => s.statut === 'En cours').length;
  const done = stats.filter((s) => s.statut === 'Terminé').length;
  const paused = stats.filter((s) => s.statut === 'En pause').length;

  return (
    <div>
      <div className="mb-5">
        <p className="gc-section-label" style={{ color: C.brand }}>Tableau de bord</p>
        <div className="mt-1.5">
          <h1 className="gc-display text-[25px] leading-tight">Vue d’ensemble</h1>
          <p className="text-sm mt-1" style={{ color: C.textMuted }}>Vue d’ensemble de vos activités</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <StatusSummary label="En cours" value={active} bg={C.greenTint} fg={C.green} />
        <StatusSummary label="En pause" value={paused} bg={C.amberTint} fg={C.amber} />
        <StatusSummary label="Terminés" value={done} bg={C.surfaceSoft} fg={C.textMuted} />
      </div>

      <div className="relative mb-5">
        <Search size={16} style={{ position: 'absolute', left: 13, top: 13, color: C.textMuted }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un chantier ou un client…"
          style={{ ...inputStyle, paddingLeft: 37, borderRadius: 13, background: C.surface, height: 44, boxShadow: '0 3px 12px rgba(15,23,42,.025)' }}
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="gc-display text-lg">Vos chantiers</p>
          <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>Suivi financier par projet</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ color: C.textMuted, background: C.surface, border: `1px solid ${C.border}` }}>
          {filtered.length} projet{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {filtered.length === 0 && <EmptyState text="Aucun chantier ne correspond à cette recherche." />}
      <div className="flex flex-col gap-3.5">
        {filtered.map((c) => <DashboardCard key={c.id} c={c} />)}
      </div>
    </div>
  );
}

function StatusSummary({ label, value, bg, fg }) {
  return (
    <div className="rounded-2xl p-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: fg }} />
        <p className="text-[10px] font-bold" style={{ color: C.textMuted }}>{label}</p>
      </div>
      <p className="gc-display text-xl leading-none mt-2">{value}</p>
    </div>
  );
}

function DashboardCard({ c }) {
  const over = c.pct > 1;
  const barColor = over ? C.red : c.pct > 0.85 ? C.amber : C.brand;
  const barBg = over ? C.redTint : c.pct > 0.85 ? C.amberTint : C.brandTint;
  const statusTone = c.statut === 'En cours' ? C.green : c.statut === 'En pause' ? C.amber : C.textMuted;

  return (
    <div className="gc-card gc-card-hover rounded-2xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: statusTone }} />
              <p className="gc-display text-[17px] leading-tight truncate">{c.nom}</p>
            </div>
            <p className="text-xs mt-1 truncate" style={{ color: C.textMuted }}>{c.client}</p>
          </div>
          <StatusPill statut={c.statut} />
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-5 mt-4 pt-3.5" style={{ borderTop: `1px solid ${C.border}` }}>
          <Metric label="Budget" value={fcfa(c.budget)} />
          <Metric label="Entrées" value={fcfa(c.totalEntrees)} />
          <Metric label="Sorties" value={fcfa(c.totalSorties)} />
          <Metric label="Solde" value={fcfa(c.solde)} valueColor={c.solde >= 0 ? C.green : C.red} />
        </div>

        {c.totalReste > 0 && (
          <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl" style={{ color: C.red, background: C.redTint }}>
            <AlertTriangle size={14} />
            <span className="text-xs font-semibold">{fcfa(c.totalReste)} reste à payer</span>
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-[11px] mb-1.5" style={{ color: C.textMuted }}>
          <span>Budget consommé</span>
          <span className="gc-tabular font-bold" style={{ color: barColor }}>{Math.round(c.pct * 100)}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 999, background: barBg, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.min(c.pct, 1) * 100}%`, background: barColor, borderRadius: 999 }} />
        </div>
        {over && <p className="text-xs font-bold mt-2" style={{ color: C.red }}>Budget dépassé de {fcfa(c.totalSorties - c.budget)}</p>}
      </div>
    </div>
  );
}

function Metric({ label, value, valueColor }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-[0.08em] font-semibold" style={{ color: C.textMuted }}>{label}</p>
      <p className="gc-tabular text-sm font-bold mt-0.5 truncate" style={{ color: valueColor || C.text }}>{value}</p>
    </div>
  );
}

function Stat({ label, value, valueColor }) {
  return (
    <div>
      <p className="text-xs" style={{ color: C.textMuted }}>{label}</p>
      <p className="gc-tabular font-semibold" style={{ color: valueColor || C.text }}>{value}</p>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Chantiers tab                                                      */
/* ---------------------------------------------------------------- */

function ChantiersTab({ chantiers, stats, onAdd, onRemove, onChangeStatut, onChangeDateFin }) {
  const counts = {
    total: chantiers.length,
    active: chantiers.filter((c) => c.statut === 'En cours').length,
    done: chantiers.filter((c) => c.statut === 'Terminé').length,
    paused: chantiers.filter((c) => c.statut === 'En pause').length,
  };
  return (
    <div>
      <PageIntro eyebrow="Gestion des projets" title="Chantiers" subtitle="Tous vos projets, leur statut et leur budget" action="Ajouter" onAction={onAdd} />

      <div className="grid grid-cols-4 gap-2 mb-4">
        <MiniCount label="Tous" value={counts.total} />
        <MiniCount label="En cours" value={counts.active} tone="green" />
        <MiniCount label="Terminés" value={counts.done} />
        <MiniCount label="En pause" value={counts.paused} tone="amber" />
      </div>

      {chantiers.length === 0 && <EmptyState text="Aucun chantier pour l'instant." cta="Ajouter le premier chantier" onCta={onAdd} />}
      <div className="flex flex-col gap-3">
        {stats.map((c) => (
          <div key={c.id} className="rounded-2xl p-4" style={{ background: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 4px 16px rgba(15,23,42,.03)' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="gc-display text-[17px] leading-tight truncate">{c.nom}</p>
                  <StatusPill statut={c.statut} />
                </div>
                <p className="text-xs mt-1 truncate" style={{ color: C.textMuted }}>{c.client}</p>
              </div>
              <button onClick={() => onRemove(c.id)} aria-label="Supprimer" className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ color: C.textMuted, background: C.surfaceSoft }}><Trash2 size={14} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5" style={{ borderTop: `1px solid ${C.border}` }}>
              <Stat label="Début" value={dateFR(c.dateDebut)} />
              <Stat label="Fin prévue" value={dateFR(c.dateFin)} />
              <Stat label="Budget" value={fcfa(c.budget)} valueColor={C.text} />
              <Stat label="Solde" value={fcfa(c.solde)} valueColor={c.solde >= 0 ? C.green : C.red} />
            </div>

            <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
              <StatutSelect statut={c.statut} onChange={(v) => onChangeStatut(c.id, v)} />
              {c.statut === 'Terminé' && (
                <label className="flex items-center gap-1.5 text-xs" style={{ color: C.textMuted }}>
                  Terminé le
                  <TextInput type="date" value={c.dateFinReelle || ''} onChange={(e) => onChangeDateFin(c.id, e.target.value)} style={{ width: 'auto', padding: '5px 8px', fontSize: 12 }} />
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniCount({ label, value, tone }) {
  const fg = tone === 'green' ? C.green : tone === 'amber' ? C.amber : C.textMuted;
  return <div className="rounded-xl px-2.5 py-2.5 text-center" style={{ background: C.surface, border: `1px solid ${C.border}` }}><p className="text-[10px] font-semibold" style={{ color: C.textMuted }}>{label}</p><p className="gc-display text-base mt-0.5" style={{ color: fg }}>{value}</p></div>;
}

function StatutSelect({ statut, onChange }) {
  const map = {
    'En cours': { bg: C.greenTint, fg: C.green },
    'Terminé': { bg: C.border, fg: C.textMuted },
    'En pause': { bg: C.amberTint, fg: C.amber },
  };
  const s = map[statut] || map['En cours'];
  return (
    <select
      value={statut}
      onChange={(e) => onChange(e.target.value)}
      style={{ background: s.bg, color: s.fg, fontSize: 11, fontWeight: 600, padding: '4px 8px', borderRadius: 4, border: 'none' }}
    >
      {STATUTS.map((st) => <option key={st} value={st}>{st}</option>)}
    </select>
  );
}

function ChantierForm({ onClose, onSave }) {
  const [f, setF] = useState({ nom: '', client: '', adresse: '', dateDebut: '', dateFin: '', budget: '', statut: 'En cours' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.nom.trim() && f.client.trim() && f.budget;
  return (
    <Modal title="Nouveau chantier" onClose={onClose}>
      <Field label="Nom du chantier"><TextInput value={f.nom} onChange={set('nom')} placeholder="Ex. VILLA NGARBA" /></Field>
      <Field label="Client"><TextInput value={f.client} onChange={set('client')} placeholder="Nom du client" /></Field>
      <Field label="Adresse (optionnel)"><TextInput value={f.adresse} onChange={set('adresse')} placeholder="Quartier, ville" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date de début"><TextInput type="date" value={f.dateDebut} onChange={set('dateDebut')} /></Field>
        <Field label="Fin prévue"><TextInput type="date" value={f.dateFin} onChange={set('dateFin')} /></Field>
      </div>
      <Field label="Budget prévu (FCFA)"><TextInput type="number" value={f.budget} onChange={set('budget')} placeholder="0" /></Field>
      <Field label="Statut"><Select value={f.statut} onChange={set('statut')}>{STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}</Select></Field>
      <div className="mt-2">
        <PrimaryButton disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={() => valid && onSave({ ...f, budget: Number(f.budget) })}>Enregistrer le chantier</PrimaryButton>
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------------------- */
/* Entrées                                                            */
/* ---------------------------------------------------------------- */

function EntreeDetail({ chantier, budget, entrees, onBack, onAdd, onRemove }) {
  const total = entrees.reduce((a, e) => a + Number(e.montant || 0), 0);
  const isSolde = budget > 0 && total >= budget;
  return (
    <div>
      <BackBar title="Tous les chantiers" onBack={onBack} />
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="gc-section-label" style={{ color: C.brand }}>Encaissements</p>
          <p className="gc-display text-xl leading-tight mt-1 truncate">{chantier}</p>
          <div className="flex items-center gap-2 mt-1.5"><p className="text-xs gc-tabular font-semibold" style={{ color: C.green }}>Total reçu {fcfa(total)}</p>{isSolde && <span style={{ background: C.greenTint, color: C.green, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999 }}>Soldé</span>}</div>
        </div>
        <button onClick={onAdd} className="shrink-0 flex items-center gap-1 text-sm font-bold px-3 py-2 rounded-xl" style={{ color: C.brand, background: C.brandTint }}><Plus size={15} /> Ajouter</button>
      </div>
      {entrees.length === 0 && <EmptyState text="Aucun paiement reçu pour ce chantier." cta="Ajouter un paiement" onCta={onAdd} />}
      <div className="flex flex-col gap-2">
        {entrees.map((e) => (
          <div key={e.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14 }} className="p-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold">{e.versePar}</p>
              <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>{e.description}</p>
              <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>{dateFR(e.date)} · {e.mode}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <p className="gc-tabular font-semibold text-sm" style={{ color: C.green }}>+{fcfa(e.montant)}</p>
              <button onClick={() => onRemove(e.id)} aria-label="Supprimer" style={{ color: C.textMuted }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EntreeForm({ chantier, onClose, onSave }) {
  const [f, setF] = useState({ date: today(), chantier, versePar: '', description: '', mode: 'Espèces', montant: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.date && f.montant;
  return (
    <Modal title={`Nouvelle entrée — ${chantier}`} onClose={onClose}>
      <Field label="Date"><TextInput type="date" value={f.date} onChange={set('date')} /></Field>
      <Field label="Versé par"><TextInput value={f.versePar} onChange={set('versePar')} placeholder="Nom de la personne ou de l'entreprise qui verse" /></Field>
      <Field label="Description"><TextInput value={f.description} onChange={set('description')} placeholder="Ex. 2e paiement" /></Field>
      <Field label="Mode de paiement"><Select value={f.mode} onChange={set('mode')}>{MODES.map((m) => <option key={m} value={m}>{m}</option>)}</Select></Field>
      <Field label="Montant reçu (FCFA)"><TextInput type="number" value={f.montant} onChange={set('montant')} placeholder="0" /></Field>
      <div className="mt-2">
        <PrimaryButton disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={() => valid && onSave({ ...f, montant: Number(f.montant) })}>Enregistrer l'entrée</PrimaryButton>
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------------------- */
/* Sorties                                                            */
/* ---------------------------------------------------------------- */

function SortieDetail({ chantier, sorties, onBack, onAdd, onRemove, onPay, onEdit, onEditPaiement, onRemovePaiement }) {
  const groups = useMemo(() => {
    const map = {};
    sorties.forEach((s) => {
      const key = s.beneficiaire || '—';
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });
    return Object.entries(map).map(([nom, items]) => ({
      nom,
      items: items.sort((a, b) => (a.date < b.date ? 1 : -1)),
      totalPaye: items.reduce((a, s) => a + paye(s), 0),
      totalReste: items.reduce((a, s) => a + Math.max(reste(s), 0), 0),
    })).sort((a, b) => b.totalReste - a.totalReste || b.totalPaye - a.totalPaye);
  }, [sorties]);

  const totalPayeChantier = sorties.reduce((a, s) => a + paye(s), 0);
  const totalResteChantier = sorties.reduce((a, s) => a + Math.max(reste(s), 0), 0);

  return (
    <div>
      <BackBar title="Tous les chantiers" onBack={onBack} />
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="gc-section-label" style={{ color: C.brand }}>Dépenses</p>
          <p className="gc-display text-xl leading-tight mt-1 truncate">{chantier}</p>
          <p className="text-xs gc-tabular font-semibold mt-1.5" style={{ color: C.textMuted }}>
            Payé {fcfa(totalPayeChantier)}{totalResteChantier > 0 && <span style={{ color: C.red }}> · Reste {fcfa(totalResteChantier)}</span>}
          </p>
        </div>
        <button onClick={onAdd} className="shrink-0 flex items-center gap-1 text-sm font-bold px-3 py-2 rounded-xl" style={{ color: C.brand, background: C.brandTint }}><Plus size={15} /> Ajouter</button>
      </div>

      {groups.length === 0 && <EmptyState text="Aucune sortie pour ce chantier." cta="Ajouter un paiement" onCta={onAdd} />}

      <div className="flex flex-col gap-3">
        {groups.map((g) => (
          <BeneficiaireGroup key={g.nom} group={g} onRemove={onRemove} onPay={onPay} onEdit={onEdit} onEditPaiement={onEditPaiement} onRemovePaiement={onRemovePaiement} />
        ))}
      </div>
    </div>
  );
}

function BeneficiaireGroup({ group, onRemove, onPay, onEdit, onEditPaiement, onRemovePaiement }) {
  const [open, setOpen] = useState(group.totalReste > 0);
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14 }}>
      <button className="w-full flex items-center justify-between px-3.5 py-3" onClick={() => setOpen(!open)}>
        <div className="text-left">
          <p className="text-sm font-semibold">{group.nom}</p>
          <p className="text-xs gc-tabular mt-0.5" style={{ color: C.textMuted }}>
            Total payé <span style={{ color: C.green, fontWeight: 600 }}>{fcfa(group.totalPaye)}</span>
            {group.totalReste > 0 && <> · reste <span style={{ color: C.red, fontWeight: 600 }}>{fcfa(group.totalReste)}</span></>}
          </p>
        </div>
        {open ? <ChevronDown size={16} style={{ color: C.textMuted }} /> : <ChevronRight size={16} style={{ color: C.textMuted }} />}
      </button>
      {open && (
        <div className="px-3.5 pb-3 flex flex-col gap-2" style={{ borderTop: `1px solid ${C.border}` }}>
          {group.items.map((s) => (
            <SortieLine key={s.id} s={s} onRemove={onRemove} onPay={onPay} onEdit={onEdit} onEditPaiement={onEditPaiement} onRemovePaiement={onRemovePaiement} />
          ))}
        </div>
      )}
    </div>
  );
}

function SortieLine({ s, onRemove, onPay, onEdit, onEditPaiement, onRemovePaiement }) {
  const [showHist, setShowHist] = useState(false);
  const [editingPaiement, setEditingPaiement] = useState(null); // paiement id
  const [tempMontant, setTempMontant] = useState('');
  const st = statutSortie(s);
  const r = reste(s);

  const startEditPaiement = (p) => { setEditingPaiement(p.id); setTempMontant(String(p.montant)); };
  const saveEditPaiement = () => {
    if (Number(tempMontant) > 0) onEditPaiement(s.id, editingPaiement, { montant: Number(tempMontant) });
    setEditingPaiement(null);
  };

  return (
    <div className="pt-2.5 first:pt-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium">{s.type} — {s.description}</p>
          <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>{dateFR(s.date)} · {s.mode}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <PaiementPill statut={st} />
          <p className="gc-tabular text-xs font-semibold">{fcfa(s.montantDu)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-1.5">
        {(s.paiements || []).length > 0 && (
          <button onClick={() => setShowHist(!showHist)} className="text-xs font-medium" style={{ color: C.brand }}>
            {showHist ? 'Masquer' : 'Voir'} les versements ({s.paiements.length})
          </button>
        )}
        {r > 0 && (
          <button onClick={() => onPay(s.id)} className="text-xs font-semibold" style={{ color: C.brand }}>Enregistrer un paiement</button>
        )}
        <button onClick={() => onEdit(s.id)} aria-label="Modifier" className="flex items-center gap-1 text-xs font-medium p-2 -m-2" style={{ color: C.textMuted }}>
          <Pencil size={12} /> Modifier
        </button>
        <button onClick={() => onRemove(s.id)} aria-label="Supprimer" className="p-2 -m-2" style={{ color: C.textMuted, marginLeft: 'auto' }}><Trash2 size={13} /></button>
      </div>

      {showHist && (
        <div className="mt-1.5 pl-2 flex flex-col gap-1" style={{ borderLeft: `2px solid ${C.border}` }}>
          {s.paiements.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-xs pl-2 gap-2" style={{ color: C.textMuted }}>
              <span className="flex items-center gap-1 shrink-0"><CheckCircle2 size={11} style={{ color: C.green }} /> {dateFR(p.date)}</span>
              {editingPaiement === p.id ? (
                <div className="flex items-center gap-1">
                  <TextInput
                    type="number"
                    autoFocus
                    value={tempMontant}
                    onChange={(e) => setTempMontant(e.target.value)}
                    style={{ width: 90, padding: '3px 6px', fontSize: 12 }}
                  />
                  <button onClick={saveEditPaiement} aria-label="Valider" className="p-1.5" style={{ color: C.green }}><Check size={14} /></button>
                  <button onClick={() => setEditingPaiement(null)} aria-label="Annuler" className="p-1.5" style={{ color: C.textMuted }}><X size={14} /></button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="gc-tabular font-medium">{fcfa(p.montant)}</span>
                  <button onClick={() => startEditPaiement(p)} aria-label="Modifier le versement" className="p-2 -m-2" style={{ color: C.textMuted }}><Pencil size={11} /></button>
                  <button onClick={() => onRemovePaiement(s.id, p.id)} aria-label="Supprimer le versement" className="p-2 -m-2" style={{ color: C.textMuted }}><Trash2 size={11} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AutocompleteInput({ value, onChange, onSelect, options, placeholder }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <TextInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        style={{ paddingRight: 36 }}
      />
      <button
        type="button"
        aria-label="Voir la liste"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        style={{ position: 'absolute', right: 4, top: 0, bottom: 0, color: C.textMuted, padding: '0 10px' }}
      >
        <ChevronDown size={16} />
      </button>
      {open && options.length > 0 && (
        <div
          className="gc-scroll"
          style={{ position: 'absolute', left: 0, right: 0, top: '100%', marginTop: 4, zIndex: 30, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: '0 10px 24px rgba(15,23,42,.12)', maxHeight: 200, overflowY: 'auto' }}
        >
          {options.slice(0, 20).map((o, i, arr) => (
            <button
              key={o}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(o); onSelect && onSelect(o); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm"
              style={{ borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SortieForm({ chantier, existingBeneficiaires = [], onClose, onSave }) {
  const parsedPersons = useMemo(() => existingBeneficiaires.map((full) => {
    const m = full.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    return m ? { nom: m[1].trim(), fonction: m[2].trim() } : { nom: full.trim(), fonction: '' };
  }), [existingBeneficiaires]);
  const nomsUniques = useMemo(() => [...new Set(parsedPersons.map((p) => p.nom))].filter(Boolean).sort(), [parsedPersons]);

  const [f, setF] = useState({
    date: today(), chantier, beneficiaireNom: '', beneficiaireFonction: '', beneficiaireFonctionAutre: '',
    type: TYPES_SORTIE[0], description: '', mode: 'Espèces',
    statutPaiement: 'Payé en totalité', montant: '', montantDu: '', montantPayeInitial: '',
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const isCredit = f.statutPaiement === 'À crédit';

  const handleSelectNom = (nom) => {
    const match = parsedPersons.find((p) => p.nom.toLowerCase() === nom.toLowerCase());
    if (!match) { setF((prev) => ({ ...prev, beneficiaireNom: nom })); return; }
    const knownOption = FONCTIONS_BENEFICIAIRE.find((fo) => fo.toLowerCase() === match.fonction.toLowerCase());
    setF((prev) => ({
      ...prev,
      beneficiaireNom: match.nom,
      beneficiaireFonction: knownOption || (match.fonction ? 'Autre' : ''),
      beneficiaireFonctionAutre: knownOption ? '' : match.fonction,
    }));
  };

  const fonctionFinale = f.beneficiaireFonction === 'Autre' ? f.beneficiaireFonctionAutre.trim() : f.beneficiaireFonction;
  const beneficiaireFinal = fonctionFinale ? `${f.beneficiaireNom.trim()} (${fonctionFinale})` : f.beneficiaireNom.trim();
  const valid = f.date && f.beneficiaireNom.trim() && (isCredit ? f.montantDu : f.montant);

  const submit = () => {
    if (!valid) return;
    if (isCredit) {
      const montantDu = Number(f.montantDu);
      const initial = Number(f.montantPayeInitial || 0);
      const paiements = initial > 0 ? [{ id: uid('p'), date: f.date, montant: initial }] : [];
      onSave({ date: f.date, chantier: f.chantier, beneficiaire: beneficiaireFinal, type: f.type, description: f.description, mode: f.mode, montantDu, paiements });
    } else {
      const montant = Number(f.montant);
      onSave({ date: f.date, chantier: f.chantier, beneficiaire: beneficiaireFinal, type: f.type, description: f.description, mode: f.mode, montantDu: montant, paiements: [{ id: uid('p'), date: f.date, montant }] });
    }
  };

  return (
    <Modal title={`Nouvelle sortie — ${chantier}`} onClose={onClose}>
      <Field label="Date"><TextInput type="date" value={f.date} onChange={set('date')} /></Field>
      <Field label="Bénéficiaire">
        <AutocompleteInput
          value={f.beneficiaireNom}
          onChange={(v) => setF({ ...f, beneficiaireNom: v })}
          onSelect={handleSelectNom}
          options={nomsUniques}
          placeholder="Ex. Hervé"
        />
      </Field>
      <Field label="Fonction">
        <Select value={f.beneficiaireFonction} onChange={set('beneficiaireFonction')}>
          <option value="">Sans fonction précisée</option>
          {FONCTIONS_BENEFICIAIRE.map((fo) => <option key={fo} value={fo}>{fo}</option>)}
        </Select>
      </Field>
      {f.beneficiaireFonction === 'Autre' && (
        <Field label="Précisez la fonction"><TextInput value={f.beneficiaireFonctionAutre} onChange={set('beneficiaireFonctionAutre')} placeholder="Ex. carreleur" /></Field>
      )}

      <Field label="Type"><Select value={f.type} onChange={set('type')}>{TYPES_SORTIE.map((t) => <option key={t} value={t}>{t}</option>)}</Select></Field>
      <Field label="Description"><TextInput value={f.description} onChange={set('description')} placeholder="Ex. 10 sacs de ciment" /></Field>
      <Field label="Mode de paiement"><Select value={f.mode} onChange={set('mode')}>{MODES.map((m) => <option key={m} value={m}>{m}</option>)}</Select></Field>

      <Field label="Statut du paiement">
        <ToggleGroup options={['Payé en totalité', 'À crédit']} value={f.statutPaiement} onChange={(v) => setF({ ...f, statutPaiement: v })} />
      </Field>

      {!isCredit ? (
        <Field label="Montant payé (FCFA)"><TextInput type="number" value={f.montant} onChange={set('montant')} placeholder="0" /></Field>
      ) : (
        <>
          <Field label="Somme due (FCFA)"><TextInput type="number" value={f.montantDu} onChange={set('montantDu')} placeholder="0" /></Field>
          <Field label="Déjà payé aujourd'hui (optionnel)"><TextInput type="number" value={f.montantPayeInitial} onChange={set('montantPayeInitial')} placeholder="0" /></Field>
        </>
      )}

      <div className="mt-2">
        <PrimaryButton disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={submit}>Enregistrer la sortie</PrimaryButton>
      </div>
    </Modal>
  );
}

function SortieEditForm({ sortie, onClose, onSave }) {
  const [f, setF] = useState({
    date: sortie.date, beneficiaire: sortie.beneficiaire, type: sortie.type,
    description: sortie.description, mode: sortie.mode, montantDu: String(sortie.montantDu),
  });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const dejaPayeAuDela = paye(sortie);
  const valid = f.date && f.beneficiaire.trim() && Number(f.montantDu) >= 0;

  const submit = () => {
    if (!valid) return;
    onSave({ date: f.date, beneficiaire: f.beneficiaire, type: f.type, description: f.description, mode: f.mode, montantDu: Number(f.montantDu) });
  };

  return (
    <Modal title={`Modifier — ${sortie.beneficiaire}`} onClose={onClose}>
      <Field label="Date"><TextInput type="date" value={f.date} onChange={set('date')} /></Field>
      <Field label="Bénéficiaire (personne ou fournisseur)"><TextInput value={f.beneficiaire} onChange={set('beneficiaire')} /></Field>
      <Field label="Type"><Select value={f.type} onChange={set('type')}>{TYPES_SORTIE.map((t) => <option key={t} value={t}>{t}</option>)}</Select></Field>
      <Field label="Description"><TextInput value={f.description} onChange={set('description')} /></Field>
      <Field label="Mode de paiement"><Select value={f.mode} onChange={set('mode')}>{MODES.map((m) => <option key={m} value={m}>{m}</option>)}</Select></Field>
      <Field label="Somme totale due (FCFA)"><TextInput type="number" value={f.montantDu} onChange={set('montantDu')} /></Field>
      {dejaPayeAuDela > 0 && (
        <p className="text-xs -mt-2 mb-3" style={{ color: C.textMuted }}>Déjà versé jusqu'ici : {fcfa(dejaPayeAuDela)}. Le reste à payer se recalculera automatiquement.</p>
      )}
      <div className="mt-2">
        <PrimaryButton disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={submit}>Enregistrer les modifications</PrimaryButton>
      </div>
    </Modal>
  );
}

function PaiementForm({ sortie, onClose, onSave }) {
  const r = reste(sortie);
  const [f, setF] = useState({ date: today(), montant: r > 0 ? String(r) : '' });
  const valid = f.date && Number(f.montant) > 0;
  return (
    <Modal title={`Paiement — ${sortie.beneficiaire}`} onClose={onClose}>
      <p className="text-xs mb-3" style={{ color: C.textMuted }}>
        Reste à payer : <span className="font-semibold" style={{ color: C.red }}>{fcfa(r)}</span>
      </p>
      <Field label="Date du paiement"><TextInput type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
      <Field label="Montant versé (FCFA)"><TextInput type="number" value={f.montant} onChange={(e) => setF({ ...f, montant: e.target.value })} placeholder="0" /></Field>
      <div className="mt-2">
        <PrimaryButton disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={() => valid && onSave({ date: f.date, montant: Number(f.montant) })}>Enregistrer le versement</PrimaryButton>
      </div>
    </Modal>
  );
}
