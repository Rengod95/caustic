import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'toggle-group',
  intent: 'A row of icon toggles that keep state: several on at once, like formatting, or one of a few, like alignment.',
  roles: ['choice.multi', 'choice.single'],
  alsoFits: ['property.editor', 'action.group'],
  placement: ['toolbar', 'inspector', 'overlay'],
  keywords: ['toggle buttons', 'formatting bar', 'text style', 'bold italic', 'alignment toggles', 'pressed buttons'],
  pairs: ['floating-bar', 'tooltip', 'text-properties', 'separator'],
  consider: [
    { id: 'button-group', when: 'the items are actions and nothing stays pressed' },
    { id: 'segmented-control', when: 'the options are text labels for a view or mode' },
    { id: 'icon-button', when: 'there is a single toggle on its own' },
  ],
  guidance: [
    'Give every item a label; it becomes the aria-label and a tooltip.',
  ],
});
