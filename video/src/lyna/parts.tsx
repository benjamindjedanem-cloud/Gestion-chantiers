// Briques visuelles du spot Lyna-Transfert : titres fins mot à mot, carte d'Afrique, flèches du logo, téléphone.
import React, { useContext } from 'react';
import { Img, interpolate, staticFile } from 'remotion';
import { ease, sp, t } from '../anim/motion';
import geo from './afrique.json';
import { C, FONT } from './theme';

// Format 16:9 : titres dans la colonne de gauche, visuels (dessinés en coordonnées 9:16) dans <Vis> à droite.
export const Wide = React.createContext(false);
export const useWide = () => useContext(Wide);
export const Vis: React.FC<{ cx: number; cy: number; s: number; children: React.ReactNode }> = ({ cx, cy, s, children }) => {
  const wide = useWide();
  if (!wide) return <>{children}</>;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(${cx - 540 * s}px, ${540 - cy * s}px) scale(${s})` }}>
      {children}
    </div>
  );
};

export const MAP = geo as unknown as { width: number; height: number; countries: Record<string, string>; cities: Record<string, [number, number]> };
export const SAHEL = ['Mali', 'Burkina Faso', 'Niger', 'Chad', 'Central African Rep.']; // bande orange du logo

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// ---------- Titre : mots qui montent un par un, mot-clé en couleur (graisse moyenne, jamais très gras) ----------
type Line = { text: string; at: number };
export const Title: React.FC<{
  f: number;
  lines: Line[];
  out?: number;
  onGreen?: boolean;
  size?: number;
  top?: number;
  left?: number;
  align?: 'left' | 'center';
  width?: number;
  wtop?: number; // position en 16:9 (colonne de gauche)
  keep?: boolean; // 16:9 : garder la position 9:16 (titre dessiné dans un <Vis>)
}> = ({ f, lines, out = 99999, onGreen = false, size: size0 = 74, top: top0 = 250, left: left0 = 90, align = 'left', width: width0 = 860, wtop = 340, keep = false }) => {
  const wide = useWide() && !keep;
  const size = wide ? Math.min(size0, 64) : size0;
  const top = wide ? wtop : top0;
  const left = wide ? 140 : left0;
  const width = wide ? 840 : width0;
  const exit = t(f, out, out + 12, 0, 1, ease.in);
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width,
        textAlign: align,
        fontFamily: FONT.title,
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1.16,
        letterSpacing: -1.2,
        color: onGreen ? C.white : C.ink,
        transform: `translateY(${-50 * exit}px)`,
        opacity: 1 - exit,
      }}
    >
      {lines.map((ln, li) => {
        // *mot-clé* : graisse 600 + couleur ; ponctuation collée au mot
        const words = ln.text.split(' ').filter(Boolean);
        let inKey = false;
        return (
          <div key={li}>
            {words.map((w, i) => {
              const starts = w.startsWith('*');
              if (starts) inKey = true;
              const key = inKey;
              if (w.replace(/[.,…;!?]+$/, '').endsWith('*')) inKey = false;
              const clean = w.replace(/\*/g, '');
              const at = ln.at + i * 3;
              const p = t(f, at, at + 14);
              const o = t(f, at, at + 8);
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    marginRight: '0.26em',
                    transform: `translateY(${(1 - p) * 0.55 * size}px)`,
                    opacity: o,
                    filter: `blur(${(1 - o) * 6}px)`,
                    fontWeight: key ? 600 : 400,
                    color: key ? (onGreen ? C.white : C.orange) : undefined,
                    position: 'relative',
                  }}
                >
                  {clean}
                  {key && onGreen ? (
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: '-0.1em',
                        bottom: '0.02em',
                        height: '0.11em',
                        background: C.orange,
                        borderRadius: 4,
                        transformOrigin: 'left',
                        transform: `scaleX(${t(f, at + 8, at + 22)})`,
                      }}
                    />
                  ) : null}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// ---------- Carte d'Afrique (coordonnées 1000 × 1048) ----------
export const Afrique: React.FC<{
  fillOf: (name: string) => string;
  stroke: string;
  sw: number;
  children?: React.ReactNode;
}> = ({ fillOf, stroke, sw, children }) => (
  <svg width={MAP.width} height={MAP.height} viewBox={`0 0 ${MAP.width} ${MAP.height}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
    {Object.entries(MAP.countries).map(([name, d]) => (
      <path key={name} d={d} fill={fillOf(name)} stroke={stroke === 'same' ? fillOf(name) : stroke} strokeWidth={sw} strokeLinejoin="round" />
    ))}
    {children}
  </svg>
);

// Caméra sur la carte : le point (cx, cy) de la carte est posé au point (sx, sy) de l'écran, à l'échelle s.
export const Camera: React.FC<{ cx: number; cy: number; s: number; sx: number; sy: number; children: React.ReactNode }> = ({ cx, cy, s, sx, sy, children }) => (
  <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${sx - cx * s}px, ${sy - cy * s}px) scale(${s})` }}>
    {children}
  </div>
);

// Trajet en arc (pointillés qui se dessinent) entre deux points de la carte.
export const arcPath = (a: [number, number], b: [number, number], bend = 0.22) => {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const cx = mx + dy * bend;
  const cy = my - Math.abs(dx) * bend - Math.abs(dy) * 0.05;
  return { d: `M ${a[0]} ${a[1]} Q ${cx} ${cy} ${b[0]} ${b[1]}`, len: Math.hypot(dx, dy) * (1 + bend * 0.6) };
};

export const Route: React.FC<{ a: [number, number]; b: [number, number]; p: number; color: string; width: number; dash: number; bend?: number }> = ({ a, b, p, color, width, dash, bend }) => {
  const { d, len } = arcPath(a, b, bend);
  const id = `m${Math.round(a[0] + b[0] * 7 + b[1] * 13)}`;
  return (
    <g>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse">
          <path d={d} fill="none" stroke="#fff" strokeWidth={width * 3} strokeDasharray={`${len * p} ${len * 2}`} strokeLinecap="round" />
        </mask>
      </defs>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeDasharray={`${dash} ${dash * 0.8}`} strokeLinecap="round" mask={`url(#${id})`} />
    </g>
  );
};

