'use client';
import { useId, type ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';
import { agentCursorTagVariants, agentCursorVariants } from './agent-cursor.variants.ts';

/** Common props (lib/common-props.ts) style the name tag: tone and variant its fill, radius, shadow and size its box. */
export interface AgentCursorProps extends Omit<ComponentProps<'div'>, 'children'>, CommonProps {
  /** The agent name shown in the tag. */
  name?: string;
  /** Position in px from the canvas host origin: { left | right, top | bottom }. */
  rect?: OverlayRect;
}

/** The agent presence on the canvas: a spectrum pointer and a spectrum-filled name tag hanging off it. Decorative; the activity list states what the agent does. */
export function AgentCursor({ name = 'Caustic', rect, tone, variant, radius, shadow, size, className, style, ...props }: AgentCursorProps) {
  const gradient = useId();
  // The own tag (soft + agent, the defaults) is filled with the pointer's gradient, so arrow and tag read as one piece.
  const own = (variant ?? 'soft') === 'soft' && (tone ?? 'agent') === 'agent';
  return (
    <div
      aria-hidden
      data-slot="agent-cursor"
      className={cn(agentCursorVariants(), className)}
      style={overlayRectStyle(rect, style)}
      {...props}
    >
      <svg data-slot="agent-cursor-pointer" viewBox="0 0 24 24" className="size-cursor shrink-0 [filter:drop-shadow(0_1px_2px_var(--cs-color-agent-glow))]">
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" className="[stop-color:var(--cs-color-agent-stop-1)]" />
            <stop offset="0.5" className="[stop-color:var(--cs-color-agent-stop-2)]" />
            <stop offset="1" className="[stop-color:var(--cs-color-agent-stop-3)]" />
          </linearGradient>
        </defs>
        {/* No outline stroke (owner 2026-10-27): the gradient fill and the soft agent drop shadow carry the arrow. */}
        <path d="M4 2.5 20 11l-7 1.8L9.5 20z" fill={`url(#${gradient})`} />
      </svg>
      <span
        data-slot="agent-cursor-tag"
        // The corner nearest the pointer stays 2xs on every radius but none, so the tag hangs off the arrow (owner A).
        className={cn(agentCursorTagVariants({ tone, variant, radius, shadow, size }), radius !== 'none' && 'rounded-ss-2xs')}
      >
        {own && (
          <svg data-slot="agent-cursor-fill" aria-hidden preserveAspectRatio="none" viewBox="0 0 1 1" className="absolute inset-0 -z-10 size-full">
            <rect width="1" height="1" fill={`url(#${gradient})`} />
          </svg>
        )}
        <span data-slot="agent-cursor-label">{name}</span>
      </span>
    </div>
  );
}
