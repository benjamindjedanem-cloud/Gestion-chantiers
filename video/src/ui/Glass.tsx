import { CSSProperties, ReactNode } from 'react';

// Carte en verre dépoli au liseré lumineux (REF-03), avec option de teinte et d'épaisseur (REF-01).
export const Glass = ({
  children,
  style,
  tint = 'rgba(255,255,255,0.10)',
  edge = 'rgba(255,255,255,0.28)',
  radius = 28,
  depth = 0,
  depthColor = 'rgba(0,0,0,0.35)',
  glow,
}: {
  children?: ReactNode;
  style?: CSSProperties;
  tint?: string;
  edge?: string;
  radius?: number;
  depth?: number;
  depthColor?: string;
  glow?: string;
}) => (
  <div
    style={{
      position: 'relative',
      borderRadius: radius,
      background: `linear-gradient(150deg, rgba(255,255,255,0.20) 0%, ${tint} 45%, rgba(255,255,255,0.04) 100%)`,
      border: `1.5px solid ${edge}`,
      backdropFilter: 'blur(22px)',
      boxShadow: [
        depth ? `0 ${depth}px 0 ${depthColor}` : null,
        '0 40px 80px rgba(0,0,0,0.40)',
        'inset 0 1.5px 0 rgba(255,255,255,0.45)',
        glow ? `0 0 60px ${glow}` : null,
      ]
        .filter(Boolean)
        .join(', '),
      overflow: 'hidden',
      ...style,
    }}
  >
    {/* Reflet sur le tiers supérieur */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 38%)',
        pointerEvents: 'none',
      }}
    />
    <div style={{ position: 'relative' }}>{children}</div>
  </div>
);
