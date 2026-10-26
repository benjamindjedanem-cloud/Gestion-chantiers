// Scènes du spot ADN Créatif (9:16), calées sur la voix off validée.
// Fil : les 3 secondes où un client décide de s'arrêter. Le fil défile (publications ternes), ADN fabrique la
// publication qui arrête le pouce. Alternance blanc ↔ bleu du logo, trait jaune du logo comme signature.
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { ArrowRight, Check, Facebook, Globe, Instagram, Linkedin, MessageCircle, Play, ShoppingBag, Eye } from 'lucide-react';
import { ease, sp, t } from '../anim/motion';
import { Logo, Phone, Post, POST_H, PostKind, Title, Touch, Wordmark } from './parts';
import { BLUE_BG, C, CUT, END, FONT, H, W, v } from './theme';

type P = { f: number };
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const sweepUp = (p: number) => {
  const y = H - p * (H + 600);
  return `polygon(0 ${y + 600}px, ${W}px ${y}px, ${W}px ${H}px, 0 ${H}px)`;
};
const sweepLeft = (p: number) => {
  const x0 = W - p * (W + 500);
  return `polygon(${x0}px 0, ${W}px 0, ${W}px ${H}px, ${x0 + 500}px ${H}px)`;
};
// Anneau blanc qui s'ouvre (REF-08) : le contenu apparaît dans le cercle, l'anneau en marque le bord.
const Ring: React.FC<{ p: number; x: number; y: number; color?: string }> = ({ p, x, y, color = C.white }) => {
  if (p <= 0 || p >= 1) return null;
  const r = p * 1500;
  return <div style={{ position: 'absolute', left: x - r - 70, top: y - r - 70, width: 2 * r + 140, height: 2 * r + 140, borderRadius: '50%', border: `70px solid ${color}`, boxShadow: '10px 16px 30px rgba(5,8,60,0.25)' }} />;
};

// ================= S1 · « Trois secondes. » =================
export const S1: React.FC<P> = ({ f }) => {
  if (f > CUT.feed + 8) return null;
  const pop = sp(f, 2, 'pose');
  const drain = t(f, 6, 90, 0, 1, (x) => x); // le compte à rebours s'écoule (linéaire, comme un vrai minuteur)
  const zoom = t(f, 48, 62, 0, 1, ease.in);
  const R = 300;
  const L = 2 * Math.PI * R;
  return (
    <AbsoluteFill style={{ background: BLUE_BG, transform: `scale(${1 + zoom * 5})`, opacity: 1 - t(f, 54, 62), transformOrigin: '540px 860px' }}>
      <div style={{ position: 'absolute', left: 540, top: 860 }}>
        <svg width={2 * R + 60} height={2 * R + 60} style={{ position: 'absolute', left: -R - 30, top: -R - 30, transform: `rotate(-90deg) scale(${pop})` }}>
          <circle cx={R + 30} cy={R + 30} r={R} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={22} />
          <circle cx={R + 30} cy={R + 30} r={R} fill="none" stroke={C.yellow} strokeWidth={22} strokeLinecap="round" strokeDasharray={`${L * (1 - drain)} ${L}`} />
        </svg>
        <div style={{ position: 'absolute', left: -300, top: -260, width: 600, textAlign: 'center', fontFamily: FONT.title, fontWeight: 300, fontSize: 440, lineHeight: '520px', color: C.white, letterSpacing: -10, transform: `scale(${0.6 + 0.4 * pop})`, opacity: Math.min(1, pop * 2) }}>
          3<span style={{ fontSize: 150, letterSpacing: 0, marginLeft: 8 }}>s</span>
        </div>
      </div>
      <Title f={f} onBlue top={1300} left={0} width={W} align="center" size={78} lines={[{ text: 'Trois *secondes.*', at: v(0.13) }]} />
    </AbsoluteFill>
  );
};

