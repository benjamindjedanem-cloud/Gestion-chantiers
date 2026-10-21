// Images clés v3 « affiche pro BTP » : mêmes scènes que le storyboard, design repris.
import { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, random, staticFile } from 'remotion';
import { Banknote, Check, Cloud, HandCoins, Truck, WifiOff } from 'lucide-react';
import { AppPanel, BeneficiaireCard, EntreeDetail, Field, Finger, FonctionList, ModalHeader, PrimaryButton } from '../app/AppUI';
import { Glass } from '../ui/Glass';
import { Banner, BrandMark, ChantierSkyline, FF, Head, K, Navy, NavyBand, RingBadge, Ribbon, Sky, StarPill, TagBubble, drop } from './kit';

const M = 72;
const At = ({ x, y, children, style }: { x: number; y: number; children: ReactNode; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', left: x, top: y, ...style }}>{children}</div>
);

// S1 · Accroche
export const V3S1 = () => (
  <AbsoluteFill>
    <Sky />
    <BrandMark />
    <At x={M} y={330}>
      <Head text="Vous gérez des" size={92} />
      <Head text="*chantiers* ?" size={132} style={{ marginTop: 4, whiteSpace: 'nowrap' }} />
      <div style={{ width: 300, height: 14, background: K.navy, marginTop: 26 }} />
    </At>
    <At x={0} y={896}>
      <ChantierSkyline />
    </At>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1336, bottom: 0, background: K.navy }} />
  </AbsoluteFill>
);

// S2 · « Tout se mélange »
const MoneyCard = ({ kind, name, amount, bg, icon, style }: { kind: string; name: string; amount: string; bg: string; icon: ReactNode; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', width: 600, background: K.white, padding: 10, borderRadius: 30, boxShadow: drop(0.9), ...style }}>
    <div style={{ background: bg, borderRadius: 22, padding: '28px 34px', color: K.white }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 66, height: 66, borderRadius: 33, background: K.white, display: 'flex', alignItems: 'center', justifyContent: 'center', color: bg }}>{icon}</div>
        <div style={{ fontFamily: FF.head, fontWeight: 900, fontSize: 38, letterSpacing: '0.02em' }}>{kind}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 22 }}>
        <div style={{ fontFamily: FF.body, fontWeight: 600, fontSize: 36, opacity: 0.95 }}>{name}</div>
        <div style={{ fontFamily: FF.num, fontWeight: 700, fontSize: 52, fontVariantNumeric: 'tabular-nums' }}>{amount}</div>
      </div>
    </div>
  </div>
);

export const V3S2 = () => (
  <AbsoluteFill>
    <Sky />
    <BrandMark />
    <At x={M} y={200}>
      <Head text="Avances, paiements, dépenses…" size={42} color={K.blue} />
      <Head text="Tout se" size={120} style={{ marginTop: 18 }} />
      <Head text="*mélange*." size={120} />
    </At>
    <MoneyCard kind="DÉPENSE" name="Transport Nadji" amount="75 000" bg="#B45309" icon={<Truck size={36} strokeWidth={2.6} />} style={{ left: 380, top: 640, transform: 'perspective(1600px) rotateY(-14deg) rotateZ(8deg)' }} />
    <MoneyCard kind="PAIEMENT" name="Dr Herbert" amount="1 200 000" bg={K.blue} icon={<Banknote size={36} strokeWidth={2.6} />} style={{ left: 90, top: 820, transform: 'perspective(1600px) rotateY(12deg) rotateZ(-7deg)' }} />
    <MoneyCard kind="AVANCE" name="Mme Achta" amount="500 000" bg={K.green} icon={<HandCoins size={36} strokeWidth={2.6} />} style={{ left: 330, top: 1040, transform: 'perspective(1600px) rotateY(-8deg) rotateZ(3deg)' }} />
  </AbsoluteFill>
);

