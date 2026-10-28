import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'app-shell',
  intent: 'The app window frame: a titlebar, start and end panels, the main stage and a floating overlay layer.',
  roles: ['navigation.global', 'layout.structure'],
  placement: ['titlebar', 'start', 'stage', 'end', 'overlay'],
  keywords: ['window frame', 'workbench', 'scaffold', 'app layout', 'chrome', 'shell'],
  pairs: ['side-panel', 'resize-handle', 'scroll-area', 'list-navigation', 'zoom-control', 'floating-bar'],
  consider: [
    { id: 'form-layout', when: 'the screen is a settings page rather than a workbench' },
  ],
  guidance: [
    'Regions carry no surface of their own; put a SidePanel in start and end to get the panel chrome.',
    'It adapts to compact and medium widths; mobile panel tabs are an app-level choice.',
  ],
});
