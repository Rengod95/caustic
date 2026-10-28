import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'canvas-artboard',
  intent: 'The sheet of a frame on the canvas that holds the design being made.',
  roles: ['canvas.surface'],
  alsoFits: ['layout.container'],
  placement: ['canvas', 'stage'],
  keywords: ['frame', 'page', 'board', 'slide', 'sheet', 'design surface', 'screen'],
  pairs: ['frame-label', 'canvas-selection', 'canvas-ruler', 'agent-work-area', 'canvas-comment'],
  consider: [
    { id: 'card', when: 'the surface is part of the interface rather than user content' },
    { id: 'compare-view', when: 'two versions of a frame are shown side by side' },
  ],
  guidance: [
    'Its fill is user content and never follows the interface theme; set the design inside it yourself.',
    'The label prop draws a plain title; use FrameLabel when the dimensions should show too.',
  ],
});
