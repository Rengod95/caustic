import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'skeleton',
  name: 'Skeleton',
  category: 'primitive',
  status: 'ready',
  purpose: 'Placeholder block for content that is loading: a soft fill with a slow horizontal shimmer. Used for text lines and avatar or thumbnail tiles.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'One block. Size comes from width and height; defaults to a 10px high full-width line.' },
  ],
  props: {
    width: { type: 'number | string', default: '100%', description: 'Pixels or any CSS length such as "70%"; applied through a CSS variable.' },
    height: { type: 'number | string', default: 10, description: 'Pixels or any CSS length.' },
    radius: { type: "'sm' | 'lg'", default: 'sm', description: 'Corner token: 6 for text lines, 10 for tiles.' },
  },
  styles: [
    { slot: 'root', expect: { radius: 'sm', height: 10, opacity: 1 }, note: 'Background is a 90deg gradient fill.pressed 25%, fill.selected 50%, fill.pressed 75% at 300% size, shimmering with a linear infinite slide; computed background-color is therefore not asserted. Specimen speed 1.8s has no token: use duration-shimmer (2200ms), see token requests.' },
    { slot: 'root', when: { radius: 'lg' }, expect: { radius: 'lg' } },
  ],
  a11y: {
    notes: [
      'Decorative: aria-hidden="true". The loading region around skeletons carries aria-busy="true" or a visible status; skeletons never announce.',
      'Under prefers-reduced-motion the shimmer stops and the block stays at fill.pressed.',
    ],
  },
  policies: ['P8'],
  flags: { motionLoop: true },
  composition: { uses: [] },
  usage: [
    'Match the shape of the content it replaces; never mix skeletons with a spinner in one region.',
    'No example of its own: the specimen section (feedback#feedback) is gated through the alert spec. Its Skeleton row is a no-wrap flex row, 10px gap: a 32x32 radius-lg tile (does not shrink) and a column with a 6px gap that takes the rest, holding two lines of height 10, widths 70% and 45%.',
  ],
});
