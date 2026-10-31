// Spot ADN Créatif 9:16 (≈ 35 s) sur la voix off validée « 3 secondes ».
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { S0, S2, S3, S4, S5, S6, S7, S8, Streaks } from './scenes';
import { C, CUT, END, VOICE_AT } from './theme';

// Musique baissée sous la voix (0,13 → 32,1 s de voix), remontée pour la fin.
const V_IN = VOICE_AT + 4;
const V_OUT = VOICE_AT + Math.round(32.11 * 30);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const musicVol = (fr: number) =>
  interpolate(fr, [0, V_IN - 2, V_IN + 8, V_OUT, V_OUT + 10, END - 30, END], [0.6, 0.6, 0.2, 0.2, 0.62, 0.62, 0], clamp);
// Musique : « energetic upbeat future bass » (Pixabay, fournie par Benjamin), 140 BPM ; démarrée à 4,41 s
// pour que son drop (15,48 s) tombe sur l'apparition du logo (image 332).
const MUSIC_TRIM = 132;
const BEAT = (30 * 60) / 140;
const DROP = CUT.logo;
// Pulsation de caméra sur un temps sur deux après le drop, éclair blanc sur les deux apparitions du logo.
const pulse = (fr: number) => {
  if (fr < DROP || fr > END - 20) return 0;
  const ph = (fr - DROP) % (BEAT * 2);
  return Math.exp(-ph / 4);
};
const flash = (fr: number) => Math.max(interpolate(fr, [CUT.logo - 1, CUT.logo, CUT.logo + 7], [0, 0.85, 0], clamp), interpolate(fr, [CUT.fin + 3, CUT.fin + 4, CUT.fin + 11], [0, 0.85, 0], clamp));

// Effets de la banque de Benjamin : le pic de chaque son tombe sur le changement de plan.
const PIC: Record<string, number> = { 'deep-whoosh-two': 1.08, 'deep-whoosh': 3.1, 'deep-slow-mo': 2.42, dark: 2.04, 'glory-two': 1.82 };
const SFX: [number, string, number][] = [
  [CUT.question, 'deep-whoosh-two', 0.7], // traînées → barre de recherche
  [CUT.logo - 6, 'deep-slow-mo', 0.6], // la barre se referme en sphère
  [CUT.logo + 4, 'glory-two', 0.7], // révélation du logo
  [CUT.services, 'deep-whoosh', 0.6], // cercle → accordéon
  [CUT.achat, 'deep-whoosh-two', 0.7], // traînées → « s'arrête »
  [CUT.achat + 52, 'dark', 0.6], // « s'arrête » devient « achète »
  [CUT.ecrire, 'deep-whoosh-two', 0.55], // cercle → réseaux
  [CUT.fin + 4, 'glory-two', 0.75], // logo final
];

export const Adn = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <AbsoluteFill style={{ transform: `scale(${1 + 0.022 * pulse(f)})` }}>
      <S2 f={f} />
      <S3 f={f} />
      <S4 f={f} />
      <S5 f={f} />
      <S6 f={f} />
      <S7 f={f} />
      <S8 f={f} />
      <S0 f={f} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: C.white, opacity: flash(f), pointerEvents: 'none' }} />
      {/* traînées de couleur (REF-09) sur les changements de plan bleu ↔ blanc */}
      {[CUT.question, CUT.achat, CUT.fin].map((at) => (
        <Streaks key={at} f={f} at={at} />
      ))}
      {SFX.map(([cut, name, vol], i) => (
        <Sequence key={i} from={Math.max(0, cut - Math.round(PIC[name] * 30))}>
          <Audio src={staticFile(`sfx-benjamin/${name}.wav`)} volume={vol * 0.8} />
        </Sequence>
      ))}
      <Audio src={staticFile('adn/musique-future-bass.mp3')} trimBefore={MUSIC_TRIM} volume={musicVol} />
      <Sequence from={VOICE_AT}>
        <Audio src={staticFile('adn/voix.wav')} />
      </Sequence>
    </AbsoluteFill>
  );
};
