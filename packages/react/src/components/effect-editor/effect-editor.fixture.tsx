import { defineFixture } from '../../lib/fixture.ts';
import { EffectEditor } from './effect-editor.tsx';

export default defineFixture({
  id: 'effect-editor',
  render: props => <EffectEditor preview {...props} />,
  examples: {},
});
