import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'canvas-size-label',
  name: 'CanvasSizeLabel',
  category: 'canvas',
  status: 'ready',
  purpose: 'The small selection-colored chip that reports a size ("180 × 44") under a selection or a shape being drawn.',
  role: null,
  slots: [{ name: 'root', el: 'span', description: 'Pill-ish chip, 18px tall, mono text. The parent centers it horizontally 24px below its bottom edge.' }],
  props: {
    children: { type: 'ReactNode', required: true, description: 'The text: width, the multiplication sign (U+00D7) and height, e.g. "180 × 44".' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'canvas.selection', fg: 'canvas.selection-on', font: 'mono', text: 'mono-sm', height: 18, padX: 6, radius: 'sm' }, note: 'Specimen: 500 10.5px / 18px mono, radius 5, no wrap. mono-sm is 11 / 16 / 500 (0.5px larger, line-height 2px smaller); the 18px height is explicit. Radius 5 maps to sm (6).' },
  ],
  a11y: { notes: ['Decorative: the same numbers are in the inspector. aria-hidden.'] },
  policies: ['P6', 'P7'],
  composition: { uses: [] },
  examples: [],
  usage: [
    'Fixture convention: render(props) renders "180 × 44" unless children are passed.',
    'Near-duplicate: 10.5px / 18px is within 1px of mono-sm (11 / 16) and mono-md (11.5 / 18); mono-sm is the closest in size, mono-md in line-height.',
  ],
});
