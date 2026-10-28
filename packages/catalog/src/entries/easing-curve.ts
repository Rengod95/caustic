import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'easing-curve',
  intent: 'Edit a cubic-bezier easing by dragging handles on a graph, with presets, a motion preview, the CSS value and duration.',
  roles: ['property.editor'],
  alsoFits: ['display.data', 'input.number'],
  placement: ['inspector', 'overlay', 'end'],
  keywords: ['bezier', 'timing function', 'transition', 'animation curve', 'ease in out', 'cubic-bezier', 'motion'],
  pairs: ['motion-timeline', 'number-field', 'dialog'],
  consider: [
    { id: 'motion-timeline', when: 'timing several layers or keyframes over time' },
  ],
  guidance: [
    'It is about 480px tall and never scrolls itself; put it in a scrolling container or turn the preview off.',
  ],
});
