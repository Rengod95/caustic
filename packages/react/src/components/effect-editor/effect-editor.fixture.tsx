import { defineFixture } from '../../lib/fixture.ts';
import { EffectEditor, type EffectEditorLabels } from './effect-editor.tsx';

const labels: EffectEditorLabels = {
  x: 'Shadow X', y: 'Shadow Y', blur: 'Blur', spread: 'Spread', xShort: 'X', yShort: 'Y', blurShort: 'Blur', spreadShort: 'Spread',
  color: { well: 'Shadow color', hex: 'Shadow hex', alpha: 'Shadow opacity', detach: 'Detach', mixed: 'Mixed' },
  mixed: 'Mixed',
};

export default defineFixture({
  id: 'effect-editor',
  render: props => <EffectEditor preview labels={labels} {...props} />,
  examples: {},
});
