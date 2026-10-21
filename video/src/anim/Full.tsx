// Vidéo complète : plans 1 à 11, voix off, musique (baissée sous la voix) et effets sonores.
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { K } from '../v3/kit';
import { S1, S2, S3, S4, S5, SFX1 } from './Part1';
import { GesturesBG, S6, S7, S8, S9, S10, S11, SFX2, VIDEO_END, VOICE, VOICE_DUR } from './Part2';

export const FULL_DURATION = VIDEO_END;

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// 1 quand la voix parle (avec rampes de 8 images), 0 sinon.
const voiceActive = (f: number) =>
  Math.max(0, ...VOICE.map(([at, id]) => {
    const end = at + Math.round(VOICE_DUR[id] * 30);
    return interpolate(f, [at - 8, at, end, end + 10], [0, 1, 1, 0], clamp);
  }));

export const Full = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: K.navy }}>
      <S4 f={f} />
      <S3 f={f} />
      <S1 f={f} />
      <S2 f={f} />
      <GesturesBG f={f} />
      <S6 f={f} />
      <S7 f={f} />
      <S8 f={f} />
      <S5 f={f} />
      <S10 f={f} />
      <S9 f={f} />
      <S11 f={f} />
      {/* musique : coupée à 1,2 s, baissée sous la voix, fondu de sortie */}
      <Audio
        src={staticFile('musique.mp3')}
        trimBefore={36}
        volume={(fr) => (0.5 - 0.39 * voiceActive(fr)) * interpolate(fr, [VIDEO_END - 60, VIDEO_END], [1, 0], clamp)}
      />
      {VOICE.map(([at, id]) => (
        <Sequence key={id} from={at}>
          <Audio src={staticFile(`voix/${id}.wav`)} volume={1} />
        </Sequence>
      ))}
      {[...SFX1.map(([a, n, v]) => [a, n, v * 0.7] as [number, string, number]), ...SFX2].map(([at, name, vol], i) => (
        <Sequence key={i} from={at}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