// S3 · Les questions — ligne verticale, badge « ? », roue de pastilles
const WheelPill = ({ cx, cy, angle, r, text, focus, opacity }: { cx: number; cy: number; angle: number; r: number; text: string; focus?: boolean; opacity: number }) => (
  <div style={{ position: 'absolute', left: cx, top: cy, transform: `rotate(${angle}deg)`, transformOrigin: '0 0' }}>
    <div style={{ position: 'absolute', right: r, top: focus ? -42 : -34, opacity }}>
      <StarPill size={focus ? 38 : 30} bg={focus ? K.navy : K.white} color={focus ? K.white : K.navy} star={focus ? K.orange : K.blue}>
        {text}
      </StarPill>
    </div>
  </div>
);

export const V3S3 = () => {
  const cx = 830, cy = 860;
  return (
    <AbsoluteFill>
      <Sky />
      <BrandMark />
      <At x={M} y={200}>
        <Head text="Qui avez-vous" size={92} />
        <Head text="*déjà* payé ?" size={92} />
      </At>
      <TagBubble bg={K.blue} style={{ left: M, top: 430 }}>Combien ?</TagBubble>
      <div style={{ position: 'absolute', left: cx - 4, top: 560, width: 8, height: 790, background: K.navy }} />
      <div style={{ position: 'absolute', left: cx - 14, top: 552, width: 28, height: 28, borderRadius: 14, background: K.blue }} />
      <WheelPill cx={cx} cy={cy} angle={-50} r={140} text="Dr Herbert : payé ?" opacity={0.55} />
      <WheelPill cx={cx} cy={cy} angle={-25} r={140} text="Transport Nadji : réglé ?" opacity={0.85} />
      <WheelPill cx={cx} cy={cy} angle={0} r={140} text="Ferrailleur Rodric : 150 000 ?" focus opacity={1} />
      <WheelPill cx={cx} cy={cy} angle={25} r={140} text="Avance Mme Achta ?" opacity={0.85} />
      <WheelPill cx={cx} cy={cy} angle={50} r={140} text="Maçon Jean ?" opacity={0.55} />
      <RingBadge size={170} ring={K.blue} style={{ left: cx - 85, top: cy - 85 }}>
        <span style={{ fontFamily: FF.head, fontWeight: 900, fontSize: 110, color: K.white, lineHeight: 1 }}>?</span>
      </RingBadge>
    </AbsoluteFill>
  );
};

// S4 · La tension — bandeaux rouges sur fond marine
const AMOUNTS = ['−150 000', '−850 000', '−300 000', '−75 000', '−1 200 000', '−45 000', '−600 000', '−250 000', '−500 000', '−180 000'];
const SPOTS: [number, number][] = [[90, 110], [560, 150], [140, 290], [600, 330], [330, 440], [80, 940], [560, 920], [260, 1080], [640, 1110], [120, 1230]];

export const V3S4 = () => (
  <AbsoluteFill>
    <Navy />
    {AMOUNTS.map((a, i) => (
      <Ribbon key={i} rotate={(random(`r${i}`) - 0.5) * 18} size={30 + random(`s${i}`) * 14} style={{ left: SPOTS[i][0], top: SPOTS[i][1] }}>
        {a} FCFA
      </Ribbon>
    ))}
    <At x={M} y={600}>
      <Head text="Le chantier n'est pas fini." size={50} color={K.white} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 26, marginTop: 20 }}>
        <span style={{ background: K.red, padding: '0 22px 8px', boxShadow: drop(0.5) }}>
          <Head text="L'argent," size={124} color={K.white} style={{ display: 'inline' }} />
        </span>
        <Head text="si." size={124} color={K.white} style={{ display: 'inline' }} />
      </div>
    </At>
  </AbsoluteFill>
);

