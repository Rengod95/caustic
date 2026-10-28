import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'alert',
  intent: 'A message about the current context that stays on the page, inline in a card or form or across a whole page.',
  roles: ['feedback.inline'],
  alsoFits: ['display.status', 'agent.request'],
  placement: ['page', 'card', 'form', 'inspector'],
  keywords: ['banner', 'callout', 'notice', 'message bar', 'inline message', 'warning'],
  pairs: ['button', 'card', 'form-layout'],
  consider: [
    { id: 'toast', when: 'the message confirms an action and can go away on its own' },
    { id: 'empty-state', when: 'the region has nothing in it yet and needs a way forward' },
  ],
  guidance: [
    'layout="page" spans the whole region; keep at most one per tone in a view.',
    'A dismissible alert needs dismissLabel; the dismiss button has no name otherwise.',
  ],
});
