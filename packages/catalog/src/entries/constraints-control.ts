import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'constraints-control',
  intent: 'Pin a frame to its parent with a box of pins and two matching selects, plus a note on what resizing will do.',
  roles: ['property.editor'],
  alsoFits: ['choice.single'],
  placement: ['inspector'],
  keywords: ['pinning', 'anchors', 'resizing', 'responsive', 'layout constraints'],
  pairs: ['position-size', 'auto-layout', 'button-group'],
  consider: [
    { id: 'alignment-pad', when: 'placing children inside an auto-layout frame instead' },
    { id: 'position-size', when: 'editing the frame position and size themselves' },
  ],
  guidance: [
    'Write the note in plain words for the current value; it is what makes the choice understandable.',
  ],
});
