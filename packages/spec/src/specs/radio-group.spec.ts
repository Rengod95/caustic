import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'radio-group',
  name: 'RadioGroup',
  category: 'form',
  status: 'ready',
  purpose: 'Picks exactly one option from a short visible list.',
  role: 'radiogroup',
  slots: [
    { name: 'root', el: 'div', role: 'radiogroup', description: 'Group container; arrow keys move the selection.' },
    { name: 'item', el: 'button', parent: 'root', role: 'radio', description: '18px circle.' },
    { name: 'indicator', el: 'span', parent: 'item', required: false, description: '7px dot when selected.' },
    { name: 'label', el: 'label', parent: 'root', required: false, description: 'Wraps an item with its text.' },
  ],
  props: {
    value: { type: 'string', description: 'Controlled value.' },
    defaultValue: { type: 'string', description: 'Uncontrolled initial value.' },
    disabled: { type: 'boolean', description: 'Disables every item.' },
    orientation: { type: "'horizontal' | 'vertical'", default: 'vertical', description: 'Arrow-key axis and layout.' },
  },
  events: { onValueChange: { payload: 'string', when: 'an item is selected by click or arrow key' } },
  styles: [
    { slot: 'item', expect: { bg: 'surface.base', edge: 'border.control', radius: 'full', height: 'size-check', width: 'size-check' } },
    { slot: 'indicator', expect: { bg: 'accent.on', height: 'size-radio-dot' } },
  ],
  behavior: {
    keyboard: { ArrowDown: 'select next', ArrowUp: 'select previous', ArrowRight: 'select next', ArrowLeft: 'select previous' },
    scenarios: [
      { name: 'arrow selects next', steps: [{ do: 'focus', slot: 'item' }, { do: 'press', key: 'ArrowDown' }], expect: [{ event: 'onValueChange', args: ['fill'] }] },
    ],
  },
  a11y: { labelRequired: true },
  policies: ['P6'],
});
