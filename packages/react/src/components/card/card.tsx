'use client';
import { Slot } from '@radix-ui/react-slot';
import { ArrowUpRight, Check } from '../../icons/index.ts';
import type { ComponentProps, MouseEventHandler, PointerEvent, PointerEventHandler, ReactNode } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { Badge, type BadgeProps } from '../badge/badge.tsx';
import {
  cardAboveCoverVariants, cardAddTargetVariants, cardArrowVariants, cardChoiceVariants, cardCoverVariants, cardFooterVariants, cardGlassShadowVariants,
  cardHeaderVariants, cardHeadlineVariants, cardIconVariants, cardIndicatorVariants, cardPanelVariants, cardReadingVariants, cardShapeVariants, cardSize,
  cardTargetVariants, cardTitleVariants, cardVariants, cardVisualVariants,
  type CardFooterVariantProps, type CardHeaderVariantProps, type CardIconVariantProps, type CardSize, type CardTitleVariantProps, type CardVariant,
} from './card.variants.ts';

/** The skin props Card, CardLink and CardChoice share. */
export interface CardSkinProps extends Omit<CommonProps, 'size' | 'variant'> {
  /**
   * Skin: surface (default), plain, glass, outline, dashed, well, agent, spotlight, feature; solid and soft paint the
   * card in the tone slots; ghost is the transparent base (the same as plain).
   */
  variant?: CardVariant;
  /**
   * Inset and gap: xs, sm, md (default) or lg. Parts (divided footer, cover, sparkline) read it from data-size.
   * `regular` and `compact` are deprecated names for md and sm.
   */
  size?: CardSize;
  /** hug = sections stacked from the top (default); fill = spread top to bottom (a tall feature tile with its visual at the bottom). */
  fill?: 'hug' | 'fill';
}

function skin({ variant, tone, size, fill, radius, shadow }: CardSkinProps) {
  const v = variant ?? 'surface';
  // The spotlight light and the feature glow are accent until a tone is chosen.
  const t = tone ?? (v === 'spotlight' || v === 'feature' ? 'accent' : 'neutral');
  const s = cardSize(size);
  const shape = v === 'glass' ? cn(cardShapeVariants({ radius }), cardGlassShadowVariants({ shadow })) : cardShapeVariants({ radius, shadow });
  return { v, s: s ?? 'md', t, cls: cn(cardVariants({ size: s, tone: t, variant: v, fill }), shape) };
}

