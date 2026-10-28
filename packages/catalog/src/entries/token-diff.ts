import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'token-diff',
  intent: 'A compact before and after list of token changes: the name, the old value and the new value.',
  roles: ['display.change', 'display.token'],
  alsoFits: ['display.code', 'agent.request'],
  placement: ['overlay', 'transcript', 'card', 'inspector'],
  keywords: ['diff', 'changes', 'before after', 'change list', 'changeset', 'review'],
  pairs: ['dialog', 'agent-request', 'change-detail', 'alias-chain'],
  consider: [
    { id: 'code-diff', when: 'the change is to code rather than token values' },
    { id: 'compare-view', when: 'people should compare the visual result side by side' },
  ],
  guidance: [
    'It fits inside a review dialog or an agent request to show what will change.',
  ],
});
