// Images clés (style frames) : une image fixe par scène du storyboard, pour valider le look avant d'animer.
import { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, random, staticFile } from 'remotion';
import { Cloud, Check, WifiOff } from 'lucide-react';
import { Background } from '../ui/Background';
import { LightLine } from '../ui/LightLine';
import { Glass } from '../ui/Glass';
import { Phrase, keyStyle } from '../ui/Phrase';
import { AppPanel, BeneficiaireCard, EntreeDetail, Field, Finger, FonctionList, ModalHeader, PrimaryButton, fcfa } from '../app/AppUI';
import { C, V, fonts } from '../theme';

const Center = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center', ...style }}>{children}</div>
);

const Logo = ({ size, style }: { size: number; style?: CSSProperties }) => (
  <Img src={staticFile('logo.png')} style={{ width: size, height: size, borderRadius: size * 0.22, ...style }} />
);

// S1 · Accroche
export const S1 = () => (
  <AbsoluteFill>
    <Background />
    <LightLine y={930} depth={40} />
    <Center style={{ top: 470 }}>
      <Phrase text="Vous gérez" size={118} weight={700} />
    </Center>
    <Center style={{ top: 615 }}>
      <Phrase text="des *chantiers* ?" size={118} keyScale={1} weight={700} />
    </Center>
  </AbsoluteFill>
);

// S2 · « Tout se mélange » — cartes en volume qui commencent à se mélanger
const MoneyCard = ({ kind, name, amount, color, style }: { kind: string; name: string; amount: string; color: string; style?: CSSProperties }) => (
  <Glass depth={10} depthColor="rgba(5,10,30,.6)" tint={`${color}33`} edge={`${color}AA`} glow={`${color}55`} style={{ width: 600, padding: '30px 36px', ...style }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ width: 16, height: 16, borderRadius: 8, background: color, boxShadow: `0 0 18px ${color}` }} />
      <span style={{ fontFamily: fonts.body, fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '.08em', textTransform: 'uppercase' }}>{kind}</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 18 }}>
      <span style={{ fontFamily: fonts.body, fontSize: 38, color: V.ice }}>{name}</span>
      <span style={{ fontFamily: fonts.display, fontSize: 46, fontWeight: 700, color: '#fff' }}>{amount}</span>
    </div>
  </Glass>
);

export const S2 = () => (
  <AbsoluteFill>
    <Background />
    <Center style={{ top: 150 }}>
      <Phrase text="Avances, paiements, dépenses…" size={62} />
    </Center>
    <Center style={{ top: 240 }}>
      <Phrase text="tout se *mélange*." size={84} keyScale={1.2} weight={700} />
    </Center>
    <div style={{ position: 'absolute', inset: 0, perspective: 1600 }}>
      <MoneyCard kind="Dépense" name="Transport Nadji" amount="75 000" color={V.amberGlow}
        style={{ position: 'absolute', left: 300, top: 560, transform: 'rotateY(-16deg) rotateZ(9deg)', filter: 'blur(1.5px)' }} />
      <MoneyCard kind="Paiement" name="Dr Herbert" amount="1 200 000" color={V.glow}
        style={{ position: 'absolute', left: 150, top: 700, transform: 'rotateY(14deg) rotateZ(-7deg)' }} />
      <MoneyCard kind="Avance" name="Mme Achta" amount="500 000" color={V.greenGlow}
        style={{ position: 'absolute', left: 260, top: 900, transform: 'rotateY(-10deg) rotateZ(4deg)' }} />
    </div>
  </AbsoluteFill>
);

// S3 · Les questions — ligne verticale + roue d'étiquettes (REF-03 ⭐)
const QLabel = ({ text, angle, r, blur, opacity, cx, cy }: { text: string; angle: number; r: number; blur: number; opacity: number; cx: number; cy: number }) => (
  <div style={{ position: 'absolute', left: cx, top: cy, transform: `rotate(${angle}deg)`, transformOrigin: '0 0' }}>
    <div style={{ position: 'absolute', right: r, top: -44, filter: `blur(${blur}px)`, opacity }}>
      <Glass radius={22} edge={blur === 0 ? 'rgba(147,197,253,.9)' : 'rgba(255,255,255,.3)'} glow={blur === 0 ? 'rgba(96,165,250,.55)' : undefined} style={{ padding: '18px 30px', whiteSpace: 'nowrap' }}>
        <span style={{ fontFamily: fonts.body, fontSize: 40, fontWeight: 600, color: '#fff' }}>{text}</span>
      </Glass>
    </div>
  </div>
);

