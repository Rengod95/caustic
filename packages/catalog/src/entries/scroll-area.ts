import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'scroll-area',
  intent: 'A scroll container with a thin themed scrollbar and an optional edge fade, keeping native scrolling.',
  roles: ['layout.container'],
  placement: ['start', 'end', 'inspector', 'card', 'transcript'],
  keywords: ['scrollbar', 'overflow', 'scroll view', 'scroll container', 'scrollable'],
  pairs: ['side-panel', 'table', 'list', 'code-diff'],
  consider: [
    { id: 'side-panel', when: 'you need a full panel with a header and a scrolling body' },
  ],
  guidance: [
    'The parent sets the height (a flex child with min-height 0, or a fixed height); the area never picks one.',
    'Use viewportRef to auto-scroll a chat; the component never scrolls on its own.',
  ],
});
