import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'alias-chain',
  intent: 'Show how a design token resolves, step by step, down to the primitive it reads from.',
  roles: ['display.token'],
  alsoFits: ['display.data', 'display.code'],
  placement: ['inspector', 'inline', 'card', 'transcript'],
  keywords: ['token alias', 'reference chain', 'resolution path', 'token reference', 'inheritance'],
  pairs: ['token-graph', 'inspector-bindings', 'color-tile', 'token-diff'],
  consider: [
    { id: 'token-graph', when: 'people need the whole dependency picture, not one path' },
    { id: 'breadcrumb', when: 'the path is a place to navigate rather than a token' },
  ],
  guidance: [
    'List names from the token itself to its primitive; the last item is drawn as the resolved value.',
  ],
});
