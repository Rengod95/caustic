import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'date-picker',
  intent: 'Choose a date or a date range in a form, from a field that opens a calendar panel.',
  roles: ['input.date'],
  alsoFits: ['property.editor'],
  placement: ['form', 'inspector', 'toolbar'],
  keywords: ['datepicker', 'date field', 'date range', 'date input', 'publish date', 'schedule'],
  pairs: ['field', 'form-layout', 'button'],
  consider: [
    { id: 'calendar', when: 'the month grid should stay open on the page or in a panel' },
  ],
  guidance: [
    'Values are ISO date strings; the trigger formats them in English, as in Oct 8 – Oct 14, 2026.',
    'In range mode the panel stays open between the start and the end; a shortcut sets both at once.',
  ],
});
