import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'code-diff',
  intent: 'Let a person review code the agent wrote as a unified diff with line numbers and Accept or Reject.',
  roles: ['display.change', 'display.code'],
  alsoFits: ['agent.request'],
  placement: ['transcript', 'end', 'stage', 'overlay'],
  keywords: ['patch', 'changes', 'unified diff', 'pull request', 'code review', 'changeset', 'added removed lines'],
  pairs: ['code-realization', 'tool-call', 'agent-request', 'message'],
  consider: [
    { id: 'token-diff', when: 'the change is a set of token values rather than lines of code' },
    { id: 'compare-view', when: 'the change is visual and best judged as before and after renderings' },
  ],
  guidance: [
    'Inside a hunk put removed lines before added ones; removed lines carry the old number, others the new one.',
  ],
});
