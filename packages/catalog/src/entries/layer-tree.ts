import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'layer-tree',
  intent: 'The layers panel: a keyboard tree of canvas objects with selection, visibility, lock and drag to reorder.',
  roles: ['collection.tree'],
  alsoFits: ['navigation.local', 'choice.multi'],
  placement: ['start', 'end'],
  keywords: ['outline', 'scene graph', 'layers panel', 'hierarchy', 'file tree', 'outliner', 'navigator', 'tree view'],
  pairs: ['input', 'section-header', 'side-panel', 'canvas-selection', 'inspector-panel'],
  consider: [
    { id: 'list', when: 'the items are flat with no nesting' },
    { id: 'activity-tree', when: 'the hierarchy is an agent run, not objects people edit' },
  ],
  guidance: [
    'Render only rows whose ancestors are expanded; filtering is yours, the tree shows what it is given.',
    'The tree reports moves, hides and locks through events; apply them to your data.',
  ],
});
