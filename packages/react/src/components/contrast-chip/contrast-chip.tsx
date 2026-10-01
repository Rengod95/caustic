'use client';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { contrastChipLevelVariants, contrastChipVariants, type ContrastChipVariantProps } from './contrast-chip.variants.ts';

export interface ContrastChipProps extends Omit<ComponentProps<'span'>, 'children'>, ContrastChipVariantProps {
  /** The WCAG level badge text. */
  level?: string;
  /** Ratio text; add the verdict for a failing pair ("2.9 : 1 · fails"). */
  children: ReactNode;
}

/** States the WCAG result of one color pair: the level reached and the measured ratio. Read-only. */
export function ContrastChip({ result, level = 'AA', className, children, ...props }: ContrastChipProps) {
  return (
    <span data-slot="contrast-chip" data-result={result ?? 'pass'} className={cn(contrastChipVariants({ result }), className)} {...props}>
      <span data-slot="contrast-chip-level" className={contrastChipLevelVariants({ result })}>{level}</span>
      <span data-slot="contrast-chip-label">{children}</span>
    </span>
  );
}
