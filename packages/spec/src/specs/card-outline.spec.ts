import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'card-outline',
  name: 'CardOutline',
  category: 'card',
  status: 'ready',
  purpose: 'Border-only card for use inside panels that already float. The dashed variant is an add action.',
  description: 'No fill and no shadow: just a 1px edge. Solid cards are static containers; the dashed card is a button.',
  role: null,
  slots: [
    { name: 'root', el: 'any', description: 'Card root. A div when solid; a button when dashed. Transparent fill; solid draws a 1px inset ring, dashed draws a 1px dashed outline inside the edge (outline-offset -1px).' },
  ],
  variants: {
    border: { values: ['solid', 'dashed'], default: 'solid', description: 'dashed marks an add action ("Add axis") and renders as a button with centered content.' },
  },
  states: {
    hover: { pseudo: ['hover'] },
    'focus-visible': { pseudo: ['focus-visible'] },
  },
  props: {
    border: { type: "'solid' | 'dashed'", default: 'solid', description: 'Edge style; dashed renders a button.' },
    size: { type: "'regular' | 'compact'", default: 'regular', description: 'Passed to Card.' },
    children: { type: 'ReactNode', description: 'Card parts. Dashed: a centered icon and label.' },
  },
  events: {
    onClick: { payload: 'MouseEvent<HTMLElement>', when: 'a dashed card is pressed' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'transparent', edge: 'border.default', radius: '3xl', padX: 'inset-regular-x', padY: 'inset-regular-y', gap: 10, fg: 'text.primary' }, note: 'Edge is inset 0 0 0 1px border.default, transitioning with duration-quick.' },
    { slot: 'root', when: { state: 'hover' }, expect: { edge: 'border.strong' }, note: 'Solid only; the dashed edge is already border.strong and does not change.' },
    { slot: 'root', when: { border: 'dashed' }, expect: { fg: 'text.secondary', minHeight: 'size-card-add', cursor: 'pointer' }, note: 'Outline 1px dashed border.strong, offset -1px (an outline, not a box-shadow). Content centered both ways, 6px between the 14px plus icon and the label.' },
    { slot: 'root', when: { border: 'dashed', state: 'focus-visible' }, expect: { ring: 'focus' } },
  ],
  behavior: {
    keyboard: { Enter: 'activates a dashed card', Space: 'activates a dashed card' },
    pointer: ['solid: the edge strengthens on hover; dashed: no hover change'],
    scenarios: [
      { name: 'dashed card fires onClick', props: { border: 'dashed' }, steps: [{ do: 'click', slot: 'root' }], expect: [{ event: 'onClick', calls: 1 }] },
    ],
  },
  a11y: { notes: ['Solid is a static container. Dashed is a native button: its text ("Add axis") is its name.', 'A dashed card holds no other interactive controls.'] },
  policies: ['P5', 'P6', 'P8'],
  composition: { uses: ['card', 'icon-button'] },
  examples: [{ id: 'outline-card', title: 'Outline card', doc: 'card-outline#outline-card' }],
  usage: [
    'Use inside an already elevated panel; on a page background use CardSurface.',
    'Example fixture: 260px-min auto-fill grid, 14px gap: two solid cards "Variant axis · Size" / "sm, md, lg" and "Variant axis · Tone" / "ink, accent, secondary", each with a trailing IconButton sm (pencil, label "Edit"); then a dashed card with a plus icon and "Add axis", min-height 76px (size-card-add).',
  ],
});
