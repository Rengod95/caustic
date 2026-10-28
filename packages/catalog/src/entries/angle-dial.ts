import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'angle-dial',
  intent: 'Set a direction or rotation by dragging a needle around a small dial, next to an angle field.',
  roles: ['input.number', 'property.editor'],
  placement: ['inspector', 'inline'],
  keywords: ['rotation knob', 'angle picker', 'direction', 'knob', 'gradient angle', 'degrees'],
  pairs: ['number-field', 'gradient-editor', 'icon-button'],
  consider: [
    { id: 'number-field', when: 'an exact typed angle is all that is needed' },
    { id: 'slider', when: 'the value is a bounded linear range rather than a direction' },
  ],
  guidance: [
    'It shows no number; put a NumberField with a ° unit beside it for the exact value.',
    '0° points up and angles grow clockwise, as in CSS gradients rather than math atan2.',
  ],
});
