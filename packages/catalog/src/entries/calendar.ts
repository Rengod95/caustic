import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'calendar',
  intent: 'Pick a date or a date range on a month grid that is shown open, with quick-pick shortcuts.',
  roles: ['input.date'],
  alsoFits: ['overlay.anchored'],
  placement: ['overlay', 'form', 'inspector'],
  keywords: ['month view', 'day picker', 'date grid', 'range picker', 'datepicker panel', 'schedule'],
  pairs: ['date-picker', 'popover', 'chip'],
  consider: [
    { id: 'date-picker', when: 'the date belongs in a form field that opens the calendar on demand' },
  ],
  guidance: [
    'Dates and months are ISO strings (YYYY-MM-DD, YYYY-MM); convert Date objects before passing them in.',
    'The panel is floating glass: it reads best over the stage or inside a popover, not flat on a page.',
  ],
});
