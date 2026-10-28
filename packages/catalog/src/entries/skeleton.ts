import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'skeleton',
  intent: 'Hold the place of loading content with a soft shimmering block of the same shape.',
  roles: ['feedback.progress'],
  placement: ['card', 'page', 'end', 'start', 'transcript'],
  keywords: ['shimmer', 'placeholder', 'loading state', 'ghost content', 'content loader', 'skeleton screen'],
  pairs: ['card', 'list', 'avatar', 'table'],
  consider: [
    { id: 'progress', when: 'the amount is known or a task is running' },
    { id: 'thinking', when: 'the wait is for the agent to reply' },
  ],
  guidance: [
    'Match the shape and size of the content it replaces: lines for text, tiles for avatars and thumbnails.',
    'Keep one loading signal per region; a skeleton and a spinner read as two.',
  ],
});
