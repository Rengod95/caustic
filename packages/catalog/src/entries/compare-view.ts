import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'compare-view',
  intent: 'Compare two renderings of the same design with a draggable split or an adjustable overlay.',
  roles: ['display.change'],
  alsoFits: ['canvas.surface', 'agent.request'],
  placement: ['stage', 'overlay', 'page', 'card'],
  keywords: ['before after', 'image comparison', 'swipe compare', 'onion skin', 'side by side', 'visual diff'],
  pairs: ['segmented-control', 'slider', 'agent-request', 'timeline'],
  consider: [
    { id: 'code-diff', when: 'the change is in code lines' },
    { id: 'token-diff', when: 'the change is a list of token values' },
  ],
  guidance: [
    'You render both sides and own the Split / Overlay switch and the opacity slider, outside the stage.',
  ],
});