// ================= S2 · « C'est le temps qu'il faut… s'arrêter… ou de passer à la suivante. » =================
const FEED: PostKind[] = ['fade2', 'fade3', 'fade4', 'fade1', 'fade3', 'fade2', 'fade4', 'fade1'];
const STOP_AT = 132; // « s'arrêter »
const SKIP_AT = 192; // « ou de passer à la suivante »
// Défilement du fil (en px) : rapide, freine et se pose sur la 4e publication, puis repart d'un coup.
const feedY = (f: number) => {
  const stop = 3 * POST_H - 40;
  if (f < STOP_AT) {
    const k = t(f, CUT.feed - 6, STOP_AT, 0, 1, ease.out);
    return k * stop;
  }
  if (f < SKIP_AT) return stop;
  return stop + t(f, SKIP_AT, SKIP_AT + 20, 0, 1, ease.inOut) * POST_H * 1.6 + Math.max(0, f - SKIP_AT - 20) * 14;
};

export const S2: React.FC<P> = ({ f }) => {
  if (f < CUT.feed - 10 || f > CUT.question + 10) return null;
  const pw = 680;
  const sw = pw * 0.94;
  const y = feedY(f);
  const vel = Math.abs(feedY(f + 1) - feedY(f));
  const timer = t(f, STOP_AT + 4, SKIP_AT, 0, 1, (x) => x);
  const swipe = t(f, SKIP_AT - 4, SKIP_AT + 8);
  const enter = t(f, CUT.feed - 8, CUT.feed + 10, 0, 1, ease.out);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Title f={f} top={200} size={72} out={SKIP_AT - 8} lines={[{ text: "C'est le temps qu'il faut", at: v(1.45) }, { text: 'pour *s’arrêter*…', at: STOP_AT - 8 }]} />
      <Title f={f} top={200} size={72} lines={[{ text: '…ou *passer*', at: SKIP_AT }, { text: 'à la suivante.', at: SKIP_AT + 12 }]} />
      <div style={{ position: 'absolute', left: W / 2 - pw / 2, top: 520, transform: `scale(${1.12 - 0.12 * enter})`, opacity: enter }}>
        <Phone w={pw}>
          <div style={{ position: 'absolute', left: 0, top: 110 - y, filter: `blur(${Math.min(10, vel * 0.25)}px)` }}>
            {FEED.map((k, i) => (
              <Post key={i} kind={k} w={sw} />
            ))}
          </div>
          {/* barre du haut de l'appli */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 110, background: C.white, borderBottom: `2px solid ${C.line}` }} />
          {/* minuteur de 3 s sur la publication arrêtée */}
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

