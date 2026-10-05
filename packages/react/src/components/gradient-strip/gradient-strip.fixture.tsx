import { defineFixture } from '../../lib/fixture.ts';
import { GradientStrip } from './gradient-strip.tsx';

export default defineFixture({
  id: 'gradient-strip',
  render: props => (
    <div className="w-98">
      <GradientStrip
        stopLabel={n => `Stop ${n}`}
        stops={[{ position: 0, color: '#E2763F' }, { position: 52, color: '#F4C26B' }, { position: 100, color: '#5F4994' }]}
        selected={1}
        {...props}
      />
    </div>
  ),
  examples: {},
});
