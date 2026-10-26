'use client';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';
import { agentWorkAreaScanClass, agentWorkAreaVariants } from './agent-work-area.variants.ts';

export interface AgentWorkAreaProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Run the scan band. Without it only the rim shows (the object is claimed but idle). */
  scanning?: boolean;
  /** Corner radius of the object in px. Default 16 (2xl). The rim radius follows as radius + 3. */
  radius?: number;
  /** Object bounds in px from the canvas host origin. */
  rect?: OverlayRect;
}

/** Marks the part of the canvas the agent is working on. Decorative: the activity is stated in the transcript, not by the light. */
export function AgentWorkArea({ scanning = true, radius, rect, className, style, ...props }: AgentWorkAreaProps) {
  // The rim sits 3px outside the object, so its radius is the object's plus 3 (the scaled 2xl token by default).
  const vars = { '--rim-r': radius !== undefined ? `${radius + 3}px` : 'calc(var(--cs-radius-2xl) + 3px)', ...(radius !== undefined ? { '--obj-r': `${radius}px` } : null) } as CSSProperties;
  return (
    <div
      aria-hidden
      data-slot="agent-work-area"
      data-scanning={scanning ? '' : undefined}
      className={cn(agentWorkAreaVariants(), scanning && agentWorkAreaScanClass, radius !== undefined && 'rounded-(--obj-r)', className)}
      style={overlayRectStyle(rect, { ...vars, ...style })}
      {...props}
    />
  );
}
