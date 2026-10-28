import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'tag-input',
  intent: 'Enter a list of short free values as removable tags, such as keywords or email addresses.',
  roles: ['input.text', 'choice.multi'],
  alsoFits: ['input.pick'],
  placement: ['form', 'inspector', 'overlay'],
  keywords: ['tags', 'token input', 'chips input', 'multi-value', 'recipients', 'labels', 'keywords field'],
  pairs: ['field', 'chip', 'button'],
  consider: [
    { id: 'combobox', when: 'values come from a fixed list rather than free text' },
    { id: 'badge', when: 'the tags are only shown, not edited' },
  ],
  guidance: [
    'Say in the Field hint what the tags are used for.',
  ],
});
