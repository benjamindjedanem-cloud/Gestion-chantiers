// Spot ADN Créatif 9:16 (≈ 35 s) sur la voix off validée « 3 secondes ».
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { S1, S2, S3, S4, S5, S6, S7, S8 } from './scenes';
import { C, VOICE_AT } from './theme';

export const Adn = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <S2 f={f} />
      <S1 f={f} />
      <S3 f={f} />
      <S4 f={f} />
      <S5 f={f} />
      <S6 f={f} />
      <S7 f={f} />
      <S8 f={f} />
      <Sequence from={VOICE_AT}>
        <Audio src={staticFile('adn/voix.mp3')} />
      </Sequence>
    </AbsoluteFill>
  );
};
