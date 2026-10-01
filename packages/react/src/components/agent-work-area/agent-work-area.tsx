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
  const vars = { '--rim-r': `${(radius ?? 16) + 3}px`, ...(radius !== undefined ? { '--obj-r': `${radius}px` } : null) } as CSSProperties;
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