// ================= S3 · « Alors, que voit-il en ces trois secondes ? » (fond bleu) =================
export const S3: React.FC<P> = ({ f }) => {
  if (f < CUT.question - 14 || f > CUT.logo + 4) return null;
  const p = t(f, CUT.question - 12, CUT.question + 6, 0, 1, ease.inOut);
  // l'œil : s'ouvre, regarde à gauche puis à droite, cligne, puis se ferme sur le logo
  const open = t(f, 262, 276, 0, 1, ease.out) * (1 - t(f, 316, 330, 0, 1, ease.in)) * (1 - 0.9 * (t(f, 292, 296) - t(f, 296, 300)));
  const look = interpolate(f, [276, 284, 296, 304, 312], [0, -60, -60, 60, 0], { ...clamp, easing: ease.inOut });
  const EW = 560;
  const EH = 300 * open;
  return (
    <AbsoluteFill style={{ background: BLUE_BG, clipPath: p < 1 ? sweepUp(p) : undefined }}>
      <Title f={f} onBlue top={1250} left={0} width={W} align="center" size={76} lines={[{ text: 'Alors, que voit-il', at: v(7.8) }, { text: 'en *3 secondes* ?', at: v(9.0) }]} />
      <div style={{ position: 'absolute', left: 540, top: 820 }}>
        <svg width={EW + 40} height={340} style={{ position: 'absolute', left: -EW / 2 - 20, top: -170, overflow: 'visible' }}>
          <defs>
            <clipPath id="oeil">
              <path d={`M 20 170 Q ${EW / 2 + 20} ${170 - EH} ${EW + 20} 170 Q ${EW / 2 + 20} ${170 + EH} 20 170 Z`} />
            </clipPath>
          </defs>
          <path d={`M 20 170 Q ${EW / 2 + 20} ${170 - EH} ${EW + 20} 170 Q ${EW / 2 + 20} ${170 + EH} 20 170 Z`} fill={C.white} stroke={C.white} strokeWidth={10} strokeLinejoin="round" />
          <g clipPath="url(#oeil)">
            <circle cx={EW / 2 + 20 + look} cy={170} r={92} fill={C.blue} />
            <circle cx={EW / 2 + 20 + look} cy={170} r={44} fill={C.blueDeep} />
            <circle cx={EW / 2 + 48 + look} cy={142} r={16} fill={C.white} />
          </g>
        </svg>
        {/* trois tics de chronomètre autour de l'œil */}
        {[0, 1, 2].map((i) => {
          const k = sp(f, 270 + i * 10, 'pose');
          const a = -150 + i * 60;
          const rad = (a * Math.PI) / 180;
          return (
            <div key={i} style={{ position: 'absolute', left: Math.cos(rad) * 400 - 30, top: Math.sin(rad) * 300 - 30, width: 60, height: 60, borderRadius: 60, border: `5px solid ${C.yellow}`, display: 'grid', placeItems: 'center', color: C.white, fontFamily: FONT.title, fontWeight: 600, fontSize: 28, transform: `scale(${k})` }}>
              {3 - i}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ================= S4 · « Chez ADN Créatif, nous fabriquons ces trois secondes… faire arrêter votre potentiel client. » =================
const BUILD = v(12.2); // « nous fabriquons ces trois secondes »
const HOLD = v(14.4); // « faire arrêter votre potentiel client »

// La publication fabriquée par ADN : se monte pièce par pièce.
const AdnPoster: React.FC<{ f: number; at: number; w: number }> = ({ f, at, w }) => {
  const k = (i: number) => sp(f, at + i * 5, 'pose');
  const s = w / 600;
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.white, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: w, height: w, background: BLUE_BG, transformOrigin: 'top left', transform: `scale(${k(0)})` }} />
      <div style={{ position: 'absolute', right: -70 * s, top: 250 * s, width: 340 * s, height: 340 * s, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #C9CCFF 45%, #6F74FF 100%)', transform: `scale(${k(1)})` }} />
      <div style={{ position: 'absolute', zIndex: 2, left: 44 * s, top: 70 * s, fontFamily: FONT.title, color: C.white, transform: `translateX(${(1 - k(2)) * -200}px)`, opacity: k(2) }}>
        <div style={{ fontSize: 34 * s, fontWeight: 500, letterSpacing: 4 }}>NOUVELLE</div>
        <div style={{ fontSize: 76 * s, fontWeight: 600, lineHeight: 1, letterSpacing: -2 }}>collection</div>
      </div>
      <div style={{ position: 'absolute', left: 44 * s, top: 330 * s, padding: `${10 * s}px ${26 * s}px`, background: C.yellow, color: C.ink, fontFamily: FONT.title, fontWeight: 600, fontSize: 64 * s, transform: `skewX(-10deg) scale(${k(3)})`, transformOrigin: 'left center' }}>
        -30 %
      </div>
      <div style={{ position: 'absolute', left: 44 * s, top: 480 * s, padding: `${14 * s}px ${30 * s}px`, borderRadius: 60, background: C.white, color: C.blue, fontFamily: FONT.title, fontWeight: 600, fontSize: 30 * s, display: 'flex', alignItems: 'center', gap: 10 * s, transform: `scale(${k(4)})`, transformOrigin: 'left center' }}>
        Je découvre <ArrowRight size={30 * s} color={C.blue} />
      </div>
    </div>
  );
};

export const S4: React.FC<P> = ({ f }) => {
  if (f < CUT.logo - 2 || f > CUT.services + 14) return null;
  const logoIn = t(f, CUT.logo, CUT.logo + 16, 0, 1, ease.out);
  const trait = t(f, CUT.logo + 8, CUT.logo + 22, 0, 1, ease.out);
  const up = t(f, BUILD - 14, BUILD + 4, 0, 1, ease.inOut);
  const phoneIn = sp(f, BUILD - 6, 'doux');
  const pw = 600;
  const hold = sp(f, HOLD, 'pose');
  return (
    <AbsoluteFill style={{ background: BLUE_BG }}>
      {/* logo : naît du point où l'œil s'est fermé, au centre, puis monte en en-tête */}
      <div style={{ position: 'absolute', left: interpolate(up, [0, 1], [540, 170]), top: interpolate(up, [0, 1], [760, 200]) }}>
        <div style={{ transform: `scale(${interpolate(up, [0, 1], [1, 0.36]) * (0.7 + 0.3 * logoIn)})`, opacity: logoIn }}>
          <Logo size={480} a={logoIn} trait={trait} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: interpolate(up, [0, 1], [540 - 300, 270]), top: interpolate(up, [0, 1], [1080, 150]), transform: `scale(${interpolate(up, [0, 1], [1, 0.78])})`, transformOrigin: 'left top' }}>
        <Wordmark f={f} at={CUT.logo + 14} size={100} />
      </div>
      <Title f={f} onBlue top={330} size={70} lines={[{ text: 'On fabrique', at: BUILD }, { text: 'ces *3 secondes*', at: BUILD + 9 }]} />
      {/* la publication ADN se monte dans le fil, et le pouce s'y arrête */}
      <div style={{ position: 'absolute', left: W / 2 - pw / 2, top: 640 + (1 - phoneIn) * 1400 }}>
        <Phone w={pw}>
          <div style={{ position: 'absolute', left: 0, top: 110 }}>
            <Post kind="adn" w={pw * 0.94}>
              <AdnPoster f={f} at={BUILD + 6} w={pw * 0.94} />
            </Post>
            <Post kind="fade2" w={pw * 0.94} />
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

// ================= S5 · « Des visuels…, des spots…, et des sites qui arrêtent le regard, et qui donnent envie d'en savoir plus. » =================
const SVC = [
  { at: v(16.22), label: 'Visuels de communication', icon: Eye },
  { at: v(17.9), label: 'Spots publicitaires', icon: Play },
  { at: v(19.2), label: 'Sites web', icon: Globe },
];
const MORE = v(21.14);

const ServiceCard: React.FC<{ i: number; f: number }> = ({ i, f }) => {
  const W0 = 820;
  if (i === 0)
    return (
      <div style={{ width: 560, height: 700, borderRadius: 28, overflow: 'hidden', position: 'relative', boxShadow: '16px 22px 0 rgba(10,16,200,0.14), 10px 16px 34px rgba(5,8,60,0.18)' }}>
        <AdnPoster f={f} at={-100} w={560} />
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 140, background: C.white, padding: 26, fontFamily: FONT.body, fontSize: 26, color: C.inkSoft }}>Affiche · format 4:5</div>
      </div>
    );
  if (i === 1) {
    const prog = t(f, SVC[1].at + 6, SVC[1].at + 50, 0, 1, (x) => x);
    return (
      <div style={{ width: W0, borderRadius: 28, overflow: 'hidden', background: '#0D0F1E', boxShadow: '16px 22px 0 rgba(10,16,200,0.14), 10px 16px 34px rgba(5,8,60,0.18)' }}>
        <div style={{ position: 'relative', height: 460, background: BLUE_BG }}>
          <div style={{ position: 'absolute', left: 60, top: 70, fontFamily: FONT.title, fontWeight: 600, fontSize: 64, color: C.white, letterSpacing: -1, transform: `translateX(${(1 - t(f, SVC[1].at + 10, SVC[1].at + 24)) * -80}px)`, opacity: t(f, SVC[1].at + 10, SVC[1].at + 20) }}>
            Votre spot
            <div style={{ fontWeight: 300, fontSize: 44 }}>en 15 secondes</div>
          </div>
          <div style={{ position: 'absolute', left: W0 / 2 - 60, top: 170, width: 120, height: 120, borderRadius: 120, background: C.yellow, display: 'grid', placeItems: 'center', transform: `scale(${1 - 0.15 * (t(f, SVC[1].at + 2, SVC[1].at + 5) - t(f, SVC[1].at + 5, SVC[1].at + 10))})`, opacity: 1 - t(f, SVC[1].at + 8, SVC[1].at + 14) }}>
            <Play size={56} color={C.ink} fill={C.ink} />
          </div>
        </div>
        <div style={{ height: 70, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 20 }}>
          <div style={{ flex: 1, height: 8, borderRadius: 8, background: 'rgba(255,255,255,0.2)' }}>
            <div style={{ width: `${prog * 100}%`, height: '100%', borderRadius: 8, background: C.yellow }} />
          </div>
          <div style={{ color: C.white, fontFamily: FONT.body, fontSize: 24 }}>0:{String(Math.round(prog * 15)).padStart(2, '0')}</div>
        </div>
      </div>
    );
  }
  const load = t(f, SVC[2].at + 4, SVC[2].at + 30);
  return (
    <div style={{ width: W0, borderRadius: 28, overflow: 'hidden', background: C.white, boxShadow: '16px 22px 0 rgba(10,16,200,0.14), 10px 16px 34px rgba(5,8,60,0.18)' }}>
      <div style={{ height: 64, background: C.paper, display: 'flex', alignItems: 'center', gap: 12, padding: '0 24px' }}>
        {['#FF6B5E', '#FFC23D', '#3DCB6A'].map((c) => (
          <div key={c} style={{ width: 18, height: 18, borderRadius: 18, background: c }} />
        ))}
        <div style={{ marginLeft: 20, flex: 1, height: 36, borderRadius: 18, background: C.white, fontFamily: FONT.body, fontSize: 22, color: C.inkSoft, display: 'flex', alignItems: 'center', padding: '0 18px' }}>boutique-mila.com</div>
      </div>
      <div style={{ position: 'relative', height: 480, padding: 50 }}>
        <div style={{ height: 48, width: 420 * load + 60, borderRadius: 10, background: load < 1 ? C.line : C.ink, transition: 'none' }} />
        <div style={{ marginTop: 18, height: 30, width: 560 * load, borderRadius: 8, background: C.line }} />
        <div style={{ marginTop: 40, display: 'flex', gap: 24 }}>
          {[0, 1, 2].map((j) => (
            <div key={j} style={{ width: 200, height: 200, borderRadius: 20, background: j === 0 ? BLUE_BG : C.blueSoft, transform: `scale(${sp(f, SVC[2].at + 14 + j * 4, 'pose')})` }} />
          ))}
        </div>
        <div style={{ position: 'absolute', left: 50, bottom: 40, padding: '14px 30px', borderRadius: 40, background: C.blue, color: C.white, fontFamily: FONT.title, fontWeight: 600, fontSize: 28, transform: `scale(${sp(f, SVC[2].at + 26, 'pose')})`, transformOrigin: 'left center' }}>Commander</div>
      </div>
    </div>
  );
};

export const S5: React.FC<P> = ({ f }) => {
  if (f < CUT.services - 14 || f > CUT.achat + 12) return null;
  const p = t(f, CUT.services - 12, CUT.services + 8, 0, 1, ease.inOut);
  const idx = SVC.filter((s) => f >= s.at).length - 1;
  const more = sp(f, MORE + 18, 'pose');
  const click = t(f, MORE + 34, MORE + 38) - t(f, MORE + 38, MORE + 46);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.paper, clipPath: p < 1 ? `circle(${p * 1500}px at 540px 760px)` : undefined }}>
        <Title f={f} top={200} size={66} out={v(19.4) - 4} lines={[{ text: 'Des visuels, des spots', at: SVC[0].at }, { text: 'et des sites', at: SVC[2].at }]} />
        <Title f={f} top={200} size={66} lines={[{ text: 'qui *arrêtent le regard*', at: v(19.4) + 6 }, { text: 'et donnent envie', at: MORE }, { text: "d'en *savoir plus.*", at: MORE + 12 }]} />
        {/* cartes de service : chacune arrive, se pose, puis s'empile derrière la suivante (REF-02) */}
        {SVC.map((s, i) => {
          const k = sp(f, s.at - 4, 'pose');
          const back = i < idx ? idx - i : 0;
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              style={{
                position: 'absolute',
                left: 540,
                top: 1060,
                opacity: f < s.at - 4 ? 0 : 1 - back * 0.25,
                transform: `translate(-50%, -50%) translateX(${(1 - k) * 1200}px) translateY(${-back * 70}px) scale(${1 - back * 0.08}) rotate(${(1 - k) * 8 - back * 2}deg)`,
                zIndex: 10 + i,
              }}
            >
              <ServiceCard i={i} f={f} />
              <div style={{ position: 'absolute', left: '50%', bottom: -40, transform: 'translateX(-50%)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 30px', borderRadius: 50, background: C.ink, color: C.white, fontFamily: FONT.title, fontWeight: 500, fontSize: 36, opacity: back ? 0 : 1 }}>
                <Icon size={34} color={C.yellow} /> {s.label}
              </div>
            </div>
          );
        })}
        {/* « envie d'en savoir plus » : bouton cliqué */}
        <div style={{ position: 'absolute', left: 540, top: 1560, transform: `translate(-50%, 0) scale(${more * (1 - click * 0.08)})`, zIndex: 30, display: 'flex', alignItems: 'center', gap: 16, padding: '26px 48px', borderRadius: 70, background: C.blue, color: C.white, fontFamily: FONT.title, fontWeight: 600, fontSize: 42, boxShadow: '8px 12px 0 rgba(10,16,200,0.2)' }}>
          En savoir plus <ArrowRight size={42} color={C.yellow} />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 31 }}>
          <Touch x={720} y={1620} press={click} visible={t(f, MORE + 26, MORE + 32)} />
        </div>
      </AbsoluteFill>
      <Ring p={p} x={540} y={760} />
    </AbsoluteFill>
  );
};

