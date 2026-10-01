import { defineFixture } from '../../lib/fixture.ts';
import { Progress } from './progress.tsx';

export default defineFixture({
  id: 'progress',
  render: props => <div className="w-60"><Progress aria-label="Upload" value={64} {...props} /></div>,
  examples: {},
});
