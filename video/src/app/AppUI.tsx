// Répliques des écrans de l'application (mêmes couleurs, polices, libellés que src/App.jsx),
// dessinées à leur taille native (~390 px de large) puis agrandies par <AppPanel> pour rester lisibles (R-ÉCRAN).
import { CSSProperties, ReactNode } from 'react';
import { Check, ChevronDown, ChevronLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { C, fonts } from '../theme';

const nf = new Intl.NumberFormat('fr-FR');
export const fcfa = (n: number) => nf.format(Math.round(n)).replace(/ | /g, ' ') + ' FCFA';

const display: CSSProperties = { fontFamily: fonts.display, fontWeight: 700, letterSpacing: '-0.02em' };
const tabular: CSSProperties = { fontVariantNumeric: 'tabular-nums' };
const label: CSSProperties = { letterSpacing: '.12em', textTransform: 'uppercase', fontSize: 11, fontWeight: 700 };

// Panneau blanc agrandi, posé dans l'univers bleu nuit, avec halo.
export const AppPanel = ({
  children,
  scale = 2.5,
  width = 390,
  style,
  glow = true,
}: {
  children: ReactNode;
  scale?: number;
  width?: number;
  style?: CSSProperties;
  glow?: boolean;
}) => (
  <div
    style={{
      position: 'absolute',
      width: width * scale,
      left: (1080 - width * scale) / 2,
      borderRadius: 18 * scale,
      background: C.bg,
      boxShadow: glow
        ? '0 0 0 1.5px rgba(255,255,255,.55), 0 0 90px rgba(96,165,250,.55), 0 50px 100px rgba(0,0,0,.5)'
        : '0 50px 100px rgba(0,0,0,.5)',
      overflow: 'hidden',
      ...style,
    }}
  >
    {/* zoom (et non transform) : la hauteur du panneau suit le contenu agrandi, et le texte reste net */}
    <div style={{ width, zoom: scale, fontFamily: fonts.body, color: C.text } as CSSProperties}>
      {children}
    </div>
  </div>
);

export const BackBar = ({ title }: { title: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.brand, fontSize: 14, fontWeight: 700, marginBottom: 14 }}>
    <ChevronLeft size={18} /> {title}
  </div>
);

export const AddButton = ({ pressed = 0 }: { pressed?: number }) => (
  <div
    style={{
      display: 'flex', alignItems: 'center', gap: 4, color: C.brand, background: C.brandTint,
      fontSize: 14, fontWeight: 700, padding: '8px 12px', borderRadius: 12,
      transform: `scale(${1 - 0.06 * pressed})`,
      boxShadow: pressed ? `0 0 0 ${3 * pressed}px rgba(29,78,216,.25)` : 'none',
    }}
  >
    <Plus size={15} /> Ajouter
  </div>
);

