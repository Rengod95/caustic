import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'combobox',
  intent: 'Choose from a long list by typing to filter it, inline in a form or from a compact trigger.',
  roles: ['input.pick'],
  alsoFits: ['input.text', 'property.editor'],
  placement: ['form', 'inspector', 'toolbar', 'overlay'],
  keywords: ['autocomplete', 'typeahead', 'searchable select', 'autosuggest', 'font picker', 'model picker', 'filter list'],
  pairs: ['field', 'picker-trigger', 'badge', 'popover'],
  consider: [
    { id: 'select', when: 'there are about seven options or fewer and typing adds nothing' },
    { id: 'tag-input', when: 'the user enters several free values rather than one from a list' },
    { id: 'menu', when: 'the list holds commands to run, not a value to keep' },
  ],
  guidance: [
    'popup mode keeps the field compact for inspector rows and toolbars; inline mode suits forms.',
    'Options can carry a leading swatch, icon or tile, a description and a badge before you reach for renderOption.',
  ],
});
