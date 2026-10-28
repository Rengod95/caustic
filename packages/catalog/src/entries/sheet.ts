import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'sheet',
  intent: 'A panel that slides in at the right or bottom edge for settings, filters or a short sharing flow.',
  roles: ['overlay.modal'],
  alsoFits: ['layout.container'],
  placement: ['overlay'],
  keywords: ['drawer', 'bottom sheet', 'side sheet', 'slide-over', 'offcanvas', 'filters panel'],
  pairs: ['button', 'checkbox', 'switch', 'input'],
  consider: [
    { id: 'dialog', when: 'the task is a blocking decision that belongs in the centre' },
    { id: 'side-panel', when: 'the panel stays docked beside the stage instead of overlaying it' },
  ],
  guidance: [
    'Sheet is Dialog with placement right or bottom; use whichever name reads better.',
    'The bottom-sheet grabber is decorative; it does not drag.',
  ],
});
