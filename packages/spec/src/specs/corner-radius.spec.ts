import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'corner-radius',
  name: 'CornerRadius',
  category: 'inspector',
  status: 'ready',
  purpose: 'Edits the corner radius of a shape: one value for all corners, a corner smoothing percentage, and four independent corners behind a toggle. An optional stage previews the result.',
  description: 'Pure composition of NumberFields and an IconToggle. The first row holds the radius (with a corner glyph as scrub label), the smoothing (spline icon, unit %) and the independent-corners toggle. While independent is on, a 2×2 grid of corner fields (top left, top right, bottom left, bottom right) appears below. Typing in the radius field copies the value to all four corner fields.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Vertical stack, 14px gap (stage, fields, corners).' },
    { name: 'stage', el: 'div', parent: 'root', required: false, description: 'Preview stage: bg.inset, xl radius, 20px / 14px padding, 14px gap, content centered.' },
    { name: 'shape', el: 'div', parent: 'stage', required: false, description: 'The previewed shape: 120 × 84, surface.base, a 1.5px text.primary inset ring and elevation 2. Its border-radius is the value ("16px" or "tl tr br bl"); it transitions the radius with duration-gentle and ease-spring.' },
    { name: 'fields', el: 'div', parent: 'root', description: 'Row: two equal columns and an auto column, 6px gap, items centered.' },
    { name: 'radius', el: 'any', parent: 'fields', description: 'NumberField, label is the corner glyph, aria-label "Corner radius", min 0.' },
    { name: 'smoothing', el: 'any', parent: 'fields', description: 'NumberField, spline icon label, unit "%", aria-label "Corner smoothing", 0–100.' },
    { name: 'independent', el: 'any', parent: 'fields', description: 'IconToggle xs (scan icon), aria-label "Independent corners".' },
    { name: 'glyph', el: 'span', parent: 'radius', description: 'Corner glyph used as the scrub label: a 12px square drawing only its top and left edges (1.5px) with a 6px top-left radius, in the label color. The other corner fields use the same glyph mirrored (top right: flipped horizontally, bottom left: vertically, bottom right: both).' },
    { name: 'corners', el: 'div', parent: 'root', required: false, description: 'Two-column grid, 6px gap, rendered only while independent is on.' },
    { name: 'corner', el: 'any', parent: 'corners', description: 'NumberField with the mirrored glyph as label; aria-labels Top left, Top right, Bottom left, Bottom right in that DOM order.' },
  ],
  states: {
    independent: { props: { independent: true } },
  },
  props: {
    value: { type: '{ radius: number; smoothing: number; corners: { tl: number; tr: number; bl: number; br: number } }', description: 'Controlled value. radius is the all-corners value; corners holds the four individual values.' },
    defaultValue: { type: '{ radius: number; smoothing: number; corners: { tl: number; tr: number; bl: number; br: number } }', default: { radius: 16, smoothing: 60, corners: { tl: 16, tr: 16, bl: 4, br: 16 } }, description: 'Uncontrolled initial value; the default is the specimen state.' },
    independent: { type: 'boolean', description: 'Controlled independent-corners state.' },
    defaultIndependent: { type: 'boolean', default: false, description: 'Uncontrolled initial state. The specimen starts with true.' },
    preview: { type: 'boolean', default: false, description: 'Shows the preview stage above the fields.' },
    disabled: { type: 'boolean', default: false, description: 'Disables every control.' },
  },
  events: {
    onValueChange: { payload: '{ radius: number; smoothing: number; corners: { tl: number; tr: number; bl: number; br: number } }', when: 'any field commits; changing radius sets all four corners to the same value' },
    onIndependentChange: { payload: 'boolean', when: 'the toggle is pressed' },
  },
  styles: [
    { slot: 'root', expect: { gap: 14 } },
    { slot: 'stage', when: { preview: true }, expect: { bg: 'bg.inset', radius: 'xl', padX: 14, padY: 20, gap: 14 } },
    { slot: 'shape', when: { preview: true }, expect: { bg: 'surface.base', edge: 'text.primary', shadow: '2', width: 'size-radius-preview-w', height: 'size-radius-preview-h' }, note: 'Edge is a 1.5px inset ring. Radius is data (a CSS custom property or inline border-radius derived from value).' },
    { slot: 'fields', expect: { gap: 6 } },
    { slot: 'glyph', expect: { fg: 'text.tertiary', height: 'icon-xs', width: 'icon-xs', radius: 'sm' }, note: 'Top-left radius only (6px); 1.5px top and left edges in the label color.' },
    { slot: 'corners', when: { independent: true }, expect: { gap: 6 } },
  ],
  behavior: {
    keyboard: { Tab: 'radius, smoothing, independent, then the four corner fields in DOM order', 'ArrowUp / ArrowDown': 'step the focused field (Shift ×10)' },
    pointer: ['scrub any label horizontally', 'pressing the independent toggle shows or hides the corner grid; the preview switches between one radius and four'],
    scenarios: [
      { name: 'independent toggle', props: { defaultIndependent: false }, steps: [{ do: 'click', slot: 'independent' }], expect: [{ event: 'onIndependentChange', args: [true] }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { independent: ['aria-pressed', 'aria-label'] },
    notes: ['Each field has an aria-label; the glyphs are aria-hidden.', 'The corner grid is added to the tab order only while shown.'],
  },
  policies: ['P6'],
  composition: { uses: ['number-field', 'icon-toggle'] },
  examples: [
    { id: 'corner-radius', title: 'Corner radius', doc: 'corner-radius#corner-radius' },
  ],
  usage: [
    'Example reproduces the section with preview true and defaultIndependent true: stage with the shape (radius 16 16 16 4), the three-control row (16, 60 %, toggle pressed) and the 2×2 corner grid (16, 16, 4, 16).',
    'Fixture contract: render(props) renders the defaults (independent off), so the corners grid is only present in the independent state; style probes on corners / corner use the independent state.',
    'The shape radius order is top-left, top-right, bottom-right, bottom-left; the corner fields are listed top left, top right, bottom left, bottom right.',
    'Smoothing is a value only: the specimen does not draw it in the preview.',
    'Token requests: size-radius-preview-w 120px and size-radius-preview-h 84px.',
  ],
});
