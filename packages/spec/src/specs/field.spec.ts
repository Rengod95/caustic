import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'field',
  name: 'Field',
  category: 'form',
  status: 'ready',
  purpose: 'Labels a form control and wires its hint, error, required mark and count.',
  role: null,
  slots: [
    { name: 'root', el: 'div', description: 'Vertical stack, 6px gap.' },
    { name: 'label', el: 'label', parent: 'root', required: false, description: 'Points at the control (htmlFor).' },
    { name: 'count', el: 'span', parent: 'root', required: false, description: 'Right side of the label row.' },
    { name: 'hint', el: 'span', parent: 'root', required: false, description: 'Help text, referenced by aria-describedby.' },
    { name: 'error', el: 'span', parent: 'root', required: false, description: 'Replaces the hint and marks the control invalid.' },
  ],
  states: { invalid: { props: { error: 'Use lowercase letters, numbers and dashes.' } } },
  props: {
    label: { type: 'ReactNode', description: 'Visible label.' },
    hint: { type: 'ReactNode', description: 'Help text.' },
    error: { type: 'ReactNode', description: 'Error message; sets invalid on the control.' },
    required: { type: 'boolean', description: 'Shows * and sets aria-required.' },
    optional: { type: 'boolean', description: 'Shows “Optional”.' },
    count: { type: 'ReactNode', description: 'Character count or other label-row meta.' },
    disabled: { type: 'boolean', description: 'Disables the control.' },
    controlId: { type: 'string', description: 'Control id; generated when omitted.' },
  },
  styles: [
    { slot: 'root', expect: { gap: 6 } },
    { slot: 'label', expect: { fg: 'text.secondary', text: 'ui-sm' } },
    { slot: 'hint', expect: { fg: 'text.tertiary', text: 'hint' } },
    { slot: 'error', when: { state: 'invalid' }, expect: { fg: 'danger.text', text: 'hint' } },
  ],
  behavior: {
    scenarios: [
      { name: 'label focuses the control', steps: [{ do: 'click', slot: 'label' }], expect: [{ focused: 'root' }] },
    ],
  },
  a11y: { notes: ['The control receives id, aria-describedby (hint or error), aria-invalid and aria-required from context.'] },
  policies: ['P6'],
  usage: ['Mark the smaller set: either * on required fields or “Optional” on optional ones.'],
});
