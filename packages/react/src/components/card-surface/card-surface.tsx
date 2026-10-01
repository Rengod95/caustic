'use client';
import { cn } from '../../lib/cn.ts';
import { Card, type CardProps } from '../card/card.tsx';

export interface CardSurfaceProps extends CardProps {}

/** The default card for content that is read: opaque surface, hairline, long soft shadow. Compose with the Card parts. */
export function CardSurface({ className, ...props }: CardSurfaceProps) {
  return (
    <Card
      data-slot="card-surface"
      className={cn('bg-surface-base shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--cs-elevation-card)]', className)}
      {...props}
    />
  );
}
