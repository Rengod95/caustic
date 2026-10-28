import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'export-controls',
  intent: 'Export the selection: pick a format and a scale, then copy or export, with a line that reports the last result.',
  roles: ['property.panel', 'action.primary'],
  alsoFits: ['choice.single'],
  placement: ['end', 'overlay', 'inspector'],
  keywords: ['download', 'save as', 'export settings', 'png', 'svg', 'pdf', 'share', 'render'],
  pairs: ['import-panel', 'dialog', 'inspector-panel'],
  consider: [
    { id: 'import-panel', when: 'bringing outside design into the canvas instead' },
  ],
  guidance: [
    'Name what will be exported in the main label ("Export 3 frames").',
    'Hide the scale row for vector and data formats; it applies to raster output.',
  ],
});
