import { defineEntry } from '../schema.ts';

export default defineEntry({
  id: 'node-graph',
  intent: 'A canvas of positioned nodes with ports and measured wires, for state machines, flows and composition maps.',
  roles: ['display.data', 'canvas.surface'],
  alsoFits: ['display.token'],
  placement: ['stage', 'canvas', 'page'],
  keywords: ['state machine', 'flow chart', 'graph editor', 'wires', 'ports', 'composition map', 'dependency'],
  pairs: ['zoom-control', 'floating-bar', 'badge'],
  consider: [
    { id: 'token-graph', when: 'the nodes are design tokens in three tiers with tracing' },
  ],
  guidance: [
    'Node positions, edge states and labels are your data; the graph measures the port dots and draws the wires.',
    'Use state on nodes, ports and edges for run progress (active, done, failed); set tone for the active colour.',
    'Wires and port dots are decorative, so give each node a text name and list its links where a screen reader can reach them.',
  ],
});
