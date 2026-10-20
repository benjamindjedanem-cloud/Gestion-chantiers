// Images clés v4 : storyboard v1 validé (univers bleu nuit, mêmes compositions), finition « designer pro » :
// typographie Montserrat très grasse, aucune lueur sur le texte, formes nettes à bord blanc, ombres directionnelles,
// grain et silhouette de chantier en filigrane, logo en haut. Orange quasi absent ; bleu = accent.
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, random, staticFile } from 'remotion';
import { Banknote, Check, Cloud, HandCoins, Truck, WifiOff } from 'lucide-react';
import { AppPanel, BeneficiaireCard, EntreeDetail, Field, Finger, FonctionList, ModalHeader } from '../app/AppUI';
import { Glass } from '../ui/Glass';
import { LightLine } from '../ui/LightLine';
import { ChantierSkyline } from '../v3/kit';
import { fonts } from '../theme';

const D = {
  night: '#071437',
  nightDeep: '#030A22',
  royal: '#123A8C',
  white: '#F5F8FF',
  accent: '#5AA2FF', // bleu d'accent plein (mots-clés)
  accentDeep: '#1D4ED8',
  ice: '#B9D3FF',
  red: '#D7263D',
  redDeep: '#9E1428',
  green: '#16A34A',
  orange: '#F7931E', // usage minimal
};
const HEAD = "'Montserrat', sans-serif";
const drop = (k = 1) => `${5 * k}px ${9 * k}px 0 rgba(0,0,0,0.28), ${9 * k}px ${20 * k}px ${36 * k}px rgba(0,0,0,0.45)`;

const noise = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>",
)}")`;

// Fond bleu nuit du storyboard v1, avec grain et silhouette de chantier en filigrane (bleu sur bleu).
const BG = ({ tint, skyline = true }: { tint?: string; skyline?: boolean }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 85% 60% at 50% 55%, ${D.royal} 0%, ${D.night} 55%, ${D.nightDeep} 100%)` }}>
    {tint && <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 45% at 50% 48%, ${tint} 0%, transparent 70%)`, opacity: 0.32 }} />}
    {skyline && (
      <div style={{ position: 'absolute', left: 0, bottom: 0, opacity: 0.16 }}>
        <ChantierSkyline color="#3D6BD6" />
      </div>
    )}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse 95% 85% at 50% 45%, transparent 55%, rgba(0,0,0,0.5) 100%)' }} />
    <AbsoluteFill style={{ backgroundImage: noise, mixBlendMode: 'overlay', opacity: 0.55 }} />
  </AbsoluteFill>
);

const Brand = () => (
  <div style={{ position: 'absolute', right: 60, top: 54, display: 'flex', alignItems: 'center', gap: 14 }}>
    <Img src={staticFile('logo.png')} style={{ width: 70, height: 70, borderRadius: 16, boxShadow: drop(0.35) }} />
    <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 25, lineHeight: 0.98, color: D.white, letterSpacing: '0.01em' }}>
      GESTION
      <br />
      CHANTIERS
    </div>
  </div>
);

// Titre : Montserrat très gras, serré ; mots-clés entre astérisques en bleu plein (pas de lueur).
const T = ({ text, size, color = D.white, keyColor = D.accent, style }: { text: string; size: number; color?: string; keyColor?: string; style?: CSSProperties }) => (
  <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: '-0.035em', color, textAlign: 'center', ...style }}>
    {text.split(/(\*[^*]+\*)/).filter(Boolean).map((p, i) =>
      p.startsWith('*') ? <span key={i} style={{ color: keyColor, fontWeight: 900, whiteSpace: 'nowrap' }}>{p.slice(1, -1)}</span> : <span key={i}>{p}</span>,
    )}
  </div>
);

const Row = ({ top, children, style }: { top: number; children: ReactNode; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top, display: 'flex', flexDirection: 'column', alignItems: 'center', ...style }}>{children}</div>
);

