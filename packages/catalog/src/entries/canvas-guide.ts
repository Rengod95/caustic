import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'canvas-guide',
  intent: 'Alignment aids over the canvas: smart and user guides, distance measurements and snap marks.',
  roles: ['canvas.annotation'],
  placement: ['canvas'],
  keywords: ['smart guides', 'snapping', 'redline', 'spacing', 'alignment line', 'measurement', 'distance'],
  pairs: ['canvas-ruler', 'canvas-selection', 'canvas-artboard'],
  consider: [
    { id: 'canvas-ruler', when: 'people need the scale along the canvas edge rather than a line across it' },
  ],
  guidance: [
    'Draw guides only while they apply (dragging, measuring); user guides stay until removed.',
  ],
});
