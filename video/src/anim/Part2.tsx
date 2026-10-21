// Animation des plans 6 à 11 (gestes → fin), version ralentie et expliquée, calée sur la voix off et la musique.
// Images = temps global de la vidéo. Chaque geste dure 4 mesures (≈ 6,9 s) : légende, geste lent, résultat qui reste.
import { CSSProperties } from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Check, Cloud, WifiOff } from 'lucide-react';
import { AppPanel, BeneficiaireCard, EntreeDetail, Field, Finger, FonctionList, ModalHeader, fcfa } from '../app/AppUI';
import { Glass } from '../ui/Glass';
import { BrandMark, ChantierSkyline, FF, K, Navy, StarPill, TagBubble, drop } from '../v3/kit';
import { Abs, Line, LiveSky } from './Part1';
import { bar, drift, ease, sp, t } from './motion';

const M = 72;
const S = (sec: number) => Math.round(sec * 30); // secondes → image
const panelShadow: CSSProperties = { borderRadius: 34, boxShadow: '0 0 0 10px #FFFFFF, 14px 24px 0 10px rgba(6,26,71,0.20), 20px 40px 70px rgba(6,26,71,0.40)' };

const typed = (f: number, start: number, text: string, rate = 1.6) => text.slice(0, Math.max(0, Math.floor((f - start) / rate)));
const count = (f: number, start: number, end: number, from: number, to: number) => Math.round(t(f, start, end, from, to, ease.inOut));
const tap = (f: number, at: number) => t(f, at - 2, at + 1) - t(f, at + 3, at + 7);

// Repères (mesures de la musique).
export const G1 = bar(11), G2 = bar(15), G3 = bar(19), ATOUT = bar(23), FINALE = bar(26), END = bar(28);
export const VIDEO_END = END + 105; // ≈ 50,3 s

// ---------------------------------------------------------------------------
// Étiquette d'étape : ① ② ③ — explique le geste en cours (compréhensible sans le son).
type Step = { at: number; n: string; text: string; done?: boolean };
const StepCaption = ({ f, steps, y }: { f: number; steps: Step[]; y: number }) => (
  <>
    {steps.map((s, i) => {
      const next = steps[i + 1]?.at ?? 1e9;
      if (f < s.at - 1 || f > next + 8) return null;
      const inP = sp(f, s.at, 'ferme');
      const outP = t(f, next, next + 7, 0, 1, ease.in);
      return (
        <div key={i} style={{ position: 'absolute', left: M, top: y, opacity: inP * (1 - outP), transform: `translateX(${(1 - inP) * -40 + outP * 40}px)` }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, background: K.white, borderRadius: 40, padding: '10px 28px 10px 10px', boxShadow: drop(0.4) }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: s.done ? K.green : K.orange, color: s.done ? K.white : K.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FF.head, fontWeight: 900, fontSize: 28 }}>
              {s.done ? <Check size={30} strokeWidth={3.5} /> : s.n}
            </div>
            <span style={{ fontFamily: FF.head, fontWeight: 800, fontSize: 34, color: K.navy, whiteSpace: 'nowrap' }}>{s.text}</span>
          </div>
        </div>
      );
    })}
  </>
);

const GestureHead = ({ f, at, tag, l1, l2 }: { f: number; at: number; tag: string; l1: string; l2: string }) => (
  <>
    <div style={{ position: 'absolute', left: M, top: 150, transform: `scale(${sp(f, at)})`, transformOrigin: '0 100%' }}>
      <TagBubble style={{ left: 0, top: 0 }}>{tag}</TagBubble>
    </div>
    <Abs x={M} y={240}>
      <Line f={f} text={l1} size={76} at={at + 4} step={5} />
      <Line f={f} text={l2} size={76} at={at + 13} step={5} />
    </Abs>
  </>
);

// Carrousel : entrée par la droite, sortie par la gauche.
const slide = (f: number, inAt: number, outAt: number) => {
  const inP = t(f, inAt - 6, inAt + 10, 0, 1, ease.inOut);
  const outP = t(f, outAt - 8, outAt + 6, 0, 1, ease.inOut);
  return { x: (1 - inP) * 1150 - outP * 1150, blur: Math.max(1 - inP, outP) * 12 };
};

