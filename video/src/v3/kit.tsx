// Direction artistique v3 « affiche pro BTP » — inspirée des affiches de référence de Benjamin :
// fonds clairs (ciel) ou blocs marine nets, titres très gras en majuscules bicolores, formes vectorielles
// pleines (bulle, pastilles, drapeau, bandeau, badge à anneau), silhouette de chantier orange, ombres franches.
// Aucune lueur néon, aucun verre dépoli.
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { fonts } from '../theme';

// Couleurs du logo : marine #002F83, bleu #006CD0, casque orange #FC9605.
export const K = {
  navy: '#0A2A6E',
  navyDeep: '#061A47',
  marine: '#002F83',
  blue: '#1565D8',
  sky1: '#9FCBF2',
  sky2: '#D6EBFB',
  sky3: '#F4F9FE',
  orange: '#F7931E',
  orangeDeep: '#E26A00',
  red: '#D7263D',
  redDeep: '#A3162A',
  green: '#12A150',
  greenDeep: '#0B7A3B',
  ink: '#0E1730',
  white: '#FFFFFF',
};

export const FF = { head: "'Montserrat', sans-serif", body: fonts.body, num: fonts.display };

// Ombre portée franche et directionnelle (lumière en haut à gauche), comme sur un calque Photoshop.
export const drop = (k = 1) => `${6 * k}px ${10 * k}px ${0}px rgba(6,26,71,0.18), ${10 * k}px ${22 * k}px ${40 * k}px rgba(6,26,71,0.28)`;

// Ciel clair avec nuages doux (bruit très basse fréquence, flouté) et soleil en haut à droite.
const clouds = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1350'><filter id='c' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.004 0.009' numOctaves='4' seed='7'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.6 -0.75'/><feGaussianBlur stdDeviation='6'/></filter><rect width='100%' height='100%' filter='url(#c)'/></svg>",
)}")`;

export const Sky = ({ ground = true }: { ground?: boolean }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${K.sky1} 0%, ${K.sky2} 42%, ${K.sky3} 75%, #FFFFFF 100%)` }}>
    <AbsoluteFill style={{ backgroundImage: clouds, opacity: 0.85 }} />
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 86% 6%, rgba(255,246,214,0.95) 0%, rgba(255,246,214,0) 34%)' }} />
    {ground && <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0) 70%, rgba(255,255,255,0.7) 100%)' }} />}
  </AbsoluteFill>
);

// Fond marine plein, avec léger dégradé et motif de rayons discret optionnel.
export const Navy = ({ rays = false }: { rays?: boolean }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${K.navy} 0%, ${K.navyDeep} 100%)` }}>
    {rays && (
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from 0deg at 50% 40%, rgba(255,255,255,0.045) 0deg 9deg, rgba(255,255,255,0) 9deg 18deg)`,
        }}
      />
    )}
    <AbsoluteFill style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(21,101,216,0.35) 0%, rgba(21,101,216,0) 70%)' }} />
  </AbsoluteFill>
);

// Bloc marine en bas de l'écran (séparation nette ciel / marine, comme l'affiche JTECH).
export const NavyBand = ({ top }: { top: number }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top, bottom: 0, background: `linear-gradient(180deg, ${K.navy} 0%, ${K.navyDeep} 100%)` }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 10, background: K.orange }} />
  </div>
);

// Logo en haut à droite, comme sur toutes les affiches de référence.
export const BrandMark = ({ dark = false, style }: { dark?: boolean; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', right: 64, top: 56, display: 'flex', alignItems: 'center', gap: 16, ...style }}>
    <Img src={staticFile('logo.png')} style={{ width: 84, height: 84, borderRadius: 20, boxShadow: drop(0.4) }} />
    <div style={{ fontFamily: FF.head, fontWeight: 900, fontSize: 30, lineHeight: 0.95, color: dark ? K.white : K.navy, letterSpacing: '-0.01em' }}>
      GESTION
      <br />
      <span style={{ color: K.orange }}>CHANTIERS</span>
    </div>
  </div>
);

// Titre très gras en majuscules ; les mots entre astérisques passent en orange.
export const Head = ({ text, size, color = K.navy, accent = K.orange, style, align = 'left' }: { text: string; size: number; color?: string; accent?: string; style?: CSSProperties; align?: 'left' | 'center' }) => (
  <div style={{ fontFamily: FF.head, fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: '-0.025em', color, textTransform: 'uppercase', textAlign: align, ...style }}>
    {text.split(/(\*[^*]+\*)/).filter(Boolean).map((part, i) =>
      part.startsWith('*') ? <span key={i} style={{ color: accent }}>{part.slice(1, -1)}</span> : <span key={i}>{part}</span>,
    )}
  </div>
);

// Petite bulle de dialogue (« INTRODUCING » de l'affiche Ararat).
export const TagBubble = ({ children, bg = K.navy, color = K.white, style }: { children: ReactNode; bg?: string; color?: string; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', ...style }}>
    <div style={{ background: bg, color, fontFamily: FF.head, fontWeight: 800, fontSize: 26, letterSpacing: '0.06em', padding: '12px 26px', borderRadius: 14, textTransform: 'uppercase', boxShadow: drop(0.35) }}>
      {children}
    </div>
    <div style={{ position: 'absolute', left: '62%', bottom: -16, width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: `18px solid ${bg}` }} />
  </div>
);

// Pastille à puce étoile (liste de l'affiche Ararat).
export const StarPill = ({ children, bg = K.navy, color = K.white, star = K.orange, size = 34, style }: { children: ReactNode; bg?: string; color?: string; star?: string; size?: number; style?: CSSProperties }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.4, background: bg, color, fontFamily: FF.head, fontWeight: 800, fontSize: size, padding: `${size * 0.42}px ${size * 0.8}px`, borderRadius: size * 0.55, boxShadow: drop(0.35), whiteSpace: 'nowrap', ...style }}>
    <span style={{ color: star, fontSize: size * 0.8 }}>★</span>
    {children}
  </div>
);

