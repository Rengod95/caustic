import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'stack-row',
  intent: 'One line of a paint or effect stack: a swatch or icon, a name and detail, an optional opacity field, show and remove.',
  roles: ['collection.list', 'property.editor'],
  placement: ['inspector', 'card'],
  keywords: ['layer row', 'fill row', 'effect row', 'list item', 'property row'],
  pairs: ['property-stack', 'color-well', 'number-field'],
  consider: [
    { id: 'property-stack', when: 'building a whole fill or effects section' },
    { id: 'list', when: 'rows sit outside an inspector' },
  ],
  guidance: [
    'A hidden row stays dimmed but keeps its actions, so it can be shown again.',
  ],
});
