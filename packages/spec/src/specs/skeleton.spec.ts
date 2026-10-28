import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'skeleton',
  name: 'Skeleton',
  category: 'primitive',
  status: 'ready',
  purpose: 'Placeholder block for content that is loading: a soft fill with a slow horizontal shimmer. Used for text lines and avatar or thumbnail tiles.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'One block. Size comes from width and height (or the size step); defaults to a 10px high full-width line.' },
  ],
  variants: {
    tone: { values: ['neutral', 'accent', 'success', 'warning', 'danger', 'info', 'agent'], default: 'neutral', description: 'Hue of the fill: neutral = neutral.track with a neutral.tint highlight (default); a hue = its soft 3 / soft-hover 4.' },
    variant: { values: ['solid', 'soft', 'outline', 'ghost'], default: 'solid', description: 'solid = the fill with the shimmer (default); soft = the fill, still; outline = no fill, a 1px tone border edge; ghost = no fill, only the shimmer band.' },
    radius: { values: ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full'], default: 'full', description: 'Corner token: full (text lines, so the placeholder reads as text) by default, lg (10) for tiles; any radius token.' },
    shadow: { values: ['none', '1', '2', '3', '4', '5'], default: 'none', description: 'Elevation; unset is flat.' },
  },
  sizes: { values: ['xs', 'sm', 'md', 'lg'], default: 'md' },
  props: {
    tone: { type: "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'agent'", default: 'neutral', description: 'Hue of the fill: neutral = neutral.track with a neutral.tint highlight (default); a hue = its soft 3 / soft-hover 4.' },
    variant: { type: "'solid' | 'soft' | 'outline' | 'ghost'", default: 'solid', description: 'solid = the fill with the shimmer (default); soft = the fill, still; outline = no fill, a 1px tone border edge; ghost = no fill, only the shimmer band.' },
    radius: { type: "'none' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'full'", default: 'full', description: 'Corner token: full (text lines, so the placeholder reads as text) by default, lg (10) for tiles; any radius token.' },
    shadow: { type: "'none' | '1' | '2' | '3' | '4' | '5'", default: 'none', description: 'Elevation; unset is flat.' },
    size: { type: "'xs' | 'sm' | 'md' | 'lg'", default: 'md', description: 'Line height when no height is given: xs 6, sm 8, md 10 (default), lg 14.' },
    width: { type: 'number | string', default: '100%', description: 'Pixels or any CSS length such as "70%"; applied through a CSS variable.' },
    height: { type: 'number | string', description: 'Pixels or any CSS length. Without it the size sets the line height (md 10px).' },
  },
  styles: [
    { slot: 'root', expect: { radius: 'full', height: 10, opacity: 1 }, note: 'Text lines are radius full so they read as text, not boxes. Background is a 90deg gradient neutral.track 25%, neutral.tint 50% (a quiet highlight that does not pull the eye on dark surfaces), neutral.track 75% at 300% size (rest fills, not interaction fills), shimmering with a linear infinite slide; computed background-color is therefore not asserted. Specimen speed 1.8s has no token: use duration-shimmer (2200ms), see token requests.' },
    { slot: 'root', when: { radius: 'lg' }, expect: { radius: 'lg' } },
    { slot: 'root', when: { variant: 'soft', tone: 'accent' }, expect: { bg: 'accent.soft' } },
    { slot: 'root', when: { variant: 'outline', tone: 'info' }, expect: { edge: 'info.border' } },
    { slot: 'root', when: { radius: 'full' }, expect: { radius: 'full' } },
    { slot: 'root', when: { shadow: '1' }, expect: { shadow: '1' } },
    { slot: 'root', when: { size: 'lg' }, expect: { height: 14 } },
  ],
  a11y: {
    notes: [
      'Decorative: aria-hidden="true". The loading region around skeletons carries aria-busy="true" or a visible status; skeletons never announce.',
      'Under prefers-reduced-motion the shimmer stops and the block stays at neutral.track.',
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
