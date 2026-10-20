import { Composition } from 'remotion';
import { Promo } from './Promo';
import { VIDEO } from './theme';

export const RemotionRoot = () => (
  <Composition
    id="Promo"
    component={Promo}
    durationInFrames={VIDEO.fps * 3}
    fps={VIDEO.fps}
    width={VIDEO.width}
    height={VIDEO.height}
  />
);