// ================= S6 · « Parce qu'un client qui s'arrête est un client qui peut acheter. » (fond bleu) =================
export const S6: React.FC<P> = ({ f }) => {
  if (f < CUT.achat - 14 || f > CUT.ecrire + 12) return null;
  const p = t(f, CUT.achat - 12, CUT.achat + 6, 0, 1, ease.inOut);
  const a = sp(f, v(23.4), 'pose');
  const line = t(f, v(24.2), v(24.9), 0, 1, ease.inOut);
  const b = sp(f, v(24.9), 'pose');
  const notif = sp(f, v(25.3), 'pose');
  const node = (k: number, Icon: typeof Eye, label: string, x: number) => (
    <div style={{ position: 'absolute', left: x - 140, top: 760, width: 280, textAlign: 'center', transform: `scale(${k})` }}>
      <div style={{ width: 220, height: 220, margin: '0 auto', borderRadius: 220, background: C.white, display: 'grid', placeItems: 'center', boxShadow: '10px 14px 0 rgba(0,0,0,0.18)' }}>
        <Icon size={100} color={C.blue} strokeWidth={1.8} />
      </div>
      <div style={{ marginTop: 26, fontFamily: FONT.title, fontWeight: 500, fontSize: 46, color: C.white }}>{label}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: BLUE_BG, clipPath: p < 1 ? sweepLeft(p) : undefined }}>
      <Title f={f} onBlue top={240} size={72} lines={[{ text: 'Un client qui *s’arrête*', at: v(23.05) }, { text: 'peut *acheter.*', at: v(24.8) }]} />
      {node(a, Eye, "S'arrête", 290)}
      {node(b, ShoppingBag, 'Achète', 790)}
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
        <path d="M 420 870 Q 540 760 660 870" fill="none" stroke={C.yellow} strokeWidth={8} strokeDasharray="18 14" strokeLinecap="round" style={{ clipPath: `inset(0 ${(1 - line) * 100}% 0 0)` }} />
      </svg>
      <div style={{ position: 'absolute', left: 120, top: 1260, width: 840, display: 'flex', alignItems: 'center', gap: 22, padding: '26px 30px', borderRadius: 34, background: C.white, boxShadow: '0 12px 30px rgba(0,0,30,0.25)', transform: `translateY(${(1 - notif) * -80}px) scale(${0.9 + 0.1 * notif})`, opacity: Math.min(1, notif * 1.5), fontFamily: FONT.body }}>
        <div style={{ width: 72, height: 72, borderRadius: 18, background: C.yellow, display: 'grid', placeItems: 'center' }}>
          <ShoppingBag size={38} color={C.ink} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 26, color: C.inkSoft, fontWeight: 500 }}>Boutique Mila · maintenant</div>
          <div style={{ fontSize: 34, color: C.ink, marginTop: 4 }}>
            Nouvelle commande <b>✓</b>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ================= S7 · « Écrivez-nous maintenant sur nos différents réseaux sociaux. » =================
