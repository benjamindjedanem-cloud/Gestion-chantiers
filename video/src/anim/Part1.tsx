// Animation des plans 1 à 5 (accroche → révélation), calée sur la musique. Images = temps global de la vidéo.
import { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Audio, Img, Sequence, random, staticFile, useCurrentFrame } from 'remotion';
import { Banknote, HandCoins, Truck } from 'lucide-react';
import { BrandMark, ChantierSkyline, FF, K, Navy, RingBadge, Sky, StarPill, TagBubble, drop } from '../v3/kit';
import { BEAT, b, drift, ease, sp, t } from './motion';

const M = 72;

// ---------------------------------------------------------------------------
// Texte : mots qui arrivent un par un (montée + flou qui se dissipe), mot-clé entre astérisques en orange.
type W = { text: string; key: boolean; suffix?: string };
// La ponctuation finale (. , … ;) se colle au mot précédent, dans la couleur normale.
const words = (s: string): W[] => {
  const out: W[] = [];
  for (const p of s.split(/(\*[^*]+\*)/).filter(Boolean)) {
    if (p.startsWith('*')) { out.push({ text: p.slice(1, -1), key: true }); continue; }
    for (const w of p.split(/\s+/).filter(Boolean)) {
      const m = /^([.,…;]+)(.*)$/.exec(w);
      if (m && out.length) {
        out[out.length - 1].suffix = (out[out.length - 1].suffix || '') + m[1];
        if (m[2]) out.push({ text: m[2], key: false });
      } else out.push({ text: w, key: false });
    }
  }
  return out;
};

export const Line = ({ f, text, size, at, step = 5, color = K.navy, accent = K.orange, style, align = 'left' }: { f: number; text: string; size: number; at: number; step?: number; color?: string; accent?: string; style?: CSSProperties; align?: 'left' | 'center' }) => (
  <div style={{ display: 'flex', flexWrap: 'nowrap', gap: size * 0.26, justifyContent: align === 'center' ? 'center' : 'flex-start', fontFamily: FF.head, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: '-0.025em', textTransform: 'uppercase', color, ...style }}>
    {words(text).map((w, i) => {
      const s0 = at + i * step;
      const p = t(f, s0, s0 + 9);
      return (
        <span key={i} style={{ display: 'inline-block', whiteSpace: 'nowrap', color: w.key ? accent : color, opacity: t(f, s0, s0 + 4), transform: `translateY(${(1 - p) * size * 0.45}px)`, filter: `blur(${(1 - p) * 8}px)` }}>
          {w.text}
          {w.suffix && <span style={{ color }}>{w.suffix}</span>}
        </span>
      );
    })}
  </div>
);

