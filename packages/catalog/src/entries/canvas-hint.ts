import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'canvas-hint',
  intent: 'Show which modifier keys change a canvas gesture while it is running, at the bottom of the canvas.',
  roles: ['canvas.annotation'],
  alsoFits: ['feedback.transient', 'feedback.inline'],
  placement: ['canvas', 'overlay'],
  keywords: ['shortcut hint', 'modifier keys', 'keyboard hint', 'gesture help', 'key legend', 'hud'],
  pairs: ['canvas-selection', 'kbd', 'floating-bar'],
  consider: [
    { id: 'kbd', when: 'a single key is mentioned inline in text' },
    { id: 'tooltip', when: 'the shortcut belongs to one control and shows on hover' },
  ],
  guidance: [
    'Show it only for the length of the gesture and remove it when the gesture ends.',
  ],
});
