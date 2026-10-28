import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'section-header',
  intent: 'Open a page, section or grouped list with a title, one sentence of description and one action.',
  roles: ['layout.structure'],
  placement: ['page', 'card', 'form', 'inspector', 'end'],
  keywords: ['page header', 'section title', 'heading', 'list header', 'eyebrow', 'title row'],
  pairs: ['button', 'list', 'card', 'segmented-control', 'form-layout'],
  consider: [
    { id: 'form-layout', when: 'the header opens a settings form with titled sections' },
  ],
  guidance: [
    'lg opens a page, md a section, sm a list group; pick headingLevel from the page outline, not the size.',
    'Keep to one action on the right, such as See all, Add or a filter.',
  ],
});
