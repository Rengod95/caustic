import { defineFixture } from '../../lib/fixture.ts';
import { TextProperties } from './text-properties.tsx';

export default defineFixture({
  id: 'text-properties',
  render: props => <TextProperties {...props} />,
  examples: {
    'text-properties': () => <TextProperties styleRuns={3} />,
  },
});
