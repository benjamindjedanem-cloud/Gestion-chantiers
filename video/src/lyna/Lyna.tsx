// Spot Lyna-Transfert 9:16 (≈ 26 s) : voix off validée + musique synthétisée + effets sonores.
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Final, MapLayer, S1, S2BG, S2Text, S3, S3BG, S4, S5 } from './scenes';
import { C, END, VOICE_AT } from './theme';
import { Wide } from './parts';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// La voix parle presque sans pause de 0,15 s à 22,7 s : la musique reste baissée sur tout ce bloc.
const V_IN = VOICE_AT + 4;
const V_OUT = VOICE_AT + Math.round(22.67 * 30);
const musicVol = (fr: number) =>
  interpolate(fr, [0, V_IN - 4, V_IN + 6, V_OUT, V_OUT + 10, END - 30, END], [0.6, 0.6, 0.28, 0.28, 0.62, 0.62, 0], clamp);

const SFX: [number, string, number][] = [
  [2, 'swoosh', 0.5],
  [8, 'swoosh', 0.35],
  [25, 'tick', 0.5],
  [29, 'whoosh', 0.5],
  [47, 'pop', 0.5],
  [51, 'swoosh', 0.35],
  [106, 'pop', 0.45],
  [124, 'pop', 0.45],
  [140, 'whoosh', 0.7],
  [160, 'pop', 0.4],
  [176, 'tick', 0.3],
  [180, 'tick', 0.3],
  [184, 'tick', 0.3],
  [202, 'whoosh', 0.5],
  [276, 'swoosh', 0.35],
  [283, 'swoosh', 0.35],
  [290, 'swoosh', 0.35],
  [297, 'swoosh', 0.35],
  [330, 'whoosh', 0.7],
  [412, 'counter', 0.35],
  [452, 'pop', 0.4],
  [472, 'whoosh-long', 0.55],
  ...[0, 1, 2, 3, 4, 5].map((i) => [518 + i * 6, 'pop', 0.3] as [number, string, number]),
  [576, 'pop', 0.35],
  [580, 'pop', 0.35],
  [584, 'pop', 0.35],
  [596, 'whoosh', 0.6],
  [688, 'swoosh', 0.45],
];

export const Lyna: React.FC<{ wide?: boolean }> = ({ wide = false }) => {
  const f = useCurrentFrame();
  return (
    <Wide.Provider value={wide}>
    <AbsoluteFill style={{ background: C.paper }}>
      <S1 f={f} />
      <S2BG f={f} />
      <S3BG f={f} />
      <MapLayer f={f} />
      <S2Text f={f} />
      <S3 f={f} />
      <S4 f={f} />
      <S5 f={f} />
      <Final f={f} />
      <Audio src={staticFile('lyna/musique.wav')} volume={musicVol} />
      <Sequence from={VOICE_AT}>
        <Audio src={staticFile('lyna/voix.wav')} volume={1} />
      </Sequence>
      {SFX.map(([at, name, vol], i) => (
        <Sequence key={i} from={at}>
          <Audio src={staticFile(`sfx-pro/${name}.wav`)} volume={vol * 0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
    </Wide.Provider>
  );
};
