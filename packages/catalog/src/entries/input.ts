import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'input',
  intent: 'Enter or edit one line of text, optionally with a prefix, a suffix or attached add-on segments.',
  roles: ['input.text'],
  alsoFits: ['property.editor'],
  placement: ['form', 'toolbar', 'inspector', 'overlay', 'inline'],
  keywords: ['text field', 'text box', 'textfield', 'search field', 'url field', 'input group', 'email field'],
  pairs: ['field', 'button', 'icon-button', 'kbd'],
  consider: [
    { id: 'textarea', when: 'the text may run longer than one line' },
    { id: 'number-field', when: 'the value is a number with a unit, steps or scrubbing' },
    { id: 'combobox', when: 'the text should be matched against a list of suggestions' },
    { id: 'hex-input', when: 'the value is a colour in hex' },
  ],
  guidance: [
    'Put the label, hint and error in a Field around it; the input itself shows one danger edge only.',
  ],
});
