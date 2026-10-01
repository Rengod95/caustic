import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'separator',
  name: 'Separator',
  category: 'structure',
  status: 'ready',
  purpose: 'A 1px divider: horizontal rule, vertical rule between inline items, or a rule with a centered label.',
  role: 'separator',
  slots: [
    { name: 'root', el: 'div', role: 'separator', description: 'Plain rule (Radix Separator): the 1px line itself. With a label it becomes a flex row that holds the two lines and the label.' },
    { name: 'line', el: 'span', parent: 'root', required: false, description: 'Labeled only: two flexible 1px lines either side of the label.' },
    { name: 'label', el: 'span', parent: 'root', required: false, description: 'Labeled only: short centered text.' },
  ],
  variants: {
    orientation: { values: ['horizontal', 'vertical'], default: 'horizontal', description: 'vertical stretches to the height of its flex row (align-self: stretch).' },
  },
  props: {
    orientation: { type: "'horizontal' | 'vertical'", default: 'horizontal', description: 'Direction of the rule.' },
    decorative: { type: 'boolean', default: true, description: 'true removes the separator role (purely visual); false keeps role="separator" with aria-orientation.' },
    label: { type: 'ReactNode', description: 'Centered label; horizontal only.' },
  },
  styles: [
    { slot: 'root', when: { orientation: 'horizontal' }, expect: { bg: 'border.default', height: 1 } },
    { slot: 'root', when: { orientation: 'vertical' }, expect: { bg: 'border.default', width: 1 } },
    { slot: 'root', when: { label: 'or continue with' }, expect: { bg: 'transparent', fg: 'text.tertiary', gap: 12, text: 'ui-sm', weight: 400 } },
    { slot: 'line', when: { label: 'or continue with' }, expect: { bg: 'border.default', height: 1 } },
  ],
  a11y: { notes: ['Decorative by default. Use decorative={false} only when the divider separates distinct regions that assistive tech should announce.', 'A label is read as normal text; do not put actions inside.'] },
  policies: ['P6'],
  composition: { uses: ['spinner', 'button'], radix: [] },
  examples: [{ id: 'separator-and-spinner', title: 'Separator & spinner', doc: 'separator#separator-and-spinner' }],
  usage: [
    'Use a rule to divide, not to decorate; prefer spacing when grouping is already clear.',
    'The vertical rule takes its height from the row it sits in.',
    '`uses: spinner, button` is for the example fixture only (the Saving button is Button loading).',
  ],
});
