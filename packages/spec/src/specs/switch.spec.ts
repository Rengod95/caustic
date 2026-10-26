import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'switch',
  name: 'Switch',
  category: 'form',
  status: 'ready',
  purpose: 'Turns a setting on or off immediately. iOS proportions; the thumb springs and stretches while pressed.',
  role: 'switch',
  slots: [
    { name: 'root', el: 'button', role: 'switch', description: 'Track.' },
    { name: 'thumb', el: 'span', parent: 'root', description: 'Moving knob.' },
  ],
  sizes: { values: ['sm', 'md'], default: 'md' },
  states: {
    checked: { props: { checked: true } },
    'focus-visible': { pseudo: ['focus', 'focus-visible'] },
    disabled: { props: { disabled: true } },
  },
  props: {
    size: { type: "'sm' | 'md'", default: 'md', description: '46×28 or 38×23.' },
    checked: { type: 'boolean', description: 'Controlled state.' },
    defaultChecked: { type: 'boolean', default: false, description: 'Uncontrolled initial state.' },
    disabled: { type: 'boolean', description: 'Disables the switch.' },
  },
  events: { onCheckedChange: { payload: 'boolean', when: 'the user toggles it' } },
  styles: [
    { slot: 'root', expect: { bg: 'control.off', radius: 'full', height: 'size-switch-md-h', width: 'size-switch-md-w' } },
    { slot: 'root', when: { state: 'checked' }, expect: { bg: 'accent.solid' } },
    { slot: 'root', when: { size: 'sm' }, expect: { height: 'size-switch-sm-h', width: 'size-switch-sm-w' } },
    { slot: 'root', when: { state: 'focus-visible' }, expect: { ring: 'focus' } },
    { slot: 'root', when: { state: 'disabled' }, expect: { bg: 'disabled.fill', opacity: 1 }, note: 'Disabled is a colour, not opacity: the track is disabled.fill whether on or off; the thumb position carries the value.' },
    { slot: 'thumb', expect: { bg: 'control.thumb', radius: 'full', height: 'size-switch-md-thumb', width: 'size-switch-md-thumb' } },
    { slot: 'thumb', when: { size: 'sm' }, expect: { height: 'size-switch-sm-thumb', width: 'size-switch-sm-thumb' } },
  ],
  behavior: {
    keyboard: { Space: 'toggle', Enter: 'toggle' },
    pointer: ['thumb stretches to the press width while held'],
    scenarios: [
      { name: 'click toggles on', steps: [{ do: 'click', slot: 'root' }], expect: [{ event: 'onCheckedChange', args: [true] }, { attr: { 'aria-checked': 'true', 'data-state': 'checked' } }] },
      { name: 'Space toggles off', props: { defaultChecked: true }, steps: [{ do: 'focus', slot: 'root' }, { do: 'press', key: 'Space' }], expect: [{ event: 'onCheckedChange', args: [false] }, { attr: { 'aria-checked': 'false' } }] },
      { name: 'disabled ignores clicks', props: { disabled: true }, steps: [{ do: 'click', slot: 'root' }], expect: [{ event: 'onCheckedChange', calls: 0 }] },
    ],
  },
  a11y: { labelRequired: true, notes: ['Label it with aria-label or a visible label element.'] },
  policies: ['P6', 'P8'],
  examples: [{ id: 'toggles', title: 'Switch, checkbox, radio', doc: 'toggle#toggles' }],
  usage: ['Use a switch for settings that apply at once; use a checkbox in forms that are saved.'],
});
