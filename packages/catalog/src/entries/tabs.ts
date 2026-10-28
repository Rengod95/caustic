import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'tabs',
  intent: 'Switch between sibling panels of content under the same heading.',
  roles: ['navigation.local'],
  alsoFits: ['choice.single', 'layout.container'],
  placement: ['page', 'end', 'start', 'inspector', 'overlay'],
  keywords: ['tab bar', 'tab strip', 'tabbed panel', 'pivot', 'sections', 'view switcher'],
  pairs: ['badge', 'section-header', 'breadcrumb', 'scroll-area'],
  consider: [
    { id: 'segmented-control', when: 'the choice switches a view or mode of the same content' },
    { id: 'list-navigation', when: 'there are many sections listed in a side column' },
    { id: 'breadcrumb', when: 'the user moves up a hierarchy rather than across siblings' },
  ],
});
