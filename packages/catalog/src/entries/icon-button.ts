import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'icon-button',
  intent: 'Run one action, or flip one option on and off, from an icon alone in toolbars, headers and rows.',
  roles: ['action.icon'],
  alsoFits: ['choice.toggle', 'canvas.control', 'action.secondary'],
  placement: ['toolbar', 'card', 'inspector', 'titlebar', 'overlay'],
  keywords: ['icon only button', 'tool button', 'toggle button', 'icon toggle', 'send button', 'close button', 'more button'],
  pairs: ['tooltip', 'button-group', 'section-header', 'menu', 'kbd'],
  consider: [
    { id: 'button', when: 'a text label makes the action clearer' },
    { id: 'toggle-group', when: 'several related toggles sit together' },
    { id: 'button-group', when: 'a row of related actions belongs on one track' },
  ],
  guidance: [
    'Always give it a label, and wrap it in a Tooltip so the name and any shortcut can be found.',
    'variant="solid" radius="full" size="sm" is the send button of a text area or composer.',
  ],
});
