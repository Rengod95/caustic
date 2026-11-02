import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'status-dot',
  intent: 'Show a short state as a small coloured dot followed by its words, in a table cell, a map cell or a row.',
  roles: ['display.status'],
  placement: ['inline', 'card', 'page'],
  keywords: ['status dot', 'state indicator', 'health', 'on off', 'status cell'],
  pairs: ['table', 'list', 'card-stat'],
  consider: [{ id: 'badge', when: 'the state is the focus of its row and should read as a pill' }],
  guidance: [
    'Write the whole state in the label, such as "On · 2 failures"; the dot tone only repeats it.',
    'The tone colours the dot only; the label stays neutral secondary text.',
  ],
});
