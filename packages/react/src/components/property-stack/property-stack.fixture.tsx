import { Droplet, SquareStack } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { EffectEditor, type EffectEditorLabels } from '../effect-editor/effect-editor.tsx';
import { InspectorPanel } from '../inspector-panel/inspector-panel.tsx';
import { PropertyStack, type PropertyItem, type PropertyStackLabels } from './property-stack.tsx';

const items: PropertyItem[] = [
  { id: 'linear', color: 'linear-gradient(90deg, #e2763f, #5f4994)', label: 'Linear', meta: '2 stops', opacity: 100 },
  { id: 'token', color: 'var(--cs-color-accent-solid)', label: 'accent/solid', mono: true, meta: 'token', opacity: 100 },
  { id: 'hidden', color: '#2b1d1480', checker: true, label: '2B1D14', mono: true, meta: 'hidden', opacity: 50, hidden: true },
];

const labels: PropertyStackLabels = {
  list: 'Fill layers', styles: 'Styles', add: 'Add fill', mixedPaints: 'Mixed paints', replaceAll: 'Replace all',
  hide: 'Hide', show: 'Show', remove: 'Remove', moveUp: 'Move up', moveDown: 'Move down', opacity: 'Opacity', mixed: 'Mixed',
};

// kind effect (the former EffectsStack): icon rows, actions always visible, label builders.
const effects: PropertyItem[] = [
  { id: 'shadow', icon: <SquareStack />, label: 'Drop shadow', meta: '24 px' },
  { id: 'blur', icon: <Droplet />, label: 'Background blur', meta: 'hidden', hidden: true },
];

const effectLabels: PropertyStackLabels = {
  list: 'Effects', hide: n => `Hide ${n}`, show: n => `Show ${n}`, remove: n => `Remove ${n}`, moveUp: n => `Move ${n} up`, moveDown: n => `Move ${n} down`,
};

const editorLabels: EffectEditorLabels = {
  x: 'Shadow X', y: 'Shadow Y', blur: 'Blur', spread: 'Spread', xShort: 'X', yShort: 'Y', blurShort: 'Blur', spreadShort: 'Spread',
  color: { well: 'Shadow color', hex: 'Shadow hex', alpha: 'Shadow opacity', detach: 'Detach', mixed: 'Mixed' },
  mixed: 'Mixed',
};

export default defineFixture({
  id: 'property-stack',
  // kind paint renders the Fill section; kind effect renders the bare effect list (no title), as the two stacks did.
  render: props => (props.kind === 'effect'
    ? <PropertyStack kind="effect" items={effects} labels={effectLabels} {...props} />
    : <PropertyStack title="Fill" labels={labels} items={items} {...props} />),
  examples: {
    'fill-stack': () => (
      <InspectorPanel aria-label="Inspector">
        <PropertyStack title="Fill" labels={labels} items={items} onStylesClick={() => {}} />
        <PropertyStack title="Fill · 3 selected" labels={labels} mixed />
      </InspectorPanel>
    ),
    // The effect being edited below the list is the selected row.
    'effects-stack-editing-effect': () => <PropertyStack kind="effect" items={effects} labels={effectLabels} selected="shadow" onSelect={() => undefined} />,
    'effects-stack-effects-stack-and-shadow': () => (
      <div className="flex flex-col gap-3.5">
        <PropertyStack kind="effect" items={effects} labels={effectLabels} />
        <EffectEditor preview labels={editorLabels} />
      </div>
    ),
    // A titled effect section: the header add button and the editor opened inline under the pressed row.
    'effect-section': () => (
      <InspectorPanel aria-label="Inspector">
        <PropertyStack
          kind="effect" title="Effects" items={effects} labels={{ ...effectLabels, add: 'Add effect' }} defaultOpenItem="shadow"
          detail={item => (item.id === 'shadow' ? <EffectEditor labels={editorLabels} /> : null)}
        />
      </InspectorPanel>
    ),
  },
});
