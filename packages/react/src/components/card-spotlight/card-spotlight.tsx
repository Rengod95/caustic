'use client';
import type { ComponentProps, PointerEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { Card } from '../card/index.ts';
import { cardSpotlightVariants } from './card-spotlight.variants.ts';

export interface CardSpotlightProps extends ComponentProps<'div'> {
  size?: 'regular' | 'compact';
}

/** Card lit by a soft accent light that follows the pointer. Decorative, for navigation grids only. */
export function CardSpotlight({ size, className, onPointerMove, ...props }: CardSpotlightProps) {
  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    const box = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - box.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - box.top}px`);
  };
  return <Card data-slot="card-spotlight" size={size} className={cn(cardSpotlightVariants(), className)} onPointerMove={handleMove} {...props} />;
}
