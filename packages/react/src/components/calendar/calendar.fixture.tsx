import { defineFixture } from '../../lib/fixture.ts';
import { Calendar } from './calendar.tsx';

// Pinned so the first day cell is Oct 1 (a Thursday) and today is Oct 1.
export default defineFixture({
  id: 'calendar',
  render: props => <Calendar today="2026-10-01" defaultMonth="2026-10" {...props} />,
  examples: {},
});
