import { defineFixture } from '../../lib/fixture.ts';
import { TokenGraph, TokenGraphNode, TokenGraphTier, type TokenGraphProps } from './token-graph.tsx';

const edges: [string, string][] = [['p1', 's1'], ['p2', 's1'], ['p1', 's2'], ['p2', 's2'], ['p3', 's3'], ['s1', 'c1'], ['s2', 'c2'], ['s3', 'c3'], ['s4', 'c1']];

const Graph = ({ traced, missing, ...props }: Partial<TokenGraphProps> & { traced?: boolean; missing?: boolean }) => (
  <TokenGraph aria-label="Token dependency graph" edges={edges} {...props}>
    <TokenGraphTier label="Primitive" at="start" />
    <TokenGraphTier label="Semantic" at="center" />
    <TokenGraphTier label="Component" at="end" />
    <TokenGraphNode itemId="p1" x={3} y={18} title="color.accent.600" description="primitive" swatch="var(--cs-accent-600)" traced={traced} missing={missing} />
    <TokenGraphNode itemId="p2" x={3} y={42} title="color.accent.400" description="primitive" swatch="var(--cs-accent-400)" />
    <TokenGraphNode itemId="p3" x={3} y={66} title="radius.3xl" description="22px" />
    <TokenGraphNode itemId="s1" x={37} y={14} title="color.accent.solid" description="light → 600 · dark → 400" swatch="var(--cs-color-accent-solid)" />
    <TokenGraphNode itemId="s2" x={37} y={40} title="color.focus.ring" description="light → 600 · dark → 400" swatch="var(--cs-color-focus-ring)" />
    <TokenGraphNode itemId="s3" x={37} y={66} title="radius.panel" description="→ radius.3xl" />
    <TokenGraphNode itemId="s4" x={37} y={84} title="color.brand.legacy" description="missing reference" missing />
    <TokenGraphNode itemId="c1" x={71} y={18} title="button.accent.bg" description="Button / Accent" swatch="var(--cs-color-accent-solid)" />
    <TokenGraphNode itemId="c2" x={71} y={42} title="input.focus" description="Input / Focus" />
    <TokenGraphNode itemId="c3" x={71} y={66} title="inspector.radius" description="Inspector" />
  </TokenGraph>
);

export default defineFixture({
  id: 'token-graph',
  frame: children => <div className="w-200">{children}</div>,
  render: props => <Graph {...(props as Partial<TokenGraphProps>)} />,
  examples: {
    'dependency-graph': () => <Graph defaultValue="s1" />,
  },
});
