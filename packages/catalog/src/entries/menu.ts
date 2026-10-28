import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'menu',
  intent: 'A floating list of actions and choices opened from a button, with icons, shortcuts and groups.',
  roles: ['overlay.anchored', 'action.secondary'],
  alsoFits: ['input.pick', 'choice.single'],
  placement: ['overlay', 'toolbar', 'titlebar', 'card'],
  keywords: ['dropdown', 'context menu', 'action menu', 'overflow menu', 'kebab', 'more menu'],
  pairs: ['icon-button', 'button', 'kbd', 'picker-trigger'],
  consider: [
    { id: 'select', when: 'the choice is a form value rather than a command' },
    { id: 'combobox', when: 'the list is long enough that people need to search it' },
    { id: 'popover', when: 'the floating panel holds controls rather than a list' },
  ],
  guidance: [
    'Destructive items sit last, below a separator, and name the outcome (Delete theme).',
  ],
});
