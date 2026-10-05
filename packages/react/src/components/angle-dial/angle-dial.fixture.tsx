import { defineFixture } from '../../lib/fixture.ts';
import { AngleDial } from './angle-dial.tsx';

export default defineFixture({
  id: 'angle-dial',
  render: props => <AngleDial label="Angle" valueText={d => `${d} degrees`} defaultValue={90} {...props} />,
  examples: {},
});
