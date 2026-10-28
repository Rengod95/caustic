import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'policy-findings',
  intent: 'The result of a policy or lint check: counts of errors, warnings and passes, then one row per finding with its action.',
  roles: ['feedback.findings'],
  alsoFits: ['agent.suggestion', 'collection.list', 'feedback.inline'],
  placement: ['end', 'page', 'card', 'transcript'],
  keywords: ['lint', 'audit', 'design linter', 'violations', 'rule check', 'issues', 'problems', 'validation report'],
  pairs: ['contrast-insight', 'alert', 'chip'],
  consider: [
    { id: 'contrast-insight', when: 'explaining one contrast pair in depth' },
    { id: 'alert', when: 'there is a single message rather than a list of findings' },
  ],
  guidance: [
    'Give the agent-tone Fix only to findings an agent can repair; the rest get a quiet Show or Migrate.',
    'List violations first and passes last.',
  ],
});
