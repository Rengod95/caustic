import { defineFixture } from '../../lib/fixture.ts';
import { CanvasHint, CanvasHintItem } from './canvas-hint.tsx';

export default defineFixture({
  id: 'canvas-hint',
  // The canvas host centers the strip near the bottom edge; the frame stands in for it.
  frame: children => <div className="flex h-24 w-120 items-end justify-center rounded-xl bg-bg-canvas pb-3.5">{children}</div>,
  render: props => (
    <CanvasHint {...props}>
      <CanvasHintItem keys="⇧">constrain</CanvasHintItem>
      <CanvasHintItem keys="⌥">from center</CanvasHintItem>
      <CanvasHintItem keys="esc">cancel</CanvasHintItem>
    </CanvasHint>
  ),
  examples: {},
});
