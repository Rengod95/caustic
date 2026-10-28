import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'effect-editor',
  intent: 'Edit one shadow or blur effect with a live preview card, X, Y, blur, spread and the shadow colour.',
  roles: ['property.editor'],
  placement: ['inspector', 'overlay'],
  keywords: ['drop shadow', 'box shadow', 'inner shadow', 'blur', 'elevation', 'effects'],
  pairs: ['property-stack', 'paint-well', 'inspector-panel'],
  consider: [
    { id: 'property-stack', when: 'listing every effect on a layer and choosing which one to edit' },
  ],
  guidance: [
    'Pair it with PropertyStack kind="effect": the list picks the effect and this editor edits it.',
  ],
});
