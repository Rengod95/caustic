import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'side-panel',
  intent: 'The frame of a side region: a header, a scrolling body and a footer, with resize and collapse.',
  roles: ['layout.container', 'navigation.global'],
  alsoFits: ['property.panel', 'agent.conversation'],
  placement: ['start', 'end'],
  keywords: ['sidebar', 'dock', 'pane', 'inspector panel', 'drawer', 'aside'],
  pairs: ['app-shell', 'list-navigation', 'layer-tree', 'inspector-panel', 'scroll-area', 'tabs'],
  consider: [
    { id: 'sheet', when: 'the panel opens over the page for a short task and then closes' },
  ],
  guidance: [
    'Put panel tabs (Tabs, SegmentedControl or chips) in the header; the panel holds no content logic.',
    'It reports collapse and width changes; remembering them is up to the app.',
  ],
});
