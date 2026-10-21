// Système de mouvement commun (skill motion-design-pro, recettes § 1–2) et grille musicale.
import { Easing, interpolate, spring } from 'remotion';

export const FPS = 30;

// Musique : 140 BPM, coupée à 1,2 s ; premier temps fort à l'image 16 (0,53 s).
export const BPM = 140;
export const BEAT = (FPS * 60) / BPM; // 12,857 images
export const DOWNBEAT = 16;
export const b = (n: number) => Math.round(DOWNBEAT + n * BEAT); // image du n-ième temps
export const bar = (m: number) => b((m - 1) * 4); // image de la mesure m (1 = premier temps fort)

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  whip: Easing.bezier(0.9, 0, 0.1, 1),
};

export const springs = {
  pose: { damping: 14, mass: 0.9, stiffness: 140 },
  ferme: { damping: 22, mass: 1, stiffness: 160 },
  doux: { damping: 26, mass: 1, stiffness: 90 },
};

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// Interpolation bornée avec courbe (par défaut : arrivée qui se pose).
export const t = (frame: number, from: number, to: number, a = 0, z = 1, easing = ease.out) =>
  interpolate(frame, [from, to], [a, z], { ...clamp, easing });

// Ressort démarrant à l'image `start`.
export const sp = (frame: number, start: number, config: keyof typeof springs = 'pose', fps = FPS) =>
  spring({ frame: frame - start, fps, config: springs[config] });

// Dérive lente permanente (jamais d'image figée).
export const drift = (frame: number, dur: number, amount = 0.03) => 1 + interpolate(frame, [0, dur], [0, amount], clamp);
