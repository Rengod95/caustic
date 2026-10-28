import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'auto-layout',
  intent: 'The auto-layout section of an inspector: flow, alignment, gap, distribution, wrap, padding, clip and grid tracks of a frame.',
  roles: ['property.panel', 'property.editor'],
  placement: ['inspector', 'end'],
  keywords: ['flexbox', 'stack layout', 'autolayout', 'spacing', 'padding', 'gap', 'frame layout', 'layout grid'],
  pairs: ['inspector-panel', 'position-size', 'constraints-control'],
  consider: [
    { id: 'alignment-pad', when: 'only the alignment pick is needed, not the whole layout section' },
    { id: 'grid-tracks', when: 'editing grid columns or rows outside a full layout section' },
  ],
  guidance: [
    'Place it inside an InspectorSection; it brings no heading or panel frame of its own.',
    'Rows it does not cover (justify, direction, reverse order) go in as children.',
  ],
});
