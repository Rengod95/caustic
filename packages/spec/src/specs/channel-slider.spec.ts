import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'channel-slider',
  name: 'ChannelSlider',
  category: 'inspector',
  status: 'ready',
  purpose: 'Token value editor for one OKLCH color: a swatch with its oklch() readout and three channel rows (L, C, H). Each track paints the real color range of its channel with the other two channels held fixed.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Vertical stack, 12px gap.' },
    { name: 'header', el: 'div', parent: 'root', description: 'Space-between row: swatch and readout on the left, mode badge on the right.' },
    { name: 'well', el: 'span', parent: 'header', description: '32px swatch of the current color, inset hairline.' },
    { name: 'readout', el: 'span', parent: 'header', description: 'The current value as oklch(L C H) text, mono, 8px after the swatch.' },
    { name: 'mode', el: 'any', parent: 'header', required: false, description: 'Badge naming the color space (outline, square corners), e.g. OKLCH.' },
    { name: 'rows', el: 'div', parent: 'root', description: 'Vertical stack of three SliderField rows, 12px gap.' },
    { name: 'note', el: 'p', parent: 'root', required: false, description: 'Explanatory line under the rows.' },
  ],
  props: {
    value: { type: '{ l: number; c: number; h: number }', description: 'Controlled color: l 0–1, c 0–0.37, h 0–360.' },
    defaultValue: { type: '{ l: number; c: number; h: number }', description: 'Uncontrolled initial color.' },
    note: { type: 'ReactNode', description: 'Footnote under the rows.' },
    disabled: { type: 'boolean', default: false, description: 'Disables all rows.' },
  },
  events: { onValueChange: { payload: '{ l: number; c: number; h: number }', when: 'any channel changes by slider or field' } },
  styles: [
    { slot: 'root', expect: { gap: 12 } },
    { slot: 'well', expect: { height: 'control-md', width: 'control-md', radius: 'md', edge: 'border.subtle' }, note: 'Fill is the current oklch color; specimen hairline is oklch(0 0 0 / .1).' },
    { slot: 'readout', expect: { text: 'mono', font: 'mono', fg: 'text.primary' } },
    { slot: 'rows', expect: { gap: 12 } },
    { slot: 'note', expect: { text: 'hint', fg: 'text.tertiary' }, note: 'Specimen line-height is 17px (hint is 18px).' },
  ],
  behavior: {
    keyboard: { ArrowRight: 'channel +step on the focused slider', Home: 'channel min', End: 'channel max' },
    pointer: ['moving a slider recolors the swatch, the readout and the other two tracks'],
    scenarios: [],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { readout: ['aria-live'] },
    notes: ['Rows are labelled Lightness, Chroma and Hue (the visible L, C, H are abbreviations).', 'The readout is a polite live region so value changes are announced once per commit.', 'Track gradients leave sRGB at high chroma; the browser maps the out-of-gamut part, which is why a numeric field is always present.'],
  },
  policies: ['P4', 'P6'],
  composition: { uses: ['slider-field', 'badge'] },
  examples: [
    { id: 'oklch', title: 'Channel sliders · OKLCH', doc: 'slider#channel-sliders-oklch' },
  ],
  usage: [
    'Row scales: L 0–100 (%), C 0–37 shown as 0.00–0.37 (fieldScale 100, no unit), H 0–360 (°).',
    'Each track is a linear-gradient built from about a dozen oklch() stops across the channel range; the thumb shows the current color.',
    'Rows use SliderField with appearance="gradient". The mode badge uses Badge outline with square corners.',
    'Example default: oklch(0.66 0.17 42).',
  ],
});
