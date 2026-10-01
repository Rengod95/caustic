import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'compare-view',
  name: 'CompareView',
  category: 'canvas',
  status: 'ready',
  purpose: 'Compares two renderings of the same design: split mode reveals "before" on the left and "after" on the right of a draggable divider; overlay mode lays "after" over "before" at an adjustable opacity.',
  description: 'A bounded stage that shows two nodes (the consumer renders both, for example two frames or screenshots) with two floating labels. In split mode the divider is a slider: drag it or use the arrow keys; the after side is clipped from the divider to the right edge. In overlay mode the divider is hidden and the after side fades through the opacity prop. The mode switch (Segmented control Split / Overlay) and the overlay opacity slider are the consumer\'s controls and sit outside the stage.',
  role: 'group',
  slots: [
    { name: 'root', el: 'div', role: 'group', description: 'The stage. Relative, 210px tall, xl radius, overflow hidden, canvas background. Needs an accessible name (aria-label, for example "Before and after").' },
    { name: 'before', el: 'div', parent: 'root', description: 'The before side: absolutely fills the stage, content centered. Holds the consumer\'s before node.' },
    { name: 'after', el: 'div', parent: 'root', description: 'The after side: fills the stage over before, with its own canvas background so it covers it. Split mode: clipped from the divider to the right edge (clip-path inset(0 0 0 position%)). Overlay mode: not clipped, opacity from the opacity prop.' },
    { name: 'label-before', el: 'span', parent: 'root', description: 'Caption of the before side, top left (10px from the top and left): "v2.3". Thick glass pill, 20px, 8px inline padding, 11px medium, above the sides.' },
    { name: 'label-after', el: 'span', parent: 'root', description: 'Caption of the after side, top right: "Now". Same pill.' },
    { name: 'divider', el: 'div', parent: 'root', required: false, role: 'slider', description: 'The split handle (split mode only): a 2px full-height line at left position%, thumb color with a 0.5px dark outline, ew-resize cursor, touch-action none. role slider, tabIndex 0, aria-label "Split position", aria-orientation horizontal, aria-valuemin 4, aria-valuemax 96, aria-valuenow the position, aria-valuetext "50% before". Hidden in overlay mode.' },
    { name: 'knob', el: 'span', parent: 'divider', description: 'Grip circle centered on the divider: 26px, thumb color, elevation 3. Decorative.' },
  ],
  variants: {
    mode: { values: ['split', 'overlay'], default: 'split', description: 'split = divider reveals before / after; overlay = after at an adjustable opacity.' },
  },
  states: {
    'focus-visible': { pseudo: ['focus', 'focus-visible'], target: 'divider' },
  },
  props: {
    'aria-label': { type: 'string', required: true, description: 'Accessible name of the stage.' },
    mode: { type: "'split' | 'overlay'", default: 'split', description: 'Comparison mode.' },
    value: { type: 'number', description: 'Controlled divider position, in percent of the width (4 to 96).' },
    defaultValue: { type: 'number', default: 50, description: 'Uncontrolled initial position.' },
    opacity: { type: 'number', default: 0.5, description: 'Overlay mode: opacity of the after side (0 to 1); set as --ov.' },
    before: { type: 'ReactNode', required: true, description: 'The before content.' },
    after: { type: 'ReactNode', required: true, description: 'The after content.' },
    beforeLabel: { type: 'ReactNode', required: true, description: 'Caption of the before side ("v2.3").' },
    afterLabel: { type: 'ReactNode', required: true, description: 'Caption of the after side ("Now").' },
  },
  events: {
    onValueChange: { payload: 'number', when: 'the divider moves (drag or keys). Percent, clamped to 4 to 96.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'bg.canvas', radius: 'xl', height: 'size-compare-h' } },
    { slot: 'after', expect: { bg: 'bg.canvas' } },
    { slot: 'label-before', expect: { material: 'thick', radius: 'full', height: 'control-2xs', padX: 8, text: 'ui-xs', weight: 500, fg: 'text.primary' } },
    { slot: 'label-after', expect: { material: 'thick', radius: 'full', height: 'control-2xs', padX: 8, text: 'ui-xs', weight: 500, fg: 'text.primary' } },
    { slot: 'divider', expect: { bg: 'control.thumb', width: 2, cursor: 'ew-resize' } },
    { slot: 'divider', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'knob', expect: { bg: 'control.thumb', shadow: '3', radius: 'full', height: 26, width: 26 }, note: '26px is the 6.5 space step.' },
  ],
  behavior: {
    keyboard: {
      'Tab': 'focuses the divider (split mode)',
      'ArrowLeft / ArrowRight': 'move the divider 2 percentage points; clamped to 4 to 96',
      'Shift + ArrowLeft / ArrowRight': 'move 10 points',
      'Home / End': 'move to 4 / 96',
    },
    pointer: [
      'pressing the divider captures the pointer; moving it sets the position from the pointer x within the stage, clamped to 4 to 96',
      'the sides themselves are not interactive',
    ],
    scenarios: [
      { name: 'ArrowRight moves the divider', steps: [{ do: 'focus', slot: 'divider' }, { do: 'press', key: 'ArrowRight' }], expect: [{ event: 'onValueChange', calls: 1, args: [52] }, { slot: 'divider', attr: { 'aria-valuenow': '52' } }] },
      { name: 'divider is a slider', steps: [], expect: [{ slot: 'divider', attr: { role: 'slider', 'aria-valuenow': '50' } }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { root: ['aria-label'], divider: ['aria-label', 'aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-valuetext'] },
    notes: [
      'The divider is a slider with keyboard control; dragging is never the only way.',
      'The two captions name what each side is, so the comparison is not only visual; the consumer should also expose the difference as text (see ChangeDetail).',
      'Overlay opacity is a separate slider owned by the consumer (Slider with aria-label "Opacity").',
      'Focus ring on the divider uses the standard ring; the 26px knob is a 24px+ hit target.',
    ],
  },
  policies: ['P1', 'P6', 'P8'],
  flags: { floating: true },
  composition: { uses: [] },
  examples: [{ id: 'visual-comparison', title: 'Visual comparison', doc: 'history#visual-comparison' }],
  usage: [
    'Fixture render(props): aria-label "Before and after", before and after art, beforeLabel "v2.3", afterLabel "Now", defaultValue 50, mode split.',
    'The specimen art is demo content, rendered by the fixture: a 66% by 70% artboard (canvas artboard fill, radius var(--r), shadow 0 6px 18px -8px at 30% black, grid with 8px gap, 14px padding, aligned to the start) with three 8px bars (4px radius, 40% / 70% / 60% wide, fill ink at 12%) and a 22px button bar (50% wide, radius var(--rb), 6px top margin, fill var(--btn)). Before: --r 10px, --rb 6px, --btn near-black (oklch .22 .02 50). After: --r 20px, --rb 999px, --btn orange (oklch .56 .16 42), 20px padding, on a canvas background. Those literal colors are art data supplied through custom properties; open question whether the fixture may use them.',
    'Example frame: only the stage is captured. The specimen\'s mode switch (a Segmented control xs "Split" / "Overlay") sits in the hidden caption row and the overlay opacity row is hidden, so neither is part of the baseline.',
    'The overlay opacity row of the specimen ("Opacity" label 52px wide + Slider, default 50) is the consumer\'s composition of Slider; it is only shown in overlay mode.',
  ],
});
