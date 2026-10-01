'use client';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { separatorVariants } from './separator.variants.ts';

export interface SeparatorProps extends Omit<ComponentProps<'div'>, 'children'> {
  orientation?: 'horizontal' | 'vertical';
  /** true (default) removes the separator role; false keeps role="separator" with aria-orientation. */
  decorative?: boolean;
  /** Centered label; horizontal only. */
  label?: ReactNode;
}

/** A 1px divider: horizontal, vertical, or a rule with a centered label. */
export function Separator({ orientation = 'horizontal', decorative = true, label, className, ...props }: SeparatorProps) {
  const labeled = label != null && label !== false && orientation === 'horizontal';
  const a11y = decorative
    ? { role: 'none' as const }
    : { role: 'separator' as const, 'aria-orientation': orientation === 'vertical' ? ('vertical' as const) : undefined };
  return (
    <div
      data-slot="separator"
      data-orientation={orientation}
      {...a11y}
      className={cn(separatorVariants({ orientation, labeled }), className)}
      {...props}
    >
      {labeled ? (
        <>
          <span data-slot="separator-line" aria-hidden className="h-px flex-1 bg-border-default" />
          <span data-slot="separator-label">{label}</span>
          <span data-slot="separator-line" aria-hidden className="h-px flex-1 bg-border-default" />
        </>
      ) : null}
    </div>
  );
}
