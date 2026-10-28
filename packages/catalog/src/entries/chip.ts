import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'chip',
  intent: 'A compact token for a filter, a quick option, a toggle or a removable reference to a frame or file.',
  roles: ['choice.multi', 'display.status'],
  alsoFits: ['choice.toggle', 'action.secondary', 'agent.request'],
  placement: ['inline', 'toolbar', 'transcript', 'form', 'card'],
  keywords: ['filter chip', 'tag', 'pill', 'token', 'quick reply', 'suggestion chip', 'attachment', 'reference'],
  pairs: ['tag-input', 'composer', 'calendar', 'suggestions', 'badge'],
  consider: [
    { id: 'badge', when: 'the label is read-only status or a count' },
    { id: 'tag-input', when: 'the user types the values in' },
    { id: 'segmented-control', when: 'exactly one of a few options is chosen' },
  ],
  guidance: [
    'Make a chip either a toggle or removable; a remove control inside a pressable chip is nested interaction.',
    'The rounded surface form suits removable references; the pill form suits filters, quick options and toggles.',
  ],
});
