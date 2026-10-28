'use client';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';
import { agentWorkAreaVariants } from './agent-work-area.variants.ts';

export interface AgentWorkAreaProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Run the scan band. Without it only the rim shows (the object is claimed but idle). */
  scanning?: boolean;
  /**
   * Corner radius of the object by radius token (default 2xl); the rim follows concentric at radius + 3px.
   * A number (px) still works: @deprecated pass a radius token instead.
   */
  radius?: Radius | number;
  /** Colour of the scan band: agent (default) = agent.glow, another tone its tint. The rim stays the spectrum. */
  tone?: Tone;
  /** The rim: outline = 2px (default), solid = 3px, soft = 1px, ghost = none (the scan alone). */
  variant?: Variant;
  /** Elevation of the marked box. Unset keeps none. */
  shadow?: Shadow;
  /** Scan band width: xs thin … lg wide; md (default) is the 200% sweep. */
  size?: Size;
  /** Object bounds in px from the canvas host origin. */
  rect?: OverlayRect;
}

/** Marks the part of the canvas the agent is working on. Decorative: the activity is stated in the transcript, not by the light. */
export function AgentWorkArea({ scanning = true, radius, rect, tone, variant, shadow, size, className, style, ...props }: AgentWorkAreaProps) {
  // The rim sits 3px outside the object, so its radius is the object's plus 3 (the scaled 2xl token by default).
  // A token radius is a class (agentWorkAreaVariants); the deprecated px number keeps the custom properties.
  const px = typeof radius === 'number' ? radius : undefined;
  const vars = { '--rim-r': px !== undefined ? `${px + 3}px` : 'calc(var(--cs-radius-2xl) + 3px)', ...(px !== undefined ? { '--obj-r': `${px}px` } : null) } as CSSProperties;
  return (
    <div
      aria-hidden
      data-slot="agent-work-area"
      data-scanning={scanning ? '' : undefined}
      className={cn(agentWorkAreaVariants({ scanning, variant, tone, radius: typeof radius === 'string' ? radius : undefined, shadow, size }), px !== undefined && 'rounded-(--obj-r)', className)}
      style={overlayRectStyle(rect, { ...vars, ...style })}
      {...props}
    />
  );
}
