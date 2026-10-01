'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { Card, CardFooter, CardHeader, CardMeta, CardTitle, type CardFooterProps, type CardMetaProps } from '../card/card.tsx';

export interface CardWellProps extends Omit<ComponentProps<'div'>, 'size'> {}

/** Double-bezel card: a pale shell with a 4px bezel holds an inset panel. Title and secondary information live on the shell. */
export function CardWell({ className, ...props }: CardWellProps) {
  return (
    <Card
      data-slot="card-well"
      className={cn('gap-0 bg-fill-pressed p-1 shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]', className)}
      {...props}
    />
  );
}

/** Shell header: title (flexible) and an optional trailing meta or IconButton xs. */
export function CardWellHeader({ className, ...props }: ComponentProps<'div'>) {
  return <CardHeader data-slot="card-well-header" headerAlign="center" className={cn('px-3 pb-3 pt-2.5', className)} {...props} />;
}

/** Shell title, small. */
export function CardWellTitle({ className, ...props }: ComponentProps<'span'>) {
  return <CardTitle data-slot="card-well-title" titleSize="sm" className={cn('min-w-0 flex-1', className)} {...props} />;
}

/** Tertiary 12px line with an optional icon, in the header or the footer. Links use the link color. */
export function CardWellMeta(props: CardMetaProps) {
  return <CardMeta data-slot="card-well-meta" {...props} />;
}

/** Inset surface panel holding the content. Bleed list rows with a negative inline margin equal to the inset. */
export function CardWellPanel({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-well-panel"
      className={cn(
        'grid min-w-0 gap-2.5 rounded-well-inner bg-surface-base px-inset-regular-x py-inset-regular-y font-ui text-ui-relaxed text-text-secondary',
        'shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--cs-elevation-well)] [&_p]:m-0',
        className,
      )}
      {...props}
    />
  );
}

/** Shell footer: meta on the left, a link or action on the right. */
export function CardWellFooter({ className, ...props }: CardFooterProps) {
  return <CardFooter data-slot="card-well-footer" className={cn('px-3 pb-2 pt-2.5', className)} {...props} />;
}
