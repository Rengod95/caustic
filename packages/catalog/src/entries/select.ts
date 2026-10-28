import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'select',
  intent: 'Choose one value from a short list, about seven options or fewer, from a field that opens a listbox.',
  roles: ['input.pick'],
  alsoFits: ['property.editor', 'choice.single'],
  placement: ['form', 'inspector', 'toolbar', 'overlay'],
  keywords: ['dropdown', 'drop-down', 'picklist', 'listbox', 'select box', 'option list', 'choose one'],
  pairs: ['field', 'form-layout', 'picker-trigger'],
  consider: [
    { id: 'combobox', when: 'there are more than about seven options or the user knows part of the name' },
    { id: 'radio-group', when: 'the options should stay visible for comparison' },
    { id: 'segmented-control', when: 'two to five short modes switch in place' },
    { id: 'menu', when: 'the entries are commands rather than a value to keep' },
  ],
});
