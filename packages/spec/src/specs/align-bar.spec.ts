import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'align-bar',
  name: 'AlignBar',
  category: 'inspector',
  status: 'ready',
  purpose: 'A small inset track of icon buttons that align the selection to an edge or a center. A separator splits horizontal from vertical alignment.',
  description: 'Compound: AlignBar (track), AlignBarItem (an IconButton) and AlignBarSeparator. It holds actions, not state: pressing an item fires its own onClick. Used in a section header (tight) and above the multi-selection tools (regular).',
  role: 'group',
  slots: [
    { name: 'root', el: 'div', role: 'group', description: 'Inline-flex track: neutral.track, lg radius, 1px gap between items.' },
    { name: 'item', el: 'button', parent: 'root', description: 'One IconButton, 32px square with an md radius (track radius minus its padding, 10 − 2). Needs aria-label ("Align left", "Align horizontal centers", …).' },
    { name: 'separator', el: 'span', parent: 'root', required: false, description: 'Vertical hairline between the horizontal and the vertical group: 1px wide, 24px tall, divider.line (the divider role, E15; same look as border.default), margin 4px 2px.' },
  ],
  variants: {
    density: { values: ['regular', 'tight'], default: 'regular', description: 'regular = 2px padding (36px track); tight = 1px padding (34px track) for a section header, where it must not push the heading row taller.' },
  },
  props: {
    density: { type: "'regular' | 'tight'", default: 'regular', description: 'Track padding.' },
    children: { type: 'ReactNode', required: true, description: 'AlignBarItem and AlignBarSeparator elements.' },
  },
  events: { onClick: { payload: 'React.MouseEvent<HTMLDivElement>', when: 'an item is pressed (the click bubbles from the item to the group; the item handler is the consumer action)' } },
  styles: [
    { slot: 'root', expect: { bg: 'neutral.track', radius: 'lg', padX: 2, padY: 2, gap: 1 } },
    { slot: 'root', when: { density: 'tight' }, expect: { padX: 1, padY: 1 } },
    { slot: 'item', expect: { height: 'control-md', width: 'control-md', radius: 'md', fg: 'text.secondary' } },
    { slot: 'separator', expect: { bg: 'divider.line', width: 1, height: 24 }, note: 'A divider is its own role (E15), not a border token used as a fill.' },
  ],
  behavior: {
    keyboard: { Tab: 'each item is a tab stop', Enter: 'activate the focused item', Space: 'activate the focused item' },
    pointer: ['pressing an item runs its action once; the bar keeps no selected state'],
    scenarios: [
      { name: 'item click', steps: [{ do: 'click', slot: 'item' }], expect: [{ event: 'onClick', calls: 1 }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { item: ['aria-label'] },
    notes: ['The group needs an aria-label ("Align"); every icon item needs its own aria-label.', 'Icons are lucide align-start-vertical / align-center-vertical / align-end-vertical (left, horizontal centers, right) and align-start-horizontal / align-center-horizontal / align-end-horizontal (top, vertical centers, bottom), 14px in the specimen header and 16px in the regular bar.'],
  },
  policies: ['P5', 'P6'],
  composition: { uses: ['icon-button'] },
  usage: [
    'Fixture contract: render(props) shows six items (Align left, Align horizontal centers, Align right, a separator, Align top, Align vertical centers, Align bottom). The click scenario uses the first item; onClick is injected on the items.',
    'No example of its own. The regular bar appears in the constraints-control example (alignment-and-constraints) and the tight bar in the position-size example (header of the Frame section, three items: Align left, Align center, Align right).',
    'Specimen bug: the header items carry the class xs (24px) but the studio rule .align-bar .ib forces 32px, so the tight bar is a 34px track with 32px buttons. The spec follows the rendered result (32px), not the class.',
    'The bar is not a toggle group: nothing stays pressed.',
  ],
});
