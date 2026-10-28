import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'color-well',
  intent: 'A swatch of the current paint: flat colour, gradient or translucent colour, with a mixed look for multi-selections.',
  roles: ['input.color'],
  alsoFits: ['display.status', 'display.data', 'action.icon'],
  placement: ['inspector', 'inline', 'card'],
  keywords: ['swatch', 'color chip', 'color sample', 'color preview', 'paint swatch'],
  pairs: ['color-picker', 'paint-well', 'stack-row'],
  consider: [
    { id: 'color-tile', when: 'showing a palette colour with its name and value' },
    { id: 'paint-well', when: 'the row also needs the hex digits and alpha' },
  ],
  guidance: [
    'The paint is data: pass any CSS colour or gradient, not a theme token, so user colours show exactly.',
  ],
});