// S5 · Révélation — composition du storyboard : logo au centre des rayons, nom, phrase, horizon
export const V3S5 = () => (
  <AbsoluteFill>
    <Navy />
    <RingBadge size={360} bg={K.white} ring={K.blue} style={{ left: 540 - 180, top: 250 }}>
      <Img src={staticFile('logo.png')} style={{ width: 260, height: 260, borderRadius: 58 }} />
    </RingBadge>
    <At x={0} y={700} style={{ width: 1080 }}>
      <Head text="Gestion *chantiers*" size={84} color={K.white} align="center" />
    </At>
    <At x={0} y={835} style={{ width: 1080 }}>
      <div style={{ fontFamily: FF.head, fontWeight: 800, fontSize: 46, color: '#C9DCFF', textAlign: 'center', lineHeight: 1.2 }}>
        Entrées, sorties, dettes…
        <br />
        enfin au <span style={{ color: K.white, fontWeight: 900 }}>même endroit</span>.
      </div>
    </At>
    <div style={{ position: 'absolute', left: 120, right: 120, top: 1060, height: 4, background: 'linear-gradient(90deg, rgba(255,255,255,0), #FFFFFF 30%, #FFFFFF 70%, rgba(255,255,255,0))' }} />
  </AbsoluteFill>
);

// Gestes : ciel en haut, bloc marine en bas, étiquette numérotée, titre bicolore, écran de l'appli posé dessus.
const GestureHead = ({ tag, l1, l2 }: { tag: string; l1: string; l2: string }) => (
  <>
    <TagBubble style={{ left: M, top: 170 }}>{tag}</TagBubble>
    <At x={M} y={265}>
      <Head text={l1} size={78} />
      <Head text={l2} size={78} />
    </At>
  </>
);

const panelShadow: CSSProperties = { borderRadius: 34, boxShadow: '0 0 0 10px #FFFFFF, 14px 24px 0 10px rgba(6,26,71,0.20), 20px 40px 70px rgba(6,26,71,0.40)' };

export const V3S6 = () => (
  <AbsoluteFill>
    <Sky />
    <NavyBand top={880} />
    <BrandMark />
    <GestureHead tag="01 · Entrées" l1="Chaque *paiement*" l2="reçu, noté." />
    <AppPanel scale={2.4} glow={false} style={{ top: 500, left: 72, ...panelShadow }}>
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
    <StarPill size={26} bg={K.orange} color={K.navy} star={K.navy} style={{ position: 'absolute', left: 610, top: 742 }}>Total à jour</StarPill>
  </AbsoluteFill>
);

export const V3S7 = () => (
  <AbsoluteFill>
    <Sky />
    <NavyBand top={880} />
    <BrandMark />
    <GestureHead tag="02 · Sorties" l1="Chaque *dépense*," l2="par bénéficiaire." />
    <AppPanel scale={2.35} glow={false} style={{ top: 470, left: 84, ...panelShadow }}>
      <ModalHeader title="Nouvelle sortie — VILLA FARCHA" />
      <div style={{ padding: '18px 20px', background: '#fff' }}>
        <Field label="Bénéficiaire (personne ou fournisseur)" value="Ets Abdelkerim" />
        <Field label="Fonction" value="Fournisseur" focused chevron />
        <div style={{ marginTop: -4, marginBottom: 14 }}>
          <FonctionList selected="Fournisseur" offset={7} visible={4} />
        </div>
        <Field label="Montant (FCFA)" value="850 000" />
      </div>
    </AppPanel>
    <Finger x={700} y={1172} pressed={0.6} />
  </AbsoluteFill>
);

// Pièce « Soldé » (appréciée par Benjamin, conservée).
const Coin = ({ size, style }: { size: number; style?: CSSProperties }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', position: 'relative', transform: 'rotateY(22deg) rotateZ(-8deg)', ...style }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#065F46', transform: 'translateX(14px)' }} />
    <div
      style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #4ADE80 0%, #16A34A 45%, #047857 100%)',
        boxShadow: '0 0 0 8px #FFFFFF, 14px 22px 40px rgba(6,26,71,.35), inset 0 3px 0 rgba(255,255,255,.5)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}
    >
      <Check size={size * 0.38} strokeWidth={3.5} />
      <span style={{ fontFamily: FF.head, fontWeight: 900, fontSize: size * 0.14, marginTop: -4, letterSpacing: '0.04em' }}>SOLDÉ</span>
    </div>
  </div>
);

