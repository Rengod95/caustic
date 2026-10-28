import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'badge',
  intent: 'A small read-only label for a status, a count, a design token name or a contrast result.',
  roles: ['display.status'],
  alsoFits: ['display.data', 'display.metric'],
  placement: ['inline', 'card', 'inspector', 'toolbar', 'transcript'],
  keywords: ['tag', 'pill', 'lozenge', 'status label', 'counter', 'token chip', 'contrast chip', 'new label'],
  pairs: ['list', 'table', 'tabs', 'card', 'menu'],
  consider: [
    { id: 'chip', when: 'the token can be clicked, toggled or removed' },
    { id: 'kbd', when: 'it shows a key or shortcut' },
    { id: 'contrast-insight', when: 'the full contrast readout with every level is needed' },
  ],
  guidance: [
    'Keep the label to a word or a count.',
    'tone="agent" is for things the agent made or did.',
    'It is not interactive; wrap it in a button when it must be clickable.',
  ],
});