// Trait d'accent sous un titre.
const Bar = ({ w = 140, color = D.accent }: { w?: number; color?: string }) => <div style={{ width: w, height: 10, borderRadius: 5, background: color, marginTop: 28 }} />;

// S1 · Accroche
export const V4S1 = () => (
  <AbsoluteFill>
    <BG />
    <Brand />
    <LightLine y={930} depth={40} />
    <Row top={440}>
      <T text="Vous gérez" size={128} />
      <T text="des *chantiers* ?" size={128} />
      <Bar />
    </Row>
  </AbsoluteFill>
);

// S2 · Le mélange — cartes pleines à bord blanc, ombre franche
const MoneyCard = ({ kind, name, amount, color, icon, style }: { kind: string; name: string; amount: string; color: string; icon: ReactNode; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', width: 600, padding: 8, borderRadius: 28, background: '#FFFFFF', boxShadow: drop(0.9), ...style }}>
    <div style={{ borderRadius: 21, padding: '26px 32px', background: `linear-gradient(160deg, ${color} 0%, ${color}DD 100%)`, color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 58, height: 58, borderRadius: 29, background: 'rgba(255,255,255,0.95)', color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <span style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 32, letterSpacing: '0.06em' }}>{kind}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 20 }}>
        <span style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 34 }}>{name}</span>
        <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 50, fontVariantNumeric: 'tabular-nums' }}>{amount}</span>
      </div>
    </div>
  </div>
);

export const V4S2 = () => (
  <AbsoluteFill>
    <BG />
    <Brand />
    <Row top={190}>
      <T text="Avances, paiements, dépenses…" size={50} color={D.ice} style={{ fontWeight: 700 }} />
      <T text="tout se *mélange*." size={96} style={{ marginTop: 14 }} />
    </Row>
    <div style={{ position: 'absolute', inset: 0, perspective: 1600 }}>
      <MoneyCard kind="DÉPENSE" name="Transport Nadji" amount="75 000" color="#C2410C" icon={<Truck size={32} strokeWidth={2.6} />} style={{ left: 330, top: 560, transform: 'rotateY(-14deg) rotateZ(8deg)' }} />
      <MoneyCard kind="PAIEMENT" name="Dr Herbert" amount="1 200 000" color={D.accentDeep} icon={<Banknote size={32} strokeWidth={2.6} />} style={{ left: 130, top: 740, transform: 'rotateY(12deg) rotateZ(-7deg)' }} />
      <MoneyCard kind="AVANCE" name="Mme Achta" amount="500 000" color="#0F8A43" icon={<HandCoins size={32} strokeWidth={2.6} />} style={{ left: 290, top: 950, transform: 'rotateY(-8deg) rotateZ(3deg)' }} />
    </div>
  </AbsoluteFill>
);

// S3 · Les questions — ligne de lumière verticale, badge « ? », roue de pastilles nettes
const QPill = ({ cx, cy, angle, r, text, focus, opacity }: { cx: number; cy: number; angle: number; r: number; text: string; focus?: boolean; opacity: number }) => (
  <div style={{ position: 'absolute', left: cx, top: cy, transform: `rotate(${angle}deg)`, transformOrigin: '0 0' }}>
    <div
      style={{
        position: 'absolute', right: r, top: focus ? -40 : -32, opacity, whiteSpace: 'nowrap',
        fontFamily: HEAD, fontWeight: 800, fontSize: focus ? 36 : 29,
        padding: focus ? '16px 30px' : '12px 24px', borderRadius: 40,
        background: focus ? '#FFFFFF' : D.night, color: focus ? D.night : D.white,
        border: focus ? 'none' : '2.5px solid rgba(255,255,255,0.75)', boxShadow: drop(0.5),
      }}
    >
      {text}
    </div>
  </div>
);

