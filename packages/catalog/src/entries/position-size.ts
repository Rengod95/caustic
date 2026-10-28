import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'position-size',
  intent: 'The geometry block of an inspector: X and Y, width and height with Fixed, Hug or Fill, ratio lock, rotation and flips.',
  roles: ['property.editor', 'property.panel'],
  placement: ['inspector'],
  keywords: ['transform', 'dimensions', 'coordinates', 'frame size', 'rotation', 'resize', 'hug contents', 'fill container'],
  pairs: ['inspector-panel', 'constraints-control', 'auto-layout', 'corner-radius'],
  consider: [
    { id: 'number-field', when: 'only one or two geometry values are needed outside an inspector' },
  ],
  guidance: [
    'A Hug or Fill dimension shows a number derived from layout and is read-only unless you allow typing.',
    'The section heading and its alignment buttons belong to the surrounding InspectorSection.',
  ],
});
