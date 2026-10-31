import { defineFixture } from '../../lib/fixture.ts';
import { Meter } from './meter.tsx';

export default defineFixture({
  id: 'meter',
  render: props => <div className="w-60"><Meter label="Budget" value={30} high={50} {...props} /></div>,
  examples: {},
});
