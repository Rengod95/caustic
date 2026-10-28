import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'empty-state',
  intent: 'What a region shows when it has nothing yet or no results: why it is empty and what to do next.',
  roles: ['feedback.empty'],
  alsoFits: ['agent.request', 'canvas.surface'],
  placement: ['stage', 'page', 'card', 'start', 'canvas'],
  keywords: ['blank slate', 'zero state', 'no results', 'placeholder', 'first run', 'onboarding'],
  pairs: ['button', 'card', 'list', 'table'],
  consider: [
    { id: 'skeleton', when: 'the content is on its way and only needs a loading shape' },
    { id: 'alert', when: 'the region has content but something about it needs a notice' },
  ],
  guidance: [
    'Say why it is empty, then give the next step; keep to one primary action.',
    'variant="agent" is the blank-canvas opener: an orb and a serif prompt asking what to design.',
  ],
});