export const S7: React.FC<P> = ({ f }) => {
  if (f < CUT.ecrire - 14 || f > CUT.fin + 12) return null;
  const p = t(f, CUT.ecrire - 12, CUT.ecrire + 8, 0, 1, ease.inOut);
  const typing = f >= v(26.6) && f < v(27.3);
  const sent = sp(f, v(27.3), 'pose');
  const reply = sp(f, v(28.0), 'pose');
  const icons = [Facebook, Instagram, Linkedin, MessageCircle];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.paper, clipPath: p < 1 ? `circle(${p * 1500}px at 540px 960px)` : undefined }}>
        <Title f={f} top={230} size={74} lines={[{ text: 'Écrivez-nous', at: v(26.27) }, { text: '*maintenant.*', at: v(26.27) + 9 }]} />
        <div style={{ position: 'absolute', left: 90, top: 560, width: 900, fontFamily: FONT.body, fontSize: 36 }}>
          <div style={{ marginLeft: 'auto', width: 'fit-content', maxWidth: 680, padding: '26px 32px', borderRadius: '36px 36px 8px 36px', background: C.blue, color: C.white, transform: `scale(${typing ? 1 : sent})`, transformOrigin: 'right bottom', opacity: f >= v(26.6) ? 1 : 0 }}>
            {typing ? (
              <span style={{ letterSpacing: 6 }}>{'•••'.slice(0, 1 + (Math.floor(f / 4) % 3))}</span>
            ) : (
              <>Bonjour ADN Créatif 👋 Je veux un spot pour ma boutique.</>
            )}
          </div>
          <div style={{ marginTop: 34, width: 'fit-content', maxWidth: 680, padding: '26px 32px', borderRadius: '36px 36px 36px 8px', background: C.white, color: C.ink, boxShadow: '0 8px 22px rgba(5,8,60,0.10)', transform: `scale(${reply})`, transformOrigin: 'left bottom' }}>
            Avec plaisir ! On en parle ?
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, top: 1240, width: W, display: 'flex', justifyContent: 'center', gap: 34 }}>
          {icons.map((Icon, i) => {
            const k = sp(f, v(27.6) + i * 4, 'pose');
            return (
              <div key={i} style={{ width: 130, height: 130, borderRadius: 130, background: C.blue, display: 'grid', placeItems: 'center', transform: `scale(${k}) rotate(${(1 - k) * -30}deg)`, boxShadow: '6px 10px 0 rgba(10,16,200,0.16)' }}>
                <Icon size={62} color={C.white} strokeWidth={1.9} />
              </div>
            );
          })}
        </div>
        <div style={{ position: 'absolute', left: 0, top: 1420, width: W, textAlign: 'center', fontFamily: FONT.title, fontWeight: 500, fontSize: 44, color: C.ink, opacity: t(f, v(28.0), v(28.3)) }}>
          ADN Créatif
        </div>
      </AbsoluteFill>
      <Ring p={p} x={540} y={960} />
    </AbsoluteFill>
  );
};

