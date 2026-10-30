// Scènes du spot ADN Créatif (9:16), v2 : vraies réalisations + typographie, aucune illustration dessinée (R-VISUELS).
// Styles : REF-09 (logo en couches avec reflet, traînées de couleur, mot géant, roue de mots),
// REF-10 (barre de recherche, sphère → logo, services en accordéon, forme qui se transforme).
import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile } from 'remotion';
import { ArrowRight, Check, Facebook, Instagram, Linkedin, MessageCircle, Search } from 'lucide-react';
import { ease, sp, t } from '../anim/motion';
import { Logo, Phone, Title, Touch } from './parts';
import { BLUE_BG, C, CUT, END, FONT, H, W, v } from './theme';

type P = { f: number };
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// ---------- Outils ----------
// Texte tapé lettre par lettre (REF-10), 1 caractère toutes les `step` images, curseur pendant la frappe.
export const Typed: React.FC<{ f: number; at: number; text: string; step?: number; caret?: boolean }> = ({ f, at, text, step = 1.6, caret = true }) => {
  const n = Math.max(0, Math.min(text.length, Math.floor((f - at) / step)));
  const typing = f >= at && n < text.length;
  return (
    <span>
      {text.slice(0, n)}
      {caret && (typing || (f >= at && f < at + text.length * step + 20 && Math.floor(f / 8) % 2 === 0)) ? <span style={{ opacity: 0.8 }}>|</span> : null}
    </span>
  );
};

// Traînées de couleur (REF-09) : bandes inclinées qui traversent l'écran ; la grande bande couvre tout au milieu
// (image `at`), c'est là que la scène change en dessous.
export const Streaks: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  if (f < at - 12 || f > at + 12) return null;
  const bands = [
    { w: 220, c: C.yellow, d: -4 },
    { w: 120, c: C.white, d: -2 },
    { w: 2200, c: C.blue, d: 0 },
    { w: 160, c: C.yellow, d: 2 },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {bands.map((b, i) => {
        const p = interpolate(f, [at - 12 + b.d, at + 12 + b.d], [0, 1], { ...clamp, easing: ease.inOut });
        const x = interpolate(p, [0, 1], [-b.w - 900, W + 900]);
        return <div key={i} style={{ position: 'absolute', left: x, top: -400, width: b.w, height: H + 800, background: b.c, transform: 'rotate(18deg)', filter: `blur(${i === 2 ? 0 : 18}px)` }} />;
      })}
    </AbsoluteFill>
  );
};

// Cercle qui grandit depuis le centre (REF-10) : révèle la scène qu'il contient.
const circle = (p: number, x = 540, y = 960) => (p < 1 ? `circle(${p * 1400}px at ${x}px ${y}px)` : undefined);

// Reflet lumineux qui balaie le logo (REF-09), masqué par la forme du logo.
const Glint: React.FC<{ f: number; at: number; size: number }> = ({ f, at, size }) => {
  const p = t(f, at, at + 14, 0, 1, ease.inOut);
  if (p <= 0 || p >= 1) return null;
  const h = (size * 951) / 959;
  const mask = `url(${staticFile('adn/logo.png')})`;
  return (
    <div style={{ position: 'absolute', left: -size / 2, top: -h / 2, width: size, height: h, WebkitMaskImage: mask, maskImage: mask, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -h * 0.2, left: interpolate(p, [0, 1], [-size * 0.4, size * 1.2]), width: size * 0.16, height: h * 1.4, background: 'rgba(255,255,255,0.85)', transform: 'rotate(25deg)', filter: 'blur(6px)' }} />
    </div>
  );
};

const Sparkle: React.FC<{ f: number; at: number; x: number; y: number; s?: number }> = ({ f, at, x, y, s = 60 }) => {
  const k = interpolate(f, [at, at + 5, at + 12], [0, 1, 0], clamp);
  if (k <= 0) return null;
  return (
    <svg width={s} height={s} viewBox="-10 -10 20 20" style={{ position: 'absolute', left: x - s / 2, top: y - s / 2, transform: `scale(${k}) rotate(${k * 45}deg)` }}>
      <path d="M0 -10 Q 1 -1 10 0 Q 1 1 0 10 Q -1 1 -10 0 Q -1 -1 0 -10 Z" fill={C.white} />
    </svg>
  );
};

