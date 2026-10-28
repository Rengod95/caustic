import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'zoom-control',
  intent: 'Zoom out, the current zoom level and zoom in, as one capsule for the canvas, a floating bar or the titlebar.',
  roles: ['canvas.control'],
  alsoFits: ['input.number', 'action.group'],
  placement: ['canvas', 'toolbar', 'titlebar', 'overlay'],
  keywords: ['magnification', 'scale', 'fit to screen', 'zoom level', 'percentage', 'zoom to fit'],
  pairs: ['floating-bar', 'menu', 'segmented-control', 'button'],
  consider: [
    { id: 'number-field', when: 'people type an exact scale value in a form or inspector' },
    { id: 'slider', when: 'the scale is set by dragging across a range' },
  ],
  guidance: [
    'Use variant="ghost" inside a FloatingBar so it drops its own glass and shadow.',
    'With readout="menu", open your own Menu from the level (Fit all, Fit selection, 100%).',
  ],
});
