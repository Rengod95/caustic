import { defineFixture } from '../../lib/fixture.ts';
import { CanvasRuler, type CanvasRulerProps } from './canvas-ruler.tsx';

const h = Array.from({ length: 9 }, (_, i) => ({ at: 80 + i * 100, label: String(i * 100) }));
const v = Array.from({ length: 4 }, (_, i) => ({ at: 60 + i * 100, label: String(i * 100) }));

export default defineFixture({
  id: 'canvas-ruler',
  // The strips are absolutely placed by the canvas host; the frame stands in for it.
  frame: children => <div className="relative h-40 w-96 overflow-hidden rounded-xl bg-bg-canvas">{children}</div>,
  render: props => {
    const p = props as CanvasRulerProps;
    if (p.orientation === 'corner') return <CanvasRuler {...p} />;
    const vertical = p.orientation === 'vertical';
    return <CanvasRuler marks={vertical ? v : h} band={vertical ? { start: 168, size: 44 } : { start: 338, size: 180 }} {...p} />;
  },
  examples: {},
});
