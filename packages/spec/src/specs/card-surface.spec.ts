import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'card-surface',
  name: 'CardSurface',
  category: 'card',
  status: 'ready',
  purpose: 'The default card for content that is read: a solid surface, a hairline, a long soft shadow and a very faint light along the top edge.',
  description: 'Anatomy comes from `card` (CardHeader, CardBody, CardFooter and friends). CardSurface adds only the surface.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Card root: Card layout (inset, 10px gap, radius 3xl) on an opaque surface.base fill.' },
  ],
  props: {
    size: { type: "'regular' | 'compact'", default: 'regular', description: 'Passed to Card: regular or compact inset.' },
    children: { type: 'ReactNode', description: 'Card parts.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'surface.base', edge: 'border.subtle', shadow: 'card', radius: '3xl', padX: 'inset-regular-x', padY: 'inset-regular-y', gap: 10, fg: 'text.primary' }, note: 'Box-shadow: inset 0 1px 0 white/5%, 0 0 0 1px border.subtle, then the long soft shadow. The whole stack is the requested elevation-card token (see token requests).' },
  ],
  a11y: { notes: ['Static container; it has no role. Interactive cards use CardAction or CardMedia.'] },
  policies: ['P5', 'P6'],
  composition: { uses: ['card', 'icon-button', 'button', 'badge', 'progress', 'token-chip'] },
  examples: [{ id: 'surface-card', title: 'Surface card', doc: 'card-surface#surface-card' }],
  usage: [
    'Default for any card with something to read.',
    'Example fixture: a 320px-min two-column grid, 14px gap. Card 1 "Team plan" / "Billed yearly · renews Mar 2027" with a trailing IconButton sm (ellipsis, label "More"); body = two meters (a 6px-gap grid of a label + bold value row, 12px, then a Progress: Seats 8 / 10 at 80, Agent rounds 3,912 / 5,000 at 78) with the body gap of 10 between them; divided footer: meta "Resets Nov 1", spacer, Button ghost sm "Manage", Button ink sm "Upgrade". Card 2: header centered, accent tile with git-branch, "Lagoon Dark" / "Inherits Lagoon · 14 overrides", Badge success with check "AA"; body = a row of 6px-gap TokenChips: accent/solid with a swatch, surface/base with a swatch, "+12". Cards align to the top of the grid (align-items start).',
  ],
});
