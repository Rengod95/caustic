import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'button',
  intent: 'Run one action with a text label, from the main submit of a form to quiet commands in a row.',
  roles: ['action.primary', 'action.secondary'],
  alsoFits: ['agent.request', 'action.group'],
  placement: ['form', 'overlay', 'toolbar', 'card', 'page'],
  keywords: ['CTA', 'call to action', 'submit', 'primary button', 'command', 'save', 'confirm'],
  pairs: ['icon-button', 'button-group', 'dialog', 'field', 'tooltip', 'kbd'],
  consider: [
    { id: 'icon-button', when: 'the action is clear from an icon alone' },
    { id: 'button-group', when: 'several related actions sit together in a row' },
    { id: 'chip', when: 'it is a quick option or filter rather than a command' },
  ],
  guidance: [
    'The main action is neutral solid (ink); keep to one accent button per view.',
    'tone="agent" is for buttons that invoke the agent.',
  ],
});
