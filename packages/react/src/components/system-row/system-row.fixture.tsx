import { Compass } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { SystemRow } from './system-row.tsx';

export default defineFixture({
  id: 'system-row',
  render: props => <div className="w-100 max-w-full"><SystemRow icon={<Compass />} {...props}>Helm suggests a new group</SystemRow></div>,
  examples: {},
});
