import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutDashboard, Building2, ArrowDownCircle, ArrowUpCircle,
  Plus, X, Search, AlertTriangle, ChevronDown, ChevronRight, ChevronLeft, Trash2, CheckCircle2, Pencil, Check, LogOut, Cloud, CloudOff, RefreshCw, Users,
} from 'lucide-react';
import { STATUTS, MODES, TYPES_SORTIE, FONCTIONS_BENEFICIAIRE, fcfa, dateFR, today, paye, reste, statutSortie, byDateDesc } from './lib.js';
import { useAppData } from './store.js';
import { useEquipe, peutGerer, deconnecter, ROLES } from './equipe.js';
import { EquipeTab } from './Equipe.jsx';
import { demanderConfirmation } from './confirm.jsx';
import { Logo, C, Field, inputStyle, TextInput, Select, StatusPill, PaiementPill, Modal, PrimaryButton, ToggleGroup, EmptyState, BackBar, PageIntro } from './ui.jsx';

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
            onClick={() => onSelect(c.id)}
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

// Mémorise l'écran courant pour l'onglet du navigateur (survit au rafraîchissement).
const ECRAN_KEY = 'gestion-chantiers-ecran';
const ONGLETS = ['dashboard', 'chantiers', 'entrees', 'sorties', 'equipe'];
function lireEcran() {
  try {
    const e = JSON.parse(sessionStorage.getItem(ECRAN_KEY)) || {};
    return { tab: ONGLETS.includes(e.tab) ? e.tab : 'dashboard', selEntree: e.selEntree || '', selSortie: e.selSortie || '' };
  } catch (err) {
    return { tab: 'dashboard', selEntree: '', selSortie: '' };
  }
}
function ecrireEcran(ecran) {
  try {
    sessionStorage.setItem(ECRAN_KEY, JSON.stringify(ecran));
  } catch (err) {
    // navigation privée : sans conséquence
  }
}

