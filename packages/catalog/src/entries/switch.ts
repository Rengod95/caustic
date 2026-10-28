import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'switch',
  intent: 'Turn a setting on or off with an effect that applies at once, with no save step.',
  roles: ['choice.toggle'],
  alsoFits: ['property.editor'],
  placement: ['form', 'inspector', 'card', 'overlay', 'end'],
  keywords: ['toggle', 'toggle switch', 'on/off', 'light switch', 'preference', 'enable'],
  pairs: ['field', 'list', 'card', 'section-header'],
  consider: [
    { id: 'checkbox', when: 'the change waits for the form to be saved' },
    { id: 'icon-button', when: 'the toggle lives in a toolbar or row as an icon' },
  ],
});
