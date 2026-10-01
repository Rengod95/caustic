import { defineFixture } from '../../lib/fixture.ts';
import { CanvasMarquee, type CanvasMarqueeProps } from './canvas-marquee.tsx';

export default defineFixture({
  id: 'canvas-marquee',
  // The canvas host positions the rectangle; the frame stands in for it.
  frame: children => <div className="relative h-52 w-72 overflow-hidden rounded-xl bg-bg-canvas">{children}</div>,
  render: props => {
    const p = props as CanvasMarqueeProps;
    return p.kind === 'draw'
      ? <CanvasMarquee rect={{ left: 40, top: 30, width: 150, height: 96 }} label="150 × 96" {...p} />
      : <CanvasMarquee rect={{ left: 40, top: 30, width: 120, height: 90 }} {...p} />;
  },
  examples: {},
});
