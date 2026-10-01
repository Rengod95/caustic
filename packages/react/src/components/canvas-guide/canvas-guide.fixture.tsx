import { defineFixture } from '../../lib/fixture.ts';
import type { OverlayRect } from '../../lib/overlay-rect.ts';
import { CanvasGuide, type CanvasGuideProps } from './canvas-guide.tsx';

export default defineFixture({
  id: 'canvas-guide',
  // The canvas host positions the guides; the frame stands in for it.
  frame: children => <div className="relative h-40 w-64 overflow-hidden rounded-xl bg-bg-canvas">{children}</div>,
  render: props => {
    const p = props as CanvasGuideProps;
    const vertical = p.orientation === 'vertical';
    const rect: OverlayRect =
      p.kind === 'snap' ? { left: 60, top: 60 }
      : p.kind === 'measure' ? (vertical ? { left: 60, top: 8, height: 142 } : { left: 20, top: 60, width: 142 })
      : vertical ? { left: 60, top: 20, height: 120 } : { left: 20, top: 60, width: 120 };
    return <CanvasGuide rect={rect} {...p}>{p.kind === 'measure' ? (p.children ?? '142') : undefined}</CanvasGuide>;
  },
  examples: {},
});
