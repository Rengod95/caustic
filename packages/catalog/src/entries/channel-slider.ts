import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'channel-slider',
  intent: 'Edit a colour channel by channel in OKLCH, HSL or hex, each track painting the real range of its channel.',
  roles: ['input.color', 'property.editor'],
  placement: ['inspector', 'end', 'form'],
  keywords: ['color sliders', 'oklch', 'lch', 'hsl', 'color channels', 'lightness', 'chroma', 'hue', 'token color'],
  pairs: ['color-well', 'hex-input', 'alias-chain'],
  consider: [
    { id: 'color-picker', when: 'picking a paint visually on a plane with page swatches' },
    { id: 'hex-input', when: 'only the hex digits need editing' },
  ],
  guidance: [
    'The value is always OKLCH; HSL and hex edits clamp into sRGB, so out-of-gamut colours move when edited there.',
  ],
});
