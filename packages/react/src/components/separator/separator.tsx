'use client';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { radiusClass, type CommonProps } from '../../lib/common-props.ts';
import { separatorLabelVariants, separatorLineVariants, separatorVariants } from './separator.variants.ts';

export interface SeparatorProps extends Omit<ComponentProps<'div'>, 'children'>, CommonProps {
  orientation?: 'horizontal' | 'vertical';
  /** true (default) removes the separator role; false keeps role="separator" with aria-orientation. */
  decorative?: boolean;
  /** Centered label; horizontal only. */
  label?: ReactNode;
}

/** A 1px divider: horizontal, vertical, or a rule with a centered label. */
export function Separator({ orientation = 'horizontal', decorative = true, label, tone, variant, radius, shadow, size, className, ...props }: SeparatorProps) {
  const labeled = label != null && label !== false && orientation === 'horizontal';
  const a11y = decorative
    ? { role: 'none' as const }
    : { role: 'separator' as const, 'aria-orientation': orientation === 'vertical' ? ('vertical' as const) : undefined };
  const line = cn(separatorLineVariants({ tone, variant, size }), radius ? radiusClass[radius] : undefined);
  return (
    <div
      data-slot="separator"
      data-orientation={orientation}
      {...a11y}
      className={cn(separatorVariants({ orientation, labeled, tone, variant, size, radius: radius ?? null, shadow: shadow ?? null }), className)}
      {...props}
    >
      {labeled ? (
        <>
          <span data-slot="separator-line" aria-hidden className={line} />
          <span data-slot="separator-label" className={separatorLabelVariants()}>{label}</span>
          <span data-slot="separator-line" aria-hidden className={line} />
        </>
      ) : null}
    </div>
  );
}