// ---------------------------------------------------------------------------
// Fond commun des trois gestes ; le bloc marine monte en volet vers le plan 9.
export const GesturesBG = ({ f }: { f: number }) => {
  if (f < G1 - 4 || f > ATOUT + 8) return null;
  const bandIn = t(f, G1 - 2, G1 + 14);
  const wipe = t(f, ATOUT - 8, ATOUT + 4, 0, 1, ease.in);
  const top = 900 + (1 - bandIn) * 500 - wipe * 900;
  return (
    <AbsoluteFill>
      <LiveSky f={f} />
      <div style={{ position: 'absolute', left: 0, right: 0, top, bottom: 0, background: `linear-gradient(180deg, ${K.navy} 0%, ${K.navyDeep} 100%)` }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 10, background: K.orange }} />
      </div>
      <div style={{ opacity: 1 - wipe }}>
        <BrandMark />
      </div>
      <AbsoluteFill style={{ background: '#FFFFFF', opacity: t(f, G1 + 2, G1 + 14, 1, 0) }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// S6 · Geste 1 — Entrée. Voix : « Un client vous paie ? Vous le notez, et le total se met à jour tout seul. »
const E_TAP = S(19.35), E_ROW = S(19.7), E_TOTAL = S(20.8), E_DONE = S(21.9);

export const S6 = ({ f }: { f: number }) => {
  if (f < G1 - 4 || f > G2 + 10) return null;
  const s = slide(f, G1 + 4, G2);
  const press = tap(f, E_TAP);
  const rowIn = t(f, E_ROW, E_ROW + 12, 0, 1, ease.out);
  const amount = count(f, E_ROW + 2, E_ROW + 22, 0, 2_500_000);
  const total = count(f, E_TOTAL, E_DONE, 6_000_000, 8_500_000);
  const zoom = 1 + t(f, E_TOTAL - 6, E_DONE, 0, 0.06, ease.inOut);
  return (
    <AbsoluteFill style={{ transform: `translateX(${s.x}px)`, filter: `blur(${s.blur}px)` }}>
      <GestureHead f={f} at={G1 + 2} tag="01 · Entrées" l1="Chaque *paiement*" l2="reçu, noté." />
      <StepCaption f={f} y={440} steps={[
        { at: G1 + 22, n: '1', text: 'Touchez « Ajouter »' },
        { at: E_ROW, n: '2', text: 'Le paiement est noté' },
        { at: E_TOTAL - 2, n: '3', text: 'Le total se calcule tout seul' },
        { at: E_DONE + 6, n: '', text: 'Total à jour', done: true },
      ]} />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - sp(f, G1 + 6, 'ferme')) * 700}px) scale(${zoom})`, transformOrigin: '30% 50%' }}>
        <AppPanel scale={2.4} glow={false} style={{ top: 560, left: 72, ...panelShadow }}>
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
        {/* le total qui vient de changer est entouré */}
        <div style={{ position: 'absolute', left: 88, top: 806, width: 540, height: 66, borderRadius: 32, border: `5px solid ${K.orange}`, opacity: t(f, E_TOTAL, E_TOTAL + 8) * (1 - t(f, G2 - 10, G2 - 4)), transform: `scale(${0.9 + 0.1 * sp(f, E_TOTAL)})` }} />
      </div>
      {f >= E_TAP - 10 && f <= E_TAP + 10 && <Finger x={905} y={784} pressed={press} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// S7 · Geste 2 — Sortie. Voix : « Vous payez un fournisseur ou un ouvrier ? Chaque dépense est rangée par bénéficiaire. »
const O_TYPE = S(25.3), O_TAPFN = S(26.5), O_TAPFOUR = S(28.1), O_AMOUNT = S(28.9), O_DONE = S(29.8);

export const S7 = ({ f }: { f: number }) => {
  if (f < G2 - 8 || f > G3 + 10) return null;
  const s = slide(f, G2, 1e9);
  const out = t(f, G3 - 10, G3 + 4, 0, 1, ease.in);
  const listOpen = t(f, O_TAPFN + 2, O_TAPFN + 12) - t(f, O_TAPFOUR + 10, O_TAPFOUR + 20);
  const scroll = t(f, O_TAPFN + 10, O_TAPFOUR - 6, 0, 7, ease.inOut);
  const chosen = f >= O_TAPFOUR + 2;
  return (
    <AbsoluteFill style={{ transform: `translateX(${s.x}px)`, filter: `blur(${s.blur}px)`, opacity: 1 - out }}>
      <GestureHead f={f} at={G2} tag="02 · Sorties" l1="Chaque *dépense*," l2="par bénéficiaire." />
      <StepCaption f={f} y={440} steps={[
        { at: O_TYPE - 4, n: '1', text: 'Qui avez-vous payé ?' },
        { at: O_TAPFN, n: '2', text: 'Sa fonction : fournisseur, maçon…' },
        { at: O_AMOUNT, n: '3', text: 'Combien ?' },
        { at: O_DONE + 4, n: '', text: 'Rangé chez Ets Abdelkerim', done: true },
      ]} />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${out * 260}px) scale(${1 - out * 0.15})`, transformOrigin: '50% 80%' }}>
        <AppPanel scale={2.35} glow={false} style={{ top: 540, left: 84, ...panelShadow }}>
          <ModalHeader title="Nouvelle sortie — VILLA FARCHA" />
          <div style={{ padding: '18px 20px', background: '#fff' }}>
            <Field label="Bénéficiaire (personne ou fournisseur)" value={typed(f, O_TYPE, 'Ets Abdelkerim')} focused={f >= O_TYPE - 4 && f < O_TAPFN} />
            <Field label="Fonction" value={chosen ? 'Fournisseur' : ''} placeholder="Sans fonction précisée" focused={f >= O_TAPFN && f < O_AMOUNT} chevron />
            <div style={{ height: listOpen * 180, overflow: 'hidden', marginTop: -4, marginBottom: 14 * listOpen }}>
              <FonctionList selected={chosen ? 'Fournisseur' : undefined} offset={scroll} visible={4} />
            </div>
            <Field label="Montant (FCFA)" value={typed(f, O_AMOUNT, '850 000', 2.2)} focused={f >= O_AMOUNT - 2} />
          </div>
        </AppPanel>
      </div>
      {f >= O_TAPFN - 10 && f <= O_TAPFN + 10 && <Finger x={700} y={1033} pressed={tap(f, O_TAPFN)} />}
      {f >= O_TAPFOUR - 10 && f <= O_TAPFOUR + 12 && <Finger x={720} y={1259} pressed={tap(f, O_TAPFOUR)} />}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
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