// ---------- Flèches circulaires du logo (3 arcs + pointes), centrées sur (0, 0) ----------
const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)];
};
export const LogoArrows: React.FC<{ D: number; draw?: number; color?: string }> = ({ D, draw = 1, color = C.green }) => {
  const r = D * 0.45;
  const w = D * 0.075;
  return (
    <svg width={D} height={D} viewBox={`${-D / 2} ${-D / 2} ${D} ${D}`} style={{ position: 'absolute', left: -D / 2, top: -D / 2, overflow: 'visible' }}>
      {[0, 1, 2].map((i) => {
        const a0 = -56 + 120 * i;
        const body = 88 * Math.min(1, draw * 1.15);
        const e = a0 + body;
        const [x0, y0] = polar(r, a0);
        const [x1, y1] = polar(r, e);
        const head = interpolate(draw, [0.8, 1], [0, 1], clamp);
        const [bi0, bi1] = polar(r - w * 1.15, e);
        const [bo0, bo1] = polar(r + w * 1.15, e);
        const [tx, ty] = polar(r, e + 19 * head);
        return (
          <g key={i}>
            <path d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`} fill="none" stroke={color} strokeWidth={w} />
            {head > 0 ? <polygon points={`${bi0},${bi1} ${bo0},${bo1} ${tx},${ty}`} fill={color} /> : null}
          </g>
        );
      })}
    </svg>
  );
};

// Icône complète du logo (flèches + Afrique avec la bande orange), centrée sur (0, 0).
export const LogoIcon: React.FC<{ D: number; draw?: number; spin?: number }> = ({ D, draw = 1, spin = 0 }) => {
  const s = (D * 0.62) / MAP.height;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0 }}>
      <div style={{ position: 'absolute', transform: `rotate(${spin}deg)` }}>
        <LogoArrows D={D} draw={draw} />
      </div>
      <div style={{ position: 'absolute', transformOrigin: '0 0', transform: `translate(${-MAP.width * s * 0.5 + D * 0.015}px, ${-MAP.height * s * 0.5}px) scale(${s})` }}>
        <Afrique fillOf={(n) => (SAHEL.includes(n) ? C.orange : C.green)} stroke="same" sw={1.5 / s} />
      </div>
    </div>
  );
};

// Nom « Lyna-Transfert » et signature (images extraites du vrai logo).
export const Wordmark: React.FC<{ width: number; reveal?: number }> = ({ width, reveal = 1 }) => (
  <Img src={staticFile('lyna/wordmark.png')} style={{ width, display: 'block', clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }} />
);
export const Tagline: React.FC<{ width: number; reveal?: number }> = ({ width, reveal = 1 }) => (
  <Img src={staticFile('lyna/tagline.png')} style={{ width, display: 'block', clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }} />
);

// Pastille ronde blanche avec le logo (coin haut droit des plans de couleur).
export const LogoBadge: React.FC<{ f: number; at: number; x?: number; y?: number; size?: number }> = ({ f, at, x: x0, y: y0, size = 112 }) => {
  const wide = useWide();
  const x = x0 ?? (wide ? 200 : 930);
  const y = y0 ?? (wide ? 150 : 150);
  const s = sp(f, at, 'pose');
  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: size,
        background: C.white,
        boxShadow: '6px 10px 18px rgba(0,40,15,0.22)',
        transform: `scale(${s})`,
      }}
    >
      <div style={{ position: 'absolute', left: size / 2, top: size / 2 }}>
        <LogoIcon D={size * 0.8} spin={f * 0.6} />
      </div>
    </div>
  );
};

// ---------- Téléphone de face ----------
export const Phone: React.FC<{ w: number; children: React.ReactNode }> = ({ w, children }) => {
  const h = w * 2.06;
  return (
    <div style={{ position: 'relative', width: w, height: h, borderRadius: w * 0.15, background: '#0E1410', padding: w * 0.03, boxShadow: '18px 34px 50px rgba(10,40,20,0.28)' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: w * 0.125, overflow: 'hidden', background: C.green }}>
        {children}
        <div style={{ position: 'absolute', left: '50%', top: w * 0.035, width: w * 0.3, height: w * 0.075, marginLeft: -w * 0.15, borderRadius: w, background: '#0E1410' }} />
      </div>
    </div>
  );
};

// Notification sur l'écran verrouillé.
export const Notif: React.FC<{ title: string; text: React.ReactNode; when: string; w: number }> = ({ title, text, when, w }) => (
  <div
    style={{
      width: w,
      borderRadius: 34,
      background: 'rgba(255,255,255,0.96)',
      padding: '24px 26px',
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      boxShadow: '0 10px 24px rgba(0,40,15,0.18)',
      fontFamily: FONT.body,
    }}
  >
    <div style={{ position: 'relative', width: 70, height: 70, borderRadius: 18, background: C.white, border: `2px solid ${C.greenPale}`, flexShrink: 0 }}>
      <div style={{ position: 'absolute', left: 35, top: 35 }}>
        <LogoIcon D={60} />
      </div>
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 25, color: C.inkSoft, fontWeight: 500 }}>
        <span>{title}</span>
        <span>{when}</span>
      </div>
      <div style={{ fontSize: 30, color: C.ink, marginTop: 4, lineHeight: 1.25 }}>{text}</div>
    </div>
  </div>
);