export default function App({ user, membre, onMembreUpdated, onMembershipChanged }) {
  const { data, saveError, syncStatus, pendingCount, syncNow, actions } = useAppData(user.id, membre.entrepriseId, membre.role);
  const equipe = useEquipe(user.id, user.email, membre.role);
  const gerer = peutGerer(membre.role); // créer, modifier, supprimer les chantiers
  // Écran affiché au moment d'un rafraîchissement de la page : on y revient.
  const [ecranInitial] = useState(lireEcran);
  const [tab, setTab] = useState(ecranInitial.tab);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [selEntree, setSelEntree] = useState(ecranInitial.selEntree); // id du chantier ouvert dans Entrées
  const [selSortie, setSelSortie] = useState(ecranInitial.selSortie); // id du chantier ouvert dans Sorties
  const [paiementFor, setPaiementFor] = useState(null); // id de la sortie à payer
  const [editSortieId, setEditSortieId] = useState(null); // sortie id en cours de modification
  const [editChantierId, setEditChantierId] = useState(null); // chantier id en cours de modification
  const [editEntreeId, setEditEntreeId] = useState(null); // entrée id en cours de modification
  const [backHint, setBackHint] = useState(false);
  const navPoppingRef = useRef(false);
  const backTimerRef = useRef(null);
  const allowExitRef = useRef(false);
  const navInitializedRef = useRef(false);

  // Navigation interne + double retour sur l'accueil.
  // Un état sentinelle est placé sous l'accueil afin que le premier retour
  // puisse être intercepté sans casser la navigation entre les écrans.
  useEffect(() => {
    const url = window.location.href;
    if (!navInitializedRef.current) {
      window.history.replaceState({ appSentinel: true }, '', url);
      window.history.pushState({ appNav: true, tab: 'dashboard', selEntree: '', selSortie: '' }, '', url);
      // Écran restauré après rafraîchissement : « retour » ramène à l'accueil.
      if (ecranInitial.tab !== 'dashboard') window.history.pushState({ appNav: true, ...ecranInitial }, '', url);
      navInitializedRef.current = true;
    }

    const onPopState = (event) => {
      if (allowExitRef.current) {
        allowExitRef.current = false;
        return;
      }

      const state = event.state;

      // Retour vers un écran interne : on restaure exactement l'écran précédent.
      if (state?.appNav) {
        navPoppingRef.current = true;
        setTab(state.tab || 'dashboard');
        setSelEntree(state.selEntree || '');
        setSelSortie(state.selSortie || '');
        setSearch('');
        return;
      }

      // Nous sommes sur la sentinelle sous l'accueil : premier retour = avertissement,
      // deuxième retour rapproché = sortie de l'application.
      if (state?.appSentinel) {
        if (backTimerRef.current) {
          clearTimeout(backTimerRef.current);
          backTimerRef.current = null;
          setBackHint(false);
          allowExitRef.current = true;
          window.history.back();
        } else {
          setBackHint(true);
          backTimerRef.current = setTimeout(() => {
            backTimerRef.current = null;
            setBackHint(false);
          }, 1600);
          window.history.pushState({ appNav: true, tab: 'dashboard', selEntree: '', selSortie: '' }, '', url);
        }
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
      if (backTimerRef.current) clearTimeout(backTimerRef.current);
    };
  }, []);

  useEffect(() => {
    // Le premier état dashboard est déjà poussé par l'effet d'initialisation.
    // Après un popstate, l'entrée d'historique existe déjà : inutile d'en créer une autre.
    if (navPoppingRef.current) {
      navPoppingRef.current = false;
      return;
    }
    const current = window.history.state;
    if (current?.appNav && current.tab === tab && current.selEntree === selEntree && current.selSortie === selSortie) return;
    window.history.pushState({ appNav: true, tab, selEntree, selSortie }, '', window.location.href);
  }, [tab, selEntree, selSortie]);

  useEffect(() => { ecrireEcran({ tab, selEntree, selSortie }); }, [tab, selEntree, selSortie]);

  // Agrégats calculés en une seule passe sur les entrées et les sorties.
  const stats = useMemo(() => {
    const acc = new Map(data.chantiers.map((c) => [c.id, { totalEntrees: 0, totalSorties: 0, totalReste: 0 }]));
    for (const e of data.entrees) {
      const a = acc.get(e.chantierId);
      if (a) a.totalEntrees += Number(e.montant || 0);
    }
    for (const s of data.sorties) {
      const a = acc.get(s.chantierId);
      if (!a) continue;
      a.totalSorties += paye(s);
      a.totalReste += Math.max(reste(s), 0);
    }
    return [...data.chantiers].sort(parDateDebut).map((c) => {
      const a = acc.get(c.id);
      const solde = a.totalEntrees - a.totalSorties;
      const pct = c.budget > 0 ? a.totalSorties / c.budget : 0;
      return { ...c, ...a, solde, pct };
    });
  }, [data]);

  const totaux = useMemo(
    () => stats.reduce((a, s) => ({ budget: a.budget + Number(s.budget || 0), entrees: a.entrees + s.totalEntrees, sorties: a.sorties + s.totalSorties, solde: a.solde + s.solde, reste: a.reste + s.totalReste }), { budget: 0, entrees: 0, sorties: 0, solde: 0, reste: 0 }),
    [stats]
  );
  const statsById = useMemo(() => new Map(stats.map((s) => [s.id, s])), [stats]);

  const entreesDuChantier = useMemo(
    () => (selEntree ? data.entrees.filter((e) => e.chantierId === selEntree).sort(byDateDesc) : []),
    [data.entrees, selEntree]
  );
  const sortiesDuChantier = useMemo(
    () => (selSortie ? data.sorties.filter((s) => s.chantierId === selSortie) : []),
    [data.sorties, selSortie]
  );
  const existingBeneficiaires = useMemo(
    () => [...new Set(sortiesDuChantier.map((s) => s.beneficiaire).filter(Boolean))].sort(),
    [sortiesDuChantier]
  );

  const chantierEntree = statsById.get(selEntree);
  const chantierSortie = statsById.get(selSortie);
  const paiementForSortie = paiementFor ? data.sorties.find((s) => s.id === paiementFor) : null;
  const editSortieObj = editSortieId ? data.sorties.find((s) => s.id === editSortieId) : null;
  const editChantierObj = editChantierId ? data.chantiers.find((c) => c.id === editChantierId) : null;
  const editEntreeObj = editEntreeId ? data.entrees.find((e) => e.id === editEntreeId) : null;
  const nomChantier = (id) => statsById.get(id)?.nom || '';

  // « Saisi par » : affiché dès que l'entreprise compte plusieurs membres.
  const auteur = useMemo(() => {
    if (equipe.membres.length < 2) return null;
    const noms = new Map(equipe.membres.map((m) => [m.user_id, m.nom_affiche || m.email]));
    return (row) => (row.creePar ? noms.get(row.creePar) || 'ancien membre' : noms.get(user.id));
  }, [equipe.membres, user.id]);

  const aucunChantierTexte = gerer
    ? null
    : membre.role === 'employe'
      ? 'Aucun chantier ne vous a encore été attribué. Demandez au propriétaire ou à un associé de vous en attribuer.'
      : 'Aucun chantier pour l’instant. Seuls le propriétaire et les associés peuvent en créer.';

  const logout = async () => {
    if (pendingCount > 0 && !(await demanderConfirmation({
      titre: 'Se déconnecter quand même ?',
      message: `${pendingCount} modification(s) n’ont pas encore été envoyées en ligne (pas de réseau). Si vous vous déconnectez maintenant, elles seront perdues.`,
      confirmer: 'Se déconnecter',
    }))) return;
    await deconnecter(user.id);
  };

  return (
    <div className="gc-root min-h-screen" style={{ background: C.bg }}>
      <div className="max-w-md lg:max-w-xl mx-auto min-h-screen flex flex-col" style={{ background: C.bg, borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}` }}>
        {tab === 'dashboard' && <Header totaux={totaux} saveError={saveError} email={user.email} membre={membre} syncStatus={syncStatus} pendingCount={pendingCount} onSync={syncNow} onLogout={logout} />}

        <main className="flex-1 overflow-y-auto gc-scroll pb-24 px-4" style={{ paddingTop: 18 }}>
            {tab === 'dashboard' && <Dashboard stats={stats} search={search} setSearch={setSearch} emptyText={aucunChantierTexte} />}

            {tab === 'chantiers' && (
              <ChantiersTab chantiers={data.chantiers} stats={stats} gerer={gerer} emptyText={aucunChantierTexte} onAdd={() => setModal('chantier')} onEdit={setEditChantierId} onRemove={actions.removeChantier} onChangeStatut={actions.updateStatutChantier} onChangeDateFin={actions.updateDateFinReelle} />
            )}

            {tab === 'entrees' && (
              !chantierEntree ? (
                <div>
                  <PageIntro eyebrow="Suivi financier" title="Entrées" subtitle="Les paiements reçus, chantier par chantier" />
                  <ChantierPicker
                    chantiers={stats}
                    emptyText={aucunChantierTexte || 'Ajoutez un chantier pour commencer à enregistrer des entrées.'}
                    getSubtitle={(c) => {
                      const lines = [{ label: fcfa(c.totalEntrees), color: C.green }];
                      if (c.budget > 0 && c.totalEntrees >= c.budget) lines.push({ label: 'Soldé', color: C.green });
                      return lines;
                    }}
                    onSelect={setSelEntree}
                  />
                </div>
              ) : (
                <EntreeDetail
                  chantier={chantierEntree.nom}
                  budget={chantierEntree.budget || 0}
                  entrees={entreesDuChantier}
                  onBack={() => setSelEntree('')}
                  onAdd={() => setModal('entree')}
                  onRemove={actions.removeEntree}
                  onEdit={setEditEntreeId}
                  auteur={auteur}
                />
              )
            )}

            {tab === 'sorties' && (
              !chantierSortie ? (
                <div>
                  <PageIntro eyebrow="Suivi financier" title="Sorties" subtitle="Les dépenses et paiements à suivre" />
                  <ChantierPicker
                    chantiers={stats}
                    emptyText={aucunChantierTexte || 'Ajoutez un chantier pour commencer à enregistrer des sorties.'}
                    getSubtitle={(c) => {
                      const lines = [{ label: fcfa(c.totalSorties), color: C.textMuted }];
                      if (c.totalReste > 0) lines.push({ label: `Reste ${fcfa(c.totalReste)}`, color: C.red });
                      return lines;
                    }}
                    onSelect={setSelSortie}
                  />
                </div>
              ) : (
                <SortieDetail
                  chantier={chantierSortie.nom}
                  sorties={sortiesDuChantier}
                  onBack={() => setSelSortie('')}
                  onAdd={() => setModal('sortie')}
                  onRemove={actions.removeSortie}
                  onPay={setPaiementFor}
                  onEdit={setEditSortieId}
                  onEditPaiement={actions.updatePaiement}
                  onRemovePaiement={actions.removePaiement}
                  auteur={auteur}
                />
              )
            )}

            {tab === 'equipe' && (
              <EquipeTab
                user={user}
                membre={membre}
                equipe={equipe}
                chantiers={stats}
                pendingCount={pendingCount}
                onMembershipChanged={onMembershipChanged}
                onMembreUpdated={onMembreUpdated}
              />
            )}
          </main>

          <BottomNav tab={tab} badgeEquipe={equipe.mesInvitations.length} setTab={(t) => { setTab(t); setSearch(''); if (t !== 'entrees') setSelEntree(''); if (t !== 'sorties') setSelSortie(''); }} />
      </div>

      {backHint && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg" style={{ background: 'rgba(15,23,42,.92)', color: '#fff' }}>
          Appuyez encore une fois pour quitter
        </div>
      )}

      {modal === 'chantier' && <ChantierForm onClose={() => setModal(null)} onSave={(c) => { actions.addChantier(c); setModal(null); }} />}
      {editChantierObj && (
        <ChantierForm
          chantier={editChantierObj}
          onClose={() => setEditChantierId(null)}
          onSave={(patch) => { actions.updateChantier(editChantierObj.id, patch); setEditChantierId(null); }}
        />
      )}
      {modal === 'entree' && chantierEntree && (
        <EntreeForm chantierId={chantierEntree.id} chantierNom={chantierEntree.nom} onClose={() => setModal(null)} onSave={(e) => { actions.addEntree(e); setModal(null); }} />
      )}
      {editEntreeObj && (
        <EntreeForm
          entree={editEntreeObj}
          chantierId={editEntreeObj.chantierId}
          chantierNom={nomChantier(editEntreeObj.chantierId)}
          onClose={() => setEditEntreeId(null)}
          onSave={(patch) => { actions.updateEntree(editEntreeObj.id, patch); setEditEntreeId(null); }}
        />
      )}
      {modal === 'sortie' && chantierSortie && (
        <SortieForm chantierId={chantierSortie.id} chantierNom={chantierSortie.nom} existingBeneficiaires={existingBeneficiaires} onClose={() => setModal(null)} onSave={(s) => { actions.addSortie(s); setModal(null); }} />
      )}
      {paiementForSortie && (
        <PaiementForm sortie={paiementForSortie} onClose={() => setPaiementFor(null)} onSave={(p) => { actions.addPaiement(paiementForSortie.id, p); setPaiementFor(null); }} />
      )}
      {editSortieObj && (
        <SortieEditForm sortie={editSortieObj} onClose={() => setEditSortieId(null)} onSave={(patch) => { actions.updateSortie(editSortieObj.id, patch); setEditSortieId(null); }} />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Header + Nav                                                      */
/* ---------------------------------------------------------------- */

// Chantiers les plus récents en premier ; sans date de début à la fin.
function parDateDebut(a, b) {
  if (a.dateDebut !== b.dateDebut) return !a.dateDebut ? 1 : !b.dateDebut ? -1 : a.dateDebut < b.dateDebut ? 1 : -1;
  return (a.nom || '').localeCompare(b.nom || '', 'fr');
}

function SyncBadge({ status, pendingCount, onSync }) {
  const map = {
    synced: { Icon: Cloud, label: 'Sauvegardé en ligne' },
    syncing: { Icon: RefreshCw, label: 'Synchronisation…' },
    offline: { Icon: CloudOff, label: pendingCount > 0 ? `Hors ligne · ${pendingCount} modif. en attente` : 'Hors ligne' },
    error: { Icon: CloudOff, label: 'Échec de la synchro · réessayer' },
  };
  const { Icon, label } = map[status] || map.syncing;
  return (
    <button onClick={onSync} className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,.12)', color: status === 'error' ? '#FECACA' : '#DBEAFE' }}>
      <Icon size={12} /> {label}
    </button>
  );
}

function Header({ totaux, saveError, email, membre, syncStatus, pendingCount, onSync, onLogout }) {
  const balancePositive = totaux.solde >= 0;
  return (
    <header className="px-5 pt-5 pb-4" style={{ background: `linear-gradient(145deg, ${C.brandDark} 0%, #1E3A8A 55%, ${C.brand} 100%)`, color: '#fff' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] font-bold" style={{ color: '#BFDBFE' }}>{ROLES[membre.role]?.label} · Gestion Chantiers</p>
          <p className="gc-display text-xl mt-1">{membre.entrepriseNom || 'Mon entreprise'}</p>
        </div>
        <div style={{ filter: 'drop-shadow(0 6px 14px rgba(0,0,0,.25))', borderRadius: 11, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.18)' }}>
          <Logo size={44} />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mt-3">
        <SyncBadge status={syncStatus} pendingCount={pendingCount} onSync={onSync} />
        <button onClick={onLogout} title={email} className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full min-w-0" style={{ background: 'rgba(255,255,255,.12)', color: '#DBEAFE' }}>
          <LogOut size={12} /> Déconnexion
        </button>
      </div>
      <div className="mt-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.12)', backdropFilter: 'blur(8px)' }}>
        <p className="text-xs" style={{ color: '#BFDBFE' }}>{saveError ? 'Mémoire du téléphone pleine : enregistrement local impossible' : 'Solde global'}</p>
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
  { id: 'equipe', label: 'Équipe', icon: Users },
];

function BottomNav({ tab, setTab, badgeEquipe }) {
  return (
    <nav className="max-w-md lg:max-w-xl mx-auto w-full fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pointer-events-none">
      <div className="pointer-events-auto rounded-2xl shadow-lg" style={{ background: 'rgba(255,255,255,.96)', border: `1px solid ${C.border}`, boxShadow: '0 12px 30px rgba(15,23,42,.10)', backdropFilter: 'blur(14px)' }}>
        <div className="flex p-1.5">
          {NAV_ITEMS.map((it) => { const Icon = it.icon; const active = tab === it.id; return (
            <button key={it.id} onClick={() => setTab(it.id)} className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl relative" style={{ color: active ? C.brand : C.textMuted, background: active ? C.brandTint : 'transparent' }}>
              <Icon size={19} strokeWidth={active ? 2.4 : 1.8} />
              {it.id === 'equipe' && badgeEquipe > 0 && <span style={{ position: 'absolute', top: 5, right: 'calc(50% - 16px)', width: 8, height: 8, borderRadius: 999, background: C.red }} />}
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 600 }}>{it.label}</span>
            </button>
          ); })}
        </div>
      </div>
    </nav>
  );
}

/* ---------------------------------------------------------------- */
/* Dashboard                                                          */
/* ---------------------------------------------------------------- */

function Dashboard({ stats, search, setSearch, emptyText }) {
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

      {filtered.length === 0 && <EmptyState text={stats.length === 0 && emptyText ? emptyText : 'Aucun chantier ne correspond à cette recherche.'} />}
      <div className="gc-dashboard-list flex flex-col gap-3.5">
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

function ChantiersTab({ chantiers, stats, gerer, emptyText, onAdd, onEdit, onRemove, onChangeStatut, onChangeDateFin }) {
  const counts = {
    total: chantiers.length,
    active: chantiers.filter((c) => c.statut === 'En cours').length,
    done: chantiers.filter((c) => c.statut === 'Terminé').length,
    paused: chantiers.filter((c) => c.statut === 'En pause').length,
  };
  return (
    <div>
      <PageIntro eyebrow="Gestion des projets" title="Chantiers" subtitle="Tous vos projets, leur statut et leur budget" action={gerer ? 'Ajouter' : null} onAction={onAdd} />

      <div className="grid grid-cols-4 gap-2 mb-4">
        <MiniCount label="Tous" value={counts.total} />
        <MiniCount label="En cours" value={counts.active} tone="green" />
        <MiniCount label="Terminés" value={counts.done} />
        <MiniCount label="En pause" value={counts.paused} tone="amber" />
      </div>

      {chantiers.length === 0 && (gerer
        ? <EmptyState text="Aucun chantier pour l'instant." cta="Ajouter le premier chantier" onCta={onAdd} />
        : <EmptyState text={emptyText} />)}
      <div className="gc-chantiers-list flex flex-col gap-3">
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
              {gerer && <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => onEdit(c.id)} aria-label="Modifier le chantier" title="Modifier" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: C.brand, background: C.brandTint }}><Pencil size={14} /></button>
                <button onClick={() => onRemove(c.id)} aria-label="Supprimer" title="Supprimer" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: C.textMuted, background: C.surfaceSoft }}><Trash2 size={14} /></button>
              </div>}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5" style={{ borderTop: `1px solid ${C.border}` }}>
              <Stat label="Début" value={dateFR(c.dateDebut)} />
              <Stat label="Fin prévue" value={dateFR(c.dateFin)} />
              <Stat label="Budget" value={fcfa(c.budget)} valueColor={C.text} />
              <Stat label="Solde" value={fcfa(c.solde)} valueColor={c.solde >= 0 ? C.green : C.red} />
            </div>

            {gerer && <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
              <StatutSelect statut={c.statut} onChange={(v) => onChangeStatut(c.id, v)} />
              {c.statut === 'Terminé' && (
                <label className="flex items-center gap-1.5 text-xs" style={{ color: C.textMuted }}>
                  Terminé le
                  <TextInput type="date" value={c.dateFinReelle || ''} onChange={(e) => onChangeDateFin(c.id, e.target.value)} style={{ width: 'auto', padding: '5px 8px', fontSize: 12 }} />
                </label>
              )}
            </div>}
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

function ChantierForm({ chantier, onClose, onSave }) {
  const [f, setF] = useState(() => chantier ? {
    ...chantier,
    budget: chantier.budget ?? '',
    statut: chantier.statut || 'En cours',
  } : { nom: '', client: '', adresse: '', dateDebut: '', dateFin: '', budget: '', statut: 'En cours' });
  const isEdit = Boolean(chantier);
  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }));
  const valid = f.nom.trim() && f.client.trim() && Number(f.budget) > 0;
  return (
    <Modal title={isEdit ? 'Modifier le chantier' : 'Nouveau chantier'} onClose={onClose}>
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
        <PrimaryButton disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={() => valid && onSave({ ...f, budget: Number(f.budget) })}>{isEdit ? 'Enregistrer les modifications' : 'Enregistrer le chantier'}</PrimaryButton>
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------------------- */
/* Entrées                                                            */
/* ---------------------------------------------------------------- */

function EntreeDetail({ chantier, budget, entrees, onBack, onAdd, onRemove, onEdit, auteur }) {
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
              <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>{dateFR(e.date)} · {e.mode}{auteur && <> · saisi par <strong>{auteur(e)}</strong></>}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <p className="gc-tabular font-semibold text-sm" style={{ color: C.green }}>+{fcfa(e.montant)}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit(e.id)} aria-label="Modifier l'entrée" title="Modifier" style={{ color: C.brand, background: C.brandTint, width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Pencil size={14} /></button>
                <button onClick={() => onRemove(e.id)} aria-label="Supprimer" title="Supprimer" style={{ color: C.textMuted, background: C.surfaceSoft, width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EntreeForm({ chantierId, chantierNom, entree, onClose, onSave }) {
  const [f, setF] = useState(() => entree ? { ...entree, montant: entree.montant ?? '' } : { date: today(), chantierId, versePar: '', description: '', mode: 'Espèces', montant: '' });
  const isEdit = Boolean(entree);
  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }));
  const valid = f.date && Number(f.montant) > 0;
  return (
    <Modal title={`${isEdit ? 'Modifier l’entrée' : 'Nouvelle entrée'} — ${chantierNom}`} onClose={onClose}>
      <Field label="Date"><TextInput type="date" value={f.date} onChange={set('date')} /></Field>
      <Field label="Versé par"><TextInput value={f.versePar} onChange={set('versePar')} placeholder="Nom de la personne ou de l'entreprise qui verse" /></Field>
      <Field label="Description"><TextInput value={f.description} onChange={set('description')} placeholder="Ex. 2e paiement" /></Field>
      <Field label="Mode de paiement"><Select value={f.mode} onChange={set('mode')}>{MODES.map((m) => <option key={m} value={m}>{m}</option>)}</Select></Field>
      <Field label="Montant reçu (FCFA)"><TextInput type="number" value={f.montant} onChange={set('montant')} placeholder="0" /></Field>
      <div className="mt-2">
        <PrimaryButton disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={() => valid && onSave({ ...f, montant: Number(f.montant) })}>{isEdit ? 'Enregistrer les modifications' : 'Enregistrer l’entrée'}</PrimaryButton>
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------------------- */
/* Sorties                                                            */
/* ---------------------------------------------------------------- */

function SortieDetail({ chantier, sorties, onBack, onAdd, onRemove, onPay, onEdit, onEditPaiement, onRemovePaiement, auteur }) {
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
          <BeneficiaireGroup key={g.nom} group={g} onRemove={onRemove} onPay={onPay} onEdit={onEdit} onEditPaiement={onEditPaiement} onRemovePaiement={onRemovePaiement} auteur={auteur} />
        ))}
      </div>
    </div>
  );
}

