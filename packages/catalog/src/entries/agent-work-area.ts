import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'agent-work-area',
  intent: 'Mark the object on the canvas the agent is working on with a spectrum rim and a scanning band.',
  roles: ['agent.presence', 'canvas.annotation'],
  alsoFits: ['feedback.progress'],
  placement: ['canvas', 'stage'],
  keywords: ['agent editing', 'working region', 'in progress', 'busy area', 'claimed object', 'ai highlight'],
  pairs: ['agent-cursor', 'canvas-selection', 'canvas-artboard'],
  consider: [
    { id: 'canvas-selection', when: 'the object is selected by a person' },
    { id: 'skeleton', when: 'a region outside the canvas is loading' },
  ],
  guidance: [
    'Keep selection handles off an object the agent holds, so people and the agent never look alike.',
    'Without scanning only the rim shows: the object is claimed but the agent is idle.',
  ],
});
