// Scènes du spot Lyna-Transfert (9:16), calées sur la voix off validée.
// Alternance blanc ↔ vert de marque (REF-05), trajets en pointillés (REF-05/08), anneau qui s'ouvre (REF-08),
// la carte d'Afrique devient l'icône du logo, les flèches du logo tournent comme signature.
import React from 'react';
import { AbsoluteFill, interpolate, interpolateColors, useVideoConfig } from 'remotion';
import { ArrowLeftRight, Facebook, Globe, Instagram, Linkedin, MessageCircle, Phone as PhoneIcon, Send, Smartphone, TrendingDown } from 'lucide-react';
import { ease, sp, t } from '../anim/motion';
import { Afrique, Camera, LogoArrows, LogoBadge, LogoIcon, MAP, Notif, Phone, Route, SAHEL, Tagline, Title, Vis, Wordmark, useWide } from './parts';
import { C, CUT, END, FONT, H, W, v } from './theme';

type P = { f: number };
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const lerp = (f: number, a: number, b: number, x: number, y: number, e = ease.inOut) => interpolate(f, [a, b], [x, y], { ...clamp, easing: e });

// ================= S1 · « Pour vos transferts d'argent… au quotidien » =================
const NOTIFS = [
  { at: 40, when: '08:15', text: <>Transfert reçu : <b>150 000 FCFA</b></> },
  { at: 106, when: '12:40', text: <>Envoi confirmé : <b>75 000 FCFA</b> vers Moundou</> },
  { at: 124, when: '18:30', text: <>Transfert reçu : <b>200 000 FCFA</b> d'Abéché</> },
];
const CLOCK = [
  { at: 0, h: '08:15' },
  { at: 104, h: '12:40' },
  { at: 122, h: '18:30' },
];

export const S1: React.FC<P> = ({ f }) => {
  if (f > CUT.tchad + 12) return null;
  // plan 1b : on entre dans le téléphone qui vient de recevoir l'argent (zoom depuis le plan 1a)
  const rise = t(f, 52, 72, 0, 1, ease.inOut);
  const leave = t(f, 140, 162, 0, 1, ease.in);
  const pw = 660;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Title f={f} top={210} wtop={400} size={72} out={54} lines={[{ text: 'Pour vos', at: 24 }, { text: "*transferts d'argent*,", at: 30 }]} />
      <Title
        f={f}
        top={200}
        wtop={360}
        size={72}
        out={140}
        lines={[
          { text: 'Choisissez une solution', at: 64 },
          { text: 'qui vous *accompagne*', at: 98 },
          { text: '*au quotidien.*', at: 117 },
        ]}
      />
      <Vis cx={1360} cy={1240} s={0.72}>
      <Envoi f={f} />
      <div
        style={{
          position: 'absolute',
          left: W / 2 - pw / 2,
          top: 520 - leave * 1500,
          opacity: f >= 52 ? 1 : 0,
          transformOrigin: '50% 50%',
          // le téléphone qui reçoit (plan 1a) glisse au centre et grandit : raccord dans le mouvement
          transform: `translate(${(1 - rise) * 280}px, ${(1 - rise) * 42}px) rotate(${(1 - rise) * 6 + leave * -10}deg) scale(${(0.606 + 0.394 * rise) * (1 + Math.max(0, f - 72) * 0.0004)})`,
          filter: `blur(${leave * 14}px)`,
        }}
      >
        <Phone w={pw}>
          <LockScreen f={f} w={pw * 0.94} />
        </Phone>
      </div>
      </Vis>
    </AbsoluteFill>
  );
};

