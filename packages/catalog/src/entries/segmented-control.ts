import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'segmented-control',
  intent: 'Switch between two to five short, mutually exclusive views or modes in place.',
  roles: ['choice.single'],
  alsoFits: ['navigation.local', 'input.pick'],
  placement: ['toolbar', 'inspector', 'titlebar', 'form'],
  keywords: ['mode switch', 'view switch', 'toggle buttons', 'pill switch'],
  pairs: ['tabs', 'foundation-toolbar', 'section-header'],
  consider: [
    { id: 'tabs', when: 'the choice swaps a whole panel of content under it' },
    { id: 'select', when: 'there are more than five options or the labels are long' },
    { id: 'toggle-group', when: 'several options can be on at once' },
  ],
  guidance: [
    'radius="full" reads as a mode switch (Ask · Plan · Build); the default radius reads as a view switch.',
    'Icon-only segments (content="icon") each need an aria-label.',
  ],
});
