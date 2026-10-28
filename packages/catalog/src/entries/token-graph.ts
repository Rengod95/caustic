import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'token-graph',
  intent: 'A three-tier dependency graph of design tokens that traces any node upstream and downstream.',
  roles: ['display.token', 'display.data'],
  alsoFits: ['collection.tree'],
  placement: ['stage', 'page'],
  keywords: ['dependency graph', 'node graph', 'token map', 'lineage', 'references', 'flow chart'],
  pairs: ['alias-chain', 'color-tile', 'token-diff'],
  consider: [
    { id: 'alias-chain', when: 'one token path inline is enough' },
  ],
  guidance: [
    'Node positions and swatch colours are your data; the graph draws the wires.',
    'Nodes, ports and wires suit any three-tier dependency view, not only tokens.',
  ],
});
