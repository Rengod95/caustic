import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'canvas-ruler',
  intent: 'The measuring strips along the top and left of the canvas, with the range of the current selection.',
  roles: ['canvas.annotation'],
  alsoFits: ['canvas.control'],
  placement: ['canvas', 'stage'],
  keywords: ['rulers', 'measure', 'tick marks', 'scale', 'coordinates'],
  pairs: ['canvas-guide', 'canvas-selection', 'canvas-artboard'],
  consider: [
    { id: 'canvas-guide', when: 'a distance or alignment between objects is shown across the canvas' },
  ],
  guidance: [
    'Render three: a horizontal strip, a vertical strip and the corner block where they meet.',
  ],
});
