import { defineFixture } from '../../lib/fixture.ts';
import { EasingCurve } from './easing-curve.tsx';

export default defineFixture({
  id: 'easing-curve',
  render: props => <EasingCurve progress={1} {...props} />,
  examples: {
    // The specimen ball sits at the start in the baseline; the loop is off so the capture is deterministic.
    'easing-curve': () => <EasingCurve defaultBezier={[0.2, 0.8, 0.2, 1]} progress={0} />,
  },
});
