import { defineFixture } from '../../lib/fixture.ts';
import { FrameLabel, type FrameLabelProps } from './frame-label.tsx';

export default defineFixture({
  id: 'frame-label',
  // The canvas host places the label above its frame; the frame stands in for it.
  frame: children => <div className="relative h-12 w-80 overflow-hidden rounded-xl bg-bg-canvas">{children}</div>,
  render: props => {
    const { name, dimensions, ...p } = props as unknown as Partial<FrameLabelProps>;
    return p.kind === 'frame'
      ? <FrameLabel rect={{ left: 16, top: 16 }} {...p} name={name ?? 'Checkout / iOS'} dimensions={dimensions ?? '390 × 844'} />
      : <FrameLabel rect={{ left: 16, top: 16 }} {...p} name={name ?? 'Checkout / Desktop'} dimensions={dimensions ?? '960 × 600'} />;
  },
  examples: {},
});
