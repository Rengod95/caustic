'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { progressIndicator, progressVariants, type ProgressVariantProps } from './progress.variants.ts';

export interface ProgressProps extends Omit<ComponentProps<'div'>, 'children'>, ProgressVariantProps {
  /** 0–100. Omit (or set indeterminate) when progress is unknown; never invent a number. */
  value?: number | undefined;
  indeterminate?: boolean;
}

export function Progress({ value, indeterminate, tone, className, ...props }: ProgressProps) {
  const unknown = indeterminate ?? value === undefined;
  const pct = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div
      role="progressbar" data-slot="progress" data-tone={tone ?? 'default'} data-state={unknown ? 'indeterminate' : 'determinate'}
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={unknown ? undefined : pct}
      className={cn(progressVariants({ tone }), className)} {...props}
    >
      <span data-slot="progress-indicator" className={progressIndicator({ tone, indeterminate: unknown })} style={unknown ? undefined : { ['--progress' as string]: `${pct}%` }} />
    </div>
  );
}
