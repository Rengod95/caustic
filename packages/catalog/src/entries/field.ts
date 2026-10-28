import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'field',
  intent: 'Wrap a form control with its label, hint, error or success message, required mark and character count.',
  roles: ['layout.form'],
  alsoFits: ['feedback.inline', 'property.editor'],
  placement: ['form', 'overlay', 'inspector', 'card'],
  keywords: ['form field', 'form item', 'label', 'helper text', 'validation message', 'error text', 'fieldset', 'form control'],
  pairs: ['input', 'textarea', 'select', 'combobox', 'date-picker', 'otp-input'],
  consider: [
    { id: 'form-layout', when: 'many fields need sections, headings and a save footer' },
  ],
  guidance: [
    'Mark the smaller set: a required mark on required fields or "Optional" on optional ones, not both.',
    'Errors say what to fix; a success message confirms in one short line.',
    'Use group mode to label a set of controls such as OTP cells or radios.',
  ],
});
