import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'suggestions',
  intent: 'Offer a row of quick prompts, each a card with an icon, a short action and a hint, that run when pressed.',
  roles: ['agent.suggestion', 'action.secondary'],
  alsoFits: ['feedback.empty', 'action.group'],
  placement: ['transcript', 'end', 'overlay', 'stage'],
  keywords: ['quick prompts', 'starter prompts', 'prompt chips', 'conversation starters', 'next actions', 'recommendations'],
  pairs: ['composer', 'empty-state', 'message'],
  consider: [
    { id: 'empty-state', when: 'the region also needs to explain why it is empty and the single way forward' },
    { id: 'button-group', when: 'the actions are plain commands with no context hint' },
  ],
  guidance: [
    'Pressing a card only reports it; you decide whether it fills the composer or submits.',
    'The glass cards are made to float over the canvas or the transcript.',
  ],
});