export const V3S8 = () => (
  <AbsoluteFill>
    <Sky />
    <NavyBand top={880} />
    <BrandMark />
    <GestureHead tag="03 · Dettes" l1="Le reste *à payer*," l2="toujours à jour." />
    <AppPanel scale={2.4} glow={false} style={{ top: 640, left: 72, ...panelShadow }}>
      <div style={{ padding: 16 }}>
        <BeneficiaireCard nom="Jean (Maçon)" totalPaye={1_200_000} reste={0} ligne="Main d'œuvre — Élévation des murs" date="20/10/2026" montantDu={1_200_000} statut="Soldé" />
      </div>
    </AppPanel>
    <div style={{ position: 'absolute', left: 740, top: 470, perspective: 1200 }}>
      <Coin size={250} />
    </div>
    <StarPill size={36} bg={K.green} color={K.white} star={K.white} style={{ position: 'absolute', left: 72, top: 1150 }}>Reste : 0 FCFA</StarPill>
  </AbsoluteFill>
);

// S9 · Atout — icônes hors ligne (appréciées par Benjamin, conservées) sur fond marine
export const V3S9 = () => (
  <AbsoluteFill>
    <Navy />
    <BrandMark dark />
    <div style={{ position: 'absolute', left: 270, top: 300, width: 540, height: 300 }}>
      <div style={{ position: 'absolute', left: 0, top: 50, opacity: 0.5 }}>
        <Glass radius={110} style={{ width: 200, height: 200 }}>
          <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WifiOff size={96} color="#FCA5A5" /></div>
        </Glass>
      </div>
      <div style={{ position: 'absolute', left: 230, top: 0 }}>
        <Glass radius={150} edge="rgba(147,197,253,.95)" glow="rgba(96,165,250,.5)" style={{ width: 290, height: 290 }}>
          <div style={{ width: 290, height: 290, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Cloud size={150} color="#fff" strokeWidth={1.6} />
            <div style={{ position: 'absolute', right: 52, bottom: 62, width: 74, height: 74, borderRadius: 37, background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 5px #fff' }}>
              <Check size={46} color="#fff" strokeWidth={3.5} />
            </div>
          </div>
        </Glass>
      </div>
    </div>
    <At x={0} y={720} style={{ width: 1080 }}>
      <Head text="Même sans" size={110} color={K.white} align="center" />
      <Head text="*réseau*." size={110} color={K.white} align="center" />
    </At>
    <At x={0} y={1000} style={{ width: 1080, display: 'flex', justifyContent: 'center' }}>
      <StarPill size={32} bg={K.white} color={K.navy}>Sauvegardé dès le retour du réseau</StarPill>
    </At>
  </AbsoluteFill>
);

// S10 · Phrase finale (écho de l'accroche : même silhouette de chantier)
export const V3S10 = () => (
  <AbsoluteFill>
    <Sky />
    <BrandMark />
    <At x={M} y={300}>
      <Head text="Chaque franc de" size={86} />
      <Head text="vos chantiers," size={86} />
      <Head text="sous" size={86} />
      <Head text="*contrôle*." size={150} style={{ marginTop: 6 }} />
    </At>
    <At x={0} y={896}>
      <ChantierSkyline />
    </At>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1336, bottom: 0, background: K.navy }} />
  </AbsoluteFill>
);

// S11 · Fin — composition du storyboard : logo à gauche, nom à droite
export const V3S11 = () => (
  <AbsoluteFill>
    <Navy />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 545, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 44 }}>
      <Img src={staticFile('logo.png')} style={{ width: 240, height: 240, borderRadius: 54, boxShadow: `0 0 0 9px #FFFFFF, ${drop(0.8)}` }} />
      <div>
        <Head text="Gestion" size={100} color={K.white} />
        <Head text="*chantiers*" size={100} color={K.white} />
      </div>
    </div>
  </AbsoluteFill>
);

export const V3_FRAMES = { V3S1, V3S2, V3S3, V3S4, V3S5, V3S6, V3S7, V3S8, V3S9, V3S10, V3S11 };
