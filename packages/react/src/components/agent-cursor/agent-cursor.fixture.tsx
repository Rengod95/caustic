import { defineFixture } from '../../lib/fixture.ts';
import { AgentCursor } from './agent-cursor.tsx';

export default defineFixture({
  id: 'agent-cursor',
  // The canvas host positions the cursor; the frame stands in for it.
  frame: children => <div className="relative h-24 w-56 overflow-hidden rounded-xl bg-bg-canvas">{children}</div>,
  render: props => <AgentCursor rect={{ left: 24, top: 16 }} name="Caustic" {...props} />,
  examples: {},
});