// Drapeau orange découpé en pointe (affiche Ararat).
export const Banner = ({ children, bg = K.orange, color = K.navy, style, width = 700 }: { children: ReactNode; bg?: string; color?: string; style?: CSSProperties; width?: number }) => (
  <div style={{ position: 'absolute', width, filter: 'drop-shadow(8px 12px 0 rgba(6,26,71,0.18)) drop-shadow(10px 22px 30px rgba(6,26,71,0.25))', ...style }}>
    <div style={{ background: bg, color, padding: '30px 70px 30px 44px', clipPath: 'polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%)', fontFamily: FF.head, fontWeight: 800 }}>{children}</div>
  </div>
);

// Bandeau incliné (affiche Elephant), avec un pli au bout.
export const Ribbon = ({ children, bg = K.red, fold = K.redDeep, rotate = -6, style, size = 38 }: { children: ReactNode; bg?: string; fold?: string; rotate?: number; style?: CSSProperties; size?: number }) => (
  <div style={{ position: 'absolute', transform: `rotate(${rotate}deg)`, filter: 'drop-shadow(6px 10px 0 rgba(0,0,0,0.25)) drop-shadow(8px 18px 22px rgba(0,0,0,0.3))', ...style }}>
    <div style={{ position: 'absolute', right: -18, top: 12, bottom: -12, width: 40, background: fold, clipPath: 'polygon(0 0, 100% 0, 60% 50%, 100% 100%, 0 100%)' }} />
    <div style={{ position: 'relative', background: `linear-gradient(180deg, ${bg} 0%, ${fold} 140%)`, color: K.white, fontFamily: FF.num, fontWeight: 700, fontSize: size, padding: `${size * 0.32}px ${size * 0.7}px`, borderRadius: 10, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', border: '3px solid rgba(255,255,255,0.9)' }}>
      {children}
    </div>
  </div>
);

// Badge rond plein avec anneau fin décalé (« Phase 1 Launches Soon » de l'affiche Ararat).
export const RingBadge = ({ size, bg = K.navy, ring = K.orange, children, style }: { size: number; bg?: string; ring?: string; children: ReactNode; style?: CSSProperties }) => (
  <div style={{ position: 'absolute', width: size, height: size, ...style }}>
    <div style={{ position: 'absolute', inset: -size * 0.09, borderRadius: '50%', border: `3px solid ${ring}`, transform: `translate(${size * 0.06}px, ${-size * 0.04}px)` }} />
    <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: bg, boxShadow: drop(0.5), display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>{children}</div>
  </div>
);

// Silhouette de chantier orange : immeubles, bâtiment en construction avec échafaudage, grue.
export const ChantierSkyline = ({ width = 1080, color = K.orange, style }: { width?: number; color?: string; style?: CSSProperties }) => (
  <svg width={width} height={width * 0.42} viewBox="0 0 1080 454" style={{ display: 'block', ...style }}>
    <g fill={color}>
      {/* immeubles finis */}
      <rect x="30" y="250" width="120" height="204" />
      <rect x="160" y="170" width="95" height="284" />
      <rect x="265" y="300" width="110" height="154" />
      <rect x="740" y="210" width="110" height="244" />
      <rect x="860" y="280" width="90" height="174" />
      <rect x="960" y="190" width="100" height="264" />
      {/* bâtiment en construction : dalles + poteaux */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="420" y={420 - i * 62} width="270" height="12" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={`p${i}`} x={428 + i * 84} y="172" width="14" height="260" />
      ))}
      <rect x="0" y="440" width="1080" height="14" />
      {/* grue */}
      <rect x="600" y="30" width="16" height="400" />
      <rect x="380" y="30" width="420" height="14" />
      <rect x="780" y="44" width="40" height="40" />
      <rect x="470" y="44" width="3" height="120" />
      <rect x="455" y="164" width="34" height="18" />
    </g>
    {/* fenêtres découpées dans les immeubles finis */}
    <g fill="#FFFFFF" opacity="0.55">
      {[[50, 280], [95, 280], [50, 330], [95, 330], [50, 380], [95, 380], [180, 200], [215, 200], [180, 250], [215, 250], [180, 300], [215, 300], [180, 350], [215, 350], [760, 240], [800, 240], [760, 290], [800, 290], [760, 340], [800, 340], [980, 220], [1020, 220], [980, 270], [1020, 270], [980, 320], [1020, 320]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="22" height="28" />
      ))}
    </g>
    {/* treillis de la grue */}
    <g stroke="#FFFFFF" strokeWidth="2" opacity="0.6">
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={600} y1={50 + i * 32} x2={616} y2={66 + i * 32} />
      ))}
    </g>
  </svg>
);

// Cadre photo / visuel : bord blanc épais, coins arrondis, ombre franche (affiches JTECH et Elephant).
export const Frame = ({ children, style, border = 10, radius = 26 }: { children: ReactNode; style?: CSSProperties; border?: number; radius?: number }) => (
  <div style={{ position: 'absolute', background: K.white, padding: border, borderRadius: radius, boxShadow: drop(0.8), ...style }}>
    <div style={{ borderRadius: radius - border / 2, overflow: 'hidden', position: 'relative' }}>{children}</div>
  </div>
);
