import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'message',
  name: 'Message',
  category: 'agent',
  status: 'ready',
  purpose: 'One turn of the transcript. A person speaks in a grey bubble; the agent speaks in bubble-less serif prose followed by a small meta row (orb, summary, copy and retry).',
  description: 'The two voices of the product (P4): author="user" is interface text in a bubble, author="agent" is voice-serif prose with inline mono code. The agent form owns its meta row so the prose and the row keep the 12px transcript rhythm. Thinking is a separate component placed between the user message and the agent prose.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'User: the bubble (end-aligned, max 88% of the column; corners 16 / 16 / 6 / 16, the small corner under the sender). Agent: a grid with 12px gap holding the prose and the meta row.' },
    { name: 'body', el: 'div', parent: 'root', description: 'Agent only. The prose: voice serif, one or more paragraphs, each with an 8px bottom margin (the last one too).' },
    { name: 'code', el: 'code', parent: 'body', required: false, description: 'Inline code in the prose: mono, neutral track fill.' },
    { name: 'meta', el: 'div', parent: 'root', required: false, description: 'Agent only. Row under the prose: orb, summary text, then the actions pushed to the end.' },
    { name: 'orb', el: 'span', parent: 'meta', required: false, description: '8px spectrum dot (the dot form of the orb), aria-hidden.' },
    { name: 'summary', el: 'span', parent: 'meta', required: false, description: 'Who and how much: "Caustic · 3 tool calls · 12s".' },
    { name: 'actions', el: 'span', parent: 'meta', required: false, description: 'End cluster, 8px gap, margin-inline-start auto.' },
    { name: 'copy', el: 'button', parent: 'actions', required: false, role: 'button', description: 'IconButton xs, copy icon; aria-label from the copyLabel prop. Rendered when onCopy is given.' },
    { name: 'retry', el: 'button', parent: 'actions', required: false, role: 'button', description: 'IconButton xs, rotate-ccw icon; aria-label from the retryLabel prop. Rendered when onRetry is given.' },
  ],
  variants: {
    author: { values: ['user', 'agent'], default: 'agent', description: 'user = grey bubble in the UI voice; agent = serif prose with a meta row.' },
  },
  states: {
    loading: { props: { streaming: true } },
  },
  props: {
    author: { type: "'user' | 'agent'", default: 'agent', description: 'Who is speaking.' },
    streaming: { type: 'boolean', default: false, description: 'The agent is still writing this message: aria-busy while true so partial text is not announced.' },
    meta: { type: 'ReactNode', description: 'Agent only. Summary text of the meta row; the row (and its orb) renders when this or an action handler is given.' },
    onCopy: { type: '() => void', description: 'Agent only. Shows the copy IconButton.' },
    onRetry: { type: '() => void', description: 'Agent only. Shows the retry IconButton.' },
    copyLabel: { type: 'string', description: 'Agent only. aria-label of the copy button (e.g. "Copy"). Required whenever onCopy is given; no built-in default.' },
    retryLabel: { type: 'string', description: 'Agent only. aria-label of the retry button (e.g. "Retry"). Required whenever onRetry is given; no built-in default.' },
    children: { type: 'ReactNode', required: true, description: 'The text. User: inline text. Agent: paragraphs (<p>) and <code>.' },
  },
  events: {
    onCopy: { payload: 'void', when: 'the copy IconButton is activated' },
    onRetry: { payload: 'void', when: 'the retry IconButton is activated' },
  },
  styles: [
    { slot: 'root', when: { author: 'user' }, expect: { bg: 'neutral.track', fg: 'text.primary', padX: 12, padY: 8, text: 'ui-relaxed' }, note: 'Radius is 16 (2xl) on three corners and 6 (sm) on the bottom-end corner; the schema cannot express per-corner radii. Specimen edge is a 0.5px inset ring in border.subtle. justify-self / align-self end, max-width 88%.' },
    { slot: 'root', when: { author: 'agent' }, expect: { gap: 12 } },
    { slot: 'body', expect: { font: 'voice', text: 'voice', fg: 'text.primary' } },
    { slot: 'code', expect: { font: 'mono', text: 'mono', bg: 'neutral.track', padX: 5, padY: 1, radius: 'sm' }, note: 'Specimen radius 5px; sm (6) used. Specimen font-size 12 = mono.' },
    { slot: 'meta', expect: { gap: 6, text: 'hint', fg: 'text.tertiary' } },
    { slot: 'orb', expect: { height: 8, width: 8, radius: 'full' } },
    { slot: 'actions', expect: { gap: 8 } },
  ],
  behavior: {
    pointer: ['copy and retry are plain IconButtons; copy does not toggle a checkmark in the specimen'],
    scenarios: [
      { name: 'copy', props: { copyLabel: 'Copy' }, steps: [{ do: 'click', slot: 'copy' }], expect: [{ event: 'onCopy', calls: 1 }] },
      { name: 'retry', props: { retryLabel: 'Retry' }, steps: [{ do: 'click', slot: 'retry' }], expect: [{ event: 'onRetry', calls: 1 }] },
      { name: 'streaming is busy', props: { streaming: true }, steps: [], expect: [{ slot: 'root', attr: { 'aria-busy': 'true' } }] },
    ],
  },
  a11y: {
    attrs: { copy: ['aria-label'], retry: ['aria-label'] },
    notes: [
      'The copy and retry buttons are named by the copyLabel and retryLabel props; there is no built-in English name. The fixture and the example pass "Copy" and "Retry".',
      'The transcript container is the live region (role="log"); a streaming message sets aria-busy so only the finished text is announced, not every token.',
      'The orb is aria-hidden; the summary text states the author and the work done.',
      'The user bubble is plain text; no role.',
    ],
  },
  policies: ['P2', 'P4', 'P6', 'P8'],
  flags: { agent: { author: ['agent'] }, motionLoop: true },
  composition: { uses: ['icon-button', 'thinking'] },
  examples: [{ id: 'messages-and-thinking', title: 'Messages & thinking', doc: 'message#messages-and-thinking' }],
  usage: [
    'Fixture requirements for render(props): the default render is author="agent" with two paragraphs, the first containing an inline <code> ("lagoon/600"), meta "Caustic · 3 tool calls · 12s" and both handlers, so every slot exists. author="user" renders the bubble "Generate a dark variant of Lagoon. Keep the accent recognizable.".',
    'Example "messages-and-thinking" renders a grid column with 12px gap, in order: Message author="user" "Generate a dark variant of Lagoon. Keep the accent recognizable."; Thinking (status thinking, label "Thinking", open) with the text "Dark surfaces need a lighter accent step to hold contrast. Moving accent/solid from 600 to 400 keeps the hue and passes on surface."; Message author="agent" with the single paragraph "I derived 14 tokens for dark. The accent moves from <code>lagoon/600</code> to <code>lagoon/400</code>, so buttons stay recognizable and pass AA on every surface." and meta "Caustic · 3 tool calls · 12s" with copy and retry. Icons: copy, rotate-ccw.',
    'The bubble keeps the specimen padding 8 / 12 and the 6px sender corner; do not use the spectrum on a user message (P2, P7).',
    'Agent paragraphs are real <p> elements.',
  ],
});