export const Pill = ({ statut }: { statut: 'Soldé' | 'Partiel' | 'À régler' }) => {
  const map = { 'Soldé': [C.greenTint, C.green], Partiel: [C.amberTint, C.amber], 'À régler': [C.redTint, C.red] } as const;
  const [bg, fg] = map[statut];
  return <span style={{ background: bg, color: fg, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>{statut}</span>;
};

const IconBtn = ({ children, brand }: { children: ReactNode; brand?: boolean }) => (
  <div style={{ color: brand ? C.brand : C.textMuted, background: brand ? C.brandTint : C.surfaceSoft, width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </div>
);

export type Entree = { versePar: string; description: string; date: string; mode: string; montant: number };

// Écran « Encaissements » d'un chantier (EntreeDetail).
export const EntreeDetail = ({
  chantier,
  total,
  entrees,
  highlight = -1,
  addPressed = 0,
}: {
  chantier: string;
  total: number;
  entrees: Entree[];
  highlight?: number;
  addPressed?: number;
}) => (
  <div style={{ padding: '20px 18px 24px' }}>
    <BackBar title="Tous les chantiers" />
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
      <div>
        <p style={{ ...label, color: C.brand, margin: 0 }}>Encaissements</p>
        <p style={{ ...display, fontSize: 22, margin: '4px 0 0' }}>{chantier}</p>
        <p style={{ ...tabular, fontSize: 15, fontWeight: 700, color: C.green, margin: '6px 0 0' }}>Total reçu {fcfa(total)}</p>
      </div>
      <AddButton pressed={addPressed} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {entrees.map((e, i) => (
        <div
          key={i}
          style={{
            background: C.surface,
            border: `1px solid ${i === highlight ? C.green : C.border}`,
            boxShadow: i === highlight ? '0 0 0 3px rgba(4,120,87,.15), 0 8px 20px rgba(4,120,87,.12)' : 'none',
            borderRadius: 14, padding: 12, display: 'flex', justifyContent: 'space-between', gap: 8,
          }}
        >
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{e.versePar}</p>
            <p style={{ fontSize: 13, color: C.textMuted, margin: '2px 0 0' }}>{e.description}</p>
            <p style={{ fontSize: 13, color: C.textMuted, margin: '2px 0 0' }}>{e.date} · {e.mode}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <p style={{ ...tabular, fontSize: 14, fontWeight: 700, color: C.green, margin: 0 }}>+{fcfa(e.montant)}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <IconBtn brand><Pencil size={14} /></IconBtn>
              <IconBtn><Trash2 size={14} /></IconBtn>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// En-tête de fenêtre (Modal) : « GESTION CHANTIERS » + titre.
export const ModalHeader = ({ title }: { title: string }) => (
  <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: '#fff' }}>
    <p style={{ fontSize: 11, letterSpacing: '0.14em', fontWeight: 700, color: C.brand, margin: 0 }}>GESTION CHANTIERS</p>
    <p style={{ ...display, fontSize: 20, margin: '2px 0 0' }}>{title}</p>
  </div>
);

export const Field = ({ label: l, value, focused, placeholder, chevron }: { label: string; value?: string; focused?: boolean; placeholder?: string; chevron?: boolean }) => (
  <div style={{ marginBottom: 12 }}>
    <p style={{ fontSize: 13, fontWeight: 500, color: C.textMuted, margin: '0 0 4px' }}>{l}</p>
    <div
      style={{
        padding: '11px 12px', borderRadius: 10, background: '#fff', fontSize: 15,
        border: `1px solid ${focused ? C.brand : C.border}`,
        boxShadow: focused ? '0 0 0 3px rgba(29,78,216,.15)' : 'none',
        color: value ? C.text : C.textMuted, display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 20,
      }}
    >
      <span style={tabular}>{value || placeholder || ' '}</span>
      {chevron && <ChevronDown size={16} color={C.textMuted} />}
    </div>
  </div>
);

export const PrimaryButton = ({ children, pressed = 0 }: { children: ReactNode; pressed?: number }) => (
  <div
    style={{
      background: C.brand, color: '#fff', fontWeight: 700, fontSize: 15, padding: '13px 16px', borderRadius: 11,
      textAlign: 'center', boxShadow: '0 8px 20px rgba(29,78,216,.25)', transform: `scale(${1 - 0.05 * pressed})`,
    }}
  >
    {children}
  </div>
);

// Liste des fonctions de bénéficiaire (FONCTIONS_BENEFICIAIRE dans src/lib.js).
export const FONCTIONS = ['Maçon', 'Carreleur', 'Électricien', 'Plombier', 'Ferrailleur', 'Peintre', 'Menuisier', 'Chef de chantier', 'Fournisseur', 'Transporteur', 'Autre'];

export const FonctionList = ({ selected, offset = 0, visible = 6 }: { selected?: string; offset?: number; visible?: number }) => (
  <div
    style={{
      background: '#fff', borderRadius: 14, border: `1px solid ${C.border}`,
      boxShadow: '0 20px 50px rgba(15,23,42,.18)', height: visible * 44, overflow: 'hidden', position: 'relative',
    }}
  >
    <div style={{ transform: `translateY(${-offset * 44}px)` }}>
      {FONCTIONS.map((f) => {
        const on = f === selected;
        return (
          <div
            key={f}
            style={{
              height: 44, padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontSize: 15, fontWeight: on ? 700 : 500, color: on ? C.brand : C.text, background: on ? C.brandTint : '#fff',
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            {f}
            {on && <Check size={18} color={C.brand} />}
          </div>
        );
      })}
    </div>
  </div>
);

// Carte d'un bénéficiaire avec ses sorties (BeneficiaireGroup + SortieLine).
export const BeneficiaireCard = ({
  nom,
  totalPaye,
  reste,
  ligne,
  date,
  montantDu,
  statut,
  resteColor,
}: {
  nom: string;
  totalPaye: number;
  reste: number;
  ligne: string;
  date: string;
  montantDu: number;
  statut: 'Soldé' | 'Partiel' | 'À régler';
  resteColor?: string;
}) => (
  <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14 }}>
    <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{nom}</p>
        <p style={{ ...tabular, fontSize: 13, color: C.textMuted, margin: '2px 0 0' }}>
          Total payé <span style={{ color: C.green, fontWeight: 600 }}>{fcfa(totalPaye)}</span>
          {reste > 0 && <> · reste <span style={{ color: resteColor || C.red, fontWeight: 700 }}>{fcfa(reste)}</span></>}
        </p>
      </div>
      <ChevronDown size={16} color={C.textMuted} />
    </div>
    <div style={{ padding: '10px 14px 12px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{ligne}</p>
          <p style={{ fontSize: 13, color: C.textMuted, margin: '2px 0 0' }}>{date} · Espèces</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <Pill statut={statut} />
          <p style={{ ...tabular, fontSize: 13, fontWeight: 600, margin: 0 }}>{fcfa(montantDu)}</p>
        </div>
      </div>
      {reste > 0 && <p style={{ fontSize: 13, fontWeight: 600, color: C.brand, margin: '8px 0 0' }}>Enregistrer un paiement</p>}
    </div>
  </div>
);

// Doigt (cercle de toucher) posé sur un élément.
export const Finger = ({ x, y, pressed = 0, size = 120 }: { x: number; y: number; pressed?: number; size?: number }) => (
  <div
    style={{
      position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: '50%',
      background: 'rgba(255,255,255,.35)', border: '3px solid rgba(255,255,255,.85)',
      boxShadow: '0 10px 30px rgba(0,0,0,.35), 0 0 40px rgba(147,197,253,.6)',
      transform: `scale(${1 - 0.15 * pressed})`,
    }}
  />
);
