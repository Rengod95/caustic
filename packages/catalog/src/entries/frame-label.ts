import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'frame-label',
  intent: 'Write a frame name and its dimensions just above the frame on the canvas.',
  roles: ['canvas.annotation'],
  alsoFits: ['display.status'],
  placement: ['canvas'],
  keywords: ['frame name', 'artboard title', 'dimensions', 'size label', 'frame header'],
  pairs: ['canvas-artboard', 'canvas-selection', 'canvas-comment'],
  consider: [
    { id: 'canvas-artboard', when: 'a plain title is enough; the artboard label prop draws it' },
  ],
  guidance: [
    'Use kind="frame" for the quieter label of a frame referenced in comments or review.',
  ],
});
