import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'image-fill',
  intent: 'Edit an image paint: a preview of how the image sits in its shape, the fit mode, crop, replace and the file facts.',
  roles: ['property.editor', 'input.file'],
  placement: ['inspector'],
  keywords: ['image fit', 'object-fit', 'background image', 'crop', 'cover', 'contain', 'tile', 'photo fill'],
  pairs: ['property-stack', 'file-upload', 'inspector-panel'],
  consider: [
    { id: 'file-upload', when: 'adding new files rather than adjusting how one image fills a shape' },
  ],
  guidance: [
    'Replace only reports the press; open your own file picker or asset library from it.',
  ],
});
