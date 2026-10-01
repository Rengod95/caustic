import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'slider-field',
  name: 'SliderField',
  category: 'inspector',
  status: 'ready',
  purpose: 'A slider with its label on the left and a precise numeric field on the right, kept in sync. The inspector row for opacity, hue, alpha and blur.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Flex row, 10px gap, items centered.' },
    { name: 'label', el: 'span', parent: 'root', required: false, description: 'Fixed 52px label column.' },
    { name: 'slider', el: 'any', parent: 'root', description: 'The Slider, flexible width.' },
    { name: 'field', el: 'any', parent: 'root', description: 'NumberField (no scrub label), fixed 72px, with an optional unit suffix.' },
  ],
  props: {
    label: { type: 'ReactNode', description: 'Row label; also names the slider and the field (aria-label).' },
    value: { type: 'number', description: 'Controlled value, in slider units.' },
    defaultValue: { type: 'number', description: 'Uncontrolled initial value, in slider units.' },
    min: { type: 'number', default: 0, description: 'Lower bound.' },
    max: { type: 'number', default: 100, description: 'Upper bound.' },
    step: { type: 'number', default: 1, description: 'Step for slider and field arrows.' },
    unit: { type: 'ReactNode', description: 'Unit suffix in the field (%, °, px).' },
    fieldScale: { type: 'number', default: 1, description: 'The field shows value / fieldScale (e.g. 100 shows 17 as 0.17 for OKLCH chroma).' },
    appearance: { type: "'default' | 'gradient' | 'alpha' | 'ruler'", default: 'default', description: 'Passed to the Slider.' },
    size: { type: "'sm' | 'md' | 'lg'", default: 'md', description: 'Passed to the Slider.' },
    gradient: { type: 'string', description: 'Passed to the Slider.' },
    thumbColor: { type: 'string', description: 'Passed to the Slider.' },
    disabled: { type: 'boolean', default: false, description: 'Disables both controls.' },
  },
  events: { onValueChange: { payload: 'number', when: 'the slider moves or a typed field value is committed; the payload is in slider units' } },
  styles: [
    { slot: 'root', expect: { gap: 10 } },
    { slot: 'label', expect: { fg: 'text.secondary', text: 'hint', width: 'size-slider-label-w' } },
    { slot: 'field', expect: { width: 72 }, note: 'Number field is 32px (control-md) tall; the unit is tertiary.' },
  ],
  behavior: {
    keyboard: { ArrowRight: 'slider +step', ArrowUp: 'field +step when focused' },
    pointer: ['dragging the slider updates the field live', 'committing the field (Enter or blur) moves the slider and clamps to min and max'],
    scenarios: [],
  },
  a11y: { labelRequired: true, minHit: 24, notes: ['The label names both the slider (aria-label) and the field, so each is announced with its purpose.'] },
  policies: ['P6'],
  flags: { field: true },
  composition: { uses: ['slider', 'number-field'] },
  examples: [
    { id: 'variants', title: 'Slider · variants', doc: 'slider#slider-variants' },
  ],
  usage: [
    'The variants example shows four rows (Opacity default, Hue gradient, Alpha over checker, Blur ruler) and, under a "Sizes" subheading (micro text, tertiary), bare Slider sm, md and lg in a 12px stack.',
    'Use for inspector rows; for a bare slider in a card or toolbar use Slider.',
    'Behavior is covered by the Slider and NumberField scenarios; this component only wires them together.',
  ],
});
