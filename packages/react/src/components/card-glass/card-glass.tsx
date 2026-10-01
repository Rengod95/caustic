'use client';
import { cn } from '../../lib/cn.ts';
import { Card, type CardProps } from '../card/card.tsx';

export interface CardGlassProps extends CardProps {}

/** Frosted card for content that floats over imagery, color or the canvas. On a flat background use CardSurface. */
export function CardGlass({ className, ...props }: CardGlassProps) {
  return <Card data-slot="card-glass" className={cn('glass', className)} {...props} />;
}
