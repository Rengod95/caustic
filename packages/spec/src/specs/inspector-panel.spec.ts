import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'inspector-panel',
  name: 'InspectorPanel',
  category: 'inspector',
  status: 'ready',
  purpose: 'The solid frame of an inspector: a stack of sections, each with a small semibold heading, optional header actions and a grid of controls.',
  description: 'Compound: InspectorPanel (frame), InspectorSection (padded block with a hairline under it), InspectorSectionHeader (title left, actions right). The panel is opaque (never glass): it sits inline in the studio shell. Every inspector page of the specimen (position, auto layout, fill, effects) is a panel of sections.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Opaque panel: surface.base, panel radius and elevation 3 (one depth cue: no hairline edge), overflow hidden. Full width of its column (the studio inspector is 272px; specimens let it fill).' },
    { name: 'section', el: 'section', parent: 'root', description: 'A block of controls: 12px padding, 8px gap, a 1px border.subtle line at the bottom (not on the last section).' },
    { name: 'header', el: 'div', parent: 'section', required: false, description: 'Heading row: flex, space between, items centered. Takes the height of its tallest action (24px with xs icon buttons).' },
    { name: 'title', el: 'span', parent: 'header', description: 'Section name, 11.5px semibold, secondary.' },
    { name: 'actions', el: 'span', parent: 'header', required: false, description: 'Flex row with a 2px gap holding xs IconButtons (add, styles) or an AlignBar.' },
  ],
  props: {
    children: { type: 'ReactNode', required: true, description: 'InspectorSection elements.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'surface.base', shadow: '3', radius: 'panel' }, note: 'One depth cue (d8f79e8): the elevation, no hairline edge.' },
    { slot: 'section', expect: { padX: 12, padY: 12, gap: 8 } },
    { slot: 'header', expect: { fg: 'text.secondary', text: 'hint', weight: 600 } },
    { slot: 'title', expect: { fg: 'text.secondary', text: 'hint', weight: 600 } },
    { slot: 'actions', expect: { gap: 2 } },
  ],
  a11y: { notes: ['Give the panel an aria-label (for example "Inspector") or render it as a landmark region; each section is labelled by its title (aria-labelledby).'] },
  policies: ['P1', 'P5', 'P6'],
  composition: { uses: ['icon-button'] },
  usage: [
    'No example of its own: the panel is exercised by the position-size and paint-stack examples.',
    'Spacing is part of the contract: section padding 12, gap 8 between rows; rows of fields use a 6px grid gap (set by the row, not by the section).',
    'The section bottom line is border.subtle; the last section has none.',
    'The shadow comes from the panel; do not add a second elevation to the sections.',
  ],
});