export const V4S3 = () => {
  const cx = 790, cy = 790;
  return (
    <AbsoluteFill>
      <BG />
      <Brand />
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(0,0,0,.28) 0%, rgba(0,0,0,0) 65%)' }} />
      <LightLine y={cy - 60} cx={cx} depth={60} rotate={90} />
      <Row top={175}>
        <T text="Qui avez-vous *déjà* payé ?" size={74} />
        <T text="Combien ?" size={56} color={D.ice} style={{ marginTop: 10, fontWeight: 700 }} />
      </Row>
      <QPill cx={cx} cy={cy} angle={-54} r={125} text="Dr Herbert : payé ?" opacity={0.45} />
      <QPill cx={cx} cy={cy} angle={-27} r={125} text="Transport Nadji : réglé ?" opacity={0.8} />
      <QPill cx={cx} cy={cy} angle={0} r={125} text="Ferrailleur Rodric : 150 000 ?" focus opacity={1} />
      <QPill cx={cx} cy={cy} angle={27} r={125} text="Avance Mme Achta ?" opacity={0.8} />
      <QPill cx={cx} cy={cy} angle={54} r={125} text="Maçon Jean ?" opacity={0.45} />
      <div style={{ position: 'absolute', left: cx - 70, top: cy - 70, width: 140, height: 140, borderRadius: 70, background: '#FFFFFF', boxShadow: drop(0.6), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: `3px solid ${D.accent}` }} />
        <span style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 92, color: D.night, lineHeight: 1 }}>?</span>
      </div>
    </AbsoluteFill>
  );
};

