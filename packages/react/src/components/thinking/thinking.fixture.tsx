import { defineFixture } from '../../lib/fixture.ts';
import { Thinking } from './thinking.tsx';

export default defineFixture({
  id: 'thinking',
  render: props => (
    <Thinking label="Thinking" defaultOpen {...props}>Dark surfaces need a lighter accent step to hold contrast. Moving accent/solid from 600 to 400 keeps the hue and passes on surface.</Thinking>
  ),
  examples: {},
});
