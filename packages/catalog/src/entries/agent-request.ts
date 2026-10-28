import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'agent-request',
  intent: 'Let the agent ask the person to decide inline: build a proposed plan, review a batch of changes, or allow an action.',
  roles: ['agent.request'],
  alsoFits: ['feedback.inline', 'overlay.anchored', 'display.data'],
  placement: ['transcript', 'end', 'overlay'],
  keywords: ['approval', 'permission prompt', 'confirm', 'proposal', 'review changes', 'human in the loop', 'consent'],
  pairs: ['message', 'token-diff', 'chip', 'choice-group', 'plan', 'composer'],
  consider: [
    { id: 'dialog', when: 'the decision must block the whole app until it is answered' },
    { id: 'choice-group', when: 'the agent asks a clarifying question with a few answer options' },
    { id: 'alert', when: 'the agent reports something that needs no decision' },
  ],
  guidance: [
    'You own the status: set it once the person answers and the card collapses into a one-line record.',
    'Once a proposal is built, replace it with the Plan or collapse it; keep the pending look for open requests.',
    'When "always" grants more than this one call, say the scope in the subtitle.',
  ],
});
