// Animation des plans 6 à 11 (gestes → fin), calée sur la musique. Images = temps global de la vidéo.
import { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Check, Cloud, WifiOff } from 'lucide-react';
import { AppPanel, BeneficiaireCard, EntreeDetail, Field, Finger, FonctionList, ModalHeader, fcfa } from '../app/AppUI';
import { Glass } from '../ui/Glass';
import { BrandMark, ChantierSkyline, FF, K, Navy, StarPill, TagBubble, drop } from '../v3/kit';
import { Abs, Line, LiveSky } from './Part1';
import { BEAT, b, drift, ease, sp, t } from './motion';

const M = 72;
const panelShadow: CSSProperties = { borderRadius: 34, boxShadow: '0 0 0 10px #FFFFFF, 14px 24px 0 10px rgba(6,26,71,0.20), 20px 40px 70px rgba(6,26,71,0.40)' };

// Texte qui s'écrit lettre par lettre (une lettre toutes les 1,5 image).
const typed = (f: number, start: number, text: string, rate = 1.5) => text.slice(0, Math.max(0, Math.floor((f - start) / rate)));
const count = (f: number, start: number, end: number, from: number, to: number) => Math.round(t(f, start, end, from, to, ease.out));

// Repères des scènes (temps de la mesure ; 1 mesure = 4 temps).
const G1 = b(40), G2 = b(48), G3 = b(56), ATOUT = b(64), FINALE = b(68), END = b(76);

// En-tête d'un geste : étiquette numérotée + titre bicolore.
const GestureHead = ({ f, at, tag, l1, l2 }: { f: number; at: number; tag: string; l1: string; l2: string }) => (
  <>
    <div style={{ position: 'absolute', left: M, top: 170, transform: `scale(${sp(f, at)})`, transformOrigin: '0 100%' }}>
      <TagBubble style={{ left: 0, top: 0 }}>{tag}</TagBubble>
    </div>
    <Abs x={M} y={265}>
      <Line f={f} text={l1} size={78} at={at + 4} step={5} />
      <Line f={f} text={l2} size={78} at={at + 13} step={5} />
    </Abs>
  </>
);

// Glissement de carrousel : entrée par la droite, sortie par la gauche.
const slide = (f: number, inAt: number, outAt: number) => {
  const inP = t(f, inAt - 6, inAt + 8, 0, 1, ease.inOut);
  const outP = t(f, outAt - 6, outAt + 6, 0, 1, ease.inOut);
  return { x: (1 - inP) * 1150 - outP * 1150, blur: Math.max(1 - inP, outP) * 12 };
};