// S4 · La tension — étiquettes rouges nettes à bord blanc
const AMOUNTS = ['−150 000', '−850 000', '−300 000', '−75 000', '−1 200 000', '−45 000', '−600 000', '−250 000', '−500 000', '−180 000', '−35 000', '−90 000'];
const SPOTS: [number, number][] = [[80, 90], [600, 120], [180, 250], [640, 290], [90, 420], [700, 450], [80, 930], [610, 900], [230, 1060], [660, 1080], [110, 1210], [600, 1230]];
const RedTag = ({ text, x, y, rot, size }: { text: string; x: number; y: number; rot: number; size: number }) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg)`, whiteSpace: 'nowrap',
      background: `linear-gradient(180deg, ${D.red} 0%, ${D.redDeep} 100%)`, color: '#fff', border: '3px solid #FFFFFF',
      fontFamily: fonts.display, fontWeight: 700, fontSize: size, padding: `${size * 0.28}px ${size * 0.6}px`, borderRadius: 12,
      boxShadow: drop(0.5), fontVariantNumeric: 'tabular-nums',
    }}
  >
    {text} FCFA
  </div>
);

export const V4S4 = () => (
  <AbsoluteFill>
    <BG tint="#E11D48" skyline={false} />
    {AMOUNTS.map((a, i) => (
      <RedTag key={i} text={a} x={SPOTS[i][0]} y={SPOTS[i][1]} rot={(random(`r${i}`) - 0.5) * 14} size={30 + random(`s${i}`) * 12} />
    ))}
    <Row top={575}>
      <T text="Le chantier n'est pas fini." size={54} color={D.ice} style={{ fontWeight: 700 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 22 }}>
        <span style={{ background: D.red, padding: '4px 24px 12px', borderRadius: 8, boxShadow: drop(0.5) }}>
          <T text="L'argent," size={124} style={{ display: 'inline', fontWeight: 900 }} />
        </span>
        <T text="si." size={124} style={{ display: 'inline', fontWeight: 900 }} />
      </div>
    </Row>
  </AbsoluteFill>
);

// S5 · Révélation — rayons plats, logo dans un badge blanc à anneau bleu
export const V4S5 = () => (
  <AbsoluteFill>
    <BG skyline={false} />
    <AbsoluteFill
      style={{
        background: 'repeating-conic-gradient(from 0deg at 50% 36%, rgba(90,162,255,0.20) 0deg 6deg, rgba(90,162,255,0) 6deg 18deg)',
        maskImage: 'radial-gradient(circle at 50% 36%, #000 0%, rgba(0,0,0,.7) 30%, transparent 62%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 36%, #000 0%, rgba(0,0,0,.7) 30%, transparent 62%)',
      }}
    />
    <LightLine y={1040} depth={50} />
    <div style={{ position: 'absolute', left: 540 - 175, top: 310, width: 350, height: 350 }}>
      <div style={{ position: 'absolute', inset: -26, borderRadius: '50%', border: `4px solid ${D.accent}` }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#FFFFFF', boxShadow: drop(0.8), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Img src={staticFile('logo.png')} style={{ width: 250, height: 250, borderRadius: 56 }} />
      </div>
    </div>
    <Row top={730}>
      <T text="Gestion Chantiers" size={100} style={{ fontWeight: 900 }} />
      <T text="Entrées, sorties, dettes…" size={46} color={D.ice} style={{ marginTop: 26, fontWeight: 700 }} />
      <T text="enfin au *même endroit*." size={46} color={D.ice} style={{ fontWeight: 700 }} />
    </Row>
  </AbsoluteFill>
);

// Gestes : légende centrée en haut, écran de l'appli à bord blanc net et ombre franche (pas de halo).
const panel: CSSProperties = { boxShadow: '0 0 0 10px #FFFFFF, 12px 22px 0 10px rgba(0,0,0,0.25), 18px 40px 70px rgba(0,0,0,0.5)', borderRadius: 34 };
const Legend = ({ text }: { text: string }) => (
  <Row top={170} style={{ padding: '0 70px' }}>
    <T text={text} size={70} />
  </Row>
);

export const V4S6 = () => (
  <AbsoluteFill>
    <BG />
    <Brand />
    <Legend text="Chaque paiement reçu, *noté*." />
    <AppPanel scale={2.4} glow={false} style={{ top: 370, left: 72, ...panel }}>
      <EntreeDetail
        chantier="VILLA FARCHA"
        total={8_500_000}
        highlight={0}
        entrees={[
          { versePar: 'M. Mahamat Saleh', description: 'Deuxième tranche', date: '20/10/2026', mode: 'Espèces', montant: 2_500_000 },
          { versePar: 'M. Mahamat Saleh', description: 'Avance de démarrage', date: '02/09/2026', mode: 'Virement bancaire', montant: 6_000_000 },
        ]}
      />
    </AppPanel>
  </AbsoluteFill>
);

export const V4S7 = () => (
  <AbsoluteFill>
    <BG />
    <Brand />
    <Legend text="Chaque dépense, par *bénéficiaire*." />
    <AppPanel scale={2.4} glow={false} style={{ top: 370, left: 72, ...panel }}>
      <ModalHeader title="Nouvelle sortie — VILLA FARCHA" />
      <div style={{ padding: '18px 20px', background: '#fff' }}>
        <Field label="Bénéficiaire (personne ou fournisseur)" value="Ets Abdelkerim" />
        <Field label="Fonction" value="Fournisseur" focused chevron />
        <div style={{ marginTop: -4, marginBottom: 14 }}>
          <FonctionList selected="Fournisseur" offset={6} visible={4} />
        </div>
        <Field label="Montant (FCFA)" value="850 000" />
      </div>
    </AppPanel>
    <Finger x={720} y={1213} pressed={0.6} />
  </AbsoluteFill>
);

// Pièce « Soldé » (appréciée, conservée) — avec bord blanc net.
const Coin = ({ size }: { size: number }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', position: 'relative', transform: 'rotateY(22deg) rotateZ(-8deg)' }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#065F46', transform: 'translateX(14px)' }} />
    <div
      style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #4ADE80 0%, #16A34A 45%, #047857 100%)',
        boxShadow: '0 0 0 7px #FFFFFF, 12px 22px 40px rgba(0,0,0,.45), inset 0 3px 0 rgba(255,255,255,.5)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}
    >
      <Check size={size * 0.38} strokeWidth={3.5} />
      <span style={{ fontFamily: HEAD, fontWeight: 900, fontSize: size * 0.14, marginTop: -4, letterSpacing: '0.04em' }}>SOLDÉ</span>
    </div>
  </div>
);

export const V4S8 = () => (
  <AbsoluteFill>
    <BG tint="#22C55E" />
    <Brand />
    <Legend text="Le reste à payer, toujours *à jour*." />
    <div style={{ position: 'absolute', left: 405, top: 400, perspective: 1200 }}>
      <Coin size={270} />
    </div>
    <AppPanel scale={2.4} glow={false} style={{ top: 760, left: 72, ...panel }}>
      <div style={{ padding: 16 }}>
        <BeneficiaireCard nom="Jean (Maçon)" totalPaye={1_200_000} reste={0} ligne="Main d'œuvre — Élévation des murs" date="20/10/2026" montantDu={1_200_000} statut="Soldé" />
      </div>
    </AppPanel>
    <Row top={1190}>
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 50, color: D.white }}>
        Reste : <span style={{ color: '#4ADE80', fontWeight: 900 }}>0 FCFA</span>{' '}
        <span style={{ color: '#FCA5A5', textDecoration: 'line-through', opacity: 0.6, fontSize: 38 }}>300 000</span>
      </div>
    </Row>
  </AbsoluteFill>
);

// S9 · Atout — icônes hors ligne (appréciées, conservées)
export const V4S9 = () => (
  <AbsoluteFill>
    <BG />
    <Brand />
    <div style={{ position: 'absolute', left: 280, top: 330, width: 520, height: 300 }}>
      <div style={{ position: 'absolute', left: 0, top: 50, opacity: 0.5 }}>
        <Glass radius={110} style={{ width: 200, height: 200 }}>
          <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WifiOff size={96} color="#FCA5A5" /></div>
        </Glass>
      </div>
      <div style={{ position: 'absolute', left: 230, top: 0 }}>
        <Glass radius={150} edge="rgba(185,211,255,.95)" glow="rgba(90,162,255,.45)" style={{ width: 290, height: 290 }}>
          <div style={{ width: 290, height: 290, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Cloud size={150} color="#fff" strokeWidth={1.6} />
            <div style={{ position: 'absolute', right: 52, bottom: 62, width: 74, height: 74, borderRadius: 37, background: D.green, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 5px #fff' }}>
              <Check size={46} color="#fff" strokeWidth={3.5} />
            </div>
          </div>
        </Glass>
      </div>
    </div>
    <Row top={760}>
      <T text="Même sans *réseau*." size={100} />
      <T text="Sauvegardé en ligne dès le retour du réseau" size={36} color={D.ice} style={{ marginTop: 26, fontWeight: 700, letterSpacing: '-0.01em' }} />
    </Row>
  </AbsoluteFill>
);

// S10 · Phrase finale
export const V4S10 = () => (
  <AbsoluteFill>
    <BG />
    <Brand />
    <LightLine y={950} depth={0} />
    <Row top={500}>
      <T text="Chaque franc de vos chantiers," size={64} style={{ fontWeight: 700 }} />
      <T text="sous *contrôle*." size={118} style={{ marginTop: 12 }} />
    </Row>
  </AbsoluteFill>
);

// S11 · Fin
export const V4S11 = () => (
  <AbsoluteFill>
    <BG skyline={false} />
    <div style={{ position: 'absolute', left: 540 - 420, top: 675 - 420, width: 840, height: 840, borderRadius: '50%', background: 'radial-gradient(circle, rgba(90,162,255,.22) 0%, rgba(90,162,255,0) 60%)' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40 }}>
      <Img src={staticFile('logo.png')} style={{ width: 230, height: 230, borderRadius: 52, boxShadow: '0 0 0 8px #FFFFFF, 12px 22px 40px rgba(0,0,0,.5)' }} />
      <div style={{ fontFamily: HEAD, fontWeight: 900, fontSize: 92, color: D.white, letterSpacing: '-0.035em', lineHeight: 0.95 }}>
        Gestion
        <br />
        Chantiers
      </div>
    </div>
  </AbsoluteFill>
);

export const V4_FRAMES = { V4S1, V4S2, V4S3, V4S4, V4S5, V4S6, V4S7, V4S8, V4S9, V4S10, V4S11 };
