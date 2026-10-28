import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'theme-gallery',
  intent: 'A grid of theme cards, each a miniature app in the theme\'s own colours and radius, to pick a theme to preview.',
  roles: ['choice.single', 'collection.list'],
  alsoFits: ['input.pick'],
  placement: ['page', 'stage', 'overlay'],
  keywords: ['themes', 'theme picker', 'skins', 'color schemes', 'presets', 'templates', 'style picker'],
  pairs: ['input', 'segmented-control', 'dialog'],
  consider: [
    { id: 'segmented-control', when: 'switching between two or three modes such as light and dark' },
    { id: 'select', when: 'the themes need no visual preview' },
  ],
  guidance: [
    'Selecting only previews; apply the theme in your own confirm step.',
    'Put search and filters above the grid with Input and SegmentedControl.',
  ],
});
