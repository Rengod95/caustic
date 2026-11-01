import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'meter',
  intent: 'Show a bounded measurement against a limit, such as a budget spent or a quota left, with warning and danger thresholds.',
  roles: ['display.metric'],
  alsoFits: ['feedback.progress'],
  placement: ['inline', 'toolbar', 'card', 'page'],
  keywords: ['gauge', 'budget bar', 'quota', 'usage meter', 'limit'],
  pairs: ['card-stat', 'progress'],
  consider: [{ id: 'progress', when: 'the bar shows work that is running, not a measurement against a limit' }],
  guidance: [
    'Pass high as 50% of max for a budget so half spent reads warning and the full budget reads danger.',
    'The tone is on the bar only; keep the label and value as neutral text.',
  ],
});
