import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'accordion',
  intent: 'Fold a long page, FAQ or settings group into titled sections that open in place.',
  roles: ['layout.container'],
  alsoFits: ['property.panel', 'navigation.local'],
  placement: ['page', 'form', 'inspector', 'end'],
  keywords: ['collapse', 'collapsible', 'expander', 'disclosure', 'faq', 'details'],
  pairs: ['badge', 'section-header', 'form-layout'],
  consider: [
    { id: 'tabs', when: 'the sections are peers and people look at one view at a time' },
    { id: 'inspector-panel', when: 'the sections hold property editors for a selected object' },
  ],
  guidance: [
    'type="single" suits FAQ-style reading; type="multiple" suits settings groups people compare.',
  ],
});
