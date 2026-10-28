import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'picker-trigger',
  intent: 'A field-looking button that shows the current value and opens a picker, menu or popover.',
  roles: ['input.pick'],
  alsoFits: ['property.editor', 'overlay.anchored'],
  placement: ['inspector', 'form', 'toolbar'],
  keywords: ['dropdown button', 'select trigger', 'menu button', 'dropdown field', 'inspector select', 'popup button'],
  pairs: ['popover', 'menu', 'field', 'calendar'],
  consider: [
    { id: 'select', when: 'you need a list of values with the listbox built in' },
    { id: 'combobox', when: 'the list is long enough to search' },
    { id: 'button', when: 'pressing it runs an action rather than choosing a value' },
  ],
  guidance: [
    'It has no popup logic: pass aria-haspopup, aria-expanded and the open handler, or use asChild under a trigger.',
    'variant="soft" is the sunken well of an inspector row; the other variants are the form field look.',
  ],
});
