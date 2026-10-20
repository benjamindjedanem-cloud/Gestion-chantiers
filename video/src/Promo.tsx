// Composition de test : vérifie polices, couleurs, logo et rendu. Remplacée après validation du storyboard.
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { C, fonts } from './theme';

export const Promo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.8 } });
  const textIn = interpolate(frame, [12, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: C.brandDark, alignItems: 'center', justifyContent: 'center', gap: 48 }}>
      <Img src={staticFile('logo.png')} style={{ width: 280, height: 280, transform: `scale(${pop})`, borderRadius: 64 }} />
      <div style={{ opacity: textIn, transform: `translateY(${(1 - textIn) * 40}px)`, textAlign: 'center' }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 96, color: '#fff' }}>Gestion Chantiers</div>
        <div style={{ fontFamily: fonts.body, fontSize: 40, color: '#BFDBFE', marginTop: 16 }}>Test de rendu</div>
      </div>
    </AbsoluteFill>
  );
};
