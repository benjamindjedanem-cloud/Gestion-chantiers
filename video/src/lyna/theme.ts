// Spot Lyna-Transfert (9:16) : couleurs du logo, polices, grille musicale et calage voix.
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';

export const W = 1080;
export const H = 1920;
export const FPS = 30;

export const C = {
  green: '#0F9E42', // vert du logo
  greenDark: '#0A7A32',
  greenDeep: '#075C26',
  greenSoft: '#3CB86A',
  greenPale: '#E9F5EC',
  orange: '#F79A00', // orange du logo, avec retenue
  ink: '#13301F',
  inkSoft: '#4E6357',
  paper: '#F7F9F4',
  white: '#FFFFFF',
  river: '#A9D3EE',
  land: '#F3EFE4',
};

export const FONT = { title: 'Montserrat', body: 'DM Sans' };

// Musique : 115 BPM, mesures sur les temps 2 + 4k (scripts/make_musique_lyna.py).
export const BEAT = (FPS * 60) / 115; // 15,65 images
export const bt = (n: number) => Math.round(n * BEAT);

// Voix off posée à 0,7 s ; v(s) = image vidéo d'un instant de la voix (en secondes).
export const VOICE_AT = 21;
export const v = (s: number) => Math.round(VOICE_AT + s * FPS);

// Changements de plan (sur les temps de la musique, juste avant chaque phrase).
export const CUT = {
  tchad: bt(10), // « Au Tchad comme à l'international »
  logo: bt(14), // « LYNA-TRANSFERT vous propose… »
  tarifs: bt(22), // « Grâce à une grille tarifaire… »
  agences: bt(31), // « Retrouvez LYNA-TRANSFERT dans ses agences… »
  final: bt(39), // « LYNA-TRANSFERT… »
  slogan: bt(42), // « Votre argent vous suit partout. »
};
export const END = bt(50); // 26,1 s
