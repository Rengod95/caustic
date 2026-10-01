'use client';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { badgeOrbVariants, badgeVariants, type BadgeVariantProps } from './badge.variants.ts';

export interface BadgeProps extends ComponentProps<'span'>, BadgeVariantProps {
  /** Leading icon. */
  icon?: ReactNode;
  /** Leading status dot (in the text color). */
  dot?: boolean;
  /** Label or count. */
  children?: ReactNode;
}

/** Small read-only status or count label. Use Chip for removable tokens and Kbd for keys. */
export function Badge({ tone, shape, icon, dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" data-tone={tone ?? 'neutral'} data-shape={shape ?? 'pill'} className={cn(badgeVariants({ tone, shape }), className)} {...props}>
      {tone === 'agent' ? <span data-slot="badge-orb" aria-hidden className={badgeOrbVariants({ tone })} /> : null}
      {icon ? <span data-slot="badge-icon" aria-hidden className="inline-flex size-icon-xs shrink-0 [&_svg]:size-full [&_svg]:stroke-[1.75]">{icon}</span> : null}
      {dot ? <span data-slot="badge-dot" aria-hidden className="size-1.5 shrink-0 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
