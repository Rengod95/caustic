import { defineFixture } from '../../lib/fixture.ts';
import { GraphNode, GraphPort, NodeGraph, type GraphEdge, type NodeGraphProps } from './node-graph.tsx';

const edges: GraphEdge[] = [
  { from: 'a-out', to: 'b-in', state: 'done', label: 'ready' },
  { from: 'b-out', to: 'c-in', state: 'active', label: 'started' },
  { from: 'b-fail', to: 'd-in', dashed: true, label: 'failed' },
];

const Graph = (props: Partial<NodeGraphProps>) => (
  <NodeGraph aria-label="State machine" surface="grid" radius="xl" width={720} height={240} edges={edges} {...props}>
    <GraphNode x={24} y={80} width={140} title="Idle" meta="start" state="done">
      <GraphPort portId="a-out" side="end" state="connected">next</GraphPort>
    </GraphNode>
    <GraphNode x={230} y={70} width={160} title="Explore" meta="spawn 3" state="active">
      <GraphPort portId="b-in" state="connected">in</GraphPort>
      <GraphPort portId="b-out" side="end" state="active">all settled</GraphPort>
      <GraphPort portId="b-fail" side="end">all failed</GraphPort>
    </GraphNode>
    <GraphNode x={500} y={40} width={150} title="Converge" state="dimmed">
      <GraphPort portId="c-in" state="connected">in</GraphPort>
    </GraphNode>
    <GraphNode x={500} y={150} width={150} title="End" variant="ghost">
      <GraphPort portId="d-in">in</GraphPort>
    </GraphNode>
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
