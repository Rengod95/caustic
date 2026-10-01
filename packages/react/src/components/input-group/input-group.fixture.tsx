import { defineFixture } from '../../lib/fixture.ts';
import { InputGroup } from './input-group.tsx';

export default defineFixture({
  id: 'input-group',
  render: props => <InputGroup aria-label="Custom domain" start="https://" end=".co" placeholder="design.orbit" {...props} />,
  examples: {},
});
