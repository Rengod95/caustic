import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'alignment-pad',
  name: 'AlignmentPad',
  category: 'inspector',
  status: 'ready',
  purpose: 'Picks where children sit inside an auto-layout frame on a 3×3 grid. The chosen cell draws a three-bar glyph that follows the layout flow, so the pad also shows the direction.',
  description: 'A radio group of nine cells. The value is a position, not a number: top-left … bottom-right. The pad does not know the flow; the owner passes orientation so the selected glyph runs along the main axis (vertical bars for a row, horizontal bars for a column).',
  role: 'radiogroup',
  slots: [
    { name: 'root', el: 'div', role: 'radiogroup', description: '96px square, 3×3 grid, 6px padding, 2px gap; neutral.well with a hairline inset edge and an lg radius.' },
    { name: 'cell', el: 'button', parent: 'root', role: 'radio', description: 'One position (nine per pad). aria-checked, roving tabindex. xs radius.' },
    { name: 'mark', el: 'span', parent: 'cell', description: 'Decorative glyph centered in the cell: a 4px dot when off; when on, three 2px bars (12px long, 4px apart) in accent.solid, vertical for orientation row and horizontal for column.' },
  ],
  variants: {
    orientation: { values: ['row', 'column'], default: 'row', description: 'Direction of the selected glyph: row = vertical bars, column = horizontal bars. Free, grid and wrap flows use column.' },
  },
  states: {
    hover: { pseudo: ['hover'], target: 'cell' },
    'focus-visible': { pseudo: ['focus', 'focus-visible'], target: 'cell' },
    selected: { props: { defaultValue: 'top-left' } },
    disabled: { props: { disabled: true } },
  },
  props: {
    label: { type: 'string', required: true, description: 'aria-label of the group (e.g. "Alignment"). Required; no built-in default.' },
    cellLabels: { type: "Record<'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right', string>", required: true, description: 'aria-label of each cell (e.g. "Top left"). Required; no built-in default.' },
    value: { type: "'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'", description: 'Controlled position.' },
    defaultValue: { type: "'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'", default: 'middle-left', description: 'Uncontrolled initial position. Specimen: middle-left (cell 4 of 9).' },
    orientation: { type: "'row' | 'column'", default: 'row', description: 'Glyph direction.' },
    disabled: { type: 'boolean', default: false, description: 'Disables the pad (a free-position frame has no alignment).' },
  },
  events: { onValueChange: { payload: 'string', when: 'a cell is chosen by click or arrow key' } },
  styles: [
    { slot: 'root', expect: { bg: 'neutral.well', edge: 'border.subtle', radius: 'lg', height: 'size-pad-box', width: 'size-pad-box', padX: 6, padY: 6, gap: 2 } },
    { slot: 'cell', expect: { radius: 'xs', bg: 'transparent' } },
    { slot: 'mark', expect: { bg: 'neutral.graphic', radius: 'full', height: 4, width: 4 }, note: 'The off dot is a graphic mark (neutral graphic, step 8), not the disabled colour.' },
    { slot: 'mark', when: { state: 'hover' }, expect: { bg: 'text.secondary' } },
    { slot: 'mark', when: { state: 'selected' }, expect: { bg: 'accent.solid', radius: '2xs', width: 2, height: 12 }, note: 'orientation row: 2px × 12px bar plus two copies 4px to either side (box-shadow or siblings). orientation column: 12px × 2px, copies 4px above and below.' },
    { slot: 'mark', when: { state: 'selected', orientation: 'column' }, expect: { width: 12, height: 2 } },
    { slot: 'cell', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'root', when: { state: 'disabled' }, expect: { bg: 'disabled.fill', edge: 'disabled.border', opacity: 1 }, note: 'Disabled is a colour, not opacity: disabled fill and edge; off dots take disabled.border, on bars disabled.text.' },
    { slot: 'mark', when: { state: 'disabled' }, expect: { bg: 'disabled.border' } },
  ],
  behavior: {
    keyboard: { ArrowRight: 'select the cell to the right', ArrowLeft: 'select the cell to the left', ArrowDown: 'select the cell below', ArrowUp: 'select the cell above', Tab: 'moves focus to the selected cell, then out (roving tabindex)' },
    pointer: ['click selects a cell', 'hovering a cell darkens its dot'],
    scenarios: [
      { name: 'click selects a cell', props: { defaultValue: 'middle-left' }, steps: [{ do: 'click', slot: 'cell' }], expect: [{ event: 'onValueChange', args: ['top-left'] }, { slot: 'cell', attr: { 'aria-checked': 'true' } }] },
      { name: 'ArrowRight moves right', props: { defaultValue: 'top-left' }, steps: [{ do: 'focus', slot: 'cell' }, { do: 'press', key: 'ArrowRight' }], expect: [{ event: 'onValueChange', args: ['top-center'] }] },
      { name: 'disabled ignores clicks', props: { disabled: true }, steps: [{ do: 'click', slot: 'cell' }], expect: [{ event: 'onValueChange', calls: 0 }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { cell: ['aria-checked', 'aria-label'] },
    notes: ['The group is labelled "Alignment"; each cell is labelled "Top left", "Top center", … "Bottom right".', 'Cells are about 27 × 24px (the pad is 96px with 6px padding and 2px gaps), which meets the 24px target.'],
  },
  policies: ['P5', 'P6'],
  composition: { uses: [] },
  usage: [
    'K2d: the group and cell names are props (label, cellLabels); the fixture passes "Alignment" and "Top left" ... "Bottom right", so the specimen is unchanged.',
    'No example of its own: it appears in the auto-layout example.',
    'Fixture contract: the plain render shows middle-left selected (the default) with orientation row.',
    'The glyph shows the bars of the selected position only; unselected cells show the dot. The bars are an illustration of items aligned along the main axis, not a data series.',
    'Token request: size-pad-box 96px (shared with constraints-control).',
  ],
});
