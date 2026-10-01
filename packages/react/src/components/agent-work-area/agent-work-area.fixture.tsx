import type { CSSProperties } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { AgentCursor } from '../agent-cursor/index.ts';
import { CanvasSelection } from '../canvas-selection/index.ts';
import { AgentWorkArea, type AgentWorkAreaProps } from './agent-work-area.tsx';

// The dark block is user content (a warm dark neutral outside the token set): passed as a swatch custom property.
const swatch = { '--c': 'oklch(.22 .02 50)', '--r': '9px' } as CSSProperties;

export default defineFixture({
  id: 'agent-work-area',
  // The canvas host positions the box; the frame stands in for it.
  frame: children => <div className="relative h-48 w-60 rounded-xl bg-bg-canvas">{children}</div>,
  render: props => <AgentWorkArea rect={{ left: 56, top: 24, width: 110, height: 130 }} {...(props as AgentWorkAreaProps)} />,
  examples: {
    'selection-human-vs-agent': () => (
      // The stage is scaffolding: a canvas-colored box holding a person selection and an agent work area side by side.
      <div className="relative block min-h-50 rounded-xl bg-bg-canvas p-4">
        <div className="absolute top-7.5 left-5.5 h-9 w-30 rounded-(--r) bg-(--c)" style={swatch} />
        <CanvasSelection handles="corners" label="120 × 36" rect={{ left: 22, top: 30, width: 120, height: 36 }} />
        <div className="absolute top-6 right-5.5 h-32.5 w-27.5 rounded-(--r) bg-surface-base shadow-2" style={{ '--r': '14px' } as CSSProperties} />
        <AgentWorkArea radius={14} rect={{ right: 22, top: 24, width: 110, height: 130 }} />
        <AgentCursor name="Caustic" rect={{ right: 4, top: 140 }} />
      </div>
    ),
  },
});
