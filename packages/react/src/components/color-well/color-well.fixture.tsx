import { defineFixture } from '../../lib/fixture.ts';
import { ColorWell } from './color-well.tsx';

export default defineFixture({
  id: 'color-well',
  render: props => <ColorWell aria-label="Fill color E2763F" color="#e2763f" appearance="checker" {...props} />,
  examples: {},
});
