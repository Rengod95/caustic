import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'inspector-panel',
  intent: 'The opaque frame of an inspector: a stack of sections, each with a caption heading, optional actions and its controls.',
  roles: ['property.panel', 'layout.container'],
  alsoFits: ['layout.structure'],
  placement: ['end', 'inspector'],
  keywords: ['properties panel', 'sidebar', 'settings panel', 'design panel', 'attributes', 'right panel'],
  pairs: ['position-size', 'property-stack', 'auto-layout', 'scroll-area', 'side-panel'],
  consider: [
    { id: 'side-panel', when: 'a general side panel that is not an object inspector' },
    { id: 'accordion', when: 'sections should collapse and expand' },
  ],
  guidance: [
    'Put it inside the inspector scroller so section headers stick while scrolling.',
    'Elevation comes from the panel; sections stay flat inside it.',
  ],
});
