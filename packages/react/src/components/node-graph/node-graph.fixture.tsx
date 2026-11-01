import { defineFixture } from '../../lib/fixture.ts';
import { NodeGraphNode, NodeGraphPort, NodeGraph, type GraphEdge, type NodeGraphProps } from './node-graph.tsx';

const edges: GraphEdge[] = [
  { from: 'a-out', to: 'b-in', state: 'done', label: 'ready' },
  { from: 'b-out', to: 'c-in', state: 'active', label: 'started' },
  { from: 'b-fail', to: 'd-in', dashed: true, label: 'failed' },
];

const Graph = (props: Partial<NodeGraphProps>) => (
  <NodeGraph aria-label="State machine" surface="grid" radius="xl" width={720} height={240} edges={edges} {...props}>
    <NodeGraphNode x={24} y={80} width={140} title="Idle" meta="start" state="done">
      <NodeGraphPort portId="a-out" side="end" state="connected">next</NodeGraphPort>
    </NodeGraphNode>
    <NodeGraphNode x={230} y={70} width={160} title="Explore" meta="spawn 3" state="active">
      <NodeGraphPort portId="b-in" state="connected">in</NodeGraphPort>
      <NodeGraphPort portId="b-out" side="end" state="active">all settled</NodeGraphPort>
      <NodeGraphPort portId="b-fail" side="end">all failed</NodeGraphPort>
    </NodeGraphNode>
    <NodeGraphNode x={500} y={40} width={150} title="Converge" state="dimmed">
      <NodeGraphPort portId="c-in" state="connected">in</NodeGraphPort>
    </NodeGraphNode>
    <NodeGraphNode x={500} y={150} width={150} title="End" variant="ghost">
      <NodeGraphPort portId="d-in">in</NodeGraphPort>
    </NodeGraphNode>
  </NodeGraph>
);

export default defineFixture({
  id: 'node-graph',
  frame: children => <div className="w-190">{children}</div>,
  render: props => <Graph {...(props as Partial<NodeGraphProps>)} />,
  examples: {
    'state-machine': () => <Graph />,
    'connecting': () => <Graph draft={{ from: 'b-fail', to: { x: 470, y: 205 }, label: 'connect' }} />,
  },
});
