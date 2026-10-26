// Briques visuelles du spot ADN Créatif : titres fins mot à mot, logo animable, téléphone, publications du fil.
import React from 'react';
import { Img, staticFile } from 'remotion';
import { ease, sp, t } from '../anim/motion';
import { C, FONT } from './theme';

// ---------- Titre : mots qui montent un par un ; *mot-clé* en graisse 600 + couleur ----------
type Line = { text: string; at: number };
export const Title: React.FC<{
  f: number;
  lines: Line[];
  out?: number;
  onBlue?: boolean;
  size?: number;
  top?: number;
  left?: number;
  width?: number;
  align?: 'left' | 'center';
}> = ({ f, lines, out = 99999, onBlue = false, size = 74, top = 230, left = 90, width = 860, align = 'left' }) => {
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
        color: onBlue ? C.white : C.ink,
        transform: `translateY(${-50 * exit}px)`,
        opacity: 1 - exit,
      }}
    >
      {lines.map((ln, li) => {
        const words = ln.text.split(' ').filter(Boolean);
        let inKey = false;
        return (
          <div key={li}>
            {words.map((w, i) => {
              if (w.startsWith('*')) inKey = true;
              const key = inKey;
              if (w.replace(/[.,…;!?]+$/, '').endsWith('*')) inKey = false;
              const at = ln.at + i * 3;
              const p = t(f, at, at + 14);
              const o = t(f, at, at + 8);
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    marginRight: '0.26em',
                    position: 'relative',
                    transform: `translateY(${(1 - p) * 0.55 * size}px)`,
                    opacity: o,
                    filter: `blur(${(1 - o) * 6}px)`,
                    fontWeight: key ? 600 : 400,
                    color: key ? (onBlue ? C.white : C.blue) : undefined,
                  }}
                >
                  {w.replace(/\*/g, '')}
                  {key ? (
                    // le trait jaune du logo souligne le mot-clé
                    <span
                      style={{
                        position: 'absolute',
                        left: '-0.04em',
                        right: '-0.04em',
                        bottom: '0.04em',
                        height: '0.12em',
                        background: C.yellow,
                        borderRadius: 3,
                        transform: `skewX(-18deg) scaleX(${t(f, at + 8, at + 20)})`,
                        transformOrigin: 'left',
                        zIndex: -1,
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

// ---------- Logo : le « A » blanc et le trait jaune, animables séparément ----------
// Image source 959 × 951 ; size = largeur affichée ; centré sur (0, 0).
export const Logo: React.FC<{ size: number; a?: number; trait?: number; spin?: number }> = ({ size, a = 1, trait = 1, spin = 0 }) => {
  const h = (size * 951) / 959;
  return (
    <div style={{ position: 'absolute', left: -size / 2, top: -h / 2, width: size, height: h, transform: `rotate(${spin}deg)` }}>
      <Img
        src={staticFile('adn/logo-a.png')}
        style={{ position: 'absolute', width: size, height: h, clipPath: `inset(${(1 - a) * 100}% 0 0 0)`, transform: `translateY(${(1 - a) * 40}px)` }}
      />
      <Img
        src={staticFile('adn/logo-trait.png')}
        style={{ position: 'absolute', width: size, height: h, opacity: Math.min(1, trait * 2), transform: `translate(${(1 - trait) * -size * 0.5}px, ${(1 - trait) * size * 0.35}px)` }}
      />
    </div>
  );
};

export const Wordmark: React.FC<{ f: number; at: number; size?: number; color?: string }> = ({ f, at, size = 92, color = C.white }) => (
  <div style={{ fontFamily: FONT.title, fontSize: size, letterSpacing: -2, color, whiteSpace: 'nowrap', display: 'flex', gap: '0.28em' }}>
    {['ADN', 'Créatif'].map((w, i) => {
      const p = t(f, at + i * 5, at + i * 5 + 16);
      return (
        <span key={w} style={{ display: 'inline-block', fontWeight: i === 0 ? 600 : 300, transform: `translateY(${(1 - p) * 40}px)`, opacity: p, filter: `blur(${(1 - p) * 6}px)` }}>
          {w}
        </span>
      );
    })}
  </div>
);

// ---------- Téléphone de face ----------
export const Phone: React.FC<{ w: number; bg?: string; children: React.ReactNode }> = ({ w, bg = C.white, children }) => {
  const h = w * 2.06;
  return (
    <div style={{ position: 'relative', width: w, height: h, borderRadius: w * 0.15, background: '#0D0F1E', padding: w * 0.03, boxShadow: '18px 34px 50px rgba(5,8,60,0.28)' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: w * 0.125, overflow: 'hidden', background: bg }}>
        {children}
        <div style={{ position: 'absolute', left: '50%', top: w * 0.035, width: w * 0.3, height: w * 0.075, marginLeft: -w * 0.15, borderRadius: w, background: '#0D0F1E' }} />
      </div>
    </div>
  );
};

// Doigt stylisé (cercle de contact + ombre) pour les gestes.
export const Touch: React.FC<{ x: number; y: number; press: number; visible?: number }> = ({ x, y, press, visible = 1 }) => (
  <div style={{ position: 'absolute', left: x - 50, top: y - 50, width: 100, height: 100, opacity: visible }}>
    <div style={{ position: 'absolute', inset: 0, borderRadius: 100, background: 'rgba(10,16,200,0.18)', transform: `scale(${1 + press * 0.5})`, opacity: 1 - press * 0.6 }} />
    <div style={{ position: 'absolute', left: 22, top: 22, width: 56, height: 56, borderRadius: 56, background: 'rgba(255,255,255,0.92)', border: `4px solid ${C.blue}`, transform: `scale(${1 - press * 0.15})`, boxShadow: '0 6px 14px rgba(5,8,60,0.25)' }} />
  </div>
);

// ---------- Publications du fil (marques fictives) ----------
export type PostKind = 'fade1' | 'fade2' | 'fade3' | 'fade4' | 'adn';
const AVATAR: Record<PostKind, [string, string]> = {
  fade1: ['#C9CBD6', 'Boutique Mila'],
  fade2: ['#D8CFC4', 'Resto Chez Ama'],
  fade3: ['#C4D3CC', 'Salon Élégance'],
  fade4: ['#D2C9D6', 'Auto Pièces Plus'],
  adn: [C.blue, 'Boutique Mila'],
};
export const POST_H = 820;
export const Post: React.FC<{ kind: PostKind; w: number; children?: React.ReactNode }> = ({ kind, w, children }) => {
  const [col, name] = AVATAR[kind];
  return (
    <div style={{ width: w, height: POST_H, background: C.white, fontFamily: FONT.body, borderBottom: `10px solid ${C.paper}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '22px 26px' }}>
        <div style={{ width: 58, height: 58, borderRadius: 58, background: col }} />
        <div>
          <div style={{ fontSize: 26, fontWeight: 500, color: C.ink }}>{name}</div>
          <div style={{ fontSize: 20, color: C.inkSoft }}>Sponsorisé</div>
        </div>
      </div>
      <div style={{ position: 'relative', width: w, height: w, overflow: 'hidden' }}>{children ?? <FadePoster kind={kind} w={w} />}</div>
      <div style={{ display: 'flex', gap: 30, padding: '22px 28px' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 40, height: 40, borderRadius: 12, border: `3px solid ${C.line}` }} />
        ))}
      </div>
    </div>
  );
};

// Visuels « ordinaires » : sans hiérarchie, couleurs ternes — ceux qu'on fait défiler.
const FadePoster: React.FC<{ kind: PostKind; w: number }> = ({ kind, w }) => {
  const d = {
    fade1: { bg: '#E7E7EA', txt: 'Promo du jour', sub: 'Venez nombreux, prix bas sur tout le magasin' },
    fade2: { bg: '#EFE8DF', txt: 'Nouveau menu', sub: 'Plats du jour, boissons, desserts, livraison possible' },
    fade3: { bg: '#E3ECE7', txt: 'Ouvert ce week-end', sub: 'Coiffure, tresses, manucure, sur rendez-vous' },
    fade4: { bg: '#ECE6EF', txt: 'Arrivage', sub: 'Pièces détachées toutes marques' },
    adn: { bg: '#fff', txt: '', sub: '' },
  }[kind];
  return (
    <div style={{ position: 'absolute', inset: 0, background: d.bg, padding: w * 0.08, fontFamily: FONT.body, color: '#6B6E7A' }}>
      <div style={{ fontSize: w * 0.075, fontWeight: 500 }}>{d.txt}</div>
      <div style={{ marginTop: 18, fontSize: w * 0.045, lineHeight: 1.35 }}>{d.sub}</div>
      <div style={{ position: 'absolute', left: w * 0.08, right: w * 0.08, bottom: w * 0.08, height: w * 0.42, borderRadius: 16, background: 'rgba(0,0,0,0.06)' }} />
    </div>
  );
};