// ================= S8 · « ADN Créatif. Le catalyseur de croissance. » (fond bleu) =================
export const S8: React.FC<P> = ({ f }) => {
  if (f < CUT.fin - 14) return null;
  const p = t(f, CUT.fin - 12, CUT.fin + 6, 0, 1, ease.inOut);
  const a = t(f, CUT.fin + 2, CUT.fin + 18, 0, 1, ease.out);
  const tr = t(f, CUT.fin + 10, CUT.fin + 24, 0, 1, ease.out);
  const curve = t(f, v(30.6), v(31.8), 0, 1, ease.inOut);
  return (
    <AbsoluteFill style={{ background: BLUE_BG, clipPath: p < 1 ? sweepUp(p) : undefined }}>
      {/* courbe de croissance jaune qui monte derrière le logo */}
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, opacity: 0.9 }}>
        <path d="M -20 1840 C 320 1820, 600 1760, 780 1600 S 1000 1420, 1120 1380" fill="none" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" strokeDasharray="2400" strokeDashoffset={2400 * (1 - curve)} />
      </svg>
      <div style={{ position: 'absolute', left: 540, top: 700, transform: `scale(${0.75 + 0.25 * a})`, opacity: a }}>
        <Logo size={480} a={a} trait={tr} spin={0} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 1030, width: W, display: 'flex', justifyContent: 'center' }}>
        <Wordmark f={f} at={CUT.fin + 6} size={104} />
      </div>
      <Title f={f} onBlue top={1190} left={0} width={W} align="center" size={60} lines={[{ text: 'Le catalyseur', at: v(30.6) }, { text: 'de *croissance.*', at: v(31.1) }]} />
    </AbsoluteFill>
  );
};

export const ADN_END = END;
