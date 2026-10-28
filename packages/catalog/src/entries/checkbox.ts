import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'checkbox',
  intent: 'Mark options on or off in a form that is saved, with a mixed state for a partly checked set.',
  roles: ['choice.multi', 'choice.toggle'],
  alsoFits: ['collection.list', 'property.editor'],
  placement: ['form', 'card', 'inspector', 'overlay', 'inline'],
  keywords: ['tick box', 'check mark', 'select all', 'indeterminate', 'tri-state', 'opt in'],
  pairs: ['field', 'form-layout', 'button', 'table', 'list'],
  consider: [
    { id: 'switch', when: 'the setting takes effect at once, with no save step' },
    { id: 'choice-group', when: 'each option needs a description, a price or a larger target' },
  ],
  guidance: [
    'Use the mixed state on a parent checkbox when only some of its children are checked.',
  ],
});
