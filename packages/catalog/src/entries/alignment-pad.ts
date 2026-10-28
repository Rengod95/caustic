import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'alignment-pad',
  intent: 'Pick where children sit inside an auto-layout frame on a 3×3 grid; the chosen cell also shows the flow direction.',
  roles: ['property.editor', 'choice.single'],
  alsoFits: ['input.pick'],
  placement: ['inspector'],
  keywords: ['alignment matrix', 'align items', 'justify content', 'anchor point', 'origin picker', 'nine grid'],
  pairs: ['auto-layout', 'number-field', 'segmented-control'],
  consider: [
    { id: 'button-group', when: 'aligning selected layers to each other rather than children inside a frame' },
    { id: 'constraints-control', when: 'pinning a frame to its parent instead of placing its children' },
  ],
  guidance: [
    'Set orientation to the frame flow so the glyph in the chosen cell runs along the main axis.',
    'It also reads well as an anchor or origin picker wherever the choice is one of nine positions.',
  ],
});
