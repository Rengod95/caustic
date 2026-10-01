import { defineFixture } from '../../lib/fixture.ts';
import { Slider } from './slider.tsx';

const hue = 'linear-gradient(90deg,oklch(0.7 0.2 0),oklch(0.7 0.2 120),oklch(0.7 0.2 240),oklch(0.7 0.2 360))';

export default defineFixture({
  id: 'slider',
  render: props => (
    <div className="flex w-60">
      <Slider aria-label="Value" defaultValue={50} gradient={props.appearance === 'alpha' ? 'linear-gradient(90deg,transparent,var(--cs-color-accent-solid))' : hue} thumbColor="var(--cs-color-accent-solid)" {...props} />
    </div>
  ),
  examples: {},
});
