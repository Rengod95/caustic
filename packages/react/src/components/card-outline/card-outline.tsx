'use client';
import type { ComponentProps, MouseEventHandler } from 'react';
import { cn } from '../../lib/cn.ts';
import { Card, type CardProps } from '../card/card.tsx';
import { cardVariants } from '../card/card.variants.ts';
import { cardOutlineVariants, type CardOutlineVariantProps } from './card-outline.variants.ts';

export interface CardOutlineProps extends Omit<CardProps, 'onClick'>, CardOutlineVariantProps {
  /** Fires when a dashed card is pressed. */
  onClick?: MouseEventHandler<HTMLElement>;
}

/** Border-only card for use inside panels that already float. border="dashed" renders a button: an add action. */
export function CardOutline({ border, size, className, onClick, ...props }: CardOutlineProps) {
  if (border === 'dashed') {
    return (
      <button
        type="button"
        data-slot="card-outline"
        data-border="dashed"
        data-size={size ?? 'regular'}
        className={cn(cardVariants({ size }), cardOutlineVariants({ border }), className)}
        onClick={onClick}
        {...(props as ComponentProps<'button'>)}
      />
    );
  }
  return <Card data-slot="card-outline" data-border="solid" size={size} className={cn(cardOutlineVariants({ border }), className)} {...props} />;
}
