import React, { useEffect, useState } from 'react';
import { Mail, Copy, Check, UserMinus, LogOut, Pencil, MapPin } from 'lucide-react';
import { C, Field, TextInput, Select, Modal, PrimaryButton, PageIntro } from './ui.jsx';
import { Shell, Field as AuthField, Notice, SubmitButton, LinkButton } from './Auth.jsx';
import { ROLES, ROLES_INVITABLES, peutGerer, actionsEquipe, chargerMesInvitations } from './equipe.js';
import { demanderConfirmation } from './confirm.jsx';

/* ---------------------------------------------------------------- */
/* Écrans d'équipe : premier accès, invitations reçues, onglet Équipe */
/* ---------------------------------------------------------------- */

const APP_URL = window.location.origin + window.location.pathname;

function RolePill({ role }) {
  const tones = {
    proprietaire: { bg: C.brandTint, fg: C.brand },
    associe: { bg: C.brandTint, fg: C.brand },
    comptable: { bg: C.greenTint, fg: C.green },
    employe: { bg: C.surfaceSoft, fg: C.textMuted },
  };
  const t = tones[role] || tones.employe;
  return <span style={{ background: t.bg, color: t.fg, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 999 }}>{ROLES[role]?.label || role}</span>;
}

function Card({ title, children, action }) {
  return (
    <section className="rounded-2xl p-4 mb-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-2 mb-3">
          {title && <p className="gc-display text-lg">{title}</p>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function ErrorText({ children }) {
  if (!children) return null;
  return <p className="text-sm px-3 py-2.5 rounded-xl mb-3" style={{ background: C.redTint, color: C.red }}>{children}</p>;
}

// Exécute une action d'équipe en gérant l'attente et l'erreur.
function useAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const run = async (fn) => {
    setBusy(true); setError('');
    try {
      await fn();
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  };
  return { busy, error, run, setError };
}

/* ---------------------------------------------------------------- */
/* Invitation reçue                                                   */
/* ---------------------------------------------------------------- */

// situation : 'aucune' (pas encore d'entreprise), 'seul' (seul dans sa propre
// entreprise), 'proprietaireAvecEquipe', 'membre' (membre d'une autre entreprise).
function InvitationRecue({ inv, situation, nbChantiers, pendingCount, onDone }) {
  const { busy, error, run } = useAction();
  const [transferer, setTransferer] = useState(true);
  const [confirmer, setConfirmer] = useState(false);

  const accepter = () => run(async () => {
    if (pendingCount > 0) throw new Error('Des modifications ne sont pas encore envoyées en ligne. Attendez « Sauvegardé en ligne » puis réessayez.');
    await actionsEquipe.accepterInvitation(inv.id, situation === 'seul' && nbChantiers > 0 && transferer);
    onDone();
  });
  const refuser = () => run(async () => { await actionsEquipe.refuserInvitation(inv.id); onDone(); });

  return (
    <div className="rounded-2xl p-4 mb-3" style={{ background: C.brandTint, border: `1px solid #BFDBFE` }}>
      <p className="text-sm">
        <strong>{inv.invite_par_nom || 'Quelqu’un'}</strong> vous invite à rejoindre <strong>{inv.entreprise_nom || 'son entreprise'}</strong> en tant que <strong>{ROLES[inv.role]?.label}</strong>.
      </p>
      <p className="text-xs mt-1" style={{ color: C.textMuted }}>{ROLES[inv.role]?.description}</p>
      <ErrorText>{error}</ErrorText>

      {situation === 'proprietaireAvecEquipe' && (
        <p className="text-xs mt-3" style={{ color: C.red }}>Vous êtes propriétaire d’une entreprise qui a d’autres membres : retirez-les avant de pouvoir rejoindre une autre entreprise.</p>
      )}

      {confirmer && situation === 'seul' && nbChantiers > 0 && (
        <div className="mt-3 p-3 rounded-xl" style={{ background: C.surface }}>
          <p className="text-xs font-semibold mb-2">Vous avez {nbChantiers} chantier(s) dans votre entreprise actuelle :</p>
          <label className="flex items-center gap-2 text-sm mb-1.5"><input type="radio" checked={transferer} onChange={() => setTransferer(true)} /> Les emporter dans {inv.entreprise_nom}</label>
          <label className="flex items-center gap-2 text-sm"><input type="radio" checked={!transferer} onChange={() => setTransferer(false)} /> <span style={{ color: C.red }}>Ne pas les emporter (ils seront supprimés)</span></label>
        </div>
      )}
      {confirmer && situation === 'membre' && (
        <p className="text-xs mt-3" style={{ color: C.amber }}>Vous quitterez votre entreprise actuelle. Ce que vous y avez saisi y restera.</p>
      )}

      {situation !== 'proprietaireAvecEquipe' && (
        <div className="flex gap-2 mt-3">
          <PrimaryButton disabled={busy} style={{ opacity: busy ? 0.6 : 1 }} onClick={() => (confirmer || situation === 'aucune' || (situation === 'seul' && nbChantiers === 0) ? accepter() : setConfirmer(true))}>
            {busy ? 'Patientez…' : confirmer ? 'Confirmer et rejoindre' : 'Rejoindre'}
          </PrimaryButton>
          <button disabled={busy} onClick={refuser} className="text-sm font-bold px-4 rounded-xl" style={{ color: C.textMuted, background: C.surface }}>Refuser</button>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Premier accès : pas encore d'entreprise                            */
/* ---------------------------------------------------------------- */

export function OnboardingScreen({ user, onDone, onLogout }) {
  const [invitations, setInvitations] = useState(null);
  const [nom, setNom] = useState('');
  const { busy, error, run } = useAction();
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    chargerMesInvitations(user.email).then(setInvitations).catch((e) => { setLoadError(e.message); setInvitations([]); });
  }, [user.email]);

  const creer = (e) => {
    e.preventDefault();
    run(async () => { await actionsEquipe.creerEntreprise(nom); onDone(); });
  };

  return (
    <Shell title="Bienvenue" subtitle="Rejoignez l’entreprise qui vous a invité, ou créez la vôtre.">
      {loadError && <Notice tone="error">{loadError}</Notice>}
      {invitations === null && <p className="text-sm" style={{ color: C.textMuted }}>Recherche de vos invitations…</p>}
      {invitations?.map((inv) => (
        <InvitationRecue key={inv.id} inv={inv} situation="aucune" nbChantiers={0} pendingCount={0} onDone={onDone} />
      ))}
      {invitations?.length === 0 && (
        <p className="text-xs mb-4" style={{ color: C.textMuted }}>
          Aucune invitation pour <strong>{user.email}</strong>. Si votre entreprise vous a ajouté, demandez-lui de vérifier l’adresse utilisée.
        </p>
      )}

      <form onSubmit={creer} className="mt-2">
        <p className="text-sm font-bold mb-2">Créer mon entreprise</p>
        <p className="text-xs mb-3" style={{ color: C.textMuted }}>Vous en serez le propriétaire et pourrez inviter vos associés, comptables et employés.</p>
        {error && <Notice tone="error">{error}</Notice>}
        <AuthField label="Nom de l’entreprise" required value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Ex. BTP NGARBA" />
        <SubmitButton busy={busy}>Créer mon entreprise</SubmitButton>
      </form>
      <div className="flex justify-center mt-5"><LinkButton onClick={onLogout}>Se déconnecter</LinkButton></div>
    </Shell>
  );
}

/* ---------------------------------------------------------------- */
/* Onglet Équipe                                                      */
/* ---------------------------------------------------------------- */

function texteInvitation(entrepriseNom, email, role) {
  return `Bonjour, je vous invite à rejoindre « ${entrepriseNom} » sur l’application Gestion Chantiers en tant que ${ROLES[role]?.label.toLowerCase()}.\n\n`
    + `1. Ouvrez ${APP_URL}\n2. Créez votre compte (ou connectez-vous) avec l’adresse ${email}\n3. Acceptez l’invitation qui s’affiche.`;
}

function PartageInvitation({ texte }) {
  const [copie, setCopie] = useState(false);
  const copier = async () => {
    try {
      await navigator.clipboard.writeText(texte);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch (e) {
      window.prompt('Copiez ce message :', texte);
    }
  };
  return (
    <div className="mt-3 p-3 rounded-xl" style={{ background: C.greenTint }}>
      <p className="text-xs font-semibold mb-2" style={{ color: C.green }}>Invitation créée. Envoyez ce message à la personne :</p>
      <p className="text-xs mb-3" style={{ whiteSpace: 'pre-line', color: C.text }}>{texte}</p>
      <div className="flex gap-2">
        <a href={`https://wa.me/?text=${encodeURIComponent(texte)}`} target="_blank" rel="noreferrer" className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl" style={{ background: '#16A34A', color: '#fff', textDecoration: 'none' }}>WhatsApp</a>
        <button onClick={copier} className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold py-2.5 rounded-xl" style={{ background: C.surface, color: C.brand }}>
          {copie ? <><Check size={15} /> Copié</> : <><Copy size={15} /> Copier</>}
        </button>
      </div>
    </div>
  );
}

function AffectationsModal({ membre, chantiers, attribues, onClose, onSaved }) {
  const [sel, setSel] = useState(() => new Set(attribues));
  const { busy, error, run } = useAction();
  const toggle = (id) => setSel((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const enregistrer = () => run(async () => { await actionsEquipe.definirAffectations(membre.user_id, [...sel]); onSaved(); });
  return (
    <Modal title={`Chantiers de ${membre.nom_affiche || membre.email}`} onClose={onClose}>
      <p className="text-xs mb-3" style={{ color: C.textMuted }}>Un employé ne voit que les chantiers cochés, et ne peut saisir que sur ceux-là.</p>
      <ErrorText>{error}</ErrorText>
      {chantiers.length === 0 && <p className="text-sm" style={{ color: C.textMuted }}>Aucun chantier pour l’instant.</p>}
      <div className="flex flex-col gap-2 mb-4">
        {chantiers.map((c) => (
          <label key={c.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ border: `1px solid ${sel.has(c.id) ? C.brand : C.border}`, background: sel.has(c.id) ? C.brandTint : C.surface }}>
            <input type="checkbox" checked={sel.has(c.id)} onChange={() => toggle(c.id)} />
            <span className="text-sm font-semibold">{c.nom}</span>
            <span className="text-xs" style={{ color: C.textMuted, marginLeft: 'auto' }}>{c.client}</span>
          </label>
        ))}
      </div>
      <PrimaryButton disabled={busy} style={{ opacity: busy ? 0.6 : 1 }} onClick={enregistrer}>{busy ? 'Patientez…' : 'Enregistrer'}</PrimaryButton>
    </Modal>
  );
}

function EditNameModal({ title, label, initial, onClose, onSave }) {
  const [v, setV] = useState(initial || '');
  const { busy, error, run } = useAction();
  return (
    <Modal title={title} onClose={onClose}>
      <ErrorText>{error}</ErrorText>
      <Field label={label}><TextInput value={v} onChange={(e) => setV(e.target.value)} autoFocus /></Field>
      <PrimaryButton disabled={busy || !v.trim()} style={{ opacity: busy || !v.trim() ? 0.6 : 1 }} onClick={() => run(async () => { await onSave(v.trim()); onClose(); })}>
        {busy ? 'Patientez…' : 'Enregistrer'}
      </PrimaryButton>
    </Modal>
  );
}

export function EquipeTab({ user, membre, equipe, chantiers, pendingCount, onMembershipChanged, onMembreUpdated }) {
  const gerer = peutGerer(membre.role);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employe');
  const [partage, setPartage] = useState(null);
  const [affect, setAffect] = useState(null); // membre dont on édite les chantiers
  const [edit, setEdit] = useState(null); // 'entreprise' | 'nom'
  const invite = useAction();
  const actions = useAction();

  const nbAffectes = (userId) => equipe.affectations.filter((a) => a.user_id === userId).length;
  const autres = equipe.membres.filter((m) => m.user_id !== user.id);
  const moi = equipe.membres.find((m) => m.user_id === user.id);
  const situation = membre.role === 'proprietaire' ? (autres.length > 0 ? 'proprietaireAvecEquipe' : 'seul') : 'membre';

  const inviter = (e) => {
    e.preventDefault();
    const adresse = email.trim().toLowerCase();
    invite.run(async () => {
      await actionsEquipe.inviter(adresse, role);
      setPartage(texteInvitation(membre.entrepriseNom, adresse, role));
      setEmail('');
      await equipe.recharger();
    });
  };

  const changerRole = (m, r) => actions.run(async () => { await actionsEquipe.changerRole(m.user_id, r); await equipe.recharger(); });
  const retirer = async (m) => {
    if (!(await demanderConfirmation({ titre: `Retirer ${m.nom_affiche || m.email} ?`, message: 'Cette personne n’aura plus accès aux chantiers. Ce qu’elle a saisi restera dans l’entreprise.', confirmer: 'Retirer' }))) return;
    actions.run(async () => { await actionsEquipe.retirerMembre(m.user_id); await equipe.recharger(); });
  };
  const quitter = async () => {
    if (pendingCount > 0) { actions.setError('Des modifications ne sont pas encore envoyées en ligne. Attendez « Sauvegardé en ligne » puis réessayez.'); return; }
    if (!(await demanderConfirmation({ titre: `Quitter « ${membre.entrepriseNom} » ?`, message: 'Vous n’aurez plus accès à ses chantiers.', confirmer: 'Quitter' }))) return;
    actions.run(async () => { await actionsEquipe.retirerMembre(user.id); onMembershipChanged(); });
  };
  const annuler = (inv) => actions.run(async () => { await actionsEquipe.annulerInvitation(inv.id); await equipe.recharger(); });

  return (
    <div>
      <PageIntro eyebrow="Organisation" title="Équipe" subtitle="Les personnes qui ont accès à vos chantiers" />

      {equipe.mesInvitations.map((inv) => (
        <InvitationRecue key={inv.id} inv={inv} situation={situation} nbChantiers={chantiers.length} pendingCount={pendingCount} onDone={onMembershipChanged} />
      ))}

      <Card title={membre.entrepriseNom || 'Mon entreprise'} action={gerer && (
        <button onClick={() => setEdit('entreprise')} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg" style={{ color: C.brand, background: C.brandTint }}><Pencil size={12} /> Renommer</button>
      )}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs" style={{ color: C.textMuted }}>Votre rôle :</span> <RolePill role={membre.role} />
        </div>
        <p className="text-xs mt-1.5" style={{ color: C.textMuted }}>{ROLES[membre.role]?.description}</p>
        <div className="flex items-center justify-between gap-2 mt-3 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="min-w-0">
            <p className="text-xs" style={{ color: C.textMuted }}>Votre nom affiché</p>
            <p className="text-sm font-semibold truncate">{moi?.nom_affiche || membre.nomAffiche || user.email}</p>
          </div>
          <button onClick={() => setEdit('nom')} className="text-xs font-bold px-2.5 py-1.5 rounded-lg" style={{ color: C.brand, background: C.brandTint }}>Modifier</button>
        </div>
      </Card>

      <ErrorText>{actions.error || equipe.erreur}</ErrorText>

      <Card title={`Membres (${equipe.membres.length})`}>
        <div className="flex flex-col gap-3">
          {equipe.membres.map((m) => {
            // On ne modifie ni le propriétaire, ni son propre rôle (pour ne pas se retirer ses droits par erreur).
            const modifiable = gerer && m.role !== 'proprietaire' && m.user_id !== user.id;
            return (
              <div key={m.user_id} className="pb-3" style={{ borderBottom: `1px solid ${C.border}` }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{m.nom_affiche || m.email}{m.user_id === user.id && <span style={{ color: C.textMuted, fontWeight: 500 }}> (vous)</span>}</p>
                    <p className="text-xs truncate" style={{ color: C.textMuted }}>{m.email}</p>
                  </div>
                  {modifiable ? (
                    <Select value={m.role} disabled={actions.busy} onChange={(e) => changerRole(m, e.target.value)} style={{ width: 'auto', padding: '6px 8px', fontSize: 12 }}>
                      {ROLES_INVITABLES.map((r) => <option key={r} value={r}>{ROLES[r].label}</option>)}
                    </Select>
                  ) : <RolePill role={m.role} />}
                </div>
                {(m.role === 'employe' || modifiable) && (
                  <div className="flex items-center gap-3 mt-2">
                    {m.role === 'employe' && (
                      gerer ? (
                        <button onClick={() => setAffect(m)} className="flex items-center gap-1 text-xs font-semibold" style={{ color: C.brand }}>
                          <MapPin size={12} /> {nbAffectes(m.user_id)} chantier(s) attribué(s)
                        </button>
                      ) : <span className="text-xs" style={{ color: C.textMuted }}>{nbAffectes(m.user_id)} chantier(s) attribué(s)</span>
                    )}
                    {modifiable && m.user_id !== user.id && (
                      <button onClick={() => retirer(m)} className="flex items-center gap-1 text-xs font-semibold" style={{ color: C.red, marginLeft: 'auto' }}><UserMinus size={12} /> Retirer</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {membre.role !== 'proprietaire' && (
          <button onClick={quitter} className="flex items-center gap-1.5 text-xs font-semibold mt-3" style={{ color: C.red }}><LogOut size={12} /> Quitter l’entreprise</button>
        )}
      </Card>

      {gerer && (
        <Card title="Inviter une personne">
          <form onSubmit={inviter}>
            <ErrorText>{invite.error}</ErrorText>
            <Field label="Adresse e-mail de la personne"><TextInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nom@exemple.com" /></Field>
            <Field label="Rôle">
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES_INVITABLES.map((r) => <option key={r} value={r}>{ROLES[r].label}</option>)}
              </Select>
            </Field>
            <p className="text-xs -mt-1 mb-3" style={{ color: C.textMuted }}>{ROLES[role].description}</p>
            <PrimaryButton type="submit" disabled={invite.busy} style={{ opacity: invite.busy ? 0.6 : 1 }}>
              <span className="flex items-center justify-center gap-2"><Mail size={16} /> {invite.busy ? 'Patientez…' : 'Inviter'}</span>
            </PrimaryButton>
          </form>
          {partage && <PartageInvitation texte={partage} />}

          {equipe.invitations.length > 0 && (
            <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${C.border}` }}>
              <p className="text-xs font-bold mb-2" style={{ color: C.textMuted }}>EN ATTENTE</p>
              {equipe.invitations.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between gap-2 py-1.5">
                  <div className="min-w-0">
                    <p className="text-sm truncate">{inv.email}</p>
                    <p className="text-xs" style={{ color: C.textMuted }}>{ROLES[inv.role]?.label}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button onClick={() => setPartage(texteInvitation(membre.entrepriseNom, inv.email, inv.role))} className="text-xs font-semibold" style={{ color: C.brand }}>Renvoyer</button>
                    <button onClick={() => annuler(inv)} className="text-xs font-semibold" style={{ color: C.textMuted }}>Annuler</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {affect && (
        <AffectationsModal
          membre={affect}
          chantiers={chantiers}
          attribues={equipe.affectations.filter((a) => a.user_id === affect.user_id).map((a) => a.chantier_id)}
          onClose={() => setAffect(null)}
          onSaved={async () => { setAffect(null); await equipe.recharger(); }}
        />
      )}
      {edit === 'entreprise' && (
        <EditNameModal title="Renommer l’entreprise" label="Nom de l’entreprise" initial={membre.entrepriseNom} onClose={() => setEdit(null)}
          onSave={async (v) => { await actionsEquipe.renommerEntreprise(v); onMembreUpdated({ entrepriseNom: v }); await equipe.recharger(); }} />
      )}
      {edit === 'nom' && (
        <EditNameModal title="Votre nom" label="Nom affiché aux autres membres" initial={moi?.nom_affiche || membre.nomAffiche} onClose={() => setEdit(null)}
          onSave={async (v) => { await actionsEquipe.definirMonNom(v); onMembreUpdated({ nomAffiche: v }); await equipe.recharger(); }} />
      )}
    </div>
  );
}
