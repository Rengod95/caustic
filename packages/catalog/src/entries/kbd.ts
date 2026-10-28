import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'kbd',
  intent: 'Show a keyboard key or shortcut chord inline with text, menus or tooltips.',
  roles: ['display.status'],
  placement: ['inline', 'overlay', 'toolbar'],
  keywords: ['keyboard shortcut', 'hotkey', 'keycap', 'key binding', 'accelerator', 'key'],
  pairs: ['tooltip', 'menu', 'button', 'input'],
  consider: [
    { id: 'badge', when: 'it shows a status, a count or a token name' },
  ],
  guidance: [
    'Use one Kbd per chord, as in <Kbd>⌘K</Kbd>, rather than one per key.',
  ],
});
