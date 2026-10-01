import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'canvas-artboard',
  name: 'CanvasArtboard',
  category: 'canvas',
  status: 'ready',
  purpose: 'The surface of a frame on the canvas: a sharp-cornered white sheet with a hairline and a soft shadow that holds the design. It is the user content layer; its fill never follows the interface theme.',
  role: null,
  slots: [{ name: 'root', el: 'div', description: 'Positioned sheet, 2px radius, canvas.artboard fill. Children are the design (positioned by the consumer).' }],
  props: {
    rect: { type: 'OverlayRect', description: 'Bounds in px from the canvas host origin: { left, top, width, height }. Applied as CSS custom properties.' },
    children: { type: 'ReactNode', description: 'The frame content.' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'canvas.artboard', radius: '2xs' }, note: 'Shadow: 0 0 0 1px oklch(0 0 0 / 0.06), 0 6px 20px -8px oklch(0 0 0 / 0.2) (hairline plus short drop). No elevation token matches: token request elevation-artboard.' },
  ],
  a11y: { notes: ['The sheet itself is a presentational container; the design inside carries its own semantics.'] },
  policies: ['P6'],
  composition: { uses: [] },
  examples: [],
  usage: [
    'Fixture convention: render(props) renders a 560 × 300 sheet.',
    'Used in the canvas-overlays example (see CanvasSelection) at (100, 64) 560 × 300 with sample wireframes inside: a 180 × 12 bar (radius 6) and a 260 × 8 bar (radius 4), a 210 × 150 card (radius 14, inset hairline), a dark 180 × 44 button (radius 10) and a light 180 × 44 button below it with an inset hairline. Their colors are literal warm oklch neutrals in the specimen (outside the token set): the fixture passes them as swatch custom properties.',
    'Token requests: elevation-artboard (the value above).',
    'Specimen bug candidate: the older .artboard rule (components.css) uses 0 8px 24px -8px at 0.18; this page uses .ab (0 6px 20px -8px at 0.2). Two near-identical sheet shadows.',
  ],
});
