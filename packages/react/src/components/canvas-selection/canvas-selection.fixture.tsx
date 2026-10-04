import { Component, Ellipsis, LayoutPanelLeft, WandSparkles } from 'lucide-react';
import type { CSSProperties } from 'react';
import { artboardSwatches } from '../canvas-artboard/canvas-artboard.fixture.tsx';
import { CanvasArtboardSample } from '../canvas-artboard/canvas-artboard.sample.tsx';
import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/index.ts';
import { CanvasArtboard } from '../canvas-artboard/index.ts';
import { CanvasGuide } from '../canvas-guide/index.ts';
import { CanvasHint, CanvasHintItem } from '../canvas-hint/index.ts';
import { CanvasMarquee } from '../canvas-marquee/index.ts';
import { CanvasRuler } from '../canvas-ruler/index.ts';
import { FloatingBar, FloatingBarItem, FloatingBarSeparator } from '../floating-bar/index.ts';
import { FrameLabel } from '../frame-label/index.ts';
import { ZoomControl } from '../zoom-control/index.ts';
import { CanvasSelection, type CanvasSelectionProps } from './canvas-selection.tsx';

const marksH = Array.from({ length: 9 }, (_, i) => ({ at: 80 + i * 100, label: String(i * 100) }));
const marksV = Array.from({ length: 4 }, (_, i) => ({ at: 60 + i * 100, label: String(i * 100) }));
const at = (x: number, y: number) => ({ '--x': `${x}px`, '--y': `${y}px` }) as CSSProperties;

export default defineFixture({
  id: 'canvas-selection',
  // The canvas host positions the overlay; the frame stands in for it.
  frame: children => <div className="relative h-32 w-64 overflow-hidden rounded-xl bg-bg-canvas">{children}</div>,
  render: props => <CanvasSelection rect={{ left: 40, top: 30, width: 180, height: 44 }} label="180 × 44" {...(props as CanvasSelectionProps)} />,
  examples: {
    // The canvas host is scaffolding (like a frame): a positioned box over the canvas grid.
    'overlay-set': () => (
      <div className="canvas-grid relative h-105 overflow-hidden rounded-2xl">
        <CanvasRuler orientation="corner" />
        <CanvasRuler orientation="horizontal" marks={marksH} band={{ start: 338, size: 180 }} />
        <CanvasRuler orientation="vertical" marks={marksV} band={{ start: 168, size: 44 }} />
        <CanvasGuide kind="user" orientation="vertical" rect={{ left: 600, top: 20, bottom: 0 }} />
        <FrameLabel kind="artboard" name="Checkout / Desktop" size="960 × 600" rect={{ left: 100, top: 46 }} />
        <CanvasArtboard rect={{ left: 100, top: 64, width: 560, height: 300 }}>
          <CanvasArtboardSample swatches={artboardSwatches} />
        </CanvasArtboard>
        <CanvasSelection mode="hover" radius={14} rect={{ left: 128, top: 168, width: 210, height: 150 }} />
        <CanvasSelection handles="all" rotate label="180 × 44" rect={{ left: 338, top: 168, width: 180, height: 44 }} />
        <CanvasGuide kind="smart" orientation="horizontal" rect={{ left: 128, top: 168, width: 400 }} />
        <CanvasGuide kind="snap" rect={{ left: 338, top: 168 }} />
        <CanvasGuide kind="snap" rect={{ left: 128, top: 168 }} />
        <CanvasGuide kind="measure" orientation="horizontal" rect={{ left: 518, top: 190, width: 142 }}>142</CanvasGuide>
        <CanvasGuide kind="measure" orientation="vertical" rect={{ left: 428, top: 64, height: 104 }}>104</CanvasGuide>
        <div className="absolute top-(--y) left-(--x) z-10" style={at(452, 112)}>
          <FloatingBar label="Selection actions" size="sm">
            <Button tone="agent" size="xs" shape="pill" iconStart={<WandSparkles />} className="mr-0.5">Ask Caustic</Button>
            <FloatingBarSeparator />
            <FloatingBarItem aria-label="Create component" icon={<Component />} />
            <FloatingBarItem aria-label="Auto layout" icon={<LayoutPanelLeft />} />
            <FloatingBarItem aria-label="More" icon={<Ellipsis />} />
          </FloatingBar>
        </div>
        <CanvasMarquee kind="marquee" rect={{ left: 700, top: 250, width: 120, height: 90 }} />
        <CanvasMarquee kind="draw" label="150 × 96" rect={{ left: 720, top: 84, width: 150, height: 96 }} />
        <div className="absolute top-8.5 right-3.5 z-20">
          <ZoomControl value="100%" appearance="glass" label="Zoom" zoomOutLabel="Zoom out" zoomInLabel="Zoom in" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-3.5 z-20 flex justify-center">
          <CanvasHint>
            <CanvasHintItem keys="⇧">constrain</CanvasHintItem>
            <CanvasHintItem keys="⌥">from center</CanvasHintItem>
            <CanvasHintItem keys="esc">cancel</CanvasHintItem>
          </CanvasHint>
        </div>
      </div>
    ),
  },
});
