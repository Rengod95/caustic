import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'line-grid',
  intent: 'Lay out a matrix, metric group, compare block or summary cells on shared hairlines, with hatched cells for what does not apply.',
  roles: ['display.data'],
  alsoFits: ['display.metric'],
  placement: ['page', 'card'],
  keywords: ['line grid', 'cell grid', 'matrix', 'metric cells', 'compare table', 'hatched cell', 'cross mark'],
  pairs: ['section-header', 'status-dot'],
  consider: [{ id: 'table', when: 'the content is records to sort, select or page through' }],
  guidance: [
    'Keep cell items to text with an optional 6px dot; counts and chips make the lines noisy.',
    'Use LineGridMetric for a value above a muted label, and LineGridEmpty when a cell does not apply.',
  ],
});
