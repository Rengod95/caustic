import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'grid-tracks',
  intent: 'Edit the columns or rows of a grid layout: one row per track with a size and unit (fr, px, Auto), plus add and remove.',
  roles: ['property.editor', 'collection.list'],
  placement: ['inspector'],
  keywords: ['grid columns', 'grid rows', 'css grid', 'track sizes', 'fr units', 'layout grid'],
  pairs: ['auto-layout', 'inspector-panel'],
  consider: [
    { id: 'auto-layout', when: 'the whole layout section is needed, not only the tracks' },
  ],
});
