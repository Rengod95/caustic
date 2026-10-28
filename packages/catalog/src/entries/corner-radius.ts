import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'corner-radius',
  intent: 'Edit the corner radius of a shape: one value, corner smoothing, and four independent corners behind a toggle.',
  roles: ['property.editor', 'input.number'],
  placement: ['inspector'],
  keywords: ['border radius', 'rounded corners', 'squircle', 'smoothing', 'corner shape'],
  pairs: ['position-size', 'inspector-panel', 'stroke-editor'],
  consider: [
    { id: 'number-field', when: 'a single radius value is all that is needed' },
  ],
  guidance: [
    'Typing the main radius sets all four corners; mark it mixed while the corners differ.',
  ],
});
