import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'change-detail',
  intent: 'List the changes in one revision: modified, added or deleted, on which layer or property, with the old and new values.',
  roles: ['display.change'],
  alsoFits: ['agent.plan', 'collection.list'],
  placement: ['end', 'card', 'transcript', 'page'],
  keywords: ['changelog', 'revision diff', 'version history', 'audit log', 'before after', 'what changed'],
  pairs: ['timeline', 'activity-tree', 'token-diff'],
  consider: [
    { id: 'token-diff', when: 'the change is a flat before and after list of token values' },
    { id: 'code-diff', when: 'the change is line-level code' },
  ],
  guidance: [
    'Values read as machine text; colour values can carry a small swatch so a change is seen at a glance.',
  ],
});
