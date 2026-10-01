import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'card-agent',
  name: 'CardAgent',
  category: 'card',
  status: 'ready',
  purpose: 'Output the agent produced and the user has not applied yet. A spectrum rim and a soft glow mark the source; once applied, the content moves to a CardSurface.',
  description: 'The spectrum is provenance, not decoration: use it only on unapplied agent results, never on content a person wrote.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Card root: Card layout on an opaque surface.base fill with a 1.5px spectrum rim (the agent-rim utility, rotating) and a soft agent glow below.' },
    { name: 'orb', el: 'span', parent: 'root', description: 'Leading spectrum orb (14px ring, rotating) in the header, aria-hidden; use in place of a tile.' },
  ],
  props: {
    size: { type: "'regular' | 'compact'", default: 'regular', description: 'Passed to Card.' },
    children: { type: 'ReactNode', description: 'Card parts.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'surface.base', agentRim: true, shadow: 'agent', radius: '3xl', padX: 'inset-regular-x', padY: 'inset-regular-y', gap: 10, fg: 'text.primary' }, note: 'Rim 1.5px, cs-spin at duration-agent, linear, infinite. Glow shadow = 0 8px 30px -12px agent-glow (no token, see token requests: elevation-agent).' },
    { slot: 'orb', expect: { height: 14, width: 14, radius: 'full' }, note: '14px orb with a 3.4px hole; the orb utility supplies the spectrum and the rotation.' },
  ],
  a11y: {
    notes: [
      'Provenance is also stated in text ("Generated from Lagoon · 12s", "Not applied yet"); the rim and orb are decorative.',
      'Reduced motion stops the rim and the orb rotation (the global rule); the rim stays visible, static.',
    ],
  },
  policies: ['P2', 'P5', 'P6', 'P8'],
  flags: { agent: true, motionLoop: true },
  composition: { uses: ['card', 'button'] },
  examples: [{ id: 'agent-card', title: 'Agent card', doc: 'card-agent#agent-card' }],
  usage: [
    'Default fixture render shows every slot marked required here, even those that product code may omit (the gateway applies default-case style rules to them).',
    'Only for results not applied yet. After Apply, render CardSurface.',
    'Example fixture: a 320px-min two-column grid (one card, aligned to the start). Header centered: orb, "3 hero variants" / "Generated from Lagoon · 12s". Body: a non-wrapping row, 8px gap, of three equal thumbnails 56px high (gradient art; fixture markup, radius ~8). Divided footer: meta "Not applied yet", spacer, Button ghost sm "Discard", Button ink sm "Review".',
  ],
});
