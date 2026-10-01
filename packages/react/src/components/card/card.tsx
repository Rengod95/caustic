'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import {
  cardFooterVariants, cardHeaderVariants, cardIconVariants, cardTitleVariants, cardVariants,
  type CardFooterVariantProps, type CardHeaderVariantProps, type CardIconVariantProps, type CardTitleVariantProps, type CardVariantProps,
} from './card.variants.ts';

export interface CardProps extends ComponentProps<'div'>, CardVariantProps {}

/** The transparent base every card variant renders: owns the inset, the gap and the radius. Use a variant in product code. */
export function Card({ size, className, ...props }: CardProps) {
  return <div data-slot="card" data-size={size ?? 'regular'} className={cn(cardVariants({ size }), className)} {...props} />;
}

export interface CardHeaderProps extends ComponentProps<'div'>, CardHeaderVariantProps {}

/** Row: optional leading CardIcon, a CardHeading (flexible) and an optional CardTrailing. Use headerAlign="center" with a tile, badge or switch. */
export function CardHeader({ headerAlign, className, ...props }: CardHeaderProps) {
  return <div data-slot="card-header" data-align={headerAlign ?? 'start'} className={cn(cardHeaderVariants({ headerAlign }), className)} {...props} />;
}

export interface CardIconProps extends ComponentProps<'span'>, CardIconVariantProps {}

/** Leading tile for an 18px lucide glyph. Decorative, so it is hidden from assistive technology. */
export function CardIcon({ iconTone, className, ...props }: CardIconProps) {
  return <span aria-hidden data-slot="card-icon" data-tone={iconTone ?? 'neutral'} className={cn(cardIconVariants({ iconTone }), className)} {...props} />;
}

/** Grid that stacks eyebrow, title and description with a 2px gap. */
export function CardHeading({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-heading" className={cn('grid min-w-0 flex-1 gap-0.5', className)} {...props} />;
}

/** Uppercase accent caption above the title. */
export function CardEyebrow({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="card-eyebrow" className={cn('block font-ui text-caption uppercase text-accent-text', className)} {...props} />;
}

export interface CardTitleProps extends ComponentProps<'span'>, CardTitleVariantProps {
  /** Element to render. Pass a heading level only when the card should appear in the outline. */
  as?: 'span' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/** Card title: title-3 in a header, titleSize="sm" (title-4) inside a body or shell header. */
export function CardTitle({ as, titleSize, className, ...props }: CardTitleProps) {
  const Tag = (as ?? 'span') as 'span';
  return <Tag data-slot="card-title" className={cn(cardTitleVariants({ titleSize }), className)} {...props} />;
}

/** One sentence under the title. */
export function CardDescription({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="card-description" className={cn('block font-ui text-ui-dense text-text-secondary', className)} {...props} />;
}

/**
 * Direct control in a header: IconButton sm, Badge or Switch. Pulled up so its hit area does not push the title down;
 * an IconButton is also pulled to the right edge.
 */
export function CardTrailing({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-trailing"
      className={cn('flex flex-none items-center -mt-0.5 has-[[data-slot=icon-button]]:-mt-1 has-[[data-slot=icon-button]]:-mr-1.5', className)}
      {...props}
    />
  );
}

/** Secondary-colored content grid. Bleed rows with a negative inline margin equal to the inset. */
export function CardBody({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-body" className={cn('grid min-w-0 gap-2.5 font-ui text-ui-relaxed text-text-secondary [&_p]:m-0', className)} {...props} />;
}

export interface CardFooterProps extends ComponentProps<'div'>, CardFooterVariantProps {}

/** Row of actions or meta. footer: start (free), end (actions right), divided (hairline above) or block (full-width button). */
export function CardFooter({ footer, className, ...props }: CardFooterProps) {
  return <div data-slot="card-footer" data-layout={footer ?? 'start'} className={cn(cardFooterVariants({ footer }), className)} {...props} />;
}

export interface CardMetaProps extends ComponentProps<'span'> {
  /** Renders a link instead of a span. */
  href?: string;
}

/** Tertiary 12px line with an optional 14px icon. Valid in a footer or a header. */
export function CardMeta({ href, className, ...props }: CardMetaProps) {
  const cls = cn('inline-flex items-center gap-1.5 font-ui text-ui-sm font-normal text-text-tertiary [&_svg]:size-icon-sm', className);
  if (href != null) return <a data-slot="card-meta" href={href} className={cn(cls, 'outline-none focus-visible:shadow-focus')} {...(props as ComponentProps<'a'>)} />;
  return <span data-slot="card-meta" className={cls} {...props} />;
}

/** Flexible filler that pushes what follows to the end of a footer. */
export function CardSpacer({ className, ...props }: ComponentProps<'span'>) {
  return <span aria-hidden data-slot="card-spacer" className={cn('flex-1', className)} {...props} />;
}
