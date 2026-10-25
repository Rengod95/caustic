import { defineFixture } from '../../lib/fixture.ts';
import { ActivityTree, type ActivityNode } from './activity-tree.tsx';

const nodes: ActivityNode[] = [
  { id: 's1', kind: 'step', status: 'done', label: 'Read theme tokens', meta: '0.4s' },
  { id: 'c1', kind: 'call', label: 'read_tokens · theme/lagoon', meta: '128' },
  { id: 's2', kind: 'step', status: 'done', label: 'Audit contrast', meta: '1.2s' },
  { id: 'c2', kind: 'call', label: 'audit_contrast · 42 pairs', meta: '0 fail' },
  { id: 's3', kind: 'step', status: 'active', label: 'Apply spacing and radius', meta: 'step 3' },
  { id: 'c3', kind: 'call', running: true, label: 'edit_layers · Pricing / Team', meta: 'running' },
  { id: 'c4', kind: 'call', unassigned: true, label: 'screenshot_frame · Checkout', meta: 'Unassigned' },
];
// A run that stopped: the failed step and call carry the danger glyph and text.
const failedNodes: ActivityNode[] = [
  nodes[0]!,
  { id: 'f1', kind: 'step', status: 'failed', label: 'Apply spacing and radius', meta: '2.1s' },
  { id: 'fc1', kind: 'call', failed: true, label: 'edit_layers · Pricing / Team', meta: 'timed out' },
];
const worker = { name: 'Worker · canvas-editor', meta: 'round 4 · 38s' };

export default defineFixture({
  id: 'activity-tree',
  render: props => <div className="w-100"><ActivityTree nodes={nodes} worker={worker} {...props} /></div>,
  examples: {
    'activity-tree': () => <ActivityTree nodes={nodes} worker={worker} />,
    'activity-tree-failed': () => <ActivityTree nodes={failedNodes} worker={worker} />,
  },
});
