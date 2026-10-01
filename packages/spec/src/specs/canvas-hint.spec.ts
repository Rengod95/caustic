import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'canvas-hint',
  name: 'CanvasHint',
  category: 'canvas',
  status: 'ready',
  purpose: 'The key hints that appear at the bottom of the canvas while a gesture is running: a thick-glass strip listing the modifier keys and what they do ("⇧ constrain", "⌥ from center", "esc cancel").',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Thick glass strip, 32px tall, xl radius, 12px inline padding, 10px gap, elevation 3. Centered horizontally 14px above the canvas bottom by the host.' },
    { name: 'item', el: 'span', parent: 'root', description: 'One hint: key then label (inline-flex, 4px gap in the specimen: a key cap, a space, the text).' },
    { name: 'key', el: 'kbd', parent: 'item', description: 'The key cap: a Kbd at 16px height and 10.5px type.' },
    { name: 'label', el: 'span', parent: 'item', description: 'What the key does.' },
  ],
  props: {
    children: { type: 'ReactNode', required: true, description: 'CanvasHintItem elements.' },
    keys: { type: 'string', description: 'CanvasHintItem prop. The key text (⇧, ⌥, esc).' },
  },
  styles: [
    { slot: 'root', expect: { material: 'thick', radius: 'xl', height: 'control-md', padX: 12, gap: 10, shadow: '3', fg: 'text.secondary', text: 'footnote' } },
    { slot: 'item', expect: { gap: 4 } },
    { slot: 'key', expect: { bg: 'fill.hover', fg: 'text.tertiary', radius: 'xs', height: 'icon-md', text: 'ui-xs', weight: 500 }, note: 'The Kbd cap with a 16px height (Kbd default 18) and 10.5px type (ui-xs is 11).' },
  ],
  a11y: { notes: ['Hints are text next to key caps; the strip is aria-hidden when it only repeats the shortcut list, and role="status" is not used (it appears with the gesture, not as news).', 'Keys use words as well as glyphs where the glyph is ambiguous ("esc").'] },
  policies: ['P1', 'P5', 'P6'],
  flags: { floating: true },
  composition: { uses: ['kbd'] },
  examples: [],
  usage: [
    'Fixture convention: render(props) renders the three hints “⇧ constrain”, “⌥ from center”, “esc cancel”.',
    'The specimen overrides the Kbd height and font (.cv-hint .kbd: 16px, 10.5px); the key slot reproduces that, so CanvasHintItem must not reuse the Kbd component unmodified. Open question: add a size="sm" to Kbd instead of a local key cap.',
    'Used by the canvas-overlays example (see CanvasSelection).',
  ],
});
