import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'stroke-editor',
  intent: 'Edit a stroke: its paint, weight and position, dash pattern and line cap, and independent widths per side.',
  roles: ['property.editor'],
  alsoFits: ['property.panel'],
  placement: ['inspector'],
  keywords: ['border', 'outline', 'stroke width', 'dashed line', 'line cap', 'border width'],
  pairs: ['property-stack', 'paint-well', 'inspector-panel', 'corner-radius'],
  consider: [
    { id: 'property-stack', when: 'a layer carries several stroke paints in a list' },
  ],
  guidance: [
    'Stroke opacity and colour alpha are separate numbers; keep both apart in your model.',
  ],
});