function BeneficiaireGroup({ group, onRemove, onPay, onEdit, onEditPaiement, onRemovePaiement, auteur }) {
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
            <SortieLine key={s.id} s={s} onRemove={onRemove} onPay={onPay} onEdit={onEdit} onEditPaiement={onEditPaiement} onRemovePaiement={onRemovePaiement} auteur={auteur} />
          ))}
        </div>
      )}
    </div>
  );
}

function SortieLine({ s, onRemove, onPay, onEdit, onEditPaiement, onRemovePaiement, auteur }) {
  const [showHist, setShowHist] = useState(false);
  const [editingPaiement, setEditingPaiement] = useState(null); // versement en cours de modification
  const st = statutSortie(s);
  const r = reste(s);

  return (
    <div className="pt-2.5 first:pt-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium">{s.type} — {s.description}</p>
          <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>{dateFR(s.date)} · {s.mode}{auteur && <> · saisi par <strong>{auteur(s)}</strong></>}</p>
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
              <div className="flex items-center gap-3">
                <span className="gc-tabular font-medium">{fcfa(p.montant)}</span>
                <button onClick={() => setEditingPaiement(p)} aria-label="Modifier le versement" className="p-2 -m-2" style={{ color: C.textMuted }}><Pencil size={11} /></button>
                <button onClick={() => onRemovePaiement(s.id, p.id)} aria-label="Supprimer le versement" className="p-2 -m-2" style={{ color: C.textMuted }}><Trash2 size={11} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingPaiement && (
        <PaiementForm
          sortie={s}
          paiement={editingPaiement}
          onClose={() => setEditingPaiement(null)}
          onSave={(patch) => { onEditPaiement(s.id, editingPaiement.id, patch); setEditingPaiement(null); }}
        />
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

function SortieForm({ chantierId, chantierNom, existingBeneficiaires = [], onClose, onSave }) {
  const parsedPersons = useMemo(() => existingBeneficiaires.map((full) => {
    const m = full.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    return m ? { nom: m[1].trim(), fonction: m[2].trim() } : { nom: full.trim(), fonction: '' };
  }), [existingBeneficiaires]);
  const nomsUniques = useMemo(() => [...new Set(parsedPersons.map((p) => p.nom))].filter(Boolean).sort(), [parsedPersons]);

  const [f, setF] = useState({
    date: today(), beneficiaireNom: '', beneficiaireFonction: '', beneficiaireFonctionAutre: '',
    type: TYPES_SORTIE[0], description: '', mode: 'Espèces',
    statutPaiement: 'Payé en totalité', montant: '', montantDu: '', montantPayeInitial: '',
  });
  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }));
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
  const valid = f.date && f.beneficiaireNom.trim() && Number(isCredit ? f.montantDu : f.montant) > 0;

  const submit = () => {
    if (!valid) return;
    if (isCredit) {
      const montantDu = Number(f.montantDu);
      const initial = Number(f.montantPayeInitial || 0);
      const paiements = initial > 0 ? [{ date: f.date, montant: initial }] : [];
      onSave({ date: f.date, chantierId, beneficiaire: beneficiaireFinal, type: f.type, description: f.description, mode: f.mode, montantDu, paiements });
    } else {
      const montant = Number(f.montant);
      onSave({ date: f.date, chantierId, beneficiaire: beneficiaireFinal, type: f.type, description: f.description, mode: f.mode, montantDu: montant, paiements: [{ date: f.date, montant }] });
    }
  };

  return (
    <Modal title={`Nouvelle sortie — ${chantierNom}`} onClose={onClose}>
      <Field label="Date"><TextInput type="date" value={f.date} onChange={set('date')} /></Field>
      <Field label="Bénéficiaire">
        <AutocompleteInput
          value={f.beneficiaireNom}
          onChange={(v) => setF((prev) => ({ ...prev, beneficiaireNom: v }))}
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
        <ToggleGroup options={['Payé en totalité', 'À crédit']} value={f.statutPaiement} onChange={(v) => setF((prev) => ({ ...prev, statutPaiement: v }))} />
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
  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }));
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

// Nouveau versement, ou modification d'un versement existant (date et montant).
function PaiementForm({ sortie, paiement, onClose, onSave }) {
  const r = reste(sortie);
  const [f, setF] = useState(() => paiement
    ? { date: paiement.date || today(), montant: String(paiement.montant ?? '') }
    : { date: today(), montant: r > 0 ? String(r) : '' });
  const valid = f.date && Number(f.montant) > 0;
  return (
    <Modal title={`${paiement ? 'Modifier le versement' : 'Paiement'} — ${sortie.beneficiaire}`} onClose={onClose}>
      {!paiement && (
        <p className="text-xs mb-3" style={{ color: C.textMuted }}>
          Reste à payer : <span className="font-semibold" style={{ color: C.red }}>{fcfa(r)}</span>
        </p>
      )}
      <Field label="Date du paiement"><TextInput type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
      <Field label="Montant versé (FCFA)"><TextInput type="number" value={f.montant} onChange={(e) => setF({ ...f, montant: e.target.value })} placeholder="0" /></Field>
      <div className="mt-2">
        <PrimaryButton disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={() => valid && onSave({ date: f.date, montant: Number(f.montant) })}>Enregistrer le versement</PrimaryButton>
      </div>
    </Modal>
  );
}
