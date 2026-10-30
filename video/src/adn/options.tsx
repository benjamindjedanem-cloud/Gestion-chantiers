// Trois pistes pour l'ouverture « Trois secondes » (images fixes à faire choisir à Benjamin), toutes faites
// de vraies réalisations ADN, sans illustration dessinée.
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { BLUE_BG, C, FONT } from './theme';
import { Logo } from './parts';

const img = (n: string) => staticFile(`adn/${n}`);

// A · Le chiffre-fenêtre : un « 3 » géant découpé dans le bleu, vos réalisations défilent à l'intérieur (REF-09 : mot géant + images réelles).
export const OptA: React.FC = () => (
  <AbsoluteFill style={{ background: BLUE_BG }}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 250,
        width: 1080,
        textAlign: 'center',
        fontFamily: FONT.title,
        fontWeight: 800,
        fontSize: 1250,
        lineHeight: '1250px',
        letterSpacing: -40,
        backgroundImage: `url(${img('fr-gc-12.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 55%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
    >
      3
    </div>
    <div style={{ position: 'absolute', left: 0, top: 1460, width: 1080, textAlign: 'center', fontFamily: FONT.title, fontWeight: 700, fontSize: 92, letterSpacing: '0.18em', color: C.white }}>SECONDES</div>
    <div style={{ position: 'absolute', left: 390, top: 1590, width: 300, height: 22, background: C.yellow, transform: 'skewX(-24deg)' }} />
  </AbsoluteFill>
);

// B · La story : plein écran sur une vraie réalisation, barre de progression de story en 3 segments, compteur 3 s.
export const OptB: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Img src={img('fr-gc-12.jpg')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)' }} />
    <div style={{ position: 'absolute', left: 40, right: 40, top: 70, display: 'flex', gap: 12 }}>
      {[1, 1, 0.45].map((p, i) => (
        <div key={i} style={{ flex: 1, height: 8, borderRadius: 8, background: 'rgba(255,255,255,0.35)' }}>
          <div style={{ width: `${p * 100}%`, height: '100%', borderRadius: 8, background: C.white }} />
        </div>
      ))}
    </div>
    <div style={{ position: 'absolute', left: 40, top: 110, display: 'flex', alignItems: 'center', gap: 18, fontFamily: FONT.body, fontSize: 34, color: C.white }}>
      <div style={{ position: 'relative', width: 76, height: 76, borderRadius: 76, background: C.blue }}>
        <div style={{ position: 'absolute', left: 38, top: 40 }}>
          <Logo size={48} />
        </div>
      </div>
      <b>ADN Créatif</b> <span style={{ opacity: 0.8 }}>· 3 s</span>
    </div>
    <div style={{ position: 'absolute', left: 70, bottom: 230, fontFamily: FONT.title, color: C.white }}>
      <div style={{ fontWeight: 800, fontSize: 168, lineHeight: 0.95, letterSpacing: -5 }}>
        Trois
        <br />
        secondes.
      </div>
      <div style={{ marginTop: 26, width: 260, height: 20, background: C.yellow, transform: 'skewX(-24deg)' }} />
    </div>
  </AbsoluteFill>
);

// C · La timeline de montage : l'envers du décor d'une agence — vos clips sur la piste, la tête de lecture s'arrête à 00:03.
export const OptC: React.FC = () => {
  const clips = ['fr-gc-12.jpg', 'fr-ly-3.jpg', 'gc-S1.jpg', 'fr-gc-4.jpg', 'fr-gc-20.jpg', 'gc-S4.jpg'];
  return (
    <AbsoluteFill style={{ background: '#101225' }}>
      {/* moniteur */}
      <div style={{ position: 'absolute', left: 60, top: 160, width: 960, height: 960, borderRadius: 24, overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
        <Img src={img('fr-ly-16.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ position: 'absolute', left: 60, top: 1140, width: 960, display: 'flex', justifyContent: 'space-between', fontFamily: 'IBM Plex Mono, monospace', fontSize: 30, color: 'rgba(255,255,255,0.6)' }}>
        <span>Composition · Spot</span>
        <span style={{ color: C.yellow }}>00:00:03:00</span>
      </div>
      {/* pistes */}
      <div style={{ position: 'absolute', left: 0, top: 1220, width: 1080, height: 420, background: '#181B33', borderTop: '2px solid #2A2E52' }}>
        {[0, 1, 2].map((tr) => (
          <div key={tr} style={{ position: 'absolute', left: 30, right: 30, top: 50 + tr * 120, height: 96, display: 'flex', gap: 6 }}>
            {clips.slice(tr, tr + 4).map((c, i) => (
              <div key={i} style={{ flex: [3, 2, 4, 2][i], borderRadius: 10, overflow: 'hidden', border: `2px solid ${tr === 0 ? C.blue : '#3A3F6E'}` }}>
                <Img src={img(c)} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
              </div>
            ))}
          </div>
        ))}
        {/* repère des 3 secondes + tête de lecture */}
        <div style={{ position: 'absolute', left: 520, top: 0, width: 6, height: 420, background: C.yellow }} />
        <div style={{ position: 'absolute', left: 470, top: -46, padding: '6px 18px', borderRadius: 8, background: C.yellow, fontFamily: FONT.title, fontWeight: 700, fontSize: 30, color: C.ink }}>3 s</div>
      </div>
      <div style={{ position: 'absolute', left: 60, top: 1700, fontFamily: FONT.title, fontWeight: 800, fontSize: 96, color: C.white, letterSpacing: -2 }}>
        Trois <span style={{ color: C.yellow }}>secondes.</span>
      </div>
    </AbsoluteFill>
  );
};
