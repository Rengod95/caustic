import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'canvas-selection',
  intent: 'The rects a person puts on the canvas: selection with handles, hover ring, marquee and shape being drawn.',
  roles: ['canvas.annotation'],
  alsoFits: ['canvas.control'],
  placement: ['canvas'],
  keywords: ['bounding box', 'transform handles', 'marquee', 'rubber band', 'hover outline', 'resize handles', 'size chip'],
  pairs: ['canvas-artboard', 'floating-bar', 'canvas-guide', 'canvas-ruler', 'agent-work-area', 'canvas-hint'],
  consider: [
    { id: 'agent-work-area', when: 'the agent, not the person, is working on the object' },
  ],
  guidance: [
    'Positions are px from a positioned host; give the host an explicit size, since every overlay is absolute.',
  ],
});
