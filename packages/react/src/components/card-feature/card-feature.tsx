'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { Card } from '../card/index.ts';
import { cardFeatureHeadlineVariants, cardFeatureVariants, cardFeatureVisualVariants, type CardFeatureVariantProps } from './card-feature.variants.ts';

export interface CardFeatureProps extends Omit<ComponentProps<'div'>, 'title'>, CardFeatureVariantProps {
  size?: 'regular' | 'compact';
}

/** Bento-grid tile with a quiet accent glow in one corner. fill="fill" spreads the sections top to bottom. */
export function CardFeature({ fill, size, className, ...props }: CardFeatureProps) {
  return <Card data-slot="card-feature" data-fill={fill ?? 'hug'} size={size} className={cn(cardFeatureVariants({ fill }), className)} {...props} />;
}

/** Large title for the hero tile; small tiles use CardTitle with titleSize="sm". */
export function CardFeatureHeadline({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="card-feature-headline" className={cn(cardFeatureHeadlineVariants(), className)} {...props} />;
}

/** Inset visual well pushed to the bottom; fills the remaining height. */
export function CardFeatureVisual({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-feature-visual" className={cn(cardFeatureVisualVariants(), className)} {...props} />;
}
