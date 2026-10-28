import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'radio-group',
  intent: 'Pick exactly one option from a short list that stays visible, as plain form radios.',
  roles: ['choice.single'],
  alsoFits: ['property.editor', 'agent.request'],
  placement: ['form', 'overlay', 'inspector', 'card'],
  keywords: ['radio buttons', 'option buttons', 'single choice', 'radio list', 'exclusive options'],
  pairs: ['field', 'form-layout', 'button'],
  consider: [
    { id: 'choice-group', when: 'each option needs a description, a price or a larger target' },
    { id: 'segmented-control', when: 'it switches between a few short modes in a compact space' },
    { id: 'select', when: 'there are many options or little room' },
  ],
  guidance: [
    'Label the set with a Field in group mode so the question reads above the radios.',
  ],
});
