import { Droplet, SquareStack } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { EffectEditor, type EffectEditorLabels } from '../effect-editor/effect-editor.tsx';
import { EffectsStack, type EffectItem, type EffectsStackLabels } from './effects-stack.tsx';

const editorLabels: EffectEditorLabels = {
  x: 'Shadow X', y: 'Shadow Y', blur: 'Blur', spread: 'Spread', xShort: 'X', yShort: 'Y', blurShort: 'Blur', spreadShort: 'Spread',
  color: { well: 'Shadow color', hex: 'Shadow hex', alpha: 'Shadow opacity', detach: 'Detach', mixed: 'Mixed' },
  mixed: 'Mixed',
};

const items: EffectItem[] = [
  { id: 'shadow', icon: <SquareStack />, label: 'Drop shadow', meta: '24 px' },
  { id: 'blur', icon: <Droplet />, label: 'Background blur', meta: 'hidden', hidden: true },
];

const labels: EffectsStackLabels = {
  list: 'Effects', hide: n => `Hide ${n}`, show: n => `Show ${n}`, remove: n => `Remove ${n}`, moveUp: n => `Move ${n} up`, moveDown: n => `Move ${n} down`,
};

export default defineFixture({
  id: 'effects-stack',
  render: props => <EffectsStack items={items} labels={labels} {...props} />,
  examples: {
    'effects-stack-and-shadow': () => (
      <div className="flex flex-col gap-3.5">
        <EffectsStack items={items} labels={labels} />
        <EffectEditor preview labels={editorLabels} />
      </div>
    ),
  },
});
