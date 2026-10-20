import { AbsoluteFill } from 'remotion';
import { V } from '../theme';

// Fond bleu nuit avec halo central ; `tint` ajoute une lueur colorée (ex. rouge pendant la tension).
export const Background = ({ tint, intensity = 1 }: { tint?: string; intensity?: number }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 85% 60% at 50% 58%, ${V.royal} 0%, ${V.navy} 32%, ${V.night} 68%, ${V.nightDeep} 100%)`,
    }}
  >
    {tint && (
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 45% at 50% 50%, ${tint} 0%, transparent 70%)`,
          opacity: 0.35 * intensity,
          mixBlendMode: 'screen',
        }}
      />
    )}
    {/* Grain léger pour éviter les aplats numériques */}
    <AbsoluteFill
      style={{
        opacity: 0.06,
        backgroundImage:
          'radial-gradient(rgba(255,255,255,.6) 1px, transparent 1px)',
        backgroundSize: '3px 3px',
      }}
    />
  </AbsoluteFill>
);
