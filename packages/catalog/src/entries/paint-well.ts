import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'paint-well',
  intent: 'One solid paint in a row: a colour swatch, its hex digits and alpha, with token-bound, mixed and invalid looks.',
  roles: ['input.color', 'property.editor'],
  placement: ['inspector'],
  keywords: ['fill', 'fill color', 'color row', 'solid paint', 'color field', 'opacity'],
  pairs: ['color-picker', 'property-stack', 'stroke-editor', 'effect-editor'],
  consider: [
    { id: 'property-stack', when: 'a layer has several paints with order and visibility' },
    { id: 'color-well', when: 'only the swatch is needed' },
  ],
  guidance: [
    'Alpha here is the colour alpha; layer or paint opacity belongs to PropertyStack or StrokeEditor.',
    'Pressing the well asks you to open the colour picker; it does not open one itself.',
  ],
});