// ---------------------------------------------------------------------------
// Fond commun des trois gestes (ciel + bloc marine) ; le bloc marine monte en volet vers le plan 9.
export const GesturesBG = ({ f }: { f: number }) => {
  if (f < G1 - 4 || f > ATOUT + 8) return null;
  const bandIn = t(f, G1 - 2, G1 + 14);
  const wipe = t(f, ATOUT - 8, ATOUT + 4, 0, 1, ease.in);
  const top = 880 + (1 - bandIn) * 500 - wipe * 880;
  return (
    <AbsoluteFill>
      <LiveSky f={f} />
      <div style={{ position: 'absolute', left: 0, right: 0, top, bottom: 0, background: `linear-gradient(180deg, ${K.navy} 0%, ${K.navyDeep} 100%)` }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 10, background: K.orange }} />
      </div>
      <div style={{ opacity: 1 - wipe }}>
        <BrandMark />
      </div>
      {/* sortie du zoom dans le logo : le blanc se dissipe */}
      <AbsoluteFill style={{ background: '#FFFFFF', opacity: t(f, G1 + 2, G1 + 14, 1, 0) }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// S6 · Geste 1 — Entrée (530 → 633)
export const S6 = ({ f }: { f: number }) => {
  if (f < G1 - 4 || f > G2 + 10) return null;
  const s = slide(f, G1 + 4, G2);
  const press = t(f, b(42), b(42) + 3) - t(f, b(42) + 4, b(42) + 8);
  const rowIn = t(f, b(43), b(43) + 10, 0, 1, ease.out);
  const amount = count(f, b(43) + 2, b(43) + 16, 0, 2_500_000);
  const total = count(f, b(44) + 4, b(45) + 6, 6_000_000, 8_500_000);
  const zoom = 1 + t(f, b(44), b(46), 0, 0.05, ease.inOut);
  return (
    <AbsoluteFill style={{ transform: `translateX(${s.x}px)`, filter: `blur(${s.blur}px)` }}>
      <GestureHead f={f} at={G1 + 2} tag="01 · Entrées" l1="Chaque *paiement*" l2="reçu, noté." />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - sp(f, G1 + 6, 'ferme')) * 700}px) scale(${zoom})`, transformOrigin: '30% 45%' }}>
        <AppPanel scale={2.4} glow={false} style={{ top: 500, left: 72, ...panelShadow }}>
          <EntreeDetail
            chantier="VILLA FARCHA"
            total={total}
            highlight={rowIn > 0.5 ? 0 : -1}
            addPressed={press}
            entrees={[
              { versePar: 'M. Mahamat Saleh', description: 'Deuxième tranche', date: '20/10/2026', mode: 'Espèces', montant: amount },
              { versePar: 'M. Mahamat Saleh', description: 'Avance de démarrage', date: '02/09/2026', mode: 'Virement bancaire', montant: 6_000_000 },
            ]}
            rowStyles={[{ maxHeight: rowIn * 120, opacity: rowIn, overflow: 'hidden', paddingTop: 12 * rowIn, paddingBottom: 12 * rowIn, transform: `translateY(${(1 - rowIn) * -20}px)` }]}
          />
        </AppPanel>
        {f >= b(45) && (
          <StarPill size={26} bg={K.orange} color={K.navy} star={K.navy} style={{ position: 'absolute', left: 610, top: 742, transform: `scale(${sp(f, b(45))})` }}>Total à jour</StarPill>
        )}
      </div>
      {f >= b(42) - 6 && f <= b(43) + 6 && <Finger x={905} y={724} pressed={press} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// S7 · Geste 2 — Sortie (633 → 736)
export const S7 = ({ f }: { f: number }) => {
  if (f < G2 - 8 || f > G3 + 10) return null;
  const s = slide(f, G2, 99999);
  const out = t(f, G3 - 8, G3 + 4, 0, 1, ease.in);
  const tapFn = b(51);
  const listOpen = t(f, tapFn + 2, tapFn + 10) - t(f, b(54), b(54) + 8);
  const scroll = t(f, tapFn + 8, b(53) - 2, 0, 7, ease.inOut);
  const tapFour = b(53);
  const chosen = f >= tapFour + 2;
  const pressFn = t(f, tapFn, tapFn + 3) - t(f, tapFn + 4, tapFn + 8);
  const pressFour = t(f, tapFour - 2, tapFour + 1) - t(f, tapFour + 2, tapFour + 6);
  return (
    <AbsoluteFill style={{ transform: `translateX(${s.x}px)`, filter: `blur(${s.blur}px)`, opacity: 1 - out }}>
      <GestureHead f={f} at={G2} tag="02 · Sorties" l1="Chaque *dépense*," l2="par bénéficiaire." />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${out * 260}px) scale(${1 - out * 0.15})`, transformOrigin: '50% 80%' }}>
        <AppPanel scale={2.35} glow={false} style={{ top: 470, left: 84, ...panelShadow }}>
          <ModalHeader title="Nouvelle sortie — VILLA FARCHA" />
          <div style={{ padding: '18px 20px', background: '#fff' }}>
            <Field label="Bénéficiaire (personne ou fournisseur)" value={typed(f, G2 + 8, 'Ets Abdelkerim')} focused={f >= G2 + 6 && f < tapFn} />
            <Field label="Fonction" value={chosen ? 'Fournisseur' : ''} placeholder="Sans fonction précisée" focused={f >= tapFn && f < b(54) + 8} chevron />
            <div style={{ height: listOpen * 180, overflow: 'hidden', marginTop: -4, marginBottom: 14 * listOpen }}>
              <FonctionList selected={chosen ? 'Fournisseur' : undefined} offset={scroll} visible={4} />
            </div>
            <Field label="Montant (FCFA)" value={typed(f, b(54) + 6, '850 000', 2)} focused={f >= b(54) + 4} />
          </div>
        </AppPanel>
      </div>
      {f >= tapFn - 6 && f <= tapFn + 10 && <Finger x={700} y={963} pressed={pressFn} />}
      {f >= tapFour - 8 && f <= tapFour + 12 && <Finger x={720} y={1189} pressed={pressFour} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Pièce « Soldé ».
const Coin = ({ size, style }: { size: number; style?: CSSProperties }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', position: 'relative', ...style }}>
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

// S8 · Geste 3 — Dette soldée (736 → 839)
export const S8 = ({ f }: { f: number }) => {
  if (f < G3 - 4 || f > ATOUT + 6) return null;
  const inP = sp(f, G3, 'ferme');
  const out = t(f, ATOUT - 8, ATOUT + 2, 0, 1, ease.in);
  const tap = b(58);
  const press = t(f, tap, tap + 3) - t(f, tap + 4, tap + 8);
  const reste = count(f, b(59), b(61), 300_000, 0);
  const paye = 1_200_000 - reste;
  const solde = reste === 0;
  const resteColor = reste > 0 ? K.red : K.green;
  const coin = sp(f, b(62), 'pose');
  return (
    <AbsoluteFill style={{ transform: `translateY(${-out * 900}px)` }}>
      <GestureHead f={f} at={G3} tag="03 · Dettes" l1="Le reste *à payer*," l2="toujours à jour." />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - inP) * 500}px) scale(${0.7 + 0.3 * inP})`, transformOrigin: '50% 90%', opacity: t(f, G3 - 4, G3 + 4) }}>
        <AppPanel scale={2.4} glow={false} style={{ top: 640, left: 72, ...panelShadow }}>
          <div style={{ padding: 16 }}>
            <BeneficiaireCard nom="Jean (Maçon)" totalPaye={paye} reste={reste} resteColor={resteColor} ligne="Main d'œuvre — Élévation des murs" date="20/10/2026" montantDu={1_200_000} statut={solde ? 'Soldé' : 'Partiel'} linkPressed={press} />
          </div>
        </AppPanel>
      </div>
      {f >= tap - 6 && f <= tap + 10 && <Finger x={300} y={1028} pressed={press} />}
      {f >= b(62) - 1 && (
        <div style={{ position: 'absolute', left: 740, top: 470, perspective: 1200 }}>
          <Coin size={250} style={{ transform: `scale(${coin}) rotateY(${t(f, b(62), b(62) + 16, 380, 22)}deg) rotateZ(-8deg)` }} />
        </div>
      )}
      {f >= b(62) + 4 && (
        <StarPill size={36} bg={K.green} color={K.white} star={K.white} style={{ position: 'absolute', left: 72, top: 1150, transform: `scale(${sp(f, b(62) + 4)})`, transformOrigin: '0 50%' }}>
          Reste : {fcfa(reste)}
        </StarPill>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// S9 · Atout — même sans réseau (839 → 890, pendant la pause musicale) ; sortie par un volet vers le bas.
export const S9 = ({ f }: { f: number }) => {
  if (f < ATOUT + 4 || f > FINALE + 14) return null;
  const out = t(f, FINALE - 2, FINALE + 12, 0, 1, ease.in);
  const off = sp(f, ATOUT + 2);
  const cloud = sp(f, b(66) + 6);
  const check = sp(f, b(67) + 6);
  return (
    <AbsoluteFill style={{ transform: `translateY(${out * 1350}px)` }}>
      <Navy />
      <BrandMark dark />
      <div style={{ position: 'absolute', left: 270, top: 300, width: 540, height: 300 }}>
        <div style={{ position: 'absolute', left: 0, top: 50, opacity: 0.5 + 0.5 * (1 - cloud), transform: `scale(${off})` }}>
          <Glass radius={110} style={{ width: 200, height: 200 }}>
            <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><WifiOff size={96} color="#FCA5A5" /></div>
          </Glass>
        </div>
        <div style={{ position: 'absolute', left: 230, top: 0, transform: `scale(${cloud})` }}>
          <Glass radius={150} edge="rgba(147,197,253,.95)" glow="rgba(96,165,250,.5)" style={{ width: 290, height: 290 }}>
            <div style={{ width: 290, height: 290, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Cloud size={150} color="#fff" strokeWidth={1.6} />
              <div style={{ position: 'absolute', right: 52, bottom: 62, width: 74, height: 74, borderRadius: 37, background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 5px #fff', transform: `scale(${check})` }}>
                <Check size={46} color="#fff" strokeWidth={3.5} />
              </div>
            </div>
          </Glass>
        </div>
      </div>
      <Abs x={0} y={720} style={{ width: 1080 }}>
        <Line f={f} text="Même sans" size={110} at={ATOUT + 4} step={6} color={K.white} align="center" />
        <Line f={f} text="*réseau*." size={110} at={ATOUT + 14} step={6} color={K.white} align="center" />
      </Abs>
      <Abs x={0} y={1000} style={{ width: 1080, display: 'flex', justifyContent: 'center', transform: `scale(${sp(f, b(67) + 8)})` }}>
        <StarPill size={32} bg={K.white} color={K.navy}>Sauvegardé dès le retour du réseau</StarPill>
      </Abs>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// S10 · Phrase finale (890 → 993) ; sortie : la phrase se rétracte vers le centre, cercle marine sur l'impact.
export const S10 = ({ f }: { f: number }) => {
  if (f < FINALE - 2 || f > END + 8) return null;
  const shrink = t(f, END - 8, END, 0, 1, ease.in);
  const ctl = t(f, b(71), b(71) + 12);
  return (
    <AbsoluteFill>
      <LiveSky f={f} />
      <BrandMark />
      <AbsoluteFill style={{ transform: `scale(${drift(f - FINALE, 100, 0.03) * (1 - shrink * 0.9)})`, transformOrigin: '50% 45%', opacity: 1 - shrink }}>
        <Abs x={M} y={300}>
          <Line f={f} text="Chaque franc de" size={86} at={FINALE + 6} step={5} />
          <Line f={f} text="vos chantiers," size={86} at={b(69)} step={6} />
          <Line f={f} text="sous" size={86} at={b(70)} step={5} />
          <div style={{ fontFamily: FF.head, fontWeight: 900, fontSize: 150, lineHeight: 1, marginTop: 6, color: K.orange, letterSpacing: `${-0.025 + (1 - ctl) * 0.45}em`, opacity: t(f, b(71), b(71) + 4), filter: `blur(${(1 - ctl) * 10}px)`, whiteSpace: 'nowrap' }}>
            CONTRÔLE<span style={{ color: K.navy }}>.</span>
          </div>
        </Abs>
      </AbsoluteFill>
      <Abs x={0} y={896} style={{ transform: `translateY(${(1 - t(f, FINALE, FINALE + 26)) * 260 + shrink * 200}px)` }}>
        <ChantierSkyline />
      </Abs>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1336, bottom: 0, background: K.navy }} />
    </AbsoluteFill>
  );
};

// S11 · Fin (993 → fin) : cercle marine qui s'ouvre depuis le centre sur l'impact, logo qui pop, nom.
export const S11 = ({ f }: { f: number }) => {
  if (f < END - 4) return null;
  const r = t(f, END - 4, END + 8, 0, 1700, ease.out);
  const pop = sp(f, END, 'pose');
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at 540px 640px)` }}>
      <Navy />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 545, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 44, transform: `scale(${drift(f - END, 60, 0.02)})` }}>
        <Img src={staticFile('logo.png')} style={{ width: 240, height: 240, borderRadius: 54, boxShadow: `0 0 0 9px #FFFFFF, ${drop(0.8)}`, transform: `scale(${pop}) rotate(${(1 - pop) * -12}deg)` }} />
        <div>
          <Line f={f} text="Gestion" size={100} at={END + 6} color={K.white} />
          <Line f={f} text="*chantiers*" size={100} at={END + 12} color={K.white} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
