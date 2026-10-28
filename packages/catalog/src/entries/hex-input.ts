import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'hex-input',
  intent: 'Edit a colour as hex digits in an uppercase mono field, with token-bound, mixed and invalid looks.',
  roles: ['input.color', 'input.text'],
  placement: ['inspector', 'inline', 'form'],
  keywords: ['hex code', 'color code', 'html color', 'hex color', 'rgb hex'],
  pairs: ['color-well', 'paint-well', 'color-picker'],
  consider: [
    { id: 'paint-well', when: 'the hex sits with a swatch and alpha in a fill row' },
    { id: 'channel-slider', when: 'the colour is tuned channel by channel' },
  ],
  guidance: [
    'Pass digits without a leading "#"; 3, 4, 6 and 8 digits are accepted and committed uppercase.',
  ],
});
