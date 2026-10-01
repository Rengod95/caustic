import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'checkbox',
  name: 'Checkbox',
  category: 'form',
  status: 'ready',
  purpose: 'Selects an option in a form; supports a mixed state for partial selections.',
  role: 'checkbox',
  slots: [
    { name: 'root', el: 'button', role: 'checkbox', description: '18px box.' },
    { name: 'indicator', el: 'span', parent: 'root', description: 'Check mark or mixed dash.' },
  ],
  states: {
    checked: { props: { checked: true } },
    indeterminate: { props: { checked: 'indeterminate' } },
    'focus-visible': { pseudo: ['focus', 'focus-visible'] },
    disabled: { props: { disabled: true } },
  },
  props: {
    checked: { type: "boolean | 'indeterminate'", description: 'Controlled state.' },
    defaultChecked: { type: "boolean | 'indeterminate'", default: false, description: 'Uncontrolled initial state.' },
    disabled: { type: 'boolean', description: 'Disables the box.' },
  },
  events: { onCheckedChange: { payload: "boolean | 'indeterminate'", when: 'the user toggles it; mixed becomes checked' } },
  styles: [
    { slot: 'root', expect: { bg: 'surface.base', edge: 'border.control', radius: 'sm', height: 'size-check', width: 'size-check' } },
    { slot: 'root', when: { state: 'checked' }, expect: { bg: 'accent.solid', fg: 'accent.on' } },
    { slot: 'root', when: { state: 'indeterminate' }, expect: { bg: 'accent.solid' } },
    { slot: 'root', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'root', when: { state: 'disabled' }, expect: { opacity: 0.42 } },
  ],
  behavior: {
    keyboard: { Space: 'toggle' },
    scenarios: [
      { name: 'click checks', steps: [{ do: 'click', slot: 'root' }], expect: [{ event: 'onCheckedChange', args: [true] }, { attr: { 'aria-checked': 'true' } }] },
      { name: 'mixed becomes checked', props: { defaultChecked: 'indeterminate' }, steps: [{ do: 'click', slot: 'root' }], expect: [{ event: 'onCheckedChange', args: [true] }] },
      { name: 'Space toggles', steps: [{ do: 'focus', slot: 'root' }, { do: 'press', key: 'Space' }], expect: [{ attr: { 'aria-checked': 'true' } }] },
    ],
  },
  a11y: { labelRequired: true, notes: ['Boundary is 3:1 against the surface (border.control).'] },
  policies: ['P6'],
  usage: ['Use in forms with a save action; use Switch for settings that apply at once.'],
});
