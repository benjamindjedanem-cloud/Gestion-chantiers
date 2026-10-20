// Objets réels du chaos : page de cahier Seyès griffonnée, ticket de caisse, message du maçon.
import { CSSProperties, ReactNode } from 'react';
import { F, Grain, P } from './kit';

const paperShadow = '0 1px 2px rgba(0,0,0,0.25), 0 10px 18px rgba(0,0,0,0.25), 0 38px 70px rgba(0,0,0,0.5)';

// Réglure Seyès (cahier d'écolier francophone) : grands carreaux + 3 lignes fines, marge rouge.
const seyes = [
  'linear-gradient(90deg, transparent 96px, rgba(215,56,59,0.55) 96px, rgba(215,56,59,0.55) 98px, transparent 98px)',
  'linear-gradient(rgba(70,110,200,0.38) 1.5px, transparent 1.5px)',
  'linear-gradient(rgba(70,110,200,0.16) 1px, transparent 1px)',
  'linear-gradient(90deg, rgba(110,80,160,0.22) 1px, transparent 1px)',
].join(',');

const Hand = ({ children, size = 42, color = P.penBlue, style }: { children: ReactNode; size?: number; color?: string; style?: CSSProperties }) => (
  <div style={{ fontFamily: F.hand, fontWeight: 500, fontSize: size, color, lineHeight: 1, whiteSpace: 'nowrap', ...style }}>{children}</div>
);

export const NotebookPage = ({ style }: { style?: CSSProperties }) => (
  <div
    style={{
      position: 'absolute', width: 600, height: 720, background: P.paper, boxShadow: paperShadow,
      backgroundImage: seyes, backgroundSize: '100% 100%, 100% 32px, 100% 8px, 32px 100%', backgroundPosition: '0 0, 0 22px, 0 22px, 98px 0',
      overflow: 'hidden', ...style,
    }}
  >
    {/* trous de reliure */}
    {[90, 250, 410, 570].map((t) => (
      <div key={t} style={{ position: 'absolute', left: 26, top: t, width: 26, height: 26, borderRadius: 13, background: '#0A1A3F', boxShadow: 'inset 0 2px 3px rgba(0,0,0,.6)' }} />
    ))}
    <div style={{ position: 'absolute', left: 116, top: 40 }}>
      <Hand size={46} style={{ textDecoration: 'underline', textDecorationThickness: 2 }}>Chantier Farcha</Hand>
      <Hand style={{ marginTop: 34 }}>Avance Mme Achta ...... 500 000</Hand>
      <Hand style={{ marginTop: 30 }}>Dr Herbert ........ 1 200 000 ?</Hand>
      <div style={{ position: 'relative', marginTop: 30 }}>
        <Hand>Ciment 50 sacs ...... 800 000</Hand>
        <div style={{ position: 'absolute', left: -6, right: 70, top: 22, height: 3, background: P.penBlue, transform: 'rotate(-2deg)' }} />
        <Hand size={38} style={{ position: 'absolute', left: 392, top: 4, color: P.penBlue, transform: 'rotate(-4deg)' }}>850 000 ?</Hand>
      </div>
      <Hand style={{ marginTop: 34 }}>Maçon Jean : payé 900 000</Hand>
      <Hand size={36} style={{ marginTop: 8, marginLeft: 120, color: P.red }}>ou 600 000 ??</Hand>
      <Hand style={{ marginTop: 30 }}>Transport Nadji ..... 75 000</Hand>
      <Hand style={{ marginTop: 30, color: 'rgba(32,58,143,0.55)' }}>Rodric ferraille ... ?</Hand>
    </div>
    {/* cercle au stylo rouge autour d'un doute */}
    <svg width={250} height={80} style={{ position: 'absolute', left: 345, top: 150 }} viewBox="0 0 220 90" preserveAspectRatio="none">
      <path d="M110 6 C 190 4, 214 30, 210 48 C 206 74, 150 86, 96 84 C 40 82, 6 66, 8 44 C 10 20, 60 4, 130 10" fill="none" stroke={P.red} strokeWidth={4} strokeLinecap="round" />
    </svg>
    <Grain opacity={0.35} freq={1.1} blend="multiply" />
    {/* léger pli et ombre de courbure */}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0) 12%, rgba(255,255,255,0) 70%, rgba(0,0,0,0.08) 100%)' }} />
  </div>
);

// Ticket de caisse thermique, bord inférieur déchiré.
export const Receipt = ({ style }: { style?: CSSProperties }) => {
  const zig = Array.from({ length: 21 }, (_, i) => `${100 - (i * 100) / 20}% ${i % 2 ? 100 : 97}%`).join(', ');
  const row = (a: string, b: string, bold?: boolean) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: bold ? 500 : 400 }}>
      <span>{a}</span>
      <span>{b}</span>
    </div>
  );
  return (
    <div style={{ position: 'absolute', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.5)) drop-shadow(0 4px 6px rgba(0,0,0,0.3))', ...style }}>
      <div
        style={{
          width: 330, padding: '34px 30px 60px', background: '#F7F5F0', fontFamily: F.mono, fontSize: 21, color: '#2A2A2A', lineHeight: 1.55,
          clipPath: `polygon(0 0, 100% 0, ${zig})`, position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', fontWeight: 500, fontSize: 24, letterSpacing: '0.06em' }}>ETS ABDELKERIM</div>
        <div style={{ textAlign: 'center', fontSize: 17, opacity: 0.75 }}>Quincaillerie · Matériaux</div>
        <div style={{ borderTop: '2px dashed #999', margin: '16px 0' }} />
        {row('Ciment CPJ 35', '')}
        {row('  50 x 17 000', '850 000')}
        {row('Livraison', 'offerte')}
        <div style={{ borderTop: '2px dashed #999', margin: '16px 0' }} />
        {row('TOTAL FCFA', '850 000', true)}
        <div style={{ textAlign: 'center', fontSize: 16, marginTop: 22, opacity: 0.7 }}>Merci de votre visite</div>
        <Grain opacity={0.25} freq={1.4} blend="multiply" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.07))' }} />
      </div>
    </div>
  );
};

// Message reçu sur le téléphone (bulle neutre, pas l'interface d'une marque).
export const MessageBubble = ({ from, text, time, style }: { from: string; text: string; time: string; style?: CSSProperties }) => (
  <div
    style={{
      position: 'absolute', maxWidth: 560, background: '#F3EFE6', borderRadius: '30px 30px 30px 8px', padding: '22px 28px 18px',
      boxShadow: paperShadow, fontFamily: F.body, ...style,
    }}
  >
    <div style={{ fontSize: 22, fontWeight: 700, color: P.orangeDeep, marginBottom: 6 }}>{from}</div>
    <div style={{ fontSize: 34, fontWeight: 500, color: '#14182B', lineHeight: 1.2 }}>{text}</div>
    <div style={{ fontSize: 18, color: '#7A7F8F', textAlign: 'right', marginTop: 8 }}>{time}</div>
  </div>
);
