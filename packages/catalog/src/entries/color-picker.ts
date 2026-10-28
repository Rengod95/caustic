import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'color-picker',
  intent: 'Pick one paint in a popover: a saturation and brightness plane, hue and alpha, eyedropper, hex fields and page swatches.',
  roles: ['input.color', 'overlay.anchored'],
  alsoFits: ['property.editor'],
  placement: ['overlay', 'inspector'],
  keywords: ['colour picker', 'color chooser', 'eyedropper', 'swatches', 'hsv', 'paint picker', 'fill picker'],
  pairs: ['color-well', 'paint-well', 'gradient-editor', 'popover'],
  consider: [
    { id: 'channel-slider', when: 'a token colour is tuned precisely, channel by channel' },
    { id: 'gradient-editor', when: 'the paint is a gradient rather than a flat colour' },
  ],
  guidance: [
    'Open it from a ColorWell or PaintWell; inside a popover of your own use embedded so the chrome does not stack.',
    'Use commitMode "release" so one drag on the plane or a slider is one undo step.',
  ],
});
