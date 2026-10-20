// Identité visuelle reprise de l'application (src/App.jsx), étendue pour l'univers immersif de la vidéo.
// Polices embarquées (fontsource) pour des rendus identiques hors ligne.
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';

export const fonts = {
  display: "'Space Grotesk', sans-serif",
  body: "'DM Sans', sans-serif",
};

// Couleurs de l'application (identiques à src/App.jsx).
export const C = {
  bg: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F8FAFC',
  border: '#E6EAF0',
  borderStrong: '#CBD5E1',
  text: '#0F172A',
  textMuted: '#64748B',
  brand: '#1D4ED8',
  brandDark: '#172554',
  brandTint: '#EFF6FF',
  green: '#047857',
  greenTint: '#ECFDF5',
  amber: '#B45309',
  amberTint: '#FFFBEB',
  red: '#B91C1C',
  redTint: '#FEF2F2',
};

// Univers immersif de la vidéo : tout dans le bleu de la marque.
export const V = {
  night: '#0B1230',
  nightDeep: '#060A1C',
  navy: '#172554',
  royal: '#1E3A8A',
  glow: '#60A5FA',
  glowSoft: '#93C5FD',
  ice: '#DBEAFE',
  white: '#FFFFFF',
  redGlow: '#EF4444',
  greenGlow: '#22C55E',
  amberGlow: '#F59E0B',
};

// Format principal 4:5 (fils LinkedIn et Facebook). Déclinaison 9:16 pour TikTok et stories.
export const VIDEO = { width: 1080, height: 1350, fps: 30 };