// S8 · Geste 3 — Dette. Voix : « Et vous voyez d'un coup d'œil ce qu'il reste à payer. »
const D_SHOW = S(33.0), D_TAP = S(34.6), D_COUNT = S(35.0), D_COIN = S(36.3);

export const S8 = ({ f }: { f: number }) => {
  if (f < G3 - 4 || f > ATOUT + 6) return null;
  const inP = sp(f, G3, 'ferme');
  const out = t(f, ATOUT - 8, ATOUT + 2, 0, 1, ease.in);
  const press = tap(f, D_TAP);
  const reste = count(f, D_COUNT, D_COUNT + 30, 300_000, 0);
  const paye = 1_200_000 - reste;
  const coin = sp(f, D_COIN, 'pose');
  return (
    <AbsoluteFill style={{ transform: `translateY(${-out * 900}px)` }}>
      <GestureHead f={f} at={G3} tag="03 · Dettes" l1="Le reste *à payer*," l2="toujours à jour." />
      <StepCaption f={f} y={440} steps={[
        { at: D_SHOW - 10, n: '1', text: 'Il reste 300 000 à payer' },
        { at: D_TAP - 4, n: '2', text: 'Enregistrez le paiement' },
        { at: D_COIN, n: '', text: 'Dette soldée', done: true },
      ]} />
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - inP) * 500}px) scale(${0.7 + 0.3 * inP})`, transformOrigin: '50% 90%', opacity: t(f, G3 - 4, G3 + 4) }}>
        <AppPanel scale={2.4} glow={false} style={{ top: 660, left: 72, ...panelShadow }}>
          <div style={{ padding: 16 }}>
            <BeneficiaireCard nom="Jean (Maçon)" totalPaye={paye} reste={reste} resteColor={reste > 0 ? K.red : K.green} ligne="Main d'œuvre — Élévation des murs" date="20/10/2026" montantDu={1_200_000} statut={reste === 0 ? 'Soldé' : 'Partiel'} linkPressed={press} />
          </div>
        </AppPanel>
        {/* le reste à payer est entouré pendant que la voix le dit */}
        <div style={{ position: 'absolute', left: 560, top: 760, width: 420, height: 62, borderRadius: 31, border: `5px solid ${K.red}`, opacity: t(f, D_SHOW - 6, D_SHOW + 4) * (1 - t(f, D_COUNT + 26, D_COUNT + 32)), transform: `scale(${0.9 + 0.1 * sp(f, D_SHOW - 6)})` }} />
      </div>
      {f >= D_TAP - 10 && f <= D_TAP + 10 && <Finger x={300} y={1048} pressed={press} />}
      {f >= D_COIN - 1 && (
        <div style={{ position: 'absolute', left: 760, top: 470, perspective: 1200 }}>
          <Coin size={230} style={{ transform: `scale(${coin}) rotateY(${t(f, D_COIN, D_COIN + 16, 380, 22)}deg) rotateZ(-8deg)` }} />
        </div>
      )}
      {f >= D_COIN + 6 && (
        <StarPill size={36} bg={K.green} color={K.white} star={K.white} style={{ position: 'absolute', left: 72, top: 1170, transform: `scale(${sp(f, D_COIN + 6)})`, transformOrigin: '0 50%' }}>
          Reste : {fcfa(reste)}
        </StarPill>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// S9 · Atout. Voix : « Même sans réseau, tout est enregistré. » ; sortie par un volet vers le bas.
const A_CLOUD = S(39.8), A_CHECK = S(40.3);

export const S9 = ({ f }: { f: number }) => {
  if (f < ATOUT + 4 || f > FINALE + 14) return null;
  const out = t(f, FINALE - 2, FINALE + 12, 0, 1, ease.in);
  const off = sp(f, ATOUT + 4);
  const cloud = sp(f, A_CLOUD);
  const check = sp(f, A_CHECK);
  return (
    <AbsoluteFill style={{ transform: `translateY(${out * 1350}px)` }}>
      <Navy />
      <BrandMark dark />
      <div style={{ position: 'absolute', left: 270, top: 300, width: 540, height: 300, transform: `scale(${drift(f - ATOUT, 150, 0.04)})` }}>
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
        <Line f={f} text="Même sans" size={110} at={ATOUT + 8} step={6} color={K.white} align="center" />
        <Line f={f} text="*réseau*." size={110} at={ATOUT + 20} step={6} color={K.white} align="center" />
      </Abs>
      <Abs x={0} y={1000} style={{ width: 1080, display: 'flex', justifyContent: 'center', transform: `scale(${sp(f, A_CHECK + 6)})` }}>
        <StarPill size={32} bg={K.white} color={K.navy}>Sauvegardé dès le retour du réseau</StarPill>
      </Abs>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// S10 · Phrase finale. Voix : « Chaque franc de vos chantiers, sous contrôle. »
const F_WORDS = S(43.85), F_CTL = S(45.55);

export const S10 = ({ f }: { f: number }) => {
  if (f < FINALE - 2 || f > END + 8) return null;
  const shrink = t(f, END - 8, END, 0, 1, ease.in);
  const ctl = t(f, F_CTL, F_CTL + 12);
  return (
    <AbsoluteFill>
      <LiveSky f={f} />
      <BrandMark />
      <AbsoluteFill style={{ transform: `scale(${drift(f - FINALE, 100, 0.03) * (1 - shrink * 0.9)})`, transformOrigin: '50% 45%', opacity: 1 - shrink }}>
        <Abs x={M} y={300}>
          <Line f={f} text="Chaque franc de" size={86} at={F_WORDS} step={5} />
          <Line f={f} text="vos chantiers," size={86} at={F_WORDS + 18} step={6} />
          <Line f={f} text="sous" size={86} at={F_CTL - 10} step={5} />
          <div style={{ fontFamily: FF.head, fontWeight: 900, fontSize: 150, lineHeight: 1, marginTop: 6, color: K.orange, letterSpacing: `${-0.025 + (1 - ctl) * 0.45}em`, opacity: t(f, F_CTL, F_CTL + 4), filter: `blur(${(1 - ctl) * 10}px)`, whiteSpace: 'nowrap' }}>
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

// S11 · Fin. Voix : « Gestion Chantiers. »
export const S11 = ({ f }: { f: number }) => {
  if (f < END - 4) return null;
  const r = t(f, END - 4, END + 8, 0, 1700, ease.out);
  const pop = sp(f, END, 'pose');
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at 540px 640px)` }}>
      <Navy />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 545, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 44, transform: `scale(${drift(f - END, 100, 0.03)})` }}>
        <Img src={staticFile('logo.png')} style={{ width: 240, height: 240, borderRadius: 54, boxShadow: `0 0 0 9px #FFFFFF, ${drop(0.8)}`, transform: `scale(${pop}) rotate(${(1 - pop) * -12}deg)` }} />
        <div>
          <Line f={f} text="Gestion" size={100} at={END + 8} color={K.white} />
          <Line f={f} text="*chantiers*" size={100} at={END + 16} color={K.white} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Voix off : [image de départ, fichier] (prise 1, découpée phrase par phrase dans public/voix/).
