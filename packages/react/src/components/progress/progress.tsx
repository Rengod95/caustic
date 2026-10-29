'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Tone } from '../../lib/common-props.ts';
import { progressIndicator, progressRingIndicator, progressRingTrack, progressVariants } from './progress.variants.ts';

export interface ProgressProps extends Omit<ComponentProps<'div'>, 'children'>, Omit<CommonProps, 'tone'> {
  /** 0–100. Omit (or set indeterminate) when progress is unknown; never invent a number. */
  value?: number | undefined;
  indeterminate?: boolean;
  /** 'bar' (default) is a horizontal track; 'ring' is the compact busy ring (the former Spinner). */
  shape?: 'bar' | 'ring';
  /**
   * Colour family of the fill (default accent on a bar, neutral on a ring). Agent fills a bar with the spectrum.
   * `'default'` is @deprecated: use the shape's default tone (same rendering).
   */
  tone?: Tone | 'default';
  /** Accessible name (aria-label). Unset is 'Loading' on a ring; a bar takes aria-label or aria-labelledby. */
  label?: string;
  /** aria-hidden with no role; use inside a control that already says it is busy. */
  decorative?: boolean;
}

export function Progress({
  value, indeterminate, shape = 'bar', tone: toneProp, variant, radius, shadow, size, label, decorative = false, className, ...props
}: ProgressProps) {
  const ring = shape === 'ring';
  const tone = toneProp === 'default' || toneProp === undefined ? (ring ? 'neutral' : 'accent') : toneProp;
  const unknown = indeterminate ?? value === undefined;
  const pct = Math.max(0, Math.min(100, value ?? 0));
  const fill = unknown ? undefined : { ['--cs-progress' as string]: `${pct}%` };
  const name = label ?? (ring ? 'Loading' : undefined);
  return (
    <div
      role={decorative ? undefined : 'progressbar'} data-slot="progress" data-shape={shape} data-tone={tone}
      data-size={size ?? 'md'} data-state={unknown ? 'indeterminate' : 'determinate'}
      aria-label={decorative ? undefined : name} aria-hidden={decorative || undefined}
      aria-valuemin={decorative ? undefined : 0} aria-valuemax={decorative ? undefined : 100}
      aria-valuenow={decorative || unknown ? undefined : pct}
      className={cn(progressVariants({ shape, tone, variant, size, radius: radius ?? null, shadow: shadow ?? null }), className)} {...props}
    >
      {ring ? (
        <>
          <span data-slot="progress-track" className={progressRingTrack({ size: size ?? 'md', tone, variant: variant ?? 'solid' })} />
          <span data-slot="progress-indicator" className={progressRingIndicator({ size: size ?? 'md', tone, indeterminate: unknown })} style={fill} />
        </>
      ) : (
        <span data-slot="progress-indicator" className={progressIndicator({ tone, indeterminate: unknown })} style={fill} />
      )}
    </div>
  );
}
