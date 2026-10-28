import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'list-navigation',
  intent: 'A sidebar column of nav items, canvas pages or agent sessions, with groups, counts and nesting.',
  roles: ['navigation.local', 'navigation.global'],
  alsoFits: ['collection.tree', 'agent.plan'],
  placement: ['start'],
  keywords: ['sidebar nav', 'side navigation', 'nav menu', 'page list', 'session list', 'tree nav'],
  pairs: ['side-panel', 'app-shell', 'icon-button', 'menu', 'kbd'],
  consider: [
    { id: 'list', when: 'the rows are settings or content rather than places to go' },
    { id: 'tabs', when: 'a few views switch inside one panel' },
    { id: 'layer-tree', when: 'the hierarchy is design layers on a canvas' },
  ],
  guidance: [
    'Keep icons consistent: every top-level item has one, or none does.',
    'In sessions, only running shows the agent orb; review means a person must act.',
  ],
});