export const Abs = ({ x, y, children, style }: { x: number; y: number; children: ReactNode; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', left: x, top: y, ...style }}>{children}</div>
);

// Fond ciel dont les nuages dérivent lentement.
export const LiveSky = ({ f }: { f: number }) => (
  <AbsoluteFill style={{ transform: `scale(${1.04 + f * 0.0002}) translateX(${-f * 0.15}px)` }}>
    <Sky />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// S1 · Accroche (0 → 67), sortie par un cercle qui part du « ? » et révèle le plan 2.
const Q_X = 945, Q_Y = 482; // position du « ? » dans le titre

export const S1 = ({ f }: { f: number }) => {
  if (f > 72) return null;
  const a = t(f, 8, 22);
  const exit = t(f, 58, 70, 0, 1, ease.in);
  return (
    <AbsoluteFill>
      <LiveSky f={f} />
      <div style={{ opacity: t(f, 2, 12) }}>
        <BrandMark />
      </div>
      <AbsoluteFill style={{ transform: `scale(${drift(f, 70)})`, transformOrigin: '30% 40%' }}>
        <Abs x={M} y={330}>
          <div style={{ transform: `scale(${1.55 - 0.55 * a}) translateY(${-exit * 60}px)`, transformOrigin: '0 50%', filter: `blur(${(1 - a) * 18}px)`, opacity: t(f, 8, 14) * (1 - exit) }}>
            <div style={{ fontFamily: FF.head, fontWeight: 900, fontSize: 92, lineHeight: 0.98, letterSpacing: '-0.025em', color: K.navy }}>VOUS GÉREZ DES</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 34, marginTop: 4, height: 140, overflow: 'visible' }}>
            <div style={{ overflow: 'hidden', paddingBottom: 8, opacity: 1 - exit }}>
              <div style={{ fontFamily: FF.head, fontWeight: 900, fontSize: 132, lineHeight: 1, letterSpacing: '-0.025em', color: K.orange, transform: `translateY(${(1 - sp(f, b(1) - 3, 'ferme')) * 140}px)` }}>CHANTIERS</div>
            </div>
            <div style={{ fontFamily: FF.head, fontWeight: 900, fontSize: 132, lineHeight: 1, color: K.navy, transform: `scale(${sp(f, b(2) - 2) * (1 + Math.pow(t(f, 54, 68, 0, 1, ease.in), 2) * 26)})`, transformOrigin: '50% 55%', display: 'inline-block', opacity: 1 }}>?</div>
          </div>
          <div style={{ width: 300 * t(f, b(2), b(2) + 10), height: 14, background: K.navy, marginTop: 26, opacity: 1 - exit }} />
        </Abs>
      </AbsoluteFill>
      <Abs x={0} y={896} style={{ transform: `translateY(${(1 - t(f, 0, 30)) * 260 + exit * 300}px)` }}>
        <ChantierSkyline />
      </Abs>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1336, bottom: 0, background: K.navy }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// S2 · « Tout se mélange » (67 → 170)
const MoneyCard = ({ kind, name, amount, bg, icon }: { kind: string; name: string; amount: string; bg: string; icon: ReactNode }) => (
  <div style={{ width: 600, background: K.white, padding: 10, borderRadius: 30, boxShadow: drop(0.9) }}>
    <div style={{ background: bg, borderRadius: 22, padding: '28px 34px', color: K.white }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 66, height: 66, borderRadius: 33, background: K.white, display: 'flex', alignItems: 'center', justifyContent: 'center', color: bg }}>{icon}</div>
        <div style={{ fontFamily: FF.head, fontWeight: 900, fontSize: 38, letterSpacing: '0.02em' }}>{kind}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 22 }}>
        <div style={{ fontFamily: FF.body, fontWeight: 600, fontSize: 36 }}>{name}</div>
        <div style={{ fontFamily: FF.num, fontWeight: 700, fontSize: 52, fontVariantNumeric: 'tabular-nums' }}>{amount}</div>
      </div>
    </div>
  </div>
);

const CARDS = [
  { at: b(4), kind: 'AVANCE', name: 'Mme Achta', amount: '500 000', bg: K.green, icon: <HandCoins size={36} strokeWidth={2.6} />, x: 330, y: 1040, ry: -8, rz: 3, exitX: 1400 },
  { at: b(5), kind: 'PAIEMENT', name: 'Dr Herbert', amount: '1 200 000', bg: K.blue, icon: <Banknote size={36} strokeWidth={2.6} />, x: 90, y: 820, ry: 12, rz: -7, exitX: -1300 },
  { at: b(6), kind: 'DÉPENSE', name: 'Transport Nadji', amount: '75 000', bg: '#B45309', icon: <Truck size={36} strokeWidth={2.6} />, x: 380, y: 640, ry: -14, rz: 8, exitX: 1400 },
];

