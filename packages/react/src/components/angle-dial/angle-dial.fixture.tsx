import { defineFixture } from '../../lib/fixture.ts';
import { AngleDial } from './angle-dial.tsx';

export default defineFixture({
  id: 'angle-dial',
  render: props => <AngleDial defaultValue={90} {...props} />,
  examples: {},
});
