import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'text-properties',
  intent: 'The text section of an inspector: weight and size, line height, letter spacing, alignment, resizing and case.',
  roles: ['property.editor', 'property.panel'],
  placement: ['inspector'],
  keywords: ['typography', 'font size', 'line height', 'letter spacing', 'text align', 'text style', 'type settings'],
  pairs: ['font-options', 'combobox', 'inspector-panel'],
  consider: [
    { id: 'font-options', when: 'editing variable axes and OpenType features' },
    { id: 'combobox', when: 'picking the font family, which sits above this section' },
  ],
  guidance: [
    'Pass the style run count; with several runs a notice says the controls apply to the whole layer.',
  ],
});
