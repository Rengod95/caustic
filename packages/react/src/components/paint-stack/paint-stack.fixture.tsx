import { defineFixture } from '../../lib/fixture.ts';
import { InspectorPanel } from '../inspector-panel/inspector-panel.tsx';
import { PaintStack, type PaintItem } from './paint-stack.tsx';

const items: PaintItem[] = [
  { id: 'linear', color: 'linear-gradient(90deg, #e2763f, #5f4994)', label: 'Linear', meta: '2 stops', opacity: 100 },
  { id: 'token', color: 'var(--cs-color-accent-solid)', label: 'accent/solid', mono: true, meta: 'token', opacity: 100 },
  { id: 'hidden', color: '#2b1d1480', checker: true, label: '2B1D14', mono: true, meta: 'hidden', opacity: 50, hidden: true },
];

export default defineFixture({
  id: 'paint-stack',
  render: props => <PaintStack items={items} {...props} />,
  examples: {
    'fill-stack': () => (
      <InspectorPanel aria-label="Inspector">
        <PaintStack items={items} />
        <PaintStack title="Fill · 3 selected" mixed />
      </InspectorPanel>
    ),
  },
});
