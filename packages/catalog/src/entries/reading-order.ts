import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'reading-order',
  intent: 'Show and reorder the order a screen reader reads the elements of a frame, flagging items read out of visual order.',
  roles: ['collection.list'],
  alsoFits: ['feedback.inline', 'property.editor'],
  placement: ['end', 'inspector', 'card'],
  keywords: ['accessibility', 'a11y', 'tab order', 'focus order', 'screen reader', 'dom order', 'reorder'],
  pairs: ['contrast-insight', 'policy-findings', 'badge'],
  consider: [
    { id: 'list', when: 'reordering a list that is not about reading order' },
  ],
  guidance: [
    'It reports the new order; you store it and recompute which items read out of visual order.',
  ],
});