// Logo révélé en couches : sphère → « A » → trait jaune qui glisse → étincelle → reflet (REF-09 + REF-10).
const LogoReveal: React.FC<{ f: number; at: number; size: number }> = ({ f, at, size }) => {
  const sphere = t(f, at - 10, at, 0, 1, ease.out) * (1 - t(f, at + 2, at + 10));
  const a = t(f, at, at + 14, 0, 1, ease.out);
  const tr = t(f, at + 8, at + 20, 0, 1, ease.out);
  return (
    <div style={{ position: 'absolute' }}>
      <div style={{ position: 'absolute', left: -size * 0.32, top: -size * 0.32, width: size * 0.64, height: size * 0.64, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, #FFFFFF, ${C.blueSoft})`, transform: `scale(${sphere})`, opacity: sphere }} />
      <div style={{ transform: `scale(${0.8 + 0.2 * a})`, opacity: a }}>
        <Logo size={size} a={a} trait={tr} />
        <Glint f={f} at={at + 22} size={size} />
      </div>
      <Sparkle f={f} at={at + 18} x={size * 0.42} y={-size * 0.4} />
    </div>
  );
};

// Nom « ADN Créatif » tapé (REF-10).
const Name: React.FC<{ f: number; at: number; size?: number; color?: string }> = ({ f, at, size = 96, color = C.white }) => (
  <div style={{ fontFamily: FONT.title, fontSize: size, letterSpacing: -2, color, whiteSpace: 'nowrap' }}>
    <span style={{ fontWeight: 600 }}>
      <Typed f={f} at={at} text="ADN" step={2} caret={false} />
    </span>{' '}
    <span style={{ fontWeight: 300 }}>
      <Typed f={f} at={at + 7} text="Créatif" step={2} />
    </span>
  </div>
);

// Publication du fil : photo réelle floutée (contenu indistinct, qu'on fait défiler) ou vraie réalisation ADN.
const POST_H = 820;
const FeedPost: React.FC<{ w: number; img?: string; children?: React.ReactNode }> = ({ w, img, children }) => (
  <div style={{ width: w, height: POST_H, background: C.white, borderBottom: `10px solid ${C.paper}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '22px 26px' }}>
      <div style={{ width: 58, height: 58, borderRadius: 58, background: C.line }} />
      <div>
        <div style={{ width: 190, height: 18, borderRadius: 9, background: C.line }} />
        <div style={{ width: 110, height: 14, borderRadius: 7, background: C.line, marginTop: 10 }} />
      </div>
    </div>
    <div style={{ position: 'relative', width: w, height: w, overflow: 'hidden', background: C.line }}>
      {children ?? <Img src={staticFile(img!)} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(14px) saturate(0.55) brightness(1.08)', transform: 'scale(1.15)' }} />}
    </div>
    <div style={{ display: 'flex', gap: 30, padding: '22px 28px' }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 40, height: 40, borderRadius: 12, border: `3px solid ${C.line}` }} />
      ))}
    </div>
  </div>
);

// ================= S1 · « Trois secondes. » — typographie seule =================
export const S1: React.FC<P> = ({ f }) => {
  if (f > CUT.feed + 2) return null;
  const k = sp(f, 2, 'pose');
  return (
    <AbsoluteFill style={{ background: BLUE_BG }}>
      <div style={{ position: 'absolute', left: 0, top: 380, width: W, height: 900, overflow: 'hidden', textAlign: 'center', fontFamily: FONT.title, fontWeight: 600, fontSize: 900, lineHeight: '900px', color: C.white, letterSpacing: -30 }}>
        <div style={{ transform: `translateY(${(1 - k) * 900}px)` }}>3</div>
      </div>
      {/* trait jaune du logo qui passe sous le chiffre */}
      <div style={{ position: 'absolute', left: 300, top: 1230, width: 480 * t(f, 10, 24, 0, 1, ease.out), height: 34, background: C.yellow, transform: 'skewX(-24deg)' }} />
      <div style={{ position: 'absolute', left: 0, top: 1330, width: W, textAlign: 'center', fontFamily: FONT.title, fontWeight: 500, fontSize: 64, letterSpacing: '0.32em', color: C.white }}>
        <Typed f={f} at={v(0.2)} text="SECONDES" step={1.6} caret={false} />
      </div>
    </AbsoluteFill>
  );
};

// ================= S2 · le fil qui défile, s'arrête 3 s, puis passe (vraies photos floutées) =================
const FEED = ['feed-1.jpg', 'feed-4.jpg', 'feed-2.jpg', 'feed-5.jpg', 'feed-3.jpg', 'feed-6.jpg', 'feed-1.jpg', 'feed-4.jpg'];
const STOP_AT = 132;
const SKIP_AT = 192;
const feedY = (f: number) => {
  const stop = 3 * POST_H - 40;
  if (f < STOP_AT) return t(f, CUT.feed - 6, STOP_AT, 0, 1, ease.out) * stop;
  if (f < SKIP_AT) return stop;
  return stop + t(f, SKIP_AT, SKIP_AT + 20, 0, 1, ease.inOut) * POST_H * 1.6 + Math.max(0, f - SKIP_AT - 20) * 14;
};

export const S2: React.FC<P> = ({ f }) => {
  if (f < CUT.feed - 2 || f > CUT.question + 2) return null;
  const pw = 680;
  const sw = pw * 0.94;
  const y = feedY(f);
  const vel = Math.abs(feedY(f + 1) - feedY(f));
  const timer = t(f, STOP_AT + 4, SKIP_AT, 0, 1, (x) => x);
  const swipe = t(f, SKIP_AT - 4, SKIP_AT + 8);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Title f={f} top={200} size={72} out={SKIP_AT - 8} lines={[{ text: "C'est le temps qu'il faut", at: v(1.45) }, { text: 'pour *s’arrêter*…', at: STOP_AT - 8 }]} />
      <Title f={f} top={200} size={72} lines={[{ text: '…ou *passer*', at: SKIP_AT }, { text: 'à la suivante.', at: SKIP_AT + 12 }]} />
      <div style={{ position: 'absolute', left: W / 2 - pw / 2, top: 520 + (1 - sp(f, CUT.feed - 4, 'doux')) * 900 }}>
        <Phone w={pw}>
          <div style={{ position: 'absolute', left: 0, top: 110 - y, filter: `blur(${Math.min(10, vel * 0.25)}px)` }}>
            {FEED.map((img, i) => (
              <FeedPost key={i} w={sw} img={`adn/${img}`} />
            ))}
          </div>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 110, background: C.white, borderBottom: `2px solid ${C.line}` }} />
          {f >= STOP_AT && f < SKIP_AT + 6 ? (
            <div style={{ position: 'absolute', right: 26, top: 150, display: 'flex', alignItems: 'center', gap: 10, background: C.ink, color: C.white, borderRadius: 40, padding: '10px 18px 10px 12px', fontFamily: FONT.title, fontWeight: 600, fontSize: 28, transform: `scale(${sp(f, STOP_AT, 'pose')})` }}>
              <svg width={36} height={36} viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={18} cy={18} r={14} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={5} />
                <circle cx={18} cy={18} r={14} fill="none" stroke={C.yellow} strokeWidth={5} strokeDasharray={`${88 * (1 - timer)} 88`} />
              </svg>
              {Math.max(0, 3 - Math.floor(timer * 3))} s
            </div>
          ) : null}
        </Phone>
        <Touch x={pw / 2 + 60} y={1100 - swipe * 420} press={f >= STOP_AT && f < SKIP_AT ? 1 : swipe} visible={t(f, CUT.feed, CUT.feed + 8) * (1 - t(f, SKIP_AT + 10, SKIP_AT + 16))} />
      </div>
    </AbsoluteFill>
  );
};

// ================= S3 · « Alors, que voit-il en ces trois secondes ? » — barre de recherche (REF-10) =================
export const S3: React.FC<P> = ({ f }) => {
  if (f < CUT.question - 2 || f > CUT.logo + 2) return null;
  const a = CUT.question + 4;
  const dot = sp(f, a, 'pose');
  const bar = t(f, a + 6, a + 18, 0, 1, ease.out);
  const toSphere = t(f, CUT.logo - 14, CUT.logo - 2, 0, 1, ease.inOut); // la barre se referme en sphère → logo
  const bw = interpolate(bar, [0, 1], [120, 900]) * (1 - toSphere) + 230 * toSphere;
  const bh = 120 + 110 * toSphere;
  return (
    <AbsoluteFill style={{ background: BLUE_BG }}>
      <div style={{ position: 'absolute', left: 540 - bw / 2, top: 760 - bh / 2, width: bw, height: bh, borderRadius: bh, background: C.white, transform: `scale(${dot})`, boxShadow: '0 20px 50px rgba(0,0,40,0.35)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ flex: 1, padding: '0 44px', fontFamily: FONT.body, fontSize: 46, color: C.ink, whiteSpace: 'nowrap', opacity: 1 - toSphere }}>
          <Typed f={f} at={v(7.85)} text="Que voit-il en 3 secondes ?" step={1.9} />
        </div>
        <div style={{ width: 96, height: 96, margin: 12, borderRadius: 96, background: C.blue, display: 'grid', placeItems: 'center', flexShrink: 0, opacity: 1 - toSphere }}>
          <Search size={46} color={C.white} strokeWidth={2.4} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 920, width: W, textAlign: 'center', fontFamily: FONT.title, fontWeight: 500, fontSize: 30, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.7)', opacity: t(f, a + 20, a + 30) * (1 - toSphere) }}>
          VOTRE CLIENT · 3 SECONDES
      </div>
    </AbsoluteFill>
  );
};

// ================= S4 · « Chez ADN Créatif, nous fabriquons ces trois secondes… faire arrêter votre potentiel client. » =================
const BUILD = v(12.2);
const HOLD = v(14.4);
export const S4: React.FC<P> = ({ f }) => {
  if (f < CUT.logo - 12 || f > CUT.services + 2) return null;
  const up = t(f, BUILD - 14, BUILD + 4, 0, 1, ease.inOut);
  const phoneIn = sp(f, HOLD - 18, 'doux');
  const hold = sp(f, HOLD, 'pose');
  const pw = 600;
  return (
    <AbsoluteFill style={{ background: BLUE_BG }}>
      <div style={{ position: 'absolute', left: interpolate(up, [0, 1], [540, 150]), top: interpolate(up, [0, 1], [760, 190]), transform: `scale(${interpolate(up, [0, 1], [1, 0.34])})` }}>
        <LogoReveal f={f} at={CUT.logo} size={460} />
      </div>
      <div style={{ position: 'absolute', left: interpolate(up, [0, 1], [540 - 300, 240]), top: interpolate(up, [0, 1], [1060, 145]), transform: `scale(${interpolate(up, [0, 1], [1, 0.8])})`, transformOrigin: 'left top' }}>
        <Name f={f} at={CUT.logo + 12} size={100} />
      </div>
      {/* mot géant (REF-09) : « 3 SECONDES » qu'on fabrique */}
      <div style={{ position: 'absolute', left: 90, top: 340, fontFamily: FONT.title, color: C.white, opacity: 1 - t(f, HOLD - 16, HOLD - 6) }}>
        <div style={{ fontSize: 56, fontWeight: 400 }}>
          <Typed f={f} at={BUILD} text="On fabrique ces" step={1.4} caret={false} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 26, marginTop: 10 }}>
          <span style={{ fontSize: 330, fontWeight: 600, lineHeight: 1, display: 'inline-block', transform: `translateY(${(1 - sp(f, BUILD + 20, 'pose')) * 200}px)`, opacity: t(f, BUILD + 20, BUILD + 26) }}>3</span>
          <span style={{ fontSize: 110, fontWeight: 600, letterSpacing: -2, position: 'relative' }}>
            <Typed f={f} at={BUILD + 26} text="secondes" step={1.6} caret={false} />
            <span style={{ position: 'absolute', left: 0, bottom: 6, height: 14, width: `${t(f, BUILD + 36, BUILD + 50) * 100}%`, background: C.yellow, transform: 'skewX(-20deg)', zIndex: -1 }} />
          </span>
        </div>
      </div>
      {/* la vraie réalisation ADN dans le fil : le spot Gestion Chantiers arrête le pouce */}
      <div style={{ position: 'absolute', left: W / 2 - pw / 2, top: 560 + (1 - phoneIn) * 1500 }}>
        <Phone w={pw}>
          <div style={{ position: 'absolute', left: 0, top: 110 }}>
            <FeedPost w={pw * 0.94}>
              {f >= HOLD - 20 ? <OffthreadVideo src={staticFile('adn/spot-gc.mp4')} startFrom={30} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div />}
            </FeedPost>
            <FeedPost w={pw * 0.94} img="adn/feed-2.jpg" />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 110, background: C.white, borderBottom: `2px solid ${C.line}` }} />
          <div style={{ position: 'absolute', right: 24, top: 140, display: 'flex', alignItems: 'center', gap: 10, background: C.yellow, color: C.ink, borderRadius: 40, padding: '10px 20px', fontFamily: FONT.title, fontWeight: 600, fontSize: 26, transform: `scale(${hold})` }}>
            <Check size={28} color={C.ink} strokeWidth={3} /> Arrêté
          </div>
        </Phone>
        <Touch x={pw / 2 + 40} y={900} press={hold} visible={t(f, HOLD - 10, HOLD)} />
      </div>
    </AbsoluteFill>
  );
};

// ================= S5 · services en accordéon (REF-10), rempli de vraies réalisations =================
const SVC = [
  { at: v(16.22), label: 'Visuels de communication' },
  { at: v(17.9), label: 'Spots publicitaires' },
  { at: v(19.2), label: 'Sites web' },
  { at: v(19.95), label: 'Sites web' }, // second site : parties sans le nom du client
];
const MORE = v(21.14);
const RECAP = v(19.4) + 30;

const Volet: React.FC<{ i: number; f: number }> = ({ i, f }) => {
  if (i === 0) {
    // affiches Gestion Chantiers qui se succèdent
    const imgs = ['gc-S1.jpg', 'gc-S4.jpg', 'gc-S10.jpg'];
    const k = Math.min(2, Math.max(0, Math.floor((f - SVC[0].at) / 16)));
    return (
      <AbsoluteFill>
        {imgs.map((src, j) => (
          <Img key={src} src={staticFile(`adn/${src}`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: j <= k ? 1 : 0, transform: `scale(${1 + 0.06 * (1 - t(f, SVC[0].at + j * 16, SVC[0].at + j * 16 + 14))})` }} />
        ))}
      </AbsoluteFill>
    );
  }
  if (i === 1) return <OffthreadVideo src={staticFile('adn/spot-lyna.mp4')} startFrom={20} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
  const s0 = SVC[i].at;
  const scroll = i === 2 ? interpolate(f, [s0 + 6, s0 + 22], [0, 700], { ...clamp, easing: ease.inOut }) : interpolate(f, [s0 + 6, s0 + 30, MORE, MORE + 20], [0, 560, 560, 1100], { ...clamp, easing: ease.inOut });
  return (
    <AbsoluteFill style={{ background: i === 3 ? '#1A0B26' : C.white, overflow: 'hidden' }}>
      <Img src={staticFile(i === 2 ? 'adn/site-immo.jpg' : 'adn/site-telecom.jpg')} style={{ position: 'absolute', left: '50%', width: 620, marginLeft: -310, top: -scroll }} />
    </AbsoluteFill>
  );
};

export const S5: React.FC<P> = ({ f }) => {
  if (f < CUT.services - 2 || f > CUT.achat + 2) return null;
  const p = t(f, CUT.services - 2, CUT.services + 16, 0, 1, ease.inOut);
  const idx = SVC.filter((s) => f >= s.at).length - 1;
  const eq = t(f, RECAP, RECAP + 16, 0, 1, ease.inOut);
  const cardIn = sp(f, CUT.services + 2, 'doux');
  const more = sp(f, MORE + 18, 'pose');
  const click = t(f, MORE + 34, MORE + 38) - t(f, MORE + 38, MORE + 46);
  const grow = SVC.map((_, i) => {
    const active = interpolate(f, [SVC[i].at - 4, SVC[i].at + 10], [0, 1], { ...clamp, easing: ease.inOut }) * (i < SVC.length - 1 ? 1 - interpolate(f, [SVC[i + 1].at - 4, SVC[i + 1].at + 10], [0, 1], { ...clamp, easing: ease.inOut }) : 1);
    return interpolate(eq, [0, 1], [0.35 + 4 * active, 1]);
  });
  return (
    <AbsoluteFill style={{ background: C.paper, clipPath: circle(p) }}>
      <Title f={f} top={190} size={68} out={RECAP - 16} lines={[{ text: 'Des *visuels*,', at: SVC[0].at }, { text: 'des *spots*', at: SVC[1].at }, { text: 'et des *sites*', at: SVC[2].at }]} />
      <Title f={f} top={190} size={68} lines={[{ text: 'qui *arrêtent le regard*', at: RECAP }, { text: 'et donnent envie', at: MORE }, { text: "d'en *savoir plus.*", at: MORE + 12 }]} />
      <div style={{ position: 'absolute', left: 70, top: 520, width: 940, height: 1000, transform: `translateY(${(1 - cardIn) * 1200}px) scale(${1 - eq * 0.12})`, display: 'flex', gap: 12, padding: 12, borderRadius: 40, background: C.white, boxShadow: '0 30px 60px -20px rgba(5,8,60,0.35)' }}>
        {SVC.map((s, i) => (
          <div key={i} style={{ flexGrow: grow[i], flexBasis: 0, position: 'relative', borderRadius: 28, overflow: 'hidden', background: C.line }}>
            <Volet i={i} f={f} />
          </div>
        ))}
      </div>
      {/* libellé du service actif, tapé sous la carte */}
      <div style={{ position: 'absolute', left: 0, top: 1560, width: W, textAlign: 'center', fontFamily: FONT.title, fontWeight: 500, fontSize: 46, color: C.ink, opacity: 1 - eq }}>
        {idx >= 0 ? <Typed f={f} at={SVC[Math.min(idx, 2)].at + 2} text={SVC[idx].label} step={1.2} /> : null}
      </div>
      <div style={{ position: 'absolute', left: 540, top: 1560, transform: `translate(-50%, 0) scale(${more * (1 - click * 0.08)})`, display: 'flex', alignItems: 'center', gap: 16, padding: '26px 48px', borderRadius: 70, background: C.blue, color: C.white, fontFamily: FONT.title, fontWeight: 600, fontSize: 42 }}>
        En savoir plus <ArrowRight size={42} color={C.yellow} />
      </div>
      <Touch x={720} y={1620} press={click} visible={t(f, MORE + 26, MORE + 32)} />
    </AbsoluteFill>
  );
};

// ================= S6 · « Parce qu'un client qui s'arrête est un client qui peut acheter. » — roue de mots =================
export const S6: React.FC<P> = ({ f }) => {
  if (f < CUT.achat - 2 || f > CUT.ecrire + 2) return null;
  const swap = v(24.7);
  const w1 = t(f, swap - 4, swap + 6, 0, 1, ease.in);
  const w2 = t(f, swap + 2, swap + 12, 0, 1, ease.out);
  const big = (txt: string, k: number, out: number) => (
    <div style={{ position: 'absolute', left: 0, top: 0, width: W, textAlign: 'center', transform: `translateY(${(1 - k) * 160 - out * 160}px)`, opacity: Math.min(k, 1 - out), filter: `blur(${(1 - k + out) * 10}px)` }}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{ background: BLUE_BG }}>
      <div style={{ position: 'absolute', left: 0, top: 640, width: W, textAlign: 'center', fontFamily: FONT.title, fontSize: 60, color: 'rgba(255,255,255,0.85)' }}>
        <Typed f={f} at={v(23.05)} text={f < swap ? 'Un client qui' : 'est un client qui'} step={1.4} caret={false} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 760, width: W, height: 260, fontFamily: FONT.title, fontWeight: 600, fontSize: 190, letterSpacing: -6, color: C.white, lineHeight: '220px' }}>
        {big('s’arrête', sp(f, v(23.6), 'pose'), w1)}
        {big('achète', w2, 0)}
      </div>
      <div style={{ position: 'absolute', left: 340, top: 1010, width: 400 * t(f, swap + 10, swap + 22, 0, 1, ease.out), height: 26, background: C.yellow, transform: 'skewX(-24deg)' }} />
    </AbsoluteFill>
  );
};

// ================= S7 · « Écrivez-nous maintenant sur nos différents réseaux sociaux. » — forme qui se transforme (REF-10) =================
const NETS = [
  { Icon: Facebook, r: '50%', rot: 0, bg: C.blue, fg: C.white },
  { Icon: Instagram, r: '32%', rot: 12, bg: C.white, fg: C.blue },
  { Icon: MessageCircle, r: '24%', rot: -8, bg: C.blue, fg: C.white },
  { Icon: Linkedin, r: '50%', rot: 0, bg: C.yellow, fg: C.ink },
];
export const S7: React.FC<P> = ({ f }) => {
  if (f < CUT.ecrire - 2 || f > CUT.fin + 2) return null;
  const p = t(f, CUT.ecrire - 2, CUT.ecrire + 16, 0, 1, ease.inOut);
  const start = v(27.2);
  const per = 13;
  const idx = Math.max(0, Math.min(NETS.length - 1, Math.floor((f - start) / per)));
  const k = t(f, start + idx * per, start + idx * per + 8, 0, 1, ease.out);
  const prev = NETS[Math.max(0, idx - 1)];
  const cur = NETS[idx];
  const pop = sp(f, start - 6, 'pose');
  const Icon = cur.Icon;
  return (
    <AbsoluteFill style={{ background: C.paper, clipPath: circle(p) }}>
      <Title f={f} top={300} left={0} width={W} align="center" size={80} lines={[{ text: 'Écrivez-nous', at: v(26.27) }, { text: '*maintenant.*', at: v(26.27) + 10 }]} />
      <div style={{ position: 'absolute', left: 540, top: 1000 }}>
        <div style={{ position: 'absolute', left: -170, top: -170, width: 340, height: 340, borderRadius: idx ? `${interpolate(k, [0, 1], [parseFloat(prev.r), parseFloat(cur.r)])}%` : cur.r, background: k < 0.5 && idx ? prev.bg : cur.bg, transform: `scale(${pop}) rotate(${interpolate(k, [0, 1], [prev.rot, cur.rot])}deg)`, display: 'grid', placeItems: 'center', boxShadow: '0 30px 60px -20px rgba(5,8,60,0.4)' }}>
          <div style={{ opacity: k, transform: `translateY(${(1 - k) * 30}px)`, filter: `blur(${(1 - k) * 6}px)` }}>
            <Icon size={150} color={cur.fg} strokeWidth={1.7} />
          </div>
        </div>
        <div style={{ position: 'absolute', left: -210, top: -210, width: 420, height: 420, borderRadius: '50%', border: `3px solid ${C.blue}`, opacity: 0.25 * pop }} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 1300, width: W, textAlign: 'center', fontFamily: FONT.title, fontWeight: 500, fontSize: 46, color: C.ink }}>
        <Typed f={f} at={v(27.0)} text="sur nos réseaux sociaux" step={1.3} />
      </div>
    </AbsoluteFill>
  );
};

// ================= S8 · « ADN Créatif. Le catalyseur de croissance. » =================
export const S8: React.FC<P> = ({ f }) => {
  if (f < CUT.fin - 2) return null;
  return (
    <AbsoluteFill style={{ background: BLUE_BG }}>
      <div style={{ position: 'absolute', left: 540, top: 720 }}>
        <LogoReveal f={f} at={CUT.fin + 4} size={460} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 1020, width: W, display: 'flex', justifyContent: 'center' }}>
        <Name f={f} at={CUT.fin + 12} size={104} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 1190, width: W, textAlign: 'center', fontFamily: FONT.title, fontWeight: 500, fontSize: 40, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.9)' }}>
        <Typed f={f} at={v(30.6)} text="LE CATALYSEUR DE CROISSANCE" step={1.2} caret={false} />
      </div>
      <div style={{ position: 'absolute', left: 540 - 130, top: 1270, width: 260 * t(f, v(31.5), v(32.0), 0, 1, ease.out), height: 12, background: C.yellow, transform: 'skewX(-24deg)' }} />
    </AbsoluteFill>
  );
};

export const ADN_END = END;
