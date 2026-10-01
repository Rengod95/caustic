import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'card-spotlight',
  name: 'CardSpotlight',
  category: 'card',
  status: 'ready',
  purpose: 'Card whose surface is lit by a soft accent light and a hairline highlight that follow the pointer. For navigation grids only.',
  description: 'The light is two decorative layers driven by the pointer position (--mx, --my relative to the card); both fade in on hover with duration-base. At rest the card looks like a plain surface card.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Card root: Card layout on an opaque surface; overflow hidden, isolated. Layer behind the content: radial accent.soft glow (320px) at the pointer. Layer above: a 1px ring of radial accent.border (200px) at the pointer, masked to the edge.' },
  ],
  states: {
    hover: { pseudo: ['hover'] },
  },
  props: {
    size: { type: "'regular' | 'compact'", default: 'regular', description: 'Passed to Card.' },
    children: { type: 'ReactNode', description: 'Card parts.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'surface.base', edge: 'border.subtle', shadow: '1', radius: '3xl', padX: 'inset-regular-x', padY: 'inset-regular-y', gap: 10, fg: 'text.primary' }, note: 'The glow (320px) and rim (200px) sizes have no tokens; see token requests (size-spotlight-glow, size-spotlight-rim).' },
  ],
  behavior: {
    pointer: [
      'pointermove sets --mx and --my (px from the card top-left) on the root; the glow and rim follow',
      'on hover both layers go from opacity 0 to 1 over duration-base; they are hidden again on leave',
      'before any pointer movement the light is centered at the top (--mx 50%, --my 0%)',
    ],
  },
  a11y: { notes: ['Purely decorative effect: nothing is conveyed by the light, and the card is not interactive by itself.', 'If the card is a link, nest it in CardAction instead; do not add a second interactive layer.'] },
  policies: ['P5', 'P6', 'P8'],
  composition: { uses: ['card'] },
  examples: [{ id: 'spotlight-card', title: 'Spotlight card', doc: 'card-spotlight#spotlight-card' }],
  usage: [
    'Only for exploration grids (feature lists, navigation); not for cards people read.',
    'The ::before/::after layers may be implemented with child elements of the root or utilities; either way they are not slots and carry aria-hidden.',
    'Example fixture: 260px-min auto-fill grid, 14px gap, three cards. Each has a header with only a neutral tile (layers / swatch-book / history), then a body with a titleSize md title ("Layers" / "Tokens" / "History", set in the body, 15px) and a paragraph ("Tree with drop hints, instances and agent marks." / "Bindings, graph and theme gallery." / "Revisions, diffs and visual compare."). The baseline is captured at rest (no pointer).',
  ],
});
