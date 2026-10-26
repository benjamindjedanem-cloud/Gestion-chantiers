// Spot ADN Créatif (9:16) : couleurs du logo, calage sur la voix off validée (32,3 s).
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
  blue: '#0A10C8', // bleu du logo
  blueDeep: '#02037A',
  blueSoft: '#E9EBFF',
  yellow: '#F5EE00', // trait jaune du logo, avec retenue
  ink: '#0B0E3A',
  inkSoft: '#5A5F86',
  paper: '#F6F7FC',
  white: '#FFFFFF',
  line: '#E3E5F2',
};
export const BLUE_BG = `linear-gradient(160deg, ${C.blue} 0%, #0607A8 55%, ${C.blueDeep} 100%)`;
export const FONT = { title: 'Montserrat', body: 'DM Sans' };

// Voix posée à 0,5 s ; v(s) = image vidéo d'un instant de la voix.
export const VOICE_AT = 15;
export const v = (s: number) => Math.round(VOICE_AT + s * FPS);

export const CUT = {
  feed: 58, // « C'est le temps qu'il faut… »
  question: 245, // « Alors, que voit-il… »
  logo: 332, // « Chez ADN Créatif… »
  services: 500, // « Des visuels… »
  achat: 704, // « Parce qu'un client qui s'arrête… »
  ecrire: 800, // « Écrivez-nous… »
  fin: 884, // « ADN Créatif. Le catalyseur de croissance. »
};
export const END = 1044; // 34,8 s
