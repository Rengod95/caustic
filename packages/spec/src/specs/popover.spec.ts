import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'popover',
  name: 'Popover',
  category: 'overlay',
  status: 'ready',
  purpose: 'A small panel anchored to an element, on thick glass with a pointer arrow. Opens on press (popover, holds controls) or on hover/focus (hover card, holds a read-only preview).',
  description: 'One surface, two triggers. trigger="click" is a Radix Popover with interactive content; trigger="hover" is a Radix HoverCard with a short preview (avatar, name, status, quick actions). Both share the same glass surface and arrow.',
  role: 'dialog',
  slots: [
    { name: 'root', el: 'div', role: 'dialog', description: 'The anchored surface (Radix Content): thick glass, 2xl radius, 14px padding, 10px gap, elevation 4. Its height is bounded by the available viewport height (max-height var(--radix-popover-content-available-height), var(--radix-hover-card-content-available-height) for hover) and the content scrolls inside it (overflow-y auto); inline is not bounded.' },
    { name: 'arrow', el: 'span', parent: 'root', required: false, description: 'A 12px rotated square on the anchor side, material.thick fill (floating surfaces have no rim). Offset 24px from the start edge for align="start".' },
    { name: 'title', el: 'b', parent: 'root', required: false, description: 'Semibold heading (13px / 600). In the hover card, the person’s name.' },
    { name: 'description', el: 'p', parent: 'root', required: false, description: 'Secondary text, 12.5px / 18, tertiary. Not the aria description of a hover card.' },
  ],
  variants: {
    trigger: { values: ['click', 'hover'], default: 'click', description: 'click = Popover with interactive content; hover = HoverCard preview that opens on hover and keyboard focus of its trigger.' },
  },
  sizes: { values: ['sm', 'md'], default: 'md' },
  states: {
    open: { props: { open: true } },
  },
  props: {
    trigger: { type: "'click' | 'hover'", default: 'click', description: 'How it opens.' },
    size: { type: "'sm' | 'md'", default: 'md', description: 'Width 240 · 280 (max 100% of the container).' },
    open: { type: 'boolean', description: 'Controlled open state.' },
    defaultOpen: { type: 'boolean', description: 'Uncontrolled initial state.' },
    anchor: { type: 'ReactNode', description: 'The element the panel hangs from (rendered with asChild).' },
    side: { type: "'top' | 'bottom' | 'left' | 'right'", default: 'bottom', description: 'Side of the anchor. Flips when there is no room; the arrow follows.' },
    align: { type: "'start' | 'center' | 'end'", default: 'start', description: 'Alignment against the anchor.' },
    arrow: { type: 'boolean', default: true, description: 'Show the pointer arrow.' },
    openDelay: { type: 'number', default: 320, description: 'Hover only: ms before opening.' },
    closeDelay: { type: 'number', default: 120, description: 'Hover only: ms before closing.' },
    inline: { type: 'boolean', default: false, description: 'Render the surface in place, open, in normal flow directly after the anchor (10px below it when the parent is a stack), without portal or positioning. For docs and specimens.' },
  },
  events: { onOpenChange: { payload: 'boolean', when: 'the anchor opens it; Escape, an outside press (click) or leaving (hover) closes it' } },
  styles: [
    { slot: 'root', expect: { material: 'thick', radius: '2xl', padX: 14, padY: 14, gap: 10, shadow: '4', width: 'size-popover-md' } },
    { slot: 'root', when: { size: 'sm' }, expect: { width: 'size-popover-sm' } },
    { slot: 'arrow', expect: { bg: 'material.thick', radius: 'xs', height: 'size-popover-arrow', width: 'size-popover-arrow' }, note: 'Specimen arrow rounds only its top-left corner (3px) before the 45° rotation; no radius token matches 3px (xs = 4).' },
    { slot: 'title', expect: { fg: 'text.primary', text: 'ui', weight: 600 } },
    { slot: 'description', expect: { fg: 'text.tertiary', text: 'ui-dense' } },
  ],
  behavior: {
    keyboard: {
      Enter: 'on the anchor (click): open; Space likewise',
      Escape: 'close and return focus to the anchor',
      Tab: 'click: focus moves through the content, then closes when it leaves the panel (not trapped); hover: the content is reachable by Tab from the anchor',
    },
    pointer: [
      'click: pressing the anchor toggles the panel; pressing outside closes it',
      'hover: hovering or focusing the anchor opens after openDelay; leaving both anchor and panel closes after closeDelay; the panel stays open while the pointer is over it',
    ],
    scenarios: [
      { name: 'Escape closes', props: { inline: true, defaultOpen: true }, steps: [{ do: 'focus', slot: 'root' }, { do: 'press', key: 'Escape' }], expect: [{ event: 'onOpenChange', args: [false] }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { root: ['aria-labelledby'] },
    notes: [
      'Click: anchor has aria-haspopup="dialog" and aria-expanded; the panel is role="dialog" labelled by its title (or aria-label).',
      'Hover card content is supplementary: everything in it must also be reachable another way (the profile page), because touch has no hover.',
      'The arrow is aria-hidden and has no hit area.',
    ],
  },
  policies: ['P1', 'P5', 'P6'],
  flags: { floating: true },
  composition: { uses: ['button', 'number-field', 'avatar'], radix: ['@radix-ui/react-popover', '@radix-ui/react-hover-card'] },
  examples: [{ id: 'anchored', title: 'Popover & hover card', doc: 'popover#popover-and-hover-card' }],
  usage: [
    'K2d: max-height is the Radix available height of the content with overflow-y auto, so tall content (a color picker, a long form) scrolls instead of being cut off by the viewport. The arrow stays outside the scrolling box. The viewport bound has no StyleExpect key yet (open question: add maxHeight to the schema and the runtime probe); the G2 class check and a G3 scenario cover it meanwhile.',
    'The example reproduces two anchored panels side by side (row, gap 24, align start), each in a stack with a 10px gap: (1) a secondary sm Button “Spacing” with a sliders-horizontal icon, whose md popover holds the title “Spacing”, two NumberFields (Gap 12, Pad 16) in a two-column grid with a 6px gap, and a footer row with the muted “Bound to space/3” and a ghost xs Button “Detach”; (2) a md Avatar “MK” with presence, whose sm hover card (240) holds a md Avatar and the name “Mina Kang” + “Product designer · Seoul”, the muted “Editing Pricing / Desktop now”, and a row with a secondary xs “Follow” and a ghost xs “Message” Button. trigger="hover" is used for the second.',
    'Content layout (grids, rows) is the consumer’s; the component supplies the surface, gap and the title/description roles.',
    'Radix Popover for click and Radix HoverCard for hover are both allowed; inline renders the same parts without Popper or portal.',
    'Fixture convention: render(props) renders an anchor and an inline surface with the arrow, a title and a description.',
    'Use Dialog for blocking decisions; Menu for lists of actions; a popover for compact controls bound to the anchor.',
    'The panel is wider than its content on purpose: width is fixed by size (240 / 280), not by content.',
  ],
});
