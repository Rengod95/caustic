import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'context-analytics',
  intent: 'Show how much of the model context window a session uses, per round and by what fills it.',
  roles: ['display.metric', 'display.data'],
  alsoFits: ['agent.plan'],
  placement: ['end', 'overlay', 'page', 'card'],
  keywords: ['token usage', 'context window', 'token budget', 'usage chart', 'quota', 'context breakdown'],
  pairs: ['composer', 'popover', 'card', 'card-stat'],
  consider: [
    { id: 'card-stat', when: 'one usage number with a trend is enough' },
    { id: 'progress', when: 'a single bar of how full the window is will do' },
  ],
  guidance: [
    'It has no surface of its own; place it in a Card, a popover or a panel section.',
    'The chart always has 12 round columns; pad earlier sessions with empty rounds.',
  ],
});
