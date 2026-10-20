import { AbsoluteFill } from 'remotion';
import { V } from '../theme';

// Ligne de lumière (REF-03) : horizon qui se creuse sous un point central.
// `rotate` fait pivoter toute la ligne autour de son centre (0 = horizon, 90 = verticale).
export const LightLine = ({
  y = 900,
  cx = 540,
  depth = 70,
  rotate = 0,
  opacity = 1,
  width = 1600,
}: {
  y?: number;
  cx?: number;
  depth?: number;
  rotate?: number;
  opacity?: number;
  width?: number;
}) => {
  const half = width / 2;
  const d = `M ${cx - half} ${y} C ${cx - 260} ${y}, ${cx - 180} ${y + depth}, ${cx} ${y + depth} C ${cx + 180} ${y + depth}, ${cx + 260} ${y}, ${cx + half} ${y}`;
  return (
    <AbsoluteFill style={{ opacity, transform: `rotate(${rotate}deg)`, transformOrigin: `${cx}px ${y + depth}px` }}>
      <svg width="100%" height="100%" viewBox="0 0 1080 1350" style={{ overflow: 'visible' }}>
        <defs>
          <filter id="ll-wide" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
          <filter id="ll-mid" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <linearGradient id="ll-fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.3" stopColor="#fff" stopOpacity="1" />
            <stop offset="0.7" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="ll-mask">
            <rect x={cx - half} y={y - 400} width={width} height={800 + depth} fill="url(#ll-fade)" />
          </mask>
        </defs>
        <g mask="url(#ll-mask)">
          <path d={d} stroke={V.glow} strokeWidth={60} fill="none" filter="url(#ll-wide)" opacity={0.55} />
          <path d={d} stroke={V.glowSoft} strokeWidth={14} fill="none" filter="url(#ll-mid)" opacity={0.9} />
          <path d={d} stroke="#fff" strokeWidth={3} fill="none" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
