import { defineFixture } from '../../lib/fixture.ts';
import { EasingCurve } from './easing-curve.tsx';

export default defineFixture({
  id: 'easing-curve',
  render: props => <EasingCurve progress={0} {...props} />,
  examples: {
    'easing-curve': () => <EasingCurve defaultBezier={[0.2, 0.8, 0.2, 1]} progress={1} />,
  },
});
