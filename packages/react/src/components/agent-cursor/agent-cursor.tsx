'use client';
import { useId, type ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';

export interface AgentCursorProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** The agent name shown in the tag. */
  name?: string;
  /** Position in px from the canvas host origin: { left | right, top | bottom }. */
  rect?: OverlayRect;
}

/** The agent presence on the canvas: a spectrum pointer and a glass name tag. Decorative; the activity list states what the agent does. */
export function AgentCursor({ name = 'Caustic', rect, className, style, ...props }: AgentCursorProps) {
  const gradient = useId();
  return (
    <div
      aria-hidden
      data-slot="agent-cursor"
      className={cn('pointer-events-none absolute top-(--rect-t) right-(--rect-r) bottom-(--rect-b) left-(--rect-l) z-20 flex items-start gap-0.5', className)}
      style={overlayRectStyle(rect, style)}
      {...props}
    >
      <svg data-slot="agent-cursor-pointer" viewBox="0 0 24 24" className="size-cursor shrink-0 [filter:drop-shadow(0_1px_2px_var(--cs-color-agent-glow))]">
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" className="[stop-color:var(--cs-spectrum-1)]" />
            <stop offset="0.5" className="[stop-color:var(--cs-spectrum-2)]" />
            <stop offset="1" className="[stop-color:var(--cs-spectrum-3)]" />
          </linearGradient>
        </defs>
        <path d="M4 2.5 20 11l-7 1.8L9.5 20z" fill={`url(#${gradient})`} strokeWidth="1.5" strokeLinejoin="round" className="stroke-canvas-handle" />
      </svg>
      <span
        data-slot="agent-cursor-tag"
        className="glass glass-thick agent-rim mt-3.5 inline-flex h-control-compact-xs items-center gap-1.5 rounded-full px-2 text-label whitespace-nowrap text-text-primary"
      >
        <span data-slot="agent-cursor-orb" className="orb orb-sm" />
        <span data-slot="agent-cursor-label">{name}</span>
      </span>
    </div>
  );
}
