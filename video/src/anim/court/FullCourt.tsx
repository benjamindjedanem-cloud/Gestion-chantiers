// Variante courte (34,8 s) avec voix off : mêmes images que la première version complète,
// phrases de la voix replacées sur ce montage (la question « Vous payez un fournisseur… » est retirée, faute de place).
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { K } from '../../v3/kit';
import { S1, S2, S3, S4, S5, SFX1 } from '../Part1';
import { VOICE_DUR } from '../Part2';
import { GesturesBG, S6, S7, S8, S9, S10, S11, SFX2, VIDEO_END } from './Part2Court';

export const COURT_DURATION = VIDEO_END;

const S = (sec: number) => Math.round(sec * 30);
const VOICE_COURT: [number, string][] = [
  [S(0.35), 'v01'], [S(2.2), 'v02'], [S(5.75), 'v03'], [S(7.3), 'v04'], [S(9.45), 'v05'], [S(10.7), 'v06'], [S(12.1), 'v07'],
  [S(14.55), 'v08'],
  [S(17.9), 'v09'], [S(18.85), 'v10'],
  [S(21.7), 'v12'],
  [S(24.7), 'v13'],
  [S(28.0), 'v14'],
  [S(30.3), 'v16'],
  [S(33.3), 'v15'],
];

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const voiceActive = (f: number) =>
  Math.max(0, ...VOICE_COURT.map(([at, id]) => {
    const end = at + Math.round(VOICE_DUR[id] * 30);
    return interpolate(f, [at - 8, at, end, end + 10], [0, 1, 1, 0], clamp);
  }));

export const FullCourt = () => {
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
      <Audio
        src={staticFile('musique.mp3')}
        trimBefore={36}
        volume={(fr) => (0.5 - 0.39 * voiceActive(fr)) * interpolate(fr, [VIDEO_END - 45, VIDEO_END], [1, 0], clamp)}
      />
      {VOICE_COURT.map(([at, id]) => (
        <Sequence key={id} from={at}>
          <Audio src={staticFile(`voix/${id}.wav`)} volume={1} />
        </Sequence>
      ))}
      {[...SFX1, ...SFX2].map(([at, name, vol], i) => (
        <Sequence key={i} from={at}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * 0.7} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
