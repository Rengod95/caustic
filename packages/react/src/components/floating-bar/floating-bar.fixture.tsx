import { Frame, Grid3x3, Hand, Magnet, MessageCircle, MousePointer2, PenTool, Square, Type, WandSparkles } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { ZoomControl } from '../zoom-control/zoom-control.tsx';
import { FloatingBar, FloatingBarGroup, FloatingBarItem, FloatingBarSeparator, type FloatingBarItemProps, type FloatingBarProps } from './floating-bar.tsx';

const stage = 'canvas-grid flex flex-col items-center gap-3.5 rounded-xl py-7 [background-size:var(--cs-space-4)_var(--cs-space-4)]';

export default defineFixture({
  id: 'floating-bar',
  render: props => {
    const { size, label, orientation, tone, variant, radius, shadow, children: _children, ...item } = props as Partial<FloatingBarProps> & FloatingBarItemProps;
    return (
      <FloatingBar label={label ?? 'Canvas tools'} size={size} orientation={orientation} tone={tone} variant={variant} radius={radius} shadow={shadow}>
        <FloatingBarGroup>
          <FloatingBarItem aria-label="Move V" icon={<MousePointer2 />} shortcut="V" {...item} />
          <FloatingBarItem aria-label="Hand H" icon={<Hand />} shortcut="H" />
        </FloatingBarGroup>
        <FloatingBarSeparator />
        <FloatingBarGroup>
          <FloatingBarItem aria-label="Frame F" icon={<Frame />} shortcut="F" />
        </FloatingBarGroup>
      </FloatingBar>
    );
  },
  examples: {
    'tool-capsule': () => (
      <div className={stage}>
        <FloatingBar label="Canvas tools">
          <FloatingBarGroup>
            <FloatingBarItem aria-label="Move V" icon={<MousePointer2 />} shortcut="V" active />
            <FloatingBarItem aria-label="Hand H" icon={<Hand />} shortcut="H" />
          </FloatingBarGroup>
          <FloatingBarSeparator />
          <FloatingBarGroup>
            <FloatingBarItem aria-label="Frame F" icon={<Frame />} shortcut="F" />
            <FloatingBarItem aria-label="Rectangle R" icon={<Square />} shortcut="R" />
            <FloatingBarItem aria-label="Text T" icon={<Type />} shortcut="T" />
            <FloatingBarItem aria-label="Pen P" icon={<PenTool />} shortcut="P" />
          </FloatingBarGroup>
          <FloatingBarSeparator />
          <FloatingBarGroup>
            <FloatingBarItem aria-label="Comment C, 3 open" icon={<MessageCircle />} badge="3" />
            <FloatingBarItem aria-label="Ask agent" icon={<WandSparkles />} agent />
          </FloatingBarGroup>
        </FloatingBar>
        <FloatingBar label="Canvas options" size="md">
          <FloatingBarItem aria-label="Show grid" icon={<Grid3x3 />} pressed />
          <FloatingBarItem aria-label="Snap to grid" icon={<Magnet />} pressed={false} />
          <FloatingBarSeparator />
          <ZoomControl value="64%" appearance="bare" label="Zoom" zoomOutLabel="Zoom out" zoomInLabel="Zoom in" />
        </FloatingBar>
      </div>
    ),
    'vertical-dock': () => (
      <div className={stage}>
        <FloatingBar label="Canvas tools" orientation="vertical">
          <FloatingBarGroup>
            <FloatingBarItem aria-label="Move V" icon={<MousePointer2 />} shortcut="V" active />
            <FloatingBarItem aria-label="Hand H" icon={<Hand />} shortcut="H" />
          </FloatingBarGroup>
          <FloatingBarSeparator />
          <FloatingBarGroup>
            <FloatingBarItem aria-label="Frame F" icon={<Frame />} shortcut="F" />
            <FloatingBarItem aria-label="Rectangle R" icon={<Square />} shortcut="R" />
            <FloatingBarItem aria-label="Text T" icon={<Type />} shortcut="T" />
            <FloatingBarItem aria-label="Pen P" icon={<PenTool />} shortcut="P" />
          </FloatingBarGroup>
          <FloatingBarSeparator />
          <FloatingBarGroup>
            <FloatingBarItem aria-label="Comment C, 3 open" icon={<MessageCircle />} badge="3" />
            <FloatingBarItem aria-label="Ask agent" icon={<WandSparkles />} agent />
          </FloatingBarGroup>
        </FloatingBar>
      </div>
    ),
    capsule: () => (
      <div className="canvas-grid flex min-h-30 items-center justify-center rounded-xl p-4 [background-size:var(--cs-space-4)_var(--cs-space-4)]">
        <FloatingBar label="Canvas tools">
          <FloatingBarItem aria-label="Move" icon={<MousePointer2 />} active />
          <FloatingBarItem aria-label="Hand" icon={<Hand />} />
          <FloatingBarItem aria-label="Frame" icon={<Frame />} />
          <FloatingBarItem aria-label="Text" icon={<Type />} />
          <FloatingBarSeparator />
          <FloatingBarItem aria-label="Ask agent" icon={<WandSparkles />} agent />
        </FloatingBar>
      </div>
    ),
  },
});