export const SFX2: [number, string, number][] = [
  [508, 'whoosh-long', 0.45],
  [G1 + 2, 'pop', 0.35], [b(42), 'pop', 0.4], [b(43), 'swoosh', 0.3], [b(44) + 4, 'counter', 0.3], [b(45), 'ding', 0.3],
  [G2 - 8, 'whoosh', 0.45], [G2 + 8, 'counter', 0.18], [b(51), 'pop', 0.4], [b(51) + 8, 'swoosh', 0.3], [b(53), 'pop', 0.4], [b(54) + 6, 'counter', 0.18],
  [G3 - 8, 'whoosh', 0.45], [b(58), 'pop', 0.4], [b(59), 'counter', 0.3], [b(62), 'ding', 0.4], [b(62), 'impact', 0.3],
  [ATOUT - 8, 'whoosh-long', 0.45], [ATOUT + 2, 'tick', 0.35], [b(66) + 6, 'pop', 0.35], [b(67) + 6, 'ding', 0.35],
  [FINALE - 2, 'whoosh', 0.45], [b(69), 'tick', 0.25], [b(70), 'tick', 0.25], [b(71), 'swoosh', 0.35], [END - Math.round(BEAT * 4), 'riser', 0.4],
  [END, 'impact', 0.75], [END + 6, 'tick', 0.3], [END + 12, 'tick', 0.3],
];

export const VIDEO_END = END + 52; // ≈ 34,8 s
