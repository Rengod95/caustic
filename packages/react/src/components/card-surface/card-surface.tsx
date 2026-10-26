'use client';
import { cn } from '../../lib/cn.ts';
import { Card, type CardProps } from '../card/card.tsx';

export interface CardSurfaceProps extends CardProps {}

/** The default card for content that is read: opaque surface and a hairline (one depth cue, no elevation). Compose with the Card parts. */
export function CardSurface({ className, ...props }: CardSurfaceProps) {
  return (
    <Card
      data-slot="card-surface"
      className={cn('bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]', className)}
      {...props}
    />
  );
}
