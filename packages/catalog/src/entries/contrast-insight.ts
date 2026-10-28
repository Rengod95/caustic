import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'contrast-insight',
  intent: 'Explain the contrast of a selected element: the ratio, WCAG levels met, a sample, and a fix suggestion when it falls short.',
  roles: ['feedback.findings', 'display.metric'],
  alsoFits: ['agent.suggestion', 'feedback.inline'],
  placement: ['end', 'inspector', 'card', 'transcript'],
  keywords: ['accessibility', 'a11y', 'wcag', 'color contrast', 'contrast ratio', 'legibility', 'contrast checker'],
  pairs: ['policy-findings', 'alert', 'button', 'compare-view'],
  consider: [
    { id: 'policy-findings', when: 'reporting many checks across a design rather than one colour pair' },
  ],
  guidance: [
    'You compute the ratio and pass the sample colours; the component only presents them.',
  ],
});
