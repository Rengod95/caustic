import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'color-tile',
  intent: 'Show a colour token as a swatch with its value and its contrast against white and black.',
  roles: ['display.token'],
  alsoFits: ['display.status', 'display.data'],
  placement: ['page', 'card', 'inspector'],
  keywords: ['swatch', 'color chip', 'palette', 'contrast check', 'wcag', 'color token'],
  pairs: ['token-graph', 'contrast-insight', 'alias-chain'],
  consider: [
    { id: 'color-well', when: 'people should pick or edit the colour' },
    { id: 'contrast-insight', when: 'the contrast story needs more than white and black' },
  ],
  guidance: [
    'Colours are runtime data passed as props, never as class names; tiles read best in a grid.',
  ],
});
