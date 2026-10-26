import { Composition, Still } from 'remotion';
import { Full, FULL_DURATION } from './anim/Full';
import { FullCourt, COURT_DURATION } from './anim/court/FullCourt';
import { Part1 } from './anim/Part1';
import { FRAMES } from './frames/StyleFrames';
import { V2_FRAMES } from './v2/frames';
import { V3_FRAMES } from './v3/frames';
import { V4_FRAMES } from './v4/frames';
import { VIDEO } from './theme';
import { Lyna } from './lyna/Lyna';
import { Adn } from './adn/Adn';
import { END as ADN_END } from './adn/theme';
import { END as LYNA_END } from './lyna/theme';

export const RemotionRoot = () => (
  <>
    <Composition
      id="Promo"
      component={Full}
      durationInFrames={FULL_DURATION}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition id="PromoCourte" component={FullCourt} durationInFrames={COURT_DURATION} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Lyna" component={Lyna} durationInFrames={LYNA_END} fps={30} width={1080} height={1920} />
    <Composition id="Lyna-16x9" component={Lyna} durationInFrames={LYNA_END} fps={30} width={1920} height={1080} defaultProps={{ wide: true }} />
    <Composition id="Adn" component={Adn} durationInFrames={ADN_END} fps={30} width={1080} height={1920} />
    <Composition id="Partie1" component={Part1} durationInFrames={540} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    {Object.entries({ ...FRAMES, ...V2_FRAMES, ...V3_FRAMES, ...V4_FRAMES }).map(([id, Frame]) => (
      <Still key={id} id={`Frame-${id}`} component={Frame} width={VIDEO.width} height={VIDEO.height} />
    ))}
  </>
);
