import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'choice-group',
  intent: 'Pick one or several options from a short set shown at once as cards, tiles or answer rows with room to explain.',
  roles: ['choice.single', 'choice.multi'],
  alsoFits: ['agent.request', 'input.pick'],
  placement: ['form', 'page', 'overlay', 'transcript'],
  keywords: ['choice cards', 'radio cards', 'option tiles', 'pricing plans', 'plan picker', 'selectable cards', 'clarifying question', 'export format'],
  pairs: ['field', 'button', 'dialog', 'message'],
  consider: [
    { id: 'radio-group', when: 'plain labels are enough and the list sits in a dense form' },
    { id: 'segmented-control', when: 'it is a compact switch between a few short modes' },
    { id: 'select', when: 'there are many options and space is tight' },
  ],
  guidance: [
    'card fits 2 to 4 options with a sentence or a price; tile fits a few short options; answer fits an agent question.',
    'The answer appearance applies on selection; there is no submit step.',
    'In narrow columns give tile grids three columns or fewer.',
  ],
});