/** Spotlight: the light follows the pointer through --mx / --my (px from the card's top-left). */
function trackPointer(e: PointerEvent<HTMLElement>) {
  const box = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - box.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - box.top}px`);
}

function pointerHandler(v: CardVariant, own?: PointerEventHandler<HTMLElement>): PointerEventHandler<HTMLElement> | undefined {
  if (v !== 'spotlight') return own;
  return e => { own?.(e); trackPointer(e); };
}

export interface CardProps extends ComponentProps<'div'>, CardSkinProps {}

/**
 * A static card: header, body and footer parts on one of the skins. It stays a div; a card that is one target is a
 * CardLink (navigates, or `as="button"` for the dashed add card), a card that is one choice is a CardChoice.
 */
export function Card({ variant, tone, size, fill, radius, shadow, className, onPointerMove, ...props }: CardProps) {
  const k = skin({ variant, tone, size, fill, radius, shadow });
  return (
    <div
      data-slot="card"
      data-variant={k.v}
      data-size={k.s}
      data-fill={fill ?? 'hug'}
      className={cn(k.cls, k.v === 'surface' && cardReadingVariants(), className)}
      onPointerMove={pointerHandler(k.v, onPointerMove as PointerEventHandler<HTMLElement> | undefined)}
      {...props}
    />
  );
}

export interface CardLinkProps extends Omit<ComponentProps<'a'>, 'onClick' | 'onPointerMove' | 'type'>, CardSkinProps {
  /** Render the child element (a router link) as the card. */
  asChild?: boolean;
  /** a (default) navigates with href; button is an in-place action, e.g. the dashed "add" card. */
  as?: 'a' | 'button';
  onClick?: MouseEventHandler<HTMLElement>;
  onPointerMove?: PointerEventHandler<HTMLElement>;
}

/**
 * A card that is one target: the whole card navigates (href or asChild) and lifts on hover; use CardArrow in the header.
 * as="button" makes it an action (variant="dashed" is the add card). Nothing interactive goes inside.
 */
export function CardLink({ asChild, as, variant, tone, size, fill, radius, shadow, className, onPointerMove, ...props }: CardLinkProps) {
  const k = skin({ variant, tone, size, fill, radius, shadow });
  const target = k.v === 'dashed' ? cardAddTargetVariants({ neutral: k.t === 'neutral' }) : cardTargetVariants();
  const cls = cn(k.cls, target, className);
  const move = pointerHandler(k.v, onPointerMove);
  if (asChild) return <Slot data-slot="card" data-kind="link" data-variant={k.v} data-size={k.s} className={cls} onPointerMove={move} {...(props as ComponentProps<typeof Slot>)} />;
  if (as === 'button') {
    return <button type="button" data-slot="card" data-kind="link" data-variant={k.v} data-size={k.s} className={cls} onPointerMove={move} {...(props as ComponentProps<'button'>)} />;
  }
  return <a data-slot="card" data-kind="link" data-variant={k.v} data-size={k.s} className={cls} onPointerMove={move} {...props} />;
}

export interface CardChoiceProps extends Omit<ComponentProps<'button'>, 'value' | 'type' | 'onPointerMove'>, CardSkinProps {
  /** radio (default) = one of a set (group them in a role="radiogroup"); checkbox = toggles on its own. */
  type?: 'radio' | 'checkbox';
  /** The value this card stands for (data-value), for the group that owns the selection. */
  value?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onPointerMove?: PointerEventHandler<HTMLElement>;
}

/**
 * A card that is one choice: a button with role radio or checkbox and aria-checked. Selected, it inverts to ink
 * (selected utility) in every skin and tone. Put a CardIndicator at the trailing end of the header; nothing
 * interactive goes inside. Arrow-key movement belongs to the group that holds the cards.
 */
export function CardChoice({
  type = 'radio', value, checked, defaultChecked = false, onCheckedChange, variant, tone, size, fill, radius, shadow, className, onClick, onPointerMove, ...props
}: CardChoiceProps) {
  const [on, setOn] = useControllableState({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange });
  const k = skin({ variant, tone, size, fill, radius, shadow });
  return (
    <button
      type="button" role={type} aria-checked={on}
      data-slot="card" data-kind="choice" data-type={type} data-variant={k.v} data-size={k.s} data-state={on ? 'checked' : 'unchecked'} data-value={value}
      className={cn(k.cls, cardTargetVariants(), cardChoiceVariants(), className)}
      onClick={e => { onClick?.(e); if (!e.defaultPrevented) setOn(type === 'checkbox' ? !on : true); }}
      onPointerMove={pointerHandler(k.v, onPointerMove)}
      {...props}
    />
  );
}

export interface CardHeaderProps extends ComponentProps<'div'>, CardHeaderVariantProps {
  /** One short badge at the end of the row (a well header: "Writes denied"). Long labels belong in the body, not here. */
  badge?: ReactNode;
}

/**
 * Row: optional leading CardIcon (or CardOrb), a CardHeading (flexible) and an optional CardTrailing. Use
 * headerAlign="center" with a tile, badge or switch. density="shell" is the header of a well card (centred, its own
 * padding, a lighter title).
 */
export function CardHeader({ headerAlign, density, badge, className, children, ...props }: CardHeaderProps) {
  const align = headerAlign ?? (density === 'shell' ? 'center' : 'start');
  return (
    <div
      data-slot="card-header" data-align={align} data-density={density ?? 'default'}
      className={cn(cardHeaderVariants({ headerAlign: align, density }), cardAboveCoverVariants(), className)}
      {...props}
    >
      {children}
      {badge != null && <span data-slot="card-badge" className="flex flex-none items-center">{badge}</span>}
    </div>
  );
}

export interface CardIconProps extends ComponentProps<'span'>, CardIconVariantProps {}

/** Leading tile for an 18px icon glyph. Decorative, so it is hidden from assistive technology. */
export function CardIcon({ iconTone, className, ...props }: CardIconProps) {
  return <span aria-hidden data-slot="card-icon" data-tone={iconTone ?? 'neutral'} className={cn(cardIconVariants({ iconTone }), className)} {...props} />;
}

/** Leading spectrum orb (14px) in place of a tile, lit by the agent skin. Decorative; state the provenance in text as well. */
export function CardOrb({ className, ...props }: ComponentProps<'span'>) {
  return <span aria-hidden data-slot="card-orb" className={cn('flex-none', className)} {...props} />;
}

/** Grid that stacks eyebrow, title and description with a 2px gap. */
export function CardHeading({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-heading" className={cn('grid min-w-0 flex-1 gap-0.5', className)} {...props} />;
}

/** Uppercase caption above the title, one step quieter than the description (text.tertiary) so it does not compete with the title. */
export function CardEyebrow({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="card-eyebrow" className={cn('block font-ui text-caption uppercase text-text-tertiary', className)} {...props} />;
}

export interface CardTitleProps extends ComponentProps<'span'>, CardTitleVariantProps {
  /** Element to render. Pass a heading level only when the card should appear in the outline. */
  as?: 'span' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/** Card title: title-3 in a header, titleSize="sm" (title-4) inside a body or a shell header. */
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

/** Secondary-colored content grid (primary on the reading surface card). Bleed rows with a negative inline margin equal to the inset. */
export function CardBody({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-body" className={cn('grid min-w-0 gap-2.5 font-ui text-ui-relaxed text-text-secondary [&_p]:m-0', cardAboveCoverVariants(), className)} {...props} />;
}

/** Inset surface panel of a well card, holding the content (a body: 10px gap). Bleed list rows with a negative inline margin equal to the inset. */
export function CardPanel({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-panel" className={cn(cardPanelVariants(), className)} {...props} />;
}

/** Large title for a hero tile (feature); small tiles use CardTitle with titleSize="sm". */
export function CardHeadline({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="card-headline" className={cn(cardHeadlineVariants(), className)} {...props} />;
}

/** Inset visual well pushed to the bottom of a feature tile; fills the remaining height. */
export function CardVisual({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-visual" className={cn(cardVisualVariants(), className)} {...props} />;
}

export interface CardFooterProps extends ComponentProps<'div'>, CardFooterVariantProps {}

/**
 * Row of actions or meta. footer: start (free), end (actions right), divided (hairline above) or block (full-width
 * button). density="shell" is the footer of a well card.
 */
export function CardFooter({ footer, density, className, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer" data-layout={footer ?? 'start'} data-density={density ?? 'default'}
      className={cn(cardFooterVariants({ footer, density }), cardAboveCoverVariants(), className)}
      {...props}
    />
  );
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

/** Link card: arrow-up-right at the trailing end of the header; nudges on hover. */
export function CardArrow({ className, ...props }: ComponentProps<'span'>) {
  return <span aria-hidden data-slot="card-arrow" className={cn(cardArrowVariants(), className)} {...props}><ArrowUpRight /></span>;
}

/** Choice card: the decorative radio (dot) or checkbox (check) mark at the trailing end of the header. */
export function CardIndicator({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span aria-hidden data-slot="card-indicator" className={cn(cardIndicatorVariants(), className)} {...props}>
      <span data-slot="card-indicator-dot" className="size-radio-dot rounded-full bg-accent-on opacity-0 group-data-[state=checked]/card:opacity-100 group-data-[state=checked]/card:animate-pop group-data-[type=checkbox]/card:hidden" />
      <Check className="hidden opacity-0 group-data-[type=checkbox]/card:block group-data-[state=checked]/card:opacity-100 group-data-[state=checked]/card:animate-pop" />
    </span>
  );
}

export interface CardCoverProps extends ComponentProps<'div'> {
  /** cover = the picture above header and footer, which sit on a frosted panel (default); overlay = text over the picture on a scrim. */
  layout?: 'cover' | 'overlay';
}

/** Full-bleed media box, first in the card: 16:9 (cover) or 4:5 (overlay). Holds the CardImage, a CardCoverTag and the CardOverlay. */
export function CardCover({ layout = 'cover', className, children, ...props }: CardCoverProps) {
  return (
    <div data-slot="card-cover" data-layout={layout} className={cn(cardCoverVariants({ layout }), className)} {...props}>
      {children}
      <span aria-hidden className="pointer-events-none absolute inset-0 hidden group-data-[layout=overlay]/cover:block [background:linear-gradient(180deg,transparent_40%,var(--cs-color-media-scrim-strong))]" />
    </div>
  );
}

export interface CardImageProps extends ComponentProps<'img'> {}

/**
 * The picture. Renders an img when src is set, otherwise a decorative element you can fill with a background. Scales on
 * card hover. In the cover layout it fills the whole card (behind the frosted content panel); in overlay, the cover.
 */
export function CardImage({ className, alt = '', ...props }: CardImageProps) {
  const cls = cn('absolute inset-0 size-full object-cover transition-transform duration-slow ease-out group-hover/card:scale-104 group-focus-visible/card:scale-104', className);
  if (props.src != null) return <img data-slot="card-image" alt={alt} className={cls} {...props} />;
  return <div data-slot="card-image" aria-hidden className={cls} {...(props as ComponentProps<'div'>)} />;
}

/** Cover layout: a Badge pinned 12px from the top-left corner. */
export function CardCoverTag({ className, ...props }: BadgeProps) {
  return <Badge data-slot="card-cover-tag" className={cn('absolute left-3 top-3 z-10', className)} {...props} />;
}

/** Overlay layout: bottom-anchored stack above the scrim. */
export function CardOverlay({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-overlay" className={cn('absolute inset-x-0 bottom-0 z-10 grid gap-1 p-4 text-media-on', className)} {...props} />;
}

/** Overlay layout: the chip above the title, a 20% white tag (media.chip) with white text (media.on). It owns its colour. */
export function CardOverlayTag({ className, ...props }: BadgeProps) {
  return <Badge data-slot="card-overlay-tag" className={cn('justify-self-start bg-media-chip text-media-on', className)} {...props} />;
}

/** Large headline over the image. */
export function CardOverlayTitle({ className, ...props }: ComponentProps<'b'>) {
  return <b data-slot="card-overlay-title" className={cn('block font-ui text-title-overlay text-media-on', className)} {...props} />;
}

/** Supporting line over the image. */
export function CardOverlayDescription({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="card-overlay-description" className={cn('block font-ui text-ui-dense text-media-on-muted', className)} {...props} />;
}
