import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'thinking',
  name: 'Thinking',
  category: 'agent',
  status: 'ready',
  purpose: 'The agent reasoning shown as a collapsible italic aside. While the agent is still thinking, the label shimmers; the text is in the serif thought voice behind a hairline rule.',
  description: 'A disclosure: a summary row (chevron and label) that opens the thought text. The chevron rotates 90 degrees when open. Not a user message and not a result; it is dismissible context. Implemented with useControllableState and a button; no Radix.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'The disclosure. 12px radius (no visible fill). data-state open | closed.' },
    { name: 'summary', el: 'button', parent: 'root', role: 'button', description: 'The trigger row: flex, 8px gap, 4px vertical padding, pointer, aria-expanded.' },
    { name: 'chevron', el: 'any', parent: 'summary', description: 'chevron-right icon, 14px, rotates 90 degrees when open (duration-base, ease-out). aria-hidden.' },
    { name: 'label', el: 'span', parent: 'summary', description: 'The label, tertiary. Shimmers while status="thinking".' },
    { name: 'body', el: 'div', parent: 'root', required: false, description: 'The thought text: serif italic, 4px below the summary, indented 6px, 14px inner start padding, 1px start rule. Not rendered when closed.' },
  ],
  variants: {
    status: { values: ['thinking', 'done'], default: 'thinking', description: 'thinking = the label shimmers (the agent is still reasoning); done = static label (for example "Thought for 8s").' },
  },
  states: {
    open: { props: { open: true } },
    closed: { props: { open: false } },
    'focus-visible': { pseudo: ['focus', 'focus-visible'], target: 'summary' },
  },
  props: {
    open: { type: 'boolean', description: 'Controlled open state.' },
    defaultOpen: { type: 'boolean', default: false, description: 'Uncontrolled initial state.' },
    status: { type: "'thinking' | 'done'", default: 'thinking', description: 'Shimmer while thinking.' },
    label: { type: 'ReactNode', default: 'Thinking', description: 'Summary text.' },
    children: { type: 'ReactNode', description: 'The thought text.' },
  },
  events: { onOpenChange: { payload: 'boolean', when: 'the summary is activated' } },
  styles: [
    { slot: 'root', expect: { radius: 'xl' } },
    { slot: 'summary', expect: { padY: 4, gap: 8, text: 'ui-dense', fg: 'text.tertiary', cursor: 'pointer' } },
    { slot: 'summary', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'chevron', expect: { height: 'icon-sm', width: 'icon-sm' } },
    { slot: 'label', when: { status: 'thinking' }, expect: { fg: 'text.tertiary' }, note: 'The shimmer utility paints a band of text.primary across the text.tertiary base; the resting color is tertiary.' },
    { slot: 'body', expect: { font: 'voice', text: 'thought', fg: 'text.secondary', border: 'border.default', padStart: 14, padEnd: 0, padTop: 2, padBottom: 2 }, note: 'Margin 4px 0 0 6px; a 1px border on the start side only.' },
  ],
  behavior: {
    keyboard: { Enter: 'toggle (on the summary)', Space: 'toggle (on the summary)' },
    pointer: ['pressing the summary toggles it', 'the chevron rotates with duration-base'],
    scenarios: [
      { name: 'click opens', props: { defaultOpen: false }, steps: [{ do: 'click', slot: 'summary' }], expect: [{ event: 'onOpenChange', args: [true] }, { slot: 'root', attr: { 'data-state': 'open' } }] },
      { name: 'click closes', props: { defaultOpen: true }, steps: [{ do: 'click', slot: 'summary' }], expect: [{ event: 'onOpenChange', args: [false] }, { slot: 'root', attr: { 'data-state': 'closed' } }] },
      { name: 'Enter toggles', props: { defaultOpen: false }, steps: [{ do: 'focus', slot: 'summary' }, { do: 'press', key: 'Enter' }], expect: [{ event: 'onOpenChange', args: [true] }] },
    ],
  },
  a11y: {
    attrs: { summary: ['aria-expanded', 'aria-controls'] },
    notes: [
      'The shimmer is decoration on a text label; the label itself ("Thinking") states the status.',
      'Reduced motion stops the shimmer (the global rule); the label stays tertiary.',
      'The thought text is the agent reasoning, rendered as prose; it is not announced while streaming.',
    ],
  },
  policies: ['P2', 'P4', 'P6', 'P8'],
  flags: { agent: { status: ['thinking'] }, motionLoop: true },
  usage: [
    'Fixture requirements for render(props): label "Thinking", defaultOpen true, body "Dark surfaces need a lighter accent step to hold contrast. Moving accent/solid from 600 to 400 keeps the hue and passes on surface." The open state must be the default render so the body slot exists.',
    'No example of its own: it is shown inside the message example (message#messages-and-thinking).',
    'Use status="done" with a duration label once the thought is finished; never leave a shimmer on a finished thought.',
  ],
});
