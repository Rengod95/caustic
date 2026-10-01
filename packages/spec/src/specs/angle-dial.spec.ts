import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'angle-dial',
  name: 'AngleDial',
  category: 'inspector',
  status: 'ready',
  purpose: 'Sets an angle by dragging around a small circle: a 32px dial with a short needle. 0° points up, 90° points right.',
  description: 'The compact direction control beside an Angle field. It carries no number itself; pair it with a NumberField (unit °) and, for a gradient, rotate and flip buttons. The needle rotates from the center; a hub dot marks the pivot.',
  role: null,
  slots: [
    { name: 'root', el: 'span', description: 'The dial: 32px circle, fill.hover with a 1px inset border.default ring, grab cursor, touch-action none, never shrinks. role="slider", tabindex 0.' },
    { name: 'needle', el: 'span', parent: 'root', description: 'A 10px × 2px bar from the center towards the angle (its transform origin is the left end), text.primary, 2px radius. Rotated by (angle − 90)°: 0° up, 90° right, 180° down.' },
    { name: 'hub', el: 'span', parent: 'root', description: 'Center dot, 4px, text.primary.' },
  ],
  states: {
    'focus-visible': { pseudo: ['focus', 'focus-visible'] },
    dragging: { pseudo: ['active'] },
    disabled: { props: { disabled: true } },
  },
  props: {
    value: { type: 'number', description: 'Controlled angle in degrees, 0–359.' },
    defaultValue: { type: 'number', default: 0, description: 'Uncontrolled initial angle.' },
    step: { type: 'number', default: 1, description: 'Arrow step in degrees; Shift and PageUp / PageDown use 15 steps.' },
    disabled: { type: 'boolean', default: false, description: 'Disables the dial.' },
  },
  events: {
    onValueChange: { payload: 'number', when: 'a drag or key changes the angle; the payload is an integer in 0–359' },
    onValueCommit: { payload: 'number', when: 'the pointer is released or a key step ends' },
  },
  styles: [
    { slot: 'root', expect: { bg: 'fill.hover', edge: 'border.default', radius: 'full', height: 'control-md', width: 'control-md', cursor: 'grab' } },
    { slot: 'root', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'root', when: { state: 'dragging' }, expect: { cursor: 'grabbing' } },
    { slot: 'root', when: { state: 'disabled' }, expect: { opacity: 0.42 } },
    { slot: 'needle', expect: { bg: 'text.primary', radius: '2xs', width: 10, height: 2 } },
    { slot: 'hub', expect: { bg: 'text.primary', radius: 'full', width: 4, height: 4 } },
  ],
  behavior: {
    keyboard: { ArrowRight: '+step', ArrowUp: '+step', ArrowLeft: '−step', ArrowDown: '−step', 'Shift+Arrow': '±15°', PageUp: '+15°', PageDown: '−15°', Home: '0°', End: '359°' },
    pointer: ['pressing on the dial points the needle at the pointer; dragging keeps following it (the angle wraps through 360°)', 'the angle is measured clockwise from straight up'],
    scenarios: [
      { name: 'ArrowRight adds a degree', props: { defaultValue: 90 }, steps: [{ do: 'focus', slot: 'root' }, { do: 'press', key: 'ArrowRight' }], expect: [{ event: 'onValueChange', args: [91] }] },
      { name: 'Shift+ArrowLeft subtracts 15', props: { defaultValue: 90 }, steps: [{ do: 'focus', slot: 'root' }, { do: 'press', key: 'Shift+ArrowLeft' }], expect: [{ event: 'onValueChange', args: [75] }] },
      { name: 'wraps below zero', props: { defaultValue: 0 }, steps: [{ do: 'focus', slot: 'root' }, { do: 'press', key: 'ArrowLeft' }], expect: [{ event: 'onValueChange', args: [359] }] },
      { name: 'disabled ignores keys', props: { defaultValue: 90, disabled: true }, steps: [{ do: 'focus', slot: 'root' }, { do: 'press', key: 'ArrowRight' }], expect: [{ event: 'onValueChange', calls: 0 }] },
    ],
  },
  a11y: {
    labelRequired: true,
    minHit: 24,
    attrs: { root: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax', 'aria-label'] },
    notes: ['role="slider" with aria-valuemin 0, aria-valuemax 359 and aria-label "Angle"; aria-valuetext like "90 degrees".', 'The needle and hub are aria-hidden.'],
  },
  policies: ['P6', 'P8'],
  composition: { uses: [] },
  usage: [
    'No example of its own: it is part of the gradient-editor example (value 90).',
    'Fixture contract: render(props) renders the dial with defaultValue 90 unless a scenario passes another value.',
    'Specimen has no keyboard handling for the dial (it has tabindex 0 and role slider but only reacts to pointer); the keyboard rules above are part of this spec.',
    'The needle length of 10px is the specimen value; the dial is 32px.',
  ],
});
