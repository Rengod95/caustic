import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'comment-bubble',
  name: 'CommentBubble',
  category: 'canvas',
  status: 'ready',
  purpose: 'A comment as it appears beside its pin: a small thick-glass speech bubble with the author name in bold and the message.',
  description: 'Rounded on three corners (14) and 4 at the bottom-left, where it points back at the pin. Max 160px wide, 12px type, elevation 3.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'The bubble. Thick glass, padding 8 / 10, max-width 160px.' },
    { name: 'author', el: 'b', parent: 'root', description: 'Author name, 600 weight.' },
    { name: 'body', el: 'span', parent: 'root', description: 'The message text, after the author and a space.' },
  ],
  props: {
    author: { type: 'string', required: true, description: 'Author name.' },
    children: { type: 'ReactNode', required: true, description: 'The message.' },
    rect: { type: 'OverlayRect', description: 'Position in px from the canvas host origin. Applied as CSS custom properties.' },
  },
  styles: [
    { slot: 'root', expect: { material: 'thick', radius: 'toolbar', padX: 10, padY: 8, shadow: '3', text: 'footnote', fg: 'text.primary' }, note: 'max-width is size-comment-max (160), not probed. Radius 14 14 14 4; the probe measures top-left (toolbar = 14), the bottom-left tail is xs (4).' },
    { slot: 'author', expect: { text: 'footnote', weight: 600 } },
  ],
  a11y: { notes: ['In the product the bubble is the visible part of the thread dialog opened from the pin; this spec is the visual only.', 'Author and message are text; no color alone.'] },
  policies: ['P1', 'P6'],
  flags: { floating: true },
  composition: { uses: [] },
  examples: [],
  usage: [
    'Fixture convention: render(props) renders author “Mina” with the message “Total should be bold, not the label.”',
    'Used by the comments example (see CommentPin).',
    'Token requests: size-comment-max (160).',
    'Near-duplicate mapped: specimen font is 12px with normal line-height; footnote is 12 / 16 / 400.',
  ],
});
