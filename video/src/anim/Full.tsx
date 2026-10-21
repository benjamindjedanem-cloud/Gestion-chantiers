// Vidéo complète : plans 1 à 11, musique et effets sonores.
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { K } from '../v3/kit';
import { S1, S2, S3, S4, S5, SFX1 } from './Part1';
import { GesturesBG, S6, S7, S8, S9, S10, S11, SFX2, VIDEO_END } from './Part2';

export const FULL_DURATION = VIDEO_END;

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
      {/* musique : coupée à 1,2 s, fondu de sortie sur la note finale */}
      <Audio
        src={staticFile('musique.mp3')}
        trimBefore={36}
        volume={(fr) => 0.75 * interpolate(fr, [VIDEO_END - 45, VIDEO_END], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
      />
      {[...SFX1, ...SFX2].map(([at, name, vol], i) => (
        <Sequence key={i} from={at}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