// ---------- Plan 1a · « Pour vos transferts d'argent » : l'argent part d'un téléphone et arrive sur l'autre ----------
const ARC = { a: [300, 1010] as [number, number], b: [800, 1180] as [number, number] };
const arcPt = (p: number) => {
  const c = [560, 760];
  const q = 1 - p;
  return [q * q * ARC.a[0] + 2 * q * p * c[0] + p * p * ARC.b[0], q * q * ARC.a[1] + 2 * q * p * c[1] + p * p * ARC.b[1]];
};
const Envoi: React.FC<{ f: number }> = ({ f }) => {
  if (f > 70) return null;
  const inA = sp(f, 0, 'pose');
  const inB = sp(f, 6, 'pose');
  const press = t(f, 24, 28) - t(f, 28, 34);
  const fly = t(f, 30, 48, 0, 1, ease.inOut);
  const [tx, ty] = arcPt(fly);
  const recv = sp(f, 47, 'pose');
  // sortie : le téléphone d'envoi file à gauche, celui qui reçoit est repris par le plan 1b
  const outA = t(f, 50, 64, 0, 1, ease.in);
  const pw = 400;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 60 - (1 - inA) * 700 - outA * 800, top: 660, transform: `rotate(${-7 + (1 - inA) * -12 - outA * 10}deg)`, filter: `blur(${outA * 10}px)`, opacity: Math.min(1, inA * 2.5) * (1 - outA) }}>
        <Phone w={pw}>
          <AbsoluteFill style={{ background: C.white, padding: '96px 30px 0', fontFamily: FONT.body }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: C.inkSoft, fontWeight: 500 }}>
              <div style={{ position: 'relative', width: 46, height: 46 }}>
                <div style={{ position: 'absolute', left: 23, top: 23 }}>
                  <LogoIcon D={44} />
                </div>
              </div>
              Lyna-Transfert
            </div>
            <div style={{ marginTop: 50, fontSize: 24, color: C.inkSoft }}>Envoi vers Moundou</div>
            <div style={{ marginTop: 8, fontFamily: FONT.title, fontWeight: 500, fontSize: 52, color: C.ink, letterSpacing: -1 }}>150 000</div>
            <div style={{ fontSize: 26, color: C.inkSoft }}>FCFA</div>
            <div style={{ marginTop: 40, height: 2, background: C.greenPale }} />
            <div style={{ marginTop: 22, display: 'flex', justifyContent: 'space-between', fontSize: 22, color: C.inkSoft }}>
              <span>Frais</span>
              <span style={{ color: C.green, fontWeight: 500 }}>2 %</span>
            </div>
            <div
              style={{
                marginTop: 60,
                height: 84,
                borderRadius: 84,
                background: f >= 30 ? C.greenDark : C.green,
                color: C.white,
                display: 'grid',
                placeItems: 'center',
                fontFamily: FONT.title,
                fontWeight: 500,
                fontSize: 30,
                transform: `scale(${1 - press * 0.06})`,
              }}
            >
              {f >= 30 ? 'Envoyé ✓' : 'Envoyer'}
            </div>
          </AbsoluteFill>
        </Phone>
      </div>
      <div style={{ position: 'absolute', left: 620 + (1 - inB) * 700, top: 830, transform: `rotate(${6 + (1 - inB) * 12}deg)`, opacity: f >= 52 ? 0 : Math.min(1, inB * 2.5) }}>
        <Phone w={pw}>
          <AbsoluteFill style={{ background: `linear-gradient(170deg, ${C.green} 0%, ${C.greenDark} 70%, ${C.greenDeep} 100%)` }}>
            <div style={{ position: 'absolute', top: 100, width: '100%', textAlign: 'center', color: C.white, fontFamily: FONT.title, fontWeight: 300, fontSize: 92, letterSpacing: -3 }}>08:15</div>
            <div style={{ position: 'absolute', left: 14, top: 260 - (1 - recv) * 60, opacity: Math.min(1, recv * 1.5), transform: `scale(${0.9 + 0.1 * recv})`, zoom: 0.62 }}>
              <Notif title="Lyna-Transfert" when="08:15" text={<>Transfert reçu : <b>150 000 FCFA</b></>} w={560} />
            </div>
          </AbsoluteFill>
        </Phone>
      </div>
      {/* trajet en pointillés + jeton qui glisse dessus */}
      <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
        <path
          d={`M ${ARC.a[0]} ${ARC.a[1]} Q 560 760 ${ARC.b[0]} ${ARC.b[1]}`}
          fill="none"
          stroke={C.green}
          strokeWidth={6}
          strokeDasharray="16 14"
          strokeLinecap="round"
          opacity={t(f, 28, 34) * (1 - t(f, 50, 56))}
          style={{ clipPath: `inset(0 ${(1 - fly) * 100}% 0 0)` }}
        />
      </svg>
      {f >= 30 && f < 50 ? (
        <div
          style={{
            position: 'absolute',
            left: tx - 58,
            top: ty - 58,
            width: 116,
            height: 116,
            borderRadius: 116,
            background: C.orange,
            border: `6px solid ${C.white}`,
            boxShadow: '6px 10px 16px rgba(0,40,15,0.25)',
            display: 'grid',
            placeItems: 'center',
            color: C.white,
            fontFamily: FONT.title,
            fontWeight: 600,
            fontSize: 26,
            filter: `blur(${Math.sin(fly * Math.PI) * 2.5}px)`,
            transform: `scale(${0.7 + 0.3 * Math.sin(fly * Math.PI) + 0.3})`,
          }}
        >
          FCFA
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const LockScreen: React.FC<{ f: number; w: number }> = ({ f, w }) => {
  const idx = CLOCK.filter((c) => f >= c.at).length - 1;
  const roll = idx > 0 ? t(f, CLOCK[idx].at, CLOCK[idx].at + 10) : 1;
  const shown = NOTIFS.filter((n) => f >= n.at);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(170deg, ${C.green} 0%, ${C.greenDark} 70%, ${C.greenDeep} 100%)` }}>
      {/* grandes flèches du logo en filigrane, qui tournent lentement */}
      <div style={{ position: 'absolute', left: w / 2, top: 820, opacity: 0.13, transform: `rotate(${f * 0.5}deg)` }}>
        <LogoArrows D={620} color={C.white} />
      </div>
      <div style={{ position: 'absolute', top: 110, width: '100%', textAlign: 'center', color: C.white, fontFamily: FONT.body, fontSize: 30, opacity: 0.9 }}>lundi</div>
      <div style={{ position: 'absolute', top: 140, width: '100%', height: 170, overflow: 'hidden', textAlign: 'center', color: C.white, fontFamily: FONT.title, fontWeight: 300, fontSize: 150, letterSpacing: -4 }}>
        {idx > 0 ? <div style={{ transform: `translateY(${-roll * 170}px)`, opacity: 1 - roll }}>{CLOCK[idx - 1].h}</div> : null}
        <div style={{ position: 'absolute', width: '100%', top: 0, transform: `translateY(${(1 - roll) * 170}px)` }}>{CLOCK[idx].h}</div>
      </div>
      {shown.map((n, i) => {
        const order = shown.length - 1 - i; // 0 = la plus récente, en haut
        const pIn = sp(f, n.at, 'pose');
        const push = shown.slice(i + 1).reduce((acc, m) => acc + sp(f, m.at, 'ferme'), 0);
        return (
          <div
            key={n.at}
            style={{
              position: 'absolute',
              left: 20,
              top: 380 + push * 170 - (1 - pIn) * 120,
              opacity: Math.min(1, pIn * 1.4) * (order > 2 ? 0 : 1),
              transform: `scale(${0.9 + 0.1 * pIn})`,
            }}
          >
            <Notif title="Lyna-Transfert" when={n.when} text={n.text} w={w - 40} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ================= Carte : Tchad → Afrique → icône du logo (S2 et début de S3) =================
const CITY = MAP.cities;
const TCHAD = ['Moundou', 'Sarh', 'Abéché'];
const CAPITALES = ['Niamey', 'Abuja', 'Ouagadougou', 'Bamako', 'Cotonou', 'Lomé', 'Accra', 'Dakar', 'Nouakchott'];
const DUBAI: [number, number] = [1041, 191];

// Position du logo (icône) : centre (X, Y) et diamètre D, selon l'image.
const logoPose = (f: number) => {
  const k = t(f, 252, 272, 0, 1, ease.inOut);
  return { X: interpolate(k, [0, 1], [540, 172]), Y: interpolate(k, [0, 1], [760, 262]), D: interpolate(k, [0, 1], [700, 200]) };
};

// 16:9 : cadre du visuel de la carte (Tchad → Afrique), puis du logo (centré, puis à droite)
const s3Vis = (f: number) => ({ cx: interpolate(t(f, 252, 272, 0, 1, ease.inOut), [0, 1], [960, 1340]), cy: 830, s: 0.77 });
const mapVis = (f: number) => {
  const k = t(f, 205, 224, 0, 1, ease.inOut);
  const b = s3Vis(f);
  return { cx: interpolate(k, [0, 1], [1360, b.cx]), cy: interpolate(k, [0, 1], [1100, b.cy]), s: interpolate(k, [0, 1], [0.83, b.s]) };
};

const camera = (f: number) => {
  // repères : Tchad en gros plan → Afrique entière → Afrique du logo
  const k1 = t(f, 176, 200, 0, 1, ease.inOut);
  const k2 = t(f, 205, 224, 0, 1, ease.inOut);
  const lp = logoPose(f);
  const sLogo = (0.62 * lp.D) / MAP.height;
  const logS = interpolate(k2, [0, 1], [interpolate(k1, [0, 1], [Math.log(4.0), Math.log(0.82)]), Math.log(sLogo)]);
  return {
    s: Math.exp(logS),
    cx: interpolate(k2, [0, 1], [interpolate(k1, [0, 1], [512, 530]), 500]),
    cy: interpolate(k2, [0, 1], [interpolate(k1, [0, 1], [372, 540]), 524]),
    sx: interpolate(k2, [0, 1], [540, lp.X + 0.015 * lp.D]),
    sy: interpolate(k2, [0, 1], [interpolate(k1, [0, 1], [1110, 1090]), lp.Y]),
  };
};

const Dot: React.FC<{ p: [number, number]; s: number; f: number; at: number; label?: string; color?: string; size?: number; labelSide?: 'left' | 'right'; labelColor?: string }> = ({ p, s, f, at, label, color = C.white, size = 11, labelSide = 'right', labelColor = C.white }) => {
  const k = sp(f, at, 'pose');
  if (k <= 0.001) return null;
  const r = (size / s) * k;
  return (
    <g>
      <circle cx={p[0]} cy={p[1]} r={r} fill={color} stroke={C.greenDark} strokeWidth={2 / s} />
      {label ? (
        <text
          x={p[0] + ((labelSide === 'right' ? 1 : -1) * (size + 8)) / s}
          y={p[1] + 9 / s}
          fontSize={27 / s}
          fontFamily={FONT.body}
          fontWeight={500}
          fill={labelColor}
          stroke={labelColor === C.white ? C.greenDeep : 'none'}
          strokeWidth={5 / s}
          paintOrder="stroke"
          textAnchor={labelSide === 'right' ? 'start' : 'end'}
          opacity={Math.min(1, k)}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
};

export const MapLayer: React.FC<P> = ({ f }) => {
  if (f < CUT.tchad - 14 || f > CUT.tarifs + 12) return null;
  const cam = camera(f);
  const toLogo = t(f, 206, 224, 0, 1, ease.inOut);
  const routesOut = 1 - t(f, 203, 213);
  const tchadLabels = 1 - t(f, 180, 190);
  const nd = CITY["N'Djamena"];
  const fill = (n: string) => {
    const base = n === 'Chad' ? interpolateColors(t(f, 160, 172), [0, 1], ['#33B163', C.white]) : '#33B163';
    const target = SAHEL.includes(n) ? C.orange : C.green;
    return interpolateColors(toLogo, [0, 1], [base, target]);
  };
  const stroke = toLogo > 0.97 ? 'same' : interpolateColors(toLogo, [0, 1], [C.greenDark, C.green]);
  const lp = logoPose(f);
  return (
    <AbsoluteFill>
      <Vis {...mapVis(f)}>
      <Camera {...cam}>
        <Afrique fillOf={fill} stroke={stroke} sw={interpolate(toLogo, [0, 1], [1.6, 2.5]) / cam.s}>
          <g opacity={routesOut}>
            {TCHAD.map((c, i) => (
              <g key={c} opacity={c === 'Abéché' ? 1 : tchadLabels * 0.6 + 0.4}>
                <Route a={nd} b={CITY[c]} p={t(f, 164 + i * 4, 180 + i * 4)} color={C.green} width={4 / cam.s} dash={12 / cam.s} bend={0.3} />
                <Dot p={CITY[c]} s={cam.s} f={f} at={176 + i * 4} label={tchadLabels > 0.02 ? c : undefined} color={C.green} size={9} labelColor={C.ink} labelSide={c === 'Abéché' ? 'left' : 'right'} />
              </g>
            ))}
            {CAPITALES.map((c, i) => (
              <g key={c}>
                <Route a={nd} b={CITY[c]} p={t(f, 184 + i * 1.6, 200 + i * 1.6)} color={C.white} width={5 / cam.s} dash={14 / cam.s} />
                <Dot p={CITY[c]} s={cam.s} f={f} at={196 + i * 1.6} size={11} label={['Dakar', 'Bamako', 'Abuja', 'Accra'].includes(c) ? c : undefined} labelSide={c === 'Accra' ? 'left' : c === 'Abuja' ? 'right' : 'right'} />
              </g>
            ))}
            <Route a={nd} b={DUBAI} p={t(f, 186, 204)} color={C.white} width={5 / cam.s} dash={14 / cam.s} bend={-0.18} />
            <Dot p={DUBAI} s={cam.s} f={f} at={200} size={10} label="Dubaï" labelSide="left" />
            {/* N'Djamena : point de départ, en orange */}
            <circle cx={nd[0]} cy={nd[1]} r={(16 / cam.s) * sp(f, 160, 'pose')} fill={C.orange} stroke={C.white} strokeWidth={5 / cam.s} />
            <circle cx={nd[0]} cy={nd[1]} r={(16 + 40 * ((f - 160) % 30) / 30) / cam.s} fill="none" stroke={C.orange} strokeWidth={3 / cam.s} opacity={f > 160 ? 1 - ((f - 160) % 30) / 30 : 0} />
            <text x={nd[0] - 26 / cam.s} y={nd[1] + 10 / cam.s} fontSize={32 / cam.s} fontFamily={FONT.body} fontWeight={500} fill={C.ink} textAnchor="end" opacity={sp(f, 163) * tchadLabels}>
              N'Djamena
            </text>
          </g>
        </Afrique>
      </Camera>
      {/* les flèches du logo se dessinent autour de l'Afrique, puis tournent (signature) */}
      {f >= 214 ? (
        <div style={{ position: 'absolute', left: lp.X, top: lp.Y, transform: `rotate(${interpolate(t(f, 214, 246, 0, 1, ease.out), [0, 1], [-140, 0]) + Math.max(0, f - 246) * 0.35}deg)` }}>
          <LogoArrows D={lp.D} draw={t(f, 214, 236, 0, 1, ease.out)} />
        </div>
      ) : null}
      </Vis>
    </AbsoluteFill>
  );
};

// ================= S2 · « Au Tchad comme à l'international » (fond vert) =================
const sweepUp = (p: number, w: number, h: number) => {
  const y = h - p * (h + 600);
  return `polygon(0 ${y + 600}px, ${w}px ${y}px, ${w}px ${h}px, 0 ${h}px)`;
};
export const S2BG: React.FC<P> = ({ f }) => {
  if (f < 140 || f > CUT.logo + 20) return null;
  const p = t(f, 142, 160, 0, 1, ease.inOut);
  const { width, height } = useVideoConfig();
  return <AbsoluteFill style={{ background: C.green, clipPath: p < 1 ? sweepUp(p, width, height) : undefined }} />;
};
export const S2Text: React.FC<P> = ({ f }) => {
  if (f < 150 || f > CUT.logo) return null;
  return (
    <>
      <Title f={f} onGreen top={230} wtop={380} size={70} out={203} lines={[{ text: 'Au *Tchad*', at: 158 }, { text: "comme à l'*international*,", at: 176 }]} />
      <LogoBadge f={f} at={164} />
      {f > 203 ? null : null}
    </>
  );
};

// ================= S3 · « LYNA-TRANSFERT vous propose des services… adaptés à vos besoins » =================
export const S3BG: React.FC<P> = ({ f }) => {
  if (f < 200 || f > CUT.tarifs + 16) return null;
  // l'anneau blanc s'ouvre depuis N'Djamena (REF-08)
  const p = t(f, 204, 222, 0, 1, ease.inOut);
  const r = p * 1500;
  const wide = useWide();
  const [ox, oy] = wide ? [1360, 560] : [540, 1000];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.white, clipPath: p < 1 ? `circle(${r}px at ${ox}px ${oy}px)` : undefined }} />
      {p < 1 ? (
        <div style={{ position: 'absolute', left: ox - r - 60, top: oy - r - 60, width: 2 * r + 120, height: 2 * r + 120, borderRadius: '50%', border: `60px solid ${C.white}`, boxShadow: '0 0 0 2px rgba(255,255,255,0.4), 10px 16px 30px rgba(0,50,20,0.25)' }} />
      ) : null}
    </AbsoluteFill>
  );
};

const SERVICES = [
  { icon: Send, label: 'Transfert national' },
  { icon: Globe, label: 'Transfert international' },
  { icon: ArrowLeftRight, label: "Change d'argent" },
  { icon: Smartphone, label: 'Mobile Money' },
];

export const S3: React.FC<P> = ({ f }) => {
  if (f < 214 || f > CUT.tarifs + 16) return null;
  const lp = logoPose(f);
  const k = t(f, 252, 272, 0, 1, ease.inOut);
  // nom du logo : sous l'icône au centre, puis à droite de l'icône en en-tête
  const wmW = interpolate(k, [0, 1], [780, 600]);
  const wmX = interpolate(k, [0, 1], [540 - 390, 300]);
  const wmY = interpolate(k, [0, 1], [1150, 196]);
  return (
    <AbsoluteFill>
      <Title f={f} top={430} wtop={380} size={72} lines={[{ text: 'Des services', at: 268 }, { text: '*adaptés à vos besoins.*', at: 301 }]} />
      <Vis {...s3Vis(f)}>
      <div style={{ position: 'absolute', left: wmX, top: wmY }}>
        <Wordmark width={wmW} reveal={t(f, 226, 246, 0, 1, ease.out)} />
        <div style={{ marginTop: wmW * 0.04, marginLeft: wmW * 0.04 }}>
          <Tagline width={wmW * 0.86} reveal={t(f, 236, 256, 0, 1, ease.out)} />
        </div>
      </div>
      {SERVICES.map((s, i) => {
        const at = 276 + i * 7;
        const k2 = sp(f, at, 'pose');
        const Icon = s.icon;
        const tick = sp(f, 312 + i * 4, 'pose');
        return (
          <div
            key={s.label}
            style={{
              position: 'absolute',
              left: 90,
              top: 680 + i * 176,
              width: 900,
              height: 144,
              borderRadius: 32,
              background: C.white,
              border: `3px solid ${C.greenPale}`,
              boxShadow: '10px 14px 0 rgba(15,158,66,0.10), 6px 10px 22px rgba(0,50,20,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: 30,
              padding: '0 34px',
              transform: `translateX(${(1 - k2) * 1100}px) rotate(${(1 - k2) * 6}deg)`,
              opacity: f < at ? 0 : 1,
              fontFamily: FONT.title,
              fontWeight: 500,
              fontSize: 46,
              color: C.ink,
              letterSpacing: -0.6,
            }}
          >
            <div style={{ width: 76, height: 76, borderRadius: 76, background: C.green, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Icon size={40} color={C.white} strokeWidth={2.2} />
            </div>
            <span style={{ flex: 1 }}>{s.label}</span>
            <div style={{ width: 54, height: 54, borderRadius: 54, background: C.orange, display: 'grid', placeItems: 'center', transform: `scale(${tick})` }}>
              <svg width="30" height="30" viewBox="0 0 24 24">
                <path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={24 * (1 - Math.min(1, tick))} />
              </svg>
            </div>
          </div>
        );
      })}
      {/* l'Afrique du logo est dessinée par MapLayer jusqu'ici ; au-delà, l'icône prend le relais */}
      {f > CUT.tarifs + 12 ? (
        <div style={{ position: 'absolute', left: lp.X, top: lp.Y }}>
          <LogoIcon D={lp.D} spin={(f - 246) * 0.35} />
        </div>
      ) : null}
      </Vis>
    </AbsoluteFill>
  );
};

// ================= S4 · « Grâce à une grille tarifaire avantageuse, frais réduits » (fond vert) =================
const sweepLeft = (p: number, w: number, h: number) => {
  const x0 = w - p * (w + 500);
  return `polygon(${x0}px 0, ${w}px 0, ${w}px ${h}px, ${x0 + 500}px ${h}px)`;
};
const ROWS = [
  { m: '5 000 à 300 000', fee: '2 %' },
  { m: '300 001 à 500 000', fee: '1 %' },
  { m: '500 001 à 900 000', fee: '0,8 %' },
  { m: '900 001 et plus', fee: '0,5 %' },
];
const ROW_H = 118;
const HL = [414, 424, 434, 444]; // la ligne mise en avant descend avec « frais réduits »

export const S4: React.FC<P> = ({ f }) => {
  if (f < CUT.tarifs - 12 || f > CUT.agences + 14) return null;
  const p = t(f, 332, 350, 0, 1, ease.inOut);
  const card = sp(f, 350, 'doux');
  const hlIdx = HL.filter((h) => f >= h).length - 1;
  const hlY = hlIdx < 0 ? 0 : interpolate(f, [HL[Math.max(0, hlIdx)], HL[Math.max(0, hlIdx)] + 7], [Math.max(0, hlIdx - 1), hlIdx], { ...clamp, easing: ease.out });
  const hlOn = t(f, 410, 416);
  const badge = sp(f, 412, 'pose');
  const intl = sp(f, 452, 'pose');
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.green, clipPath: p < 1 ? sweepLeft(p, width, height) : undefined }}>
      <Title f={f} onGreen top={220} wtop={380} size={72} out={404} lines={[{ text: 'Une grille tarifaire', at: 352 }, { text: '*avantageuse*', at: 384 }]} />
      <Title f={f} onGreen top={220} wtop={380} size={72} lines={[{ text: 'Des *frais réduits*', at: 414 }, { text: 'sur vos transferts.', at: 447 }]} />
      <LogoBadge f={f} at={356} />
      <Vis cx={1380} cy={930} s={0.95}>
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 520,
          width: 940,
          borderRadius: 44,
          background: C.white,
          boxShadow: '14px 20px 0 rgba(0,60,25,0.25)',
          padding: '40px 44px 30px',
          transform: `translateY(${(1 - card) * 1400}px) rotate(${(1 - card) * 4}deg)`,
          fontFamily: FONT.body,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontFamily: FONT.title, fontWeight: 500, fontSize: 44, color: C.ink, letterSpacing: -0.5 }}>
          <Send size={40} color={C.green} strokeWidth={2.2} /> Transfert national
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 26, padding: '0 22px', fontSize: 27, color: C.inkSoft, fontWeight: 500 }}>
          <span>Montant (FCFA)</span>
          <span>Frais</span>
        </div>
        <div style={{ position: 'relative', marginTop: 12 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: hlY * ROW_H, height: ROW_H - 10, borderRadius: 24, background: C.greenPale, opacity: hlOn }} />
          {ROWS.map((r, i) => {
            const k = sp(f, 360 + i * 6, 'pose');
            const active = hlIdx === i && hlOn > 0.5;
            return (
              <div
                key={r.m}
                style={{
                  position: 'relative',
                  height: ROW_H - 10,
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 22px',
                  borderBottom: i < 3 ? `2px solid ${C.greenPale}` : undefined,
                  transform: `translateX(${(1 - k) * -120}px)`,
                  opacity: Math.min(1, k * 1.5),
                }}
              >
                <span style={{ fontSize: 42, color: C.ink }}>{r.m}</span>
                <span
                  style={{
                    minWidth: 150,
                    textAlign: 'center',
                    padding: '10px 22px',
                    borderRadius: 40,
                    fontFamily: FONT.title,
                    fontWeight: 600,
                    fontSize: 42,
                    color: active ? C.white : C.green,
                    background: active ? C.orange : C.greenPale,
                    transform: `scale(${active ? 1.06 : 1})`,
                  }}
                >
                  {r.fee}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {/* pastille ronde : les frais baissent */}
      <div
        style={{
          position: 'absolute',
          left: 790,
          top: 420,
          width: 210,
          height: 210,
          borderRadius: 210,
          background: C.orange,
          border: `8px solid ${C.white}`,
          boxShadow: '8px 12px 0 rgba(0,60,25,0.25)',
          transform: `scale(${badge}) rotate(${(1 - badge) * -40}deg)`,
          display: 'grid',
          placeItems: 'center',
          color: C.white,
          fontFamily: FONT.title,
          textAlign: 'center',
        }}
      >
        <div>
          <TrendingDown size={40} color={C.white} strokeWidth={2.4} />
          <div style={{ fontSize: 56, fontWeight: 600, lineHeight: 1, marginTop: 4 }}>{ROWS[Math.max(0, hlIdx)].fee}</div>
          <div style={{ fontSize: 22, fontWeight: 500, marginTop: 6 }}>de frais</div>
        </div>
      </div>
      {/* carte internationale */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 1290,
          width: 940,
          height: 150,
          borderRadius: 40,
          background: C.white,
          boxShadow: '14px 20px 0 rgba(0,60,25,0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 44px',
          transform: `translateY(${(1 - intl) * 700}px)`,
          fontFamily: FONT.title,
          fontWeight: 500,
          fontSize: 42,
          color: C.ink,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Globe size={40} color={C.green} strokeWidth={2.2} /> International
        </span>
        <span style={{ fontWeight: 600, color: C.white, background: C.green, padding: '10px 26px', borderRadius: 40 }}>dès 4 %</span>
      </div>
      </Vis>
    </AbsoluteFill>
  );
};

// ================= S5 · « Retrouvez LYNA-TRANSFERT dans ses agences à travers N'Djamena et sur ses réseaux sociaux » =================
const AGENCES: { n: string; x: number; y: number; side?: 'l' | 'r' }[] = [
  { n: 'Farcha', x: 175, y: 330 },
  { n: 'Marché à Mil', x: 455, y: 250 },
  { n: 'Rue de 40 m', x: 590, y: 430 },
  { n: 'Grand Marché', x: 380, y: 560, side: 'l' },
  { n: 'Dembé', x: 800, y: 520, side: 'l' },
  { n: 'SNER', x: 690, y: 640 },
];
const RIVER = 'M -20 560 C 120 600, 210 690, 330 720 S 560 790, 660 860 S 860 930, 960 960';

const CityMap: React.FC<{ f: number }> = ({ f }) => {
  const lines: React.ReactNode[] = [];
  for (let i = -6; i < 20; i++) {
    lines.push(<line key={`a${i}`} x1={i * 70} y1={-100} x2={i * 70 + 260} y2={1100} stroke={C.white} strokeWidth={7} />);
    lines.push(<line key={`b${i}`} x1={-100} y1={i * 74} x2={1100} y2={i * 74 - 230} stroke={C.white} strokeWidth={7} />);
  }
  return (
    <svg width={920} height={880} viewBox="0 0 920 880" style={{ position: 'absolute', left: 0, top: 0 }}>
      <rect width={920} height={880} fill={C.land} />
      <g opacity={0.95}>{lines}</g>
      {[
        [90, 150, 120, 80],
        [520, 120, 90, 70],
        [700, 470, 110, 70],
        [260, 420, 80, 60],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx={12} fill="#D5EACB" transform={`rotate(-17 ${x} ${y})`} />
      ))}
      {/* grands axes */}
      <path d="M 0 250 L 920 120" stroke="#FFFFFF" strokeWidth={20} />
      <path d="M 0 250 L 920 120" stroke="#E7DFC9" strokeWidth={22} opacity={0.35} />
      <path d="M 330 0 L 520 880" stroke="#FFFFFF" strokeWidth={20} />
      <path d="M 40 470 L 920 380" stroke="#FFFFFF" strokeWidth={16} />
      {/* le Chari */}
      <path d={RIVER} fill="none" stroke={C.river} strokeWidth={84} strokeLinecap="round" />
      <path d={RIVER} fill="none" stroke="#C4E2F5" strokeWidth={40} strokeLinecap="round" opacity={0.7} />
      <path d="M 0 720 L 0 880 L 920 880 L 920 990 Z" fill={C.river} opacity={0} />
      <text x={120} y={705} fontFamily={FONT.body} fontStyle="italic" fontSize={28} fill="#5C93B8" transform="rotate(22 120 705)">
        Chari
      </text>
    </svg>
  );
};

const Pin: React.FC<{ f: number; at: number; x: number; y: number; name: string; side?: 'l' | 'r' }> = ({ f, at, x, y, name, side = 'r' }) => {
  const k = sp(f, at, 'pose');
  const lab = sp(f, at + 5, 'ferme');
  if (f < at) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y }}>
      <div style={{ position: 'absolute', left: -14, top: -6, width: 28, height: 12, borderRadius: '50%', background: 'rgba(0,40,15,0.25)', transform: `scale(${k})` }} />
      <svg width={64} height={84} viewBox="0 0 64 84" style={{ position: 'absolute', left: -32, top: -84 - (1 - Math.min(k, 1)) * 140, opacity: Math.min(1, k * 3) }}>
        <path d="M32 82 C 32 82, 4 50, 4 31 A 28 28 0 1 1 60 31 C 60 50, 32 82, 32 82 Z" fill={C.orange} stroke={C.white} strokeWidth={4} />
        <circle cx={32} cy={31} r={11} fill={C.white} />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: -76,
          ...(side === 'r' ? { left: 38 } : { right: 38 }),
          whiteSpace: 'nowrap',
          background: C.white,
          borderRadius: 30,
          padding: '8px 20px',
          fontFamily: FONT.body,
          fontWeight: 500,
          fontSize: 30,
          color: C.ink,
          boxShadow: '4px 6px 0 rgba(15,158,66,0.18), 0 4px 12px rgba(0,40,15,0.12)',
          transform: `scale(${lab})`,
          transformOrigin: side === 'r' ? 'left center' : 'right center',
        }}
      >
        {name}
      </div>
    </div>
  );
};

export const S5: React.FC<P> = ({ f }) => {
  if (f < CUT.agences - 12 || f > CUT.final + 4) return null;
  const p = t(f, 474, 494, 0, 1, ease.inOut);
  const r = p * 1300;
  const card = sp(f, 492, 'doux');
  const outK = t(f, 598, 612, 0, 1, ease.in);
  const wide = useWide();
  const { width, height } = useVideoConfig();
  const [ox, oy] = [width / 2, height / 2];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: C.paper, clipPath: p < 1 ? `circle(${r}px at ${ox}px ${oy}px)` : undefined }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${1 - outK * 0.35})`, opacity: 1 - outK, filter: `blur(${outK * 8}px)` }}>
          <Title f={f} top={210} wtop={300} size={72} lines={[{ text: 'Retrouvez nos *agences*', at: 506 }, { text: "à travers *N'Djamena*", at: 532 }]} />
          <Vis cx={1380} cy={910} s={1}>
          <div
            style={{
              position: 'absolute',
              left: 70,
              top: 460,
              width: 940,
              height: 900,
              borderRadius: 44,
              background: C.white,
              padding: 10,
              boxShadow: '14px 20px 0 rgba(15,158,66,0.16), 8px 14px 30px rgba(0,50,20,0.14)',
              transform: `translateY(${(1 - card) * 1300}px)`,
            }}
          >
            <div style={{ position: 'relative', width: 920, height: 880, borderRadius: 36, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, transformOrigin: '50% 45%', transform: `scale(${1 + (f - 492) * 0.0006})` }}>
                <CityMap f={f} />
                {AGENCES.map((a, i) => (
                  <Pin key={a.n} f={f} at={518 + i * 6} x={a.x} y={a.y} name={a.n} side={a.side} />
                ))}
              </div>
            </div>
          </div>
          </Vis>
          <Title f={f} top={1408} wtop={600} size={50} lines={[{ text: 'et sur nos *réseaux sociaux*', at: 566 }]} />
          <div style={{ position: 'absolute', left: wide ? 140 : 90, top: wide ? 690 : 1490, display: 'flex', gap: 26, alignItems: 'center' }}>
            {[Facebook, Instagram, Linkedin].map((Icon, i) => {
              const k = sp(f, 576 + i * 4, 'pose');
              return (
                <div key={i} style={{ width: 104, height: 104, borderRadius: 104, background: C.green, display: 'grid', placeItems: 'center', transform: `scale(${k}) rotate(${(1 - k) * -30}deg)` }}>
                  <Icon size={50} color={C.white} strokeWidth={2} />
                </div>
              );
            })}
            <span style={{ marginLeft: 10, fontFamily: FONT.title, fontWeight: 500, fontSize: 42, color: C.ink, opacity: t(f, 590, 600), transform: `translateX(${(1 - t(f, 590, 602)) * 30}px)` }}>Lyna Transfert</span>
          </div>
          <LogoBadge f={f} at={496} />
        </div>
      </AbsoluteFill>
      {p < 1 ? (
        <div style={{ position: 'absolute', left: ox - r - 70, top: oy - r - 70, width: 2 * r + 140, height: 2 * r + 140, borderRadius: '50%', border: `70px solid ${C.white}`, boxShadow: '10px 16px 30px rgba(0,50,20,0.25)' }} />
      ) : null}
    </AbsoluteFill>
  );
};

