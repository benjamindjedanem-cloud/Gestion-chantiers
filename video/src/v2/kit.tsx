// Direction artistique v2 « Le plan de chantier » : papier d'architecte bleu nuit, quadrillage technique,
// annotations au feutre orange (couleur du casque du logo), règle graduée, objets réels.
import '@fontsource/caveat/500.css';
import '@fontsource/caveat/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';
import { fonts } from '../theme';

// Palette dérivée du logo (marine #002F83, bleu #006CD0, casque #FC9605).
export const P = {
  ink: '#06122E',
  inkMid: '#0B1F4D',
  marine: '#002F83',
  blue: '#1D4ED8',
  blueLight: '#8FB2FF',
  line: 'rgba(170,196,255,0.075)',
  lineMajor: 'rgba(170,196,255,0.14)',
  paper: '#F3EFE6',
  paperShade: '#E4DDCD',
  cream: '#F3EFE6', // texte sur fond sombre : blanc cassé, jamais blanc pur
  orange: '#FC9605',
  orangeDeep: '#E8700A',
  red: '#D7383B',
  green: '#1F9D6B',
  penBlue: '#203A8F',
};

export const F = {
  display: fonts.display,
  body: fonts.body,
  hand: "'Caveat', cursive",
  mono: "'IBM Plex Mono', monospace",
};

// Grain : bruit fractal SVG (texture organique, pas un motif répété).
const noise = (freq: number, opacity: number) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 ${opacity} 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
  )}")`;

export const Grain = ({ opacity = 0.5, freq = 0.85, blend = 'overlay' }: { opacity?: number; freq?: number; blend?: CSSProperties['mixBlendMode'] }) => (
  <AbsoluteFill style={{ backgroundImage: noise(freq, opacity), mixBlendMode: blend, pointerEvents: 'none' }} />
);

// Fond « papier d'architecte » : encre bleu nuit, quadrillage mineur/majeur, lumière unique en haut à gauche, vignettage.
export const Blueprint = ({ light = 1, grid = 1 }: { light?: number; grid?: number }) => (
  <AbsoluteFill style={{ background: `linear-gradient(165deg, ${P.inkMid} 0%, ${P.ink} 55%, #040B1F 100%)` }}>
    <AbsoluteFill
      style={{
        opacity: grid,
        backgroundImage: [
          `linear-gradient(${P.lineMajor} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${P.lineMajor} 1px, transparent 1px)`,
          `linear-gradient(${P.line} 1px, transparent 1px)`,
          `linear-gradient(90deg, ${P.line} 1px, transparent 1px)`,
        ].join(','),
        backgroundSize: '135px 135px, 135px 135px, 27px 27px, 27px 27px',
        backgroundPosition: '-1px -1px',
      }}
    />
    <AbsoluteFill style={{ opacity: light, background: 'radial-gradient(ellipse 70% 55% at 18% 8%, rgba(143,178,255,0.20) 0%, rgba(143,178,255,0) 70%)' }} />
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)' }} />
    <Grain opacity={0.55} />
  </AbsoluteFill>
);

// Repères de coupe aux quatre coins (comme une épreuve d'imprimerie).
export const CropMarks = ({ inset = 44, size = 26, color = 'rgba(243,239,230,0.38)' }: { inset?: number; size?: number; color?: string }) => {
  const s: CSSProperties = { position: 'absolute', width: size, height: size, borderColor: color, borderStyle: 'solid', borderWidth: 0 };
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ ...s, left: inset, top: inset, borderLeftWidth: 1.5, borderTopWidth: 1.5 }} />
      <div style={{ ...s, right: inset, top: inset, borderRightWidth: 1.5, borderTopWidth: 1.5 }} />
      <div style={{ ...s, left: inset, bottom: inset, borderLeftWidth: 1.5, borderBottomWidth: 1.5 }} />
      <div style={{ ...s, right: inset, bottom: inset, borderRightWidth: 1.5, borderBottomWidth: 1.5 }} />
    </AbsoluteFill>
  );
};

// Petite légende technique en police mono.
export const Meta = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ fontFamily: F.mono, fontSize: 19, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(243,239,230,0.55)', ...style }}>{children}</div>
);

// Règle graduée / niveau laser : trait orange fin (seule source lumineuse), graduations et cotes.
export const Ruler = ({ y, from = 0, to = 1080, progress = 1 }: { y: number; from?: number; to?: number; progress?: number }) => {
  const ticks = [];
  for (let x = from; x <= to; x += 27) {
    const major = (x - from) % 135 === 0;
    ticks.push(
      <div key={x} style={{ position: 'absolute', left: x, top: y + 6, width: 1.5, height: major ? 22 : 10, background: 'rgba(243,239,230,0.45)' }} />,
    );
    if (major && x > from && x < to)
      ticks.push(
        <div key={`l${x}`} style={{ position: 'absolute', left: x + 6, top: y + 14, fontFamily: F.mono, fontSize: 14, color: 'rgba(243,239,230,0.45)' }}>
          {(x - from) / 27}
        </div>,
      );
  }
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute', left: from, top: y, height: 2.5, width: (to - from) * progress,
          background: P.orange, boxShadow: `0 0 12px ${P.orange}, 0 0 32px rgba(252,150,5,0.45)`,
        }}
      />
      {ticks}
    </AbsoluteFill>
  );
};

// Trait de feutre dessiné à la main (soulignement, cercle, rature, flèche).
export const Marker = ({
  d,
  width = 10,
  color = P.orange,
  style,
  viewBox = '0 0 400 60',
  w = 400,
  h = 60,
  progress = 1,
}: {
  d: string;
  width?: number;
  color?: string;
  style?: CSSProperties;
  viewBox?: string;
  w?: number;
  h?: number;
  progress?: number;
}) => (
  <svg width={w} height={h} viewBox={viewBox} style={{ overflow: 'visible', ...style }}>
    <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} opacity={0.95} />
    <path d={d} fill="none" stroke={color} strokeWidth={width * 0.35} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} opacity={0.5} transform="translate(2 3)" />
  </svg>
);

// Tracés de feutre prêts à l'emploi.
export const STROKES = {
  underline: 'M6 34 C 80 22, 170 30, 250 26 S 360 20, 394 30',
  underline2: 'M10 40 C 120 26, 250 36, 390 24',
  circle: 'M200 8 C 320 6, 392 24, 390 52 C 388 82, 300 98, 190 96 C 80 94, 8 78, 10 50 C 12 22, 90 6, 220 12',
  scribble: 'M10 40 C 60 0, 90 80, 140 30 S 220 70, 260 25 S 330 75, 390 30',
  cross: 'M10 10 L 390 50 M 20 52 L 380 8',
};

// Typographie titre : serrée, grands contrastes d'échelle, alignée à gauche.
export const Title = ({ children, size, color = P.cream, style }: { children: ReactNode; size: number; color?: string; style?: CSSProperties }) => (
  <div style={{ fontFamily: F.display, fontWeight: 700, fontSize: size, lineHeight: 0.92, letterSpacing: '-0.045em', color, ...style }}>{children}</div>
);
