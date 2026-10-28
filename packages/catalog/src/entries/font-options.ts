import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'font-options',
  intent: 'Tune a font\'s variable axes and OpenType features, with a live sample set in the current face.',
  roles: ['property.editor'],
  alsoFits: ['choice.multi'],
  placement: ['inspector', 'overlay'],
  keywords: ['variable font', 'opentype', 'font features', 'ligatures', 'tabular numbers', 'font axes', 'typography'],
  pairs: ['text-properties', 'inspector-panel', 'combobox'],
  consider: [
    { id: 'text-properties', when: 'editing weight, size, spacing and alignment of the text layer' },
  ],
  guidance: [
    'Axes and features come from your font data; list only those the face actually supports.',
  ],
});