// ================= S6–S7 · « LYNA-TRANSFERT… Votre argent vous suit partout. » =================
export const Final: React.FC<P> = ({ f }) => {
  if (f < CUT.final - 14) return null;
  const inK = t(f, 598, 612, 0, 1, ease.out);
  const up = t(f, 650, 668, 0, 1, ease.inOut);
  const D = interpolate(inK, [0, 1], [2600, 640]) - up * 120;
  const Y = 720 - up * 130;
  const spin = interpolate(inK, [0, 1], [-260, 0]) + Math.max(0, f - 612) * 0.45;
  const afr = sp(f, 609, 'pose');
  const band = sp(f, 688, 'doux');
  const wide = useWide();
  return (
    <AbsoluteFill style={{ background: C.white, opacity: t(f, 596, 604) }}>
      <Vis cx={interpolate(band, [0, 1], [960, 620])} cy={840} s={1}>
      <div style={{ position: 'absolute', left: 540, top: Y }}>
        <div style={{ position: 'absolute', transform: `rotate(${spin}deg)` }}>
          <LogoArrows D={D} />
        </div>
        <div style={{ position: 'absolute', transform: `scale(${afr})` }}>
          <div style={{ position: 'absolute', transformOrigin: '0 0', transform: `translate(${-MAP.width * ((0.62 * D) / MAP.height) * 0.5 + D * 0.015}px, ${-MAP.height * ((0.62 * D) / MAP.height) * 0.5}px) scale(${(0.62 * D) / MAP.height})` }}>
            <Afrique fillOf={(n) => (SAHEL.includes(n) ? C.orange : C.green)} stroke="same" sw={2.5 / ((0.62 * D) / MAP.height)} />
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 540 - 390, top: Y + D / 2 + 50 }}>
        <Wordmark width={780} reveal={t(f, 614, 632, 0, 1, ease.out)} />
        <div style={{ marginTop: 30, marginLeft: 31 }}>
          <Tagline width={670} reveal={t(f, 624, 642, 0, 1, ease.out)} />
        </div>
      </div>
      <Title
        f={f}
        top={Y + D / 2 + 330}
        left={0}
        width={W}
        align="center"
        keep
        size={68}
        lines={[
          { text: 'Votre argent', at: 657 },
          { text: 'vous *suit partout.*', at: 669 },
        ]}
      />
      </Vis>
      {/* bandeau vert : contacts (en bas en 9:16, panneau de droite en 16:9) */}
      <div
        style={{
          position: 'absolute',
          ...(wide
            ? { left: 1260, top: 0, width: 660, height: 1080, borderRadius: '60px 0 0 60px', transform: `translateX(${(1 - band) * 700}px)`, padding: '0 60px', display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' }
            : { left: 0, top: 1440, width: W, height: 520, borderRadius: '60px 60px 0 0', transform: `translateY(${(1 - band) * 520}px)`, padding: '56px 90px' }),
          background: C.green,
          fontFamily: FONT.body,
          fontWeight: 500,
          color: C.white,
          fontSize: wide ? 38 : 40,
        }}
      >
        {[
          ...(wide
            ? [
                { Icon: PhoneIcon, txt: '(+235) 66 27 06 83', at: 694 },
                { Icon: PhoneIcon, txt: '(+235) 99 40 06 20', at: 697 },
              ]
            : [{ Icon: PhoneIcon, txt: '(+235) 66 27 06 83 · 99 40 06 20', at: 694 }]),
          { Icon: MessageCircle, txt: wide ? '(+235) 68 64 18 13' : '(+235) 68 64 18 13 (WhatsApp)', at: 700 },
          { Icon: Facebook, txt: 'Lyna Transfert', at: 706 },
        ].map(({ Icon, txt, at }) => (
          <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 26, opacity: t(f, at, at + 10), transform: `translateY(${(1 - t(f, at, at + 14)) * 30}px)` }}>
            <div style={{ width: 66, height: 66, borderRadius: 66, background: C.white, display: 'grid', placeItems: 'center' }}>
              <Icon size={34} color={C.green} strokeWidth={2.2} />
            </div>
            {txt}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const LYNA_END = END;
