// Spot ADN Créatif 9:16 (≈ 35 s) sur la voix off validée « 3 secondes ».
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { S2, S3, S4, S5, S6, S7, S8, Streaks } from './scenes';
import { C, CUT, VOICE_AT } from './theme';

export const Adn = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <S2 f={f} />
      <S3 f={f} />
      <S4 f={f} />
      <S5 f={f} />
      <S6 f={f} />
      <S7 f={f} />
      <S8 f={f} />
      {/* traînées de couleur (REF-09) sur les changements de plan bleu ↔ blanc */}
      {[CUT.question, CUT.achat, CUT.fin].map((at) => (
        <Streaks key={at} f={f} at={at} />
      ))}
      <Sequence from={VOICE_AT}>
        <Audio src={staticFile('adn/voix.mp3')} />
      </Sequence>
    </AbsoluteFill>
  );
};
