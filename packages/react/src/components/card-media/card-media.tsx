'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { Badge, type BadgeProps } from '../badge/badge.tsx';
import type { CardProps } from '../card/card.tsx';
import { cardVariants } from '../card/card.variants.ts';
import { cardMediaCoverVariants, cardMediaVariants, type CardMediaVariantProps } from './card-media.variants.ts';

export interface CardMediaProps extends CardProps, CardMediaVariantProps {
  /** Makes the whole card one link. */
  href?: string;
}

/** Image-led card. Compose CardMediaCover first, then optional header and footer parts. With href the root is a single link. */
export function CardMedia({ layout, size, href, className, ...props }: CardMediaProps) {
  const cls = cn(cardVariants({ size }), cardMediaVariants({ layout }), className);
  if (href != null) {
    return <a data-slot="card-media" data-layout={layout ?? 'cover'} data-size={size ?? 'regular'} href={href} className={cls} {...(props as ComponentProps<'a'>)} />;
  }
  return <div data-slot="card-media" data-layout={layout ?? 'cover'} data-size={size ?? 'regular'} className={cls} {...props} />;
}

/** Full-bleed media box (16:9, or 4:5 in the overlay layout). Holds the image, the tag and the overlay. */
export function CardMediaCover({ className, children, ...props }: ComponentProps<'div'>) {
  return (
    <div data-slot="card-media-cover" className={cn(cardMediaCoverVariants(), className)} {...props}>
      {children}
      <span aria-hidden className="pointer-events-none absolute inset-0 hidden group-data-[layout=overlay]:block [background:linear-gradient(180deg,transparent_40%,var(--cs-color-media-scrim)),linear-gradient(180deg,transparent_40%,var(--cs-color-media-scrim))]" />
    </div>
  );
}

export interface CardMediaImageProps extends ComponentProps<'img'> {}

/** The picture. Renders an img when src is set, otherwise a decorative element you can fill with a background. Scales on card hover. */
export function CardMediaImage({ className, alt = '', ...props }: CardMediaImageProps) {
  const cls = cn('absolute inset-0 size-full object-cover transition-transform duration-480 ease-out group-hover:scale-104 group-focus-visible:scale-104', className);
  if (props.src != null) return <img data-slot="card-media-image" alt={alt} className={cls} {...props} />;
  return <div data-slot="card-media-image" aria-hidden className={cls} {...(props as ComponentProps<'div'>)} />;
}

/** Cover layout only: a Badge pinned 12px from the top-left corner. */
export function CardMediaTag({ className, ...props }: BadgeProps) {
  return <Badge data-slot="card-media-tag" className={cn('absolute left-3 top-3 z-10', className)} {...props} />;
}

/** Overlay layout only: bottom-anchored stack above the scrim. */
export function CardMediaOverlay({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-media-overlay" className={cn('absolute inset-x-0 bottom-0 z-10 grid gap-1 p-4 text-media-on', className)} {...props} />;
}

/** Large headline over the image. */
export function CardMediaOverlayTitle({ className, ...props }: ComponentProps<'b'>) {
  return <b data-slot="card-media-overlay-title" className={cn('block font-ui text-title-overlay text-media-on', className)} {...props} />;
}

/** Supporting line over the image. */
export function CardMediaOverlayDescription({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="card-media-overlay-description" className={cn('block font-ui text-ui-dense text-media-on-muted', className)} {...props} />;
}
