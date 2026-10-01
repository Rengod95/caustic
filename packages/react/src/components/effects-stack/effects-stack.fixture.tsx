import { Droplet, SquareStack } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { EffectEditor } from '../effect-editor/effect-editor.tsx';
import { EffectsStack, type EffectItem } from './effects-stack.tsx';

const items: EffectItem[] = [
  { id: 'shadow', icon: <SquareStack />, label: 'Drop shadow', meta: '24 px' },
  { id: 'blur', icon: <Droplet />, label: 'Background blur', meta: 'hidden', hidden: true },
];

export default defineFixture({
  id: 'effects-stack',
  render: props => <EffectsStack items={items} {...props} />,
  examples: {
    'effects-stack-and-shadow': () => (
      <div className="flex flex-col gap-3.5">
        <EffectsStack items={items} />
        <EffectEditor preview />
      </div>
    ),
  },
});
