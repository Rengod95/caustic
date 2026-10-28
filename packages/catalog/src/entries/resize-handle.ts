import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'resize-handle',
  intent: 'A draggable, keyboard-operable divider that sets the size of the panel next to it.',
  roles: ['layout.structure'],
  placement: ['start', 'end', 'stage'],
  keywords: ['splitter', 'gutter', 'sash', 'pane resizer', 'drag handle', 'split view'],
  pairs: ['side-panel', 'app-shell'],
  consider: [
    { id: 'separator', when: 'the line only divides and is never dragged' },
    { id: 'side-panel', when: 'you need a whole resizable panel; it already includes the handle' },
  ],
  guidance: [
    'You position it on the panel edge; it only sets the size, cursor, hit strip and line.',
    'Give it a label naming the panel it resizes, and a resetValue for double-click reset.',
  ],
});