export const S3 = () => {
  const cx = 780, cy = 780;
  return (
    <AbsoluteFill>
      <Background />
      <AbsoluteFill style={{ background: 'linear-gradient(90deg, rgba(0,0,0,.25) 0%, rgba(0,0,0,0) 60%, rgba(96,165,250,.10) 100%)' }} />
      <LightLine y={cy - 60} cx={cx} depth={60} rotate={90} />
      <Center style={{ top: 120 }}>
        <Phrase text="Qui avez-vous *déjà* payé ?" size={70} keyScale={1.15} weight={700} />
      </Center>
      <Center style={{ top: 225 }}>
        <Phrase text="Combien ?" size={58} color={V.ice} />
      </Center>
      <QLabel cx={cx} cy={cy} angle={-58} r={130} blur={7} opacity={0.4} text="Dr Herbert : payé ?" />
      <QLabel cx={cx} cy={cy} angle={-28} r={130} blur={3.5} opacity={0.75} text="Transport Nadji : réglé ?" />
      <QLabel cx={cx} cy={cy} angle={0} r={130} blur={0} opacity={1} text="Ferrailleur Rodric : 150 000 ?" />
      <QLabel cx={cx} cy={cy} angle={28} r={130} blur={3.5} opacity={0.75} text="Avance Mme Achta ?" />
      <QLabel cx={cx} cy={cy} angle={56} r={130} blur={7} opacity={0.4} text="Maçon Jean ?" />
      <div style={{ position: 'absolute', left: cx - 64, top: cy - 64 }}>
        <Glass radius={64} edge="rgba(255,255,255,.9)" glow="rgba(147,197,253,.9)" style={{ width: 128, height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 128, height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fonts.display, fontSize: 72, fontWeight: 700, color: '#fff' }}>?</div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

// S4 · La tension — montants rouges lumineux
const RED_AMOUNTS = ['−150 000', '−850 000', '−300 000', '−75 000', '−1 200 000', '−45 000', '−600 000', '−90 000', '−250 000', '−500 000', '−35 000', '−180 000', '−400 000', '−120 000', '−960 000', '−60 000'];

const RedPill = ({ text, x, y, scale, blur }: { text: string; x: number; y: number; scale: number; blur: number }) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${scale})`, filter: `blur(${blur}px)`,
      padding: '14px 26px', borderRadius: 18, background: 'rgba(127,29,29,.75)', border: '2px solid rgba(248,113,113,.9)',
      boxShadow: '0 0 30px rgba(239,68,68,.75), inset 0 1px 0 rgba(255,255,255,.3)',
      fontFamily: fonts.display, fontWeight: 700, fontSize: 40, color: '#fff', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
    }}
  >
    {text} FCFA
  </div>
);

export const S4 = () => (
  <AbsoluteFill>
    <Background tint={V.redGlow} intensity={0.9} />
    {RED_AMOUNTS.map((a, i) => {
      // grille 2 × 8 avec décalage pseudo-aléatoire fixe ; la bande centrale reste libre pour le texte
      const col = i % 2, row = Math.floor(i / 2);
      const rowsY = [110, 250, 390, 930, 1060, 1190, 520, 840];
      const depth = random(`d${i}`);
      const x = (col === 0 ? 280 : 790) + (random(`x${i}`) - 0.5) * 160;
      const y = rowsY[row] + (random(`y${i}`) - 0.5) * 50;
      const scale = row >= 6 ? 0.55 : 0.75 + depth * 0.4;
      return <RedPill key={i} text={a} x={row >= 6 ? (col === 0 ? 150 : 930) : x} y={y} scale={scale} blur={row >= 6 || depth < 0.3 ? 5 : 0} />;
    })}
    <Center style={{ top: 560 }}>
      <Phrase text="Le chantier n'est pas fini." size={56} color={V.ice} weight={500} />
    </Center>
    <Center style={{ top: 640 }}>
      <Phrase text="*L'argent*, si." size={120} keyScale={1} keyColor="#FCA5A5" weight={700} style={{ textShadow: '0 4px 30px rgba(0,0,0,.6)' }} />
    </Center>
  </AbsoluteFill>
);

// S5 · Révélation — logo au centre de rayons bleus
export const S5 = () => (
  <AbsoluteFill>
    <Background />
    <AbsoluteFill
      style={{
        background: `repeating-conic-gradient(from 0deg at 50% 38%, rgba(96,165,250,.38) 0deg 7deg, rgba(96,165,250,0) 7deg 22deg)`,
        maskImage: 'radial-gradient(circle at 50% 38%, #000 0%, rgba(0,0,0,.6) 25%, transparent 60%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 38%, #000 0%, rgba(0,0,0,.6) 25%, transparent 60%)',
      }}
    />
    <div style={{ position: 'absolute', left: 540 - 260, top: 513 - 260, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,197,253,.55) 0%, rgba(96,165,250,0) 65%)' }} />
    <LightLine y={1030} depth={50} />
    <Center style={{ top: 363 }}>
      <Logo size={300} style={{ boxShadow: '0 0 80px rgba(147,197,253,.8), 0 30px 60px rgba(0,0,0,.5)' }} />
    </Center>
    <Center style={{ top: 712 }}>
      <div style={{ fontFamily: fonts.display, fontSize: 96, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em' }}>Gestion Chantiers</div>
    </Center>
    <Center style={{ top: 850, padding: '0 90px' }}>
      <Phrase text="Entrées, sorties, dettes… enfin au *même endroit*." size={50} keyScale={1.1} weight={500} />
    </Center>
  </AbsoluteFill>
);

// Légende des gestes (en haut de l'écran)
const Legend = ({ text }: { text: string }) => (
  <Center style={{ top: 110, padding: '0 70px' }}>
    <Phrase text={text} size={64} keyScale={1.15} weight={700} />
  </Center>
);

// S6 · Geste 1 — Entrée
export const S6 = () => (
  <AbsoluteFill>
    <Background />
    <Legend text="Chaque paiement reçu, *noté*." />
    <AppPanel scale={2.55} style={{ top: 300 }}>
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

// S7 · Geste 2 — Sortie : choix de la fonction « Fournisseur »
export const S7 = () => (
  <AbsoluteFill>
    <Background />
    <Legend text="Chaque dépense, par *bénéficiaire*." />
    <AppPanel scale={2.5} style={{ top: 280 }}>
      <ModalHeader title="Nouvelle sortie — VILLA FARCHA" />
      <div style={{ padding: '18px 20px', background: '#fff' }}>
        <Field label="Bénéficiaire (personne ou fournisseur)" value="Ets Abdelkerim" />
        <Field label="Fonction" value="Fournisseur" focused chevron />
        <div style={{ marginTop: -4, marginBottom: 14 }}>
          <FonctionList selected="Fournisseur" offset={6} visible={4} />
        </div>
        <Field label="Montant (FCFA)" value="850 000" />
        <PrimaryButton>Enregistrer la sortie</PrimaryButton>
      </div>
    </AppPanel>
    <Finger x={720} y={1195} pressed={0.6} />
  </AbsoluteFill>
);

// S8 · Geste 3 — Dette soldée
const Coin = ({ size, style }: { size: number; style?: CSSProperties }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', position: 'relative', transform: 'rotateY(22deg) rotateZ(-8deg)', ...style }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#065F46', transform: 'translateX(14px)' }} />
    <div
      style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, #4ADE80 0%, #16A34A 45%, #047857 100%)',
        boxShadow: '0 0 60px rgba(34,197,94,.7), inset 0 3px 0 rgba(255,255,255,.5)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}
    >
      <Check size={size * 0.38} strokeWidth={3.5} />
      <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: size * 0.15, marginTop: -4 }}>Soldé</span>
    </div>
  </div>
);

export const S8 = () => (
  <AbsoluteFill>
    <Background tint={V.greenGlow} intensity={0.35} />
    <Legend text="Le reste à payer, toujours *à jour*." />
    <AppPanel scale={2.5} style={{ top: 640 }}>
      <div style={{ padding: 16 }}>
        <BeneficiaireCard nom="Jean (Maçon)" totalPaye={1_200_000} reste={0} ligne="Main d'œuvre — Élévation des murs" date="20/10/2026" montantDu={1_200_000} statut="Soldé" />
      </div>
    </AppPanel>
    <div style={{ position: 'absolute', left: 405, top: 300, perspective: 1200 }}>
      <Coin size={270} />
    </div>
    <Center style={{ top: 1150 }}>
      <div style={{ fontFamily: fonts.display, fontSize: 52, fontWeight: 700, color: '#fff' }}>
        Reste : <span style={{ ...keyStyle('#86EFAC') }}>0 FCFA</span>{' '}
        <span style={{ color: '#FCA5A5', textDecoration: 'line-through', opacity: 0.55, fontSize: 40 }}>300 000</span>
      </div>
    </Center>
  </AbsoluteFill>
);

// S9 · Atout — même sans réseau
export const S9 = () => (
  <AbsoluteFill>
    <Background />
    <Center style={{ top: 330 }}>
      <div style={{ position: 'relative', width: 520, height: 300 }}>
        <div style={{ position: 'absolute', left: 0, top: 50, opacity: 0.45, filter: 'blur(2px)' }}>
          <Glass radius={110} style={{ width: 200, height: 200 }}>
            <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WifiOff size={96} color="#FCA5A5" /></div>
          </Glass>
        </div>
        <div style={{ position: 'absolute', left: 230, top: 0 }}>
          <Glass radius={150} edge="rgba(147,197,253,.95)" glow="rgba(96,165,250,.7)" style={{ width: 290, height: 290 }}>
            <div style={{ width: 290, height: 290, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Cloud size={150} color="#fff" strokeWidth={1.6} />
              <div style={{ position: 'absolute', right: 52, bottom: 62, width: 74, height: 74, borderRadius: 37, background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(34,197,94,.8)' }}>
                <Check size={46} color="#fff" strokeWidth={3.5} />
              </div>
            </div>
          </Glass>
        </div>
      </div>
    </Center>
    <Center style={{ top: 760 }}>
      <Phrase text="Même sans *réseau*." size={100} keyScale={1.1} weight={700} />
    </Center>
    <Center style={{ top: 920 }}>
      <div style={{ fontFamily: fonts.body, fontSize: 40, color: V.ice, opacity: 0.85 }}>Sauvegardé en ligne dès le retour du réseau</div>
    </Center>
  </AbsoluteFill>
);

// S10 · Phrase finale
export const S10 = () => (
  <AbsoluteFill>
    <Background />
    <LightLine y={940} depth={0} />
    <Center style={{ top: 500 }}>
      <Phrase text="Chaque franc de vos chantiers," size={62} weight={600} />
    </Center>
    <Center style={{ top: 600 }}>
      <Phrase text="sous *contrôle*." size={110} keyScale={1.1} weight={700} />
    </Center>
  </AbsoluteFill>
);

// S11 · Fin — logo + nom
export const S11 = () => (
  <AbsoluteFill>
    <Background />
    <div style={{ position: 'absolute', left: 540 - 420, top: 675 - 420, width: 840, height: 840, borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,.35) 0%, rgba(96,165,250,0) 60%)' }} />
    <Center style={{ top: 560 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <Logo size={230} style={{ boxShadow: '0 0 70px rgba(147,197,253,.7)' }} />
        <div style={{ fontFamily: fonts.display, fontSize: 92, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 0.95 }}>
          Gestion<br />Chantiers
        </div>
      </div>
    </Center>
  </AbsoluteFill>
);

export const FRAMES = { S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11 };
export { C, fcfa };
