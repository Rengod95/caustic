import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'card-glass',
  name: 'CardGlass',
  category: 'card',
  status: 'ready',
  purpose: 'Frosted card for content that floats over imagery, color or the canvas. Regular glass material with a specular top edge and a rim.',
  description: 'Policy P1 keeps glass for things that float; this card is the owner-designed exception that is flagged floating. It must sit on a colored or image stage. On a flat background use CardSurface.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Card root: Card layout on the regular glass material (material.regular fill, backdrop blur 24px, saturate 1.8).' },
  ],
  props: {
    size: { type: "'regular' | 'compact'", default: 'regular', description: 'Passed to Card.' },
    children: { type: 'ReactNode', description: 'Card parts.' },
  },
  styles: [
    { slot: 'root', expect: { material: 'regular', edge: 'material.rim', shadow: '3', radius: '3xl', padX: 'inset-regular-x', padY: 'inset-regular-y', gap: 10, fg: 'text.primary' }, note: 'Box-shadow stack: inset 0 1px 0 material.specular, inset 0 0 0 1px material.rim, 0 0 0 .5px material.edge, elevation-3. The glass utility supplies fill, blur and the rim layers.' },
  ],
  a11y: { notes: ['Text sits on a blurred, variable backdrop: the gate checks contrast of text.primary and text.secondary on material.regular; do not place tertiary text on it.'] },
  policies: ['P1', 'P5', 'P6'],
  flags: { floating: true },
  composition: { uses: ['card', 'button', 'progress', 'switch'] },
  examples: [{ id: 'glass-card', title: 'Glass card', doc: 'card-glass#glass-card' }],
  usage: [
    'P1 reconciliation: Card and every other variant are opaque; CardGlass is the single card with flags.floating, justified because it is meant to float over a stage. Use it only where something visible is behind it (imagery, a canvas, a colored panel).',
    'Example fixture: a stage frame (full width, radius 3xl, 28px padding, 14px gap, overflow hidden, 260px-min auto-fit grid) painted with three soft radial gradients (accent hue at 18%/22%, amber at 82%/30%, green at 55%/95%) over bg.canvas. Gradients are literal colors in the fixture only.',
    'Card 1: header with a title "Now playing" / "Agent session · Pricing refresh" and a trailing spectrum orb (14px, fixture markup); body = Progress agent tone at 62 and meta "Step 3 of 4 · Apply spacing and radius"; end footer: Button secondary sm "Pause", Button ink sm "Open". Card 2: centered header, tile with a sun glyph and a 40% white fill (fixture override), "Light theme" / "Preview over the canvas", Switch on (aria-label "Light theme").',
  ],
});
