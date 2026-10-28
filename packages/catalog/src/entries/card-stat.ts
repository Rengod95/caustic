import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'card-stat',
  intent: 'Show one KPI: a label, a large value, a coloured change with a note and an optional sparkline.',
  roles: ['display.metric'],
  placement: ['page', 'end', 'card'],
  keywords: ['kpi', 'stat', 'metric tile', 'scorecard', 'number card', 'sparkline'],
  pairs: ['card', 'section-header', 'table'],
  consider: [
    { id: 'card', when: 'the number needs a chart, a list or more content around it' },
    { id: 'progress', when: 'the number is completion toward a known total' },
  ],
  guidance: [
    'deltaTone is the meaning, not the direction: fewer errors is a good drop.',
  ],
});
