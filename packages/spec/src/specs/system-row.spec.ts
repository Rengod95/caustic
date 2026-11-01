import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'system-row',
  name: 'SystemRow',
  category: 'agent',
  status: 'ready',
  purpose: 'A quiet row in a chat transcript for something the system did, not a person or the agent: a signal, a group change, a lease handover, a goal verdict, a bundle of failures. A muted icon, one secondary line and at most one action.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Flex row, items centred, 10px gap, min-width 0, ui-sm type.' },
    { name: 'icon', el: 'span', parent: 'root', description: 'The glyph, aria-hidden, muted (text.tertiary, size icon-sm).' },
    { name: 'text', el: 'span', parent: 'root', description: 'The one line: text.secondary, truncating.' },
    { name: 'action', el: 'button', parent: 'root', required: false, description: 'The single optional action: a ghost xs neutral Button from actionLabel.' },
  ],
  variants: {},
  states: {},
  props: {
    icon: { type: 'ReactNode', description: 'The glyph before the text (an icon element); drawn muted.' },
    children: { type: 'ReactNode', description: 'The one line of text.' },
    actionLabel: { type: 'ReactNode', description: 'Label of the single action. Unset renders no action.' },
    onAction: { type: '() => void', description: 'Called when the action is pressed.' },
  },
  events: {
    onAction: { payload: 'void', when: 'The action is pressed.' },
  },
  styles: [
    { slot: 'root', expect: { gap: 10, text: 'ui-sm' } },
    { slot: 'icon', expect: { fg: 'text.tertiary', height: 'icon-sm', width: 'icon-sm' } },
    { slot: 'text', expect: { fg: 'text.secondary' } },
  ],
  behavior: {
    scenarios: [
      { name: 'the action reports a press', props: { actionLabel: 'Open' }, steps: [{ do: 'click', slot: 'action' }], expect: [{ event: 'onAction', calls: 1 }] },
      { name: 'no action by default', steps: [], expect: [{ hidden: 'action' }] },
    ],
  },
  a11y: { labelRequired: false, notes: ['The line is plain text in reading order; the icon is decorative and never the only carrier of the meaning.'] },
  policies: ['P6'],
  flags: {},
  composition: { uses: ['button'] },
  examples: [],
  usage: [
    'Use for transcript rows the system writes; a message from the agent or a person is a Message.',
    'One line only: put the detail in the row the action opens. At most one action.',
  ],
});
