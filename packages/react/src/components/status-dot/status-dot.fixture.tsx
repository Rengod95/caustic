import { defineFixture } from '../../lib/fixture.ts';
import { StatusDot } from './status-dot.tsx';

export default defineFixture({
  id: 'status-dot',
  render: props => <StatusDot label="On · 2 failures" {...props} />,
  examples: {},
});
