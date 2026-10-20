import { Composition, Still } from 'remotion';
import { Promo } from './Promo';
import { FRAMES } from './frames/StyleFrames';
import { VIDEO } from './theme';

export const RemotionRoot = () => (
  <>
    <Composition
      id="Promo"
      component={Promo}
      durationInFrames={VIDEO.fps * 3}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    {Object.entries(FRAMES).map(([id, Frame]) => (
      <Still key={id} id={`Frame-${id}`} component={Frame} width={VIDEO.width} height={VIDEO.height} />
    ))}
  </>
);
