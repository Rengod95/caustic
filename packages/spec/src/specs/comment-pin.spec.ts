import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'comment-pin',
  name: 'CommentPin',
  category: 'canvas',
  status: 'ready',
  purpose: 'A comment marker pinned to the canvas: a 28px speech-bubble pin with a tail at the bottom-left, showing the author initials (human, coral) or the agent orb (agent, ink).',
  description: 'The pin is the anchor; the thread opens from it as a CommentBubble beside it. A human pin is identity coral with white initials, an agent pin is an ink pin with a small spectrum orb, so the two authors read apart on the canvas. Both have a 2px white ring and elevation 3 so they stay legible over any frame.',
  role: 'button',
  slots: [
    { name: 'root', el: 'button', role: 'button', description: '28px pin: 14px radius on three corners, 4px on the bottom-left (the tail). Centered content. aria-label names the author and the thread ("Comment by Mina").' },
    { name: 'initials', el: 'span', parent: 'root', required: false, description: 'Author initials ("MK"), human pin.' },
    { name: 'orb', el: 'span', parent: 'root', required: false, description: 'Small spectrum orb (10px), agent pin.' },
  ],
  variants: {
    author: { values: ['human', 'agent'], default: 'human', description: 'human = coral pin with initials; agent = ink pin with the orb.' },
  },
  states: {
    'focus-visible': { pseudo: ['focus', 'focus-visible'] },
    hover: { pseudo: ['hover'] },
  },
  props: {
    author: { type: "'human' | 'agent'", default: 'human', description: 'Who wrote the thread.' },
    initials: { type: 'string', default: 'MK', description: 'Initials for the human pin (two letters).' },
    label: { type: 'string', required: true, description: 'Accessible name, rendered as aria-label ("Comment by Mina Kim").' },
    rect: { type: 'OverlayRect', description: 'Position in px from the canvas host origin ({ left, top }). The specimen places pins by percent of the frame width; the host converts. Applied as CSS custom properties.' },
  },
  events: {
    onClick: { payload: 'React.MouseEvent<HTMLButtonElement>', when: 'the pin is activated; the consumer opens the thread' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'identity.coral', fg: 'identity.on', radius: 'toolbar', height: 'control-sm', width: 'control-sm', text: 'micro', shadow: '3' }, note: 'Border radius is 14 14 14 4: the bottom-left corner is 4 (xs); the probe measures the top-left (toolbar = 14). 2px ring in canvas.handle (white in both themes) below the elevation. The specimen coral is oklch(.52 .13 30), close to identity.coral (coral.600).' },
    { slot: 'root', when: { author: 'agent' }, expect: { bg: 'ink.solid', fg: 'ink.on' } },
    { slot: 'root', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'orb', when: { author: 'agent' }, expect: { height: 'size-orb-xs', width: 'size-orb-xs', radius: 'full' }, note: 'Specimen: cs-orb cs-sm with width and height forced to 10px (12px is the small orb); token request size-orb-xs.' },
  ],
  behavior: {
    keyboard: { Enter: 'open the thread', Space: 'open the thread' },
    pointer: ['click opens the thread'],
    scenarios: [{ name: 'click opens the thread', steps: [{ do: 'click', slot: 'root' }], expect: [{ event: 'onClick', calls: 1 }] }],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { root: ['aria-label'] },
    notes: ['The author is carried by the label text and by color: an agent pin is named "Comment by Caustic" (not just the orb).', 'The initials and orb are decorative.', 'P7: the coral pin and the ink-with-orb pin distinguish human from agent without reading the label.'],
  },
  policies: ['P2', 'P6', 'P7', 'P8'],
  flags: { agent: { author: ['agent'] }, motionLoop: true },
  composition: { uses: ['frame-label', 'comment-bubble'] },
  examples: [{ id: 'comments-and-frame-labels', title: 'Comments & frame labels', doc: 'comments#comments-and-frame-labels' }],
  usage: [
    'Fixture convention: render(props) renders one human pin with the initials “MK”; author="agent" renders the orb.',
    'Example comments-and-frame-labels: a stage (canvas background, radius xl, min-height 150, positioned, padding 0) holding: a FrameLabel kind="frame" “Checkout / iOS” “390 × 844” at (16, 12); a 6px-radius sheet inset 16 left/right/bottom and 32 top (swatch background, hairline ring; scaffolding, no token); a human CommentPin “MK” at left 60%, top 46; an agent CommentPin at left 28%, top 80; and a CommentBubble at left calc(60% + 34px), top 44 with “Mina” and the text “Total should be bold, not the label.” The stage height equals the min-height 150.',
    'Spectrum (the agent orb) is allowed only for author="agent".',
    'Token requests: size-orb-xs (10).',
  ],
});