export const S2 = ({ f }: { f: number }) => {
  if (f < 56 || f > 178) return null;
  // révélation en cercle depuis le « ? » du plan 1
  const r = t(f, 61, 72, 0, 1700, ease.in);
  const shuffle = t(f, b(8), b(8) + 18, 0, 1, ease.out); // le mélange démarre franchement sur « tout se »
  const exit = t(f, 160, 174, 0, 1, ease.in);
  return (
    <AbsoluteFill style={{ clipPath: `circle(${r}px at ${Q_X}px ${Q_Y}px)` }}>
      {/* le ciel s'efface en fin de plan pour laisser apparaître le plan 3 (même ciel : fondu invisible) */}
      <AbsoluteFill style={{ opacity: 1 - t(f, 164, 172) }}>
        <LiveSky f={f} />
      </AbsoluteFill>
      <BrandMark />
      <Abs x={M} y={200} style={{ transform: `translateY(${-exit * 80}px)`, opacity: 1 - exit }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {['AVANCES,', 'PAIEMENTS,', 'DÉPENSES…'].map((w, i) => (
            <span key={w} style={{ fontFamily: FF.head, fontWeight: 900, fontSize: 42, color: K.blue, opacity: t(f, CARDS[i].at, CARDS[i].at + 5), transform: `translateY(${(1 - t(f, CARDS[i].at, CARDS[i].at + 9)) * 20}px)`, display: 'inline-block' }}>{w}</span>
          ))}
        </div>
        <Line f={f} text="Tout se" size={120} at={b(8)} step={6} style={{ marginTop: 18 }} />
        {/* « mélange » : lettres espacées et floues qui se resserrent (interlettrage) */}
        <div style={{ fontFamily: FF.head, fontWeight: 900, fontSize: 120, lineHeight: 1, letterSpacing: `${-0.025 + (1 - t(f, b(9), b(9) + 12)) * 0.5}em`, color: K.orange, opacity: t(f, b(9), b(9) + 5), filter: `blur(${(1 - t(f, b(9), b(9) + 12)) * 10}px)`, whiteSpace: 'nowrap' }}>
          MÉLANGE<span style={{ color: K.navy }}>.</span>
        </div>
      </Abs>
      {CARDS.map((c, i) => {
        const p = sp(f, c.at, 'pose');
        const w = (f - b(8)) / 9;
        const dx = Math.sin(w + i * 2.1) * 170 * shuffle;
        const dy = Math.cos(w * 1.3 + i) * 110 * shuffle;
        const rot = Math.sin(w * 0.9 + i * 1.7) * 22 * shuffle;
        const ex = exit * c.exitX;
        const blur = Math.min(14, shuffle * 3 + exit * 14);
        return (
          <div
            key={c.kind}
            style={{
              position: 'absolute', left: c.x, top: c.y, opacity: t(f, c.at, c.at + 4),
              transform: `translate(${(1 - p) * 520 + dx + ex}px, ${(1 - p) * 640 + dy}px) perspective(1600px) rotateY(${c.ry}deg) rotateZ(${c.rz + (1 - p) * 28 + rot}deg)`,
              filter: `blur(${blur}px)`,
            }}
          >
            <MoneyCard kind={c.kind} name={c.name} amount={c.amount} bg={c.bg} icon={c.icon} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// S3 · Les questions (170 → 273) : la ligne pivote, badge « ? », roue de pastilles par crans (un cran par temps).
const LABELS = ['Dr Herbert : payé ?', 'Avance Mme Achta ?', 'Transport Nadji : réglé ?', 'Ferrailleur Rodric : 150 000 ?', 'Maçon Jean ?', 'Dr Herbert : 1 200 000 ?', 'Ets Abdelkerim : réglé ?', 'Avance Mme Achta : 500 000 ?', 'Ferrailleur Rodric ?', 'Maçon Jean : combien ?'];
const CX = 830, CY = 860;

export const S3 = ({ f }: { f: number }) => {
  if (f < 162 || f > 280) return null;
  const lineIn = t(f, 164, 174);
  const pivot = t(f, 172, 188, 90, 0, ease.inOut);
  const wipe = t(f, 260, 276, 0, 1, ease.in); // la ligne s'élargit jusqu'à couvrir l'écran (vers le plan 4)
  // roue : un cran (27°) par temps à partir de b(13), avec un ressort sur chaque cran ; accélère avant la sortie
  const start = b(13);
  const steps = f < start ? 0 : Math.floor((f - start) / BEAT);
  const frac = f < start ? 0 : sp(f, start + steps * BEAT, 'ferme');
  const rot = (steps + frac) * 27 + wipe * 160;
  const q1Out = t(f, b(16) - 6, b(16));
  return (
    <AbsoluteFill>
      <LiveSky f={f} />
      <BrandMark />
      <Abs x={M} y={200} style={{ opacity: 1 - q1Out, transform: `translateY(${-q1Out * 50}px)` }}>
        <Line f={f} text="Qui vous doit" size={92} at={b(12)} step={5} />
        <Line f={f} text="*encore* ?" size={92} at={b(12) + 14} step={5} />
      </Abs>
      {f >= b(16) - 2 && (
        <Abs x={M} y={200}>
          <Line f={f} text="Qui avez-vous" size={92} at={b(16)} step={5} />
          <Line f={f} text="*déjà* payé ?" size={92} at={b(16) + 12} step={5} />
        </Abs>
      )}
      <div style={{ position: 'absolute', left: M, top: 430, transform: `scale(${sp(f, b(17))})`, transformOrigin: '20% 100%' }}>
        <TagBubble bg={K.blue} style={{ left: 0, top: 0 }}>Combien ?</TagBubble>
      </div>
      {/* ligne marine : apparaît horizontale, pivote à la verticale, puis s'élargit en volet */}
      <div
        style={{
          position: 'absolute', left: CX - 4, top: CY - 320, width: 8, height: 640, background: K.navy,
          transform: `rotate(${pivot}deg) scaleY(${lineIn * (1 + wipe * 3)}) scaleX(${1 + wipe * 300})`, transformOrigin: '50% 50%',
        }}
      />
      {LABELS.map((txt, i) => {
        const ang = i * 27 - rot + 54; // les étiquettes montent du bas vers le haut
        if (ang < -45 || ang > 80) return null;
        const focus = Math.abs(ang) < 13.5;
        const appear = t(f, b(12) + i * 3, b(12) + i * 3 + 8);
        return (
          <div key={i} style={{ position: 'absolute', left: CX, top: CY, transform: `rotate(${ang}deg)`, transformOrigin: '0 0', opacity: (1 - Math.abs(ang) / 90) * appear * (1 - wipe) }}>
            <div style={{ position: 'absolute', right: 140, top: focus ? -42 : -34 }}>
              <StarPill size={focus ? 38 : 30} bg={focus ? K.navy : K.white} color={focus ? K.white : K.navy} star={focus ? K.orange : K.blue}>
                {txt}
              </StarPill>
            </div>
          </div>
        );
      })}
      <div style={{ opacity: 1 - wipe }}>
        <RingBadge size={170} ring={K.blue} style={{ left: CX - 85, top: CY - 85, transform: `scale(${sp(f, b(12))})` }}>
          <span style={{ fontFamily: FF.head, fontWeight: 900, fontSize: 110, color: K.white, lineHeight: 1 }}>?</span>
        </RingBadge>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// S4 · La tension (273 → 427) : bandeaux rouges en rafale, « L'argent, si. », « où » sur la coupure, convergence.
const AMOUNTS = ['−150 000', '−850 000', '−300 000', '−75 000', '−1 200 000', '−45 000', '−600 000', '−250 000', '−500 000', '−180 000', '−35 000', '−90 000'];
const SPOTS: [number, number][] = [[90, 110], [560, 150], [140, 290], [600, 330], [330, 440], [700, 470], [80, 940], [560, 920], [260, 1080], [640, 1110], [120, 1230], [600, 1230]];

const RedTag = ({ text, size }: { text: string; size: number }) => (
  <div style={{ background: `linear-gradient(180deg, ${K.red} 0%, ${K.redDeep} 140%)`, color: K.white, fontFamily: FF.num, fontWeight: 700, fontSize: size, padding: `${size * 0.32}px ${size * 0.7}px`, borderRadius: 10, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', border: '3px solid rgba(255,255,255,0.9)', boxShadow: '6px 10px 0 rgba(0,0,0,0.25), 8px 18px 22px rgba(0,0,0,0.3)' }}>
    {text} FCFA
  </div>
);

const Slam = ({ f, at, children, size, block }: { f: number; at: number; children: string; size: number; block?: boolean }) => {
  const p = sp(f, at, 'pose');
  return (
    <span style={{ position: 'relative', display: 'inline-block', opacity: t(f, at, at + 3), transform: `scale(${1.6 - 0.6 * p})`, transformOrigin: '20% 60%' }}>
      {block && <span style={{ position: 'absolute', left: -22, right: -22, top: 0, bottom: -10, background: K.red, transformOrigin: '0 50%', transform: `scaleX(${t(f, at, at + 8)})`, boxShadow: drop(0.5) }} />}
      <span style={{ position: 'relative', fontFamily: FF.head, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: '-0.025em', color: K.white }}>{children}</span>
    </span>
  );
};

export const S4 = ({ f }: { f: number }) => {
  if (f < 266 || f > 436) return null;
  const orbit = t(f, b(28), b(32), 0, 1, ease.in); // de la coupure au drop
  const converge = t(f, b(32) - 12, b(32), 0, 1, ease.in);
  const p4Out = t(f, 358, 366, 0, 1, ease.in);
  const p5Out = t(f, 412, 426, 0, 1, ease.in);
  return (
    <AbsoluteFill>
      <Navy />
      {AMOUNTS.map((a, i) => {
        const at = 276 + i * 6;
        const p = sp(f, at, 'pose');
        const [x0, y0] = SPOTS[i];
        // orbite autour du centre, qui accélère et se resserre jusqu'au drop
        const dx = x0 + 160 - 540, dy = y0 + 30 - 690;
        const ang = orbit * orbit * (2.4 + (i % 3) * 0.4) * Math.PI;
        const rad = 1 - converge;
        const x = 540 + (dx * Math.cos(ang) - dy * Math.sin(ang)) * rad - 160;
        const y = 690 + (dx * Math.sin(ang) + dy * Math.cos(ang)) * rad - 30;
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: y, transform: `rotate(${(random(`r${i}`) - 0.5) * 18 + (1 - p) * 30}deg) scale(${p * (1 - converge * 0.8)})`, filter: `blur(${orbit * 6 + converge * 10}px)`, opacity: 1 - converge * 0.6 }}>
            <RedTag text={a} size={30 + random(`s${i}`) * 14} />
          </div>
        );
      })}
      <Abs x={M} y={600} style={{ opacity: 1 - p4Out, transform: `translateY(${-p4Out * 70}px)` }}>
        <Line f={f} text="Le chantier n'est pas fini." size={50} at={278} step={6} color={K.white} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 30, marginTop: 26, paddingLeft: 22 }}>
          <Slam f={f} at={b(24)} size={124} block>L'ARGENT,</Slam>
          <Slam f={f} at={b(25)} size={124}>SI.</Slam>
        </div>
      </Abs>
      {f >= 362 && (
        <Abs x={0} y={560} style={{ width: 1080, opacity: 1 - p5Out, transform: `scale(${1 - p5Out * 0.6})` }}>
          <Line f={f} text="Et personne ne sait" size={60} at={363} step={4} color={K.white} align="center" />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <Slam f={f} at={b(28)} size={210} block>OÙ</Slam>
          </div>
          <Line f={f} text="il est passé." size={60} at={b(29)} step={5} color={K.white} align="center" style={{ marginTop: 28 }} />
        </Abs>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// S5 · Révélation (427 → 530) : flash sur le drop, logo qui pivote, nom, phrase dont l'écart se referme.
export const S5 = ({ f }: { f: number }) => {
  if (f < b(32) - 1 || f > 532) return null;
  const zoom = Math.pow(t(f, 514, 532, 0, 1, ease.in), 2);
  const fadeOut = t(f, 508, 518);
  const s0 = b(32);
  const pop = sp(f, s0, 'pose');
  const flash = t(f, s0, s0 + 10, 1, 0);
  const gapIn = t(f, b(36), b(36) + 8);
  const gap = t(f, b(36) + 6, b(36) + 36, 1, 0, ease.inOut);
  return (
    <AbsoluteFill>
      <Navy />
      <AbsoluteFill style={{ transform: `scale(${drift(f - s0, 110, 0.025)})` }}>
        <RingBadge size={360} bg={K.white} ring={K.blue} style={{ left: 540 - 180, top: 250, transform: `perspective(1200px) scale(${(0.25 + 0.75 * pop) * (1 + zoom * 16)}) rotateY(${t(f, s0, s0 + 18, 170, 0)}deg)` }}>
          <Img src={staticFile('logo.png')} style={{ width: 260, height: 260, borderRadius: 58 }} />
        </RingBadge>
        <Abs x={0} y={700} style={{ width: 1080, opacity: 1 - fadeOut }}>
          <Line f={f} text="Gestion *chantiers*" size={84} at={b(33)} step={Math.round(BEAT)} color={K.white} align="center" />
        </Abs>
        <Abs x={0} y={835} style={{ width: 1080, opacity: 1 - fadeOut }}>
          <div style={{ fontFamily: FF.head, fontWeight: 800, fontSize: 46, color: '#C9DCFF', textAlign: 'center', lineHeight: 1.2 }}>
            <div style={{ opacity: gapIn, transform: `translateX(${-gap * 240 - (1 - gapIn) * 200}px)`, filter: `blur(${(1 - gapIn) * 12}px)` }}>Entrées, sorties, dettes…</div>
            <div style={{ opacity: gapIn, transform: `translateX(${gap * 240 + (1 - gapIn) * 200}px)`, filter: `blur(${(1 - gapIn) * 12}px)` }}>
              enfin au <span style={{ color: K.white, fontWeight: 900 }}>même endroit</span>.
            </div>
          </div>
        </Abs>
        <div style={{ position: 'absolute', left: 120, right: 120, top: 1060, height: 4, transformOrigin: '50% 50%', transform: `scaleX(${t(f, b(36), b(36) + 20)})`, opacity: 1 - fadeOut, background: 'linear-gradient(90deg, rgba(255,255,255,0), #FFFFFF 30%, #FFFFFF 70%, rgba(255,255,255,0))' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: '#FFFFFF', opacity: flash }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Effets sonores calés sur l'image (voir STORYBOARD.md § effets sonores).
export const SFX1: [number, string, number][] = [
  [2, 'whoosh', 0.35], [b(1) - 2, 'tick', 0.35], [b(2) - 2, 'pop', 0.4],
  [56, 'whoosh', 0.5],
  [b(4), 'pop', 0.4], [b(5), 'pop', 0.4], [b(6), 'pop', 0.4], [b(8), 'swoosh', 0.45], [b(9), 'tick', 0.35], [158, 'whoosh', 0.5],
  ...Array.from({ length: 7 }, (_, i) => [b(13) + Math.round(i * BEAT), 'tick', 0.22] as [number, string, number]),
  [b(12), 'pop', 0.4], [b(17), 'pop', 0.35], [256, 'whoosh-long', 0.5],
  ...Array.from({ length: 12 }, (_, i) => [276 + i * 6, 'pop', 0.18] as [number, string, number]),
  [b(24), 'impact', 0.55], [b(28), 'impact', 0.4], [b(28), 'riser', 0.45],
  [b(32), 'impact', 0.7], [b(32) - 6, 'whoosh-long', 0.45], [b(33), 'tick', 0.35], [b(34), 'tick', 0.35], [b(36), 'swoosh', 0.4],
];

export const Part1 = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: K.navy }}>
      <S4 f={f} />
      <S3 f={f} />
      <S1 f={f} />
      <S2 f={f} />
      <S5 f={f} />
      <Audio src={staticFile('musique.mp3')} trimBefore={36} volume={0.75} />
      {SFX1.map(([at, name, vol], i) => (
        <Sequence key={i} from={at}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
