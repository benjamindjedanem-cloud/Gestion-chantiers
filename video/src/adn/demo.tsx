// Démo : comment les vraies réalisations d'ADN remplacent les illustrations (passage « Des visuels… savoir plus », voix 16,0 → 22,9 s).
import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { ease, sp, t } from '../anim/motion';
import { Phone, Title, Touch } from './parts';
import { C } from './theme';

export const DEMO_LEN = 210;
const V0 = 16.0; // la démo commence à 16,0 s de la voix
const at = (s: number) => Math.round((s - V0) * 30);
const A = at(16.22); // visuels
const B = at(17.9); // spots
const S = at(19.2); // sites
const R = at(19.5); // « qui arrêtent le regard »
const M = at(21.14); // « envie d'en savoir plus »

const shadow = '0 2px 4px rgba(5,8,60,0.10), 0 24px 48px -12px rgba(5,8,60,0.35)';

const Poster: React.FC<{ src: string; w: number; ratio: number }> = ({ src, w, ratio }) => (
  <div style={{ width: w, height: w * ratio, background: C.white, padding: 10, boxShadow: shadow }}>
    <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
  </div>
);

export const AdnDemo: React.FC = () => {
  const f = useCurrentFrame();
  // 1. Visuels : deux vraies affiches posées comme des tirages
  const p1 = sp(f, A, 'pose');
  const p2 = sp(f, A + 6, 'pose');
  // 2. Spot : le vrai spot tourne dans un téléphone
  const ph1 = sp(f, B - 2, 'doux');
  // 3. Site : le vrai site défile dans un second téléphone
  const ph2 = sp(f, S - 2, 'doux');
  const back = t(f, S - 2, S + 16, 0, 1, ease.inOut); // les éléments précédents reculent
  const scroll = interpolate(f, [S + 10, S + 40, S + 55, M + 8, M + 22], [0, 820, 820, 2030, 2030], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease.inOut });
  const tap = t(f, M + 30, M + 34) - t(f, M + 34, M + 42);
  const pw = 560;
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <Title f={f} top={190} size={70} out={R - 6} lines={[{ text: 'Des *visuels*,', at: A }, { text: 'des *spots*', at: B }, { text: 'et des *sites*', at: S }]} />
      <Title f={f} top={190} size={70} lines={[{ text: 'qui *arrêtent le regard*', at: R + 4 }, { text: 'et donnent envie', at: M }, { text: "d'en *savoir plus.*", at: M + 12 }]} />

      {/* affiches : arrivent l'une après l'autre, puis reculent à droite */}
      <div style={{ position: 'absolute', left: 540, top: 1150, transform: `translate(${back * 250}px, ${back * -60}px) scale(${1 - back * 0.42})` }}>
        <div style={{ position: 'absolute', left: -120, top: -420, transform: `translateY(${(1 - p2) * 1300}px) rotate(${7 - (1 - p2) * 10}deg)` }}>
          <Poster src="adn/visuel-2.jpg" w={430} ratio={1.5} />
        </div>
        <div style={{ position: 'absolute', left: -330, top: -470, transform: `translateY(${(1 - p1) * 1300}px) rotate(${-5 + (1 - p1) * 8}deg)` }}>
          <Poster src="adn/visuel-1.jpg" w={500} ratio={1.5} />
        </div>
      </div>

      {/* téléphone 1 : le spot Lyna-Transfert, qui joue vraiment */}
      <div style={{ position: 'absolute', left: 540 - pw / 2, top: 560, transform: `translateX(${(1 - ph1) * 1200 - back * 330}px) scale(${1 - back * 0.3}) rotate(${(1 - ph1) * 10 - back * 6}deg)`, opacity: f < B - 2 ? 0 : 1 }}>
        <Phone w={pw}>
          <OffthreadVideo src={staticFile('adn/spot-lyna.mp4')} startFrom={150} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Phone>
      </div>

      {/* téléphone 2 : le site Tchad Immobilier qui défile */}
      <div style={{ position: 'absolute', left: 540 - pw / 2 + 60, top: 600, transform: `translateX(${(1 - ph2) * 1200}px) rotate(${(1 - ph2) * 10}deg)`, opacity: f < S - 2 ? 0 : 1 }}>
        <Phone w={pw}>
          <Img src={staticFile('adn/site-immo.jpg')} style={{ position: 'absolute', left: 0, top: -scroll, width: '100%' }} />
        </Phone>
        <Touch x={230} y={405} press={tap} visible={t(f, M + 24, M + 30)} />
      </div>

      <Audio src={staticFile('adn/voix.mp3')} trimBefore={Math.round(V0 * 30)} />
    </AbsoluteFill>
  );
};
