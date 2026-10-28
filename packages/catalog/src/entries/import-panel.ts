import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'import-panel',
  intent: 'Bring outside design into the canvas: pick a source, say where it comes from, set capture options, then preview it.',
  roles: ['input.file'],
  alsoFits: ['overlay.modal', 'choice.single', 'property.panel'],
  placement: ['overlay', 'form'],
  keywords: ['import', 'url to design', 'html to design', 'paste code', 'capture page', 'website import', 'upload'],
  pairs: ['dialog', 'export-controls', 'file-upload'],
  consider: [
    { id: 'file-upload', when: 'the only source is local files' },
    { id: 'export-controls', when: 'the flow goes the other way, out of the canvas' },
  ],
  guidance: [
    'It does not import: Preview asks you to convert and show the result, and nothing is added until confirmed.',
    'Sources other than URL pass their own field (file drop, code editor) as children.',
  ],
});
