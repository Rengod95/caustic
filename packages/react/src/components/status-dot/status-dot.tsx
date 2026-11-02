'use client';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { statusDotLabelVariants, statusDotMarkVariants, statusDotVariants } from './status-dot.variants.ts';

export interface StatusDotProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** Colour of the dot only; the label stays secondary text. */
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  /** The state in words. */
  label: ReactNode;
}

/** A status dot and its words. The tone colours the dot, never the text. */
export function StatusDot({ tone, label, className, ...props }: StatusDotProps) {
  return (
    <span data-slot="status-dot" data-tone={tone ?? 'neutral'} className={cn(statusDotVariants(), className)} {...props}>
      <span data-slot="status-dot-dot" aria-hidden className={statusDotMarkVariants({ tone })} />
      <span data-slot="status-dot-label" className={statusDotLabelVariants()}>{label}</span>
    </span>
  );
}