export const VOICE: [number, string][] = [
  [S(0.35), 'v01'], [S(2.2), 'v02'], [S(5.75), 'v03'], [S(7.3), 'v04'], [S(9.45), 'v05'], [S(10.7), 'v06'], [S(12.1), 'v07'],
  [S(14.55), 'v08'],
  [S(18.3), 'v09'], [S(19.3), 'v10'],
  [S(25.1), 'v11'], [S(27.3), 'v12'],
  [S(31.9), 'v13'],
  [S(38.7), 'v14'],
  [S(43.8), 'v16'],
  [S(47.05), 'v15'],
];
export const VOICE_DUR: Record<string, number> = { v01: 1.05, v02: 3.39, v03: 1.07, v04: 2.32, v05: 1.35, v06: 1.49, v07: 1.84, v08: 3.1, v09: 0.93, v10: 2.7, v11: 1.86, v12: 2.36, v13: 2.33, v14: 2.16, v15: 1.14, v16: 2.47 };

export const SFX2: [number, string, number][] = [
  [508, 'whoosh-long', 0.35],
  [G1 + 2, 'pop', 0.25], [E_TAP, 'pop', 0.3], [E_ROW, 'swoosh', 0.2], [E_TOTAL, 'counter', 0.22], [E_DONE, 'ding', 0.25],
  [G2 - 8, 'whoosh', 0.35], [O_TYPE, 'counter', 0.12], [O_TAPFN, 'pop', 0.3], [O_TAPFN + 10, 'swoosh', 0.2], [O_TAPFOUR, 'pop', 0.3], [O_AMOUNT, 'counter', 0.12], [O_DONE + 4, 'ding', 0.22],
  [G3 - 8, 'whoosh', 0.35], [D_TAP, 'pop', 0.3], [D_COUNT, 'counter', 0.22], [D_COIN, 'ding', 0.3], [D_COIN, 'impact', 0.22],
  [ATOUT - 8, 'whoosh-long', 0.35], [ATOUT + 4, 'tick', 0.25], [A_CLOUD, 'pop', 0.25], [A_CHECK, 'ding', 0.25],
  [FINALE - 2, 'whoosh', 0.35], [F_CTL, 'swoosh', 0.25], [END - 51, 'riser', 0.3],
  [END, 'impact', 0.6], [END + 8, 'tick', 0.22], [END + 16, 'tick', 0.22],
];
