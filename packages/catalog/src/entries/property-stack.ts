import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'property-stack',
  intent: 'A stack of fills or effects on a layer: paints with opacity and visibility, or effects to pick for editing.',
  roles: ['property.panel', 'collection.list'],
  placement: ['inspector'],
  keywords: ['fills', 'multiple fills', 'effects list', 'shadows', 'appearance', 'paint layers', 'styles'],
  pairs: ['stack-row', 'effect-editor', 'color-picker', 'paint-well', 'inspector-panel'],
  consider: [
    { id: 'stroke-editor', when: 'the stroke weight, dash and caps are edited too' },
    { id: 'paint-well', when: 'there is only one solid paint to edit' },
  ],
  guidance: [
    'For a multi-selection with differing paints, show the mixed summary with Replace all instead of rows.',
    'Pressing a swatch or effect row asks you to open its editor; it can open inline under the row.',
  ],
});
