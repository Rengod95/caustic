'use client';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { usePresence } from '../../hooks/use-presence.ts';
import { cn } from '../../lib/cn.ts';
import { radiusClass, shadowClass, type CommonProps } from '../../lib/common-props.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';
import {
  canvasCommentAuthorVariants, canvasCommentBubbleVariants, canvasCommentOrbVariants, canvasCommentPinVariants, canvasCommentVariants,
} from './canvas-comment.variants.ts';

/**
 * Common props (lib/common-props.ts) style the pin: variant = human pin fill (default solid: the identity colour),
 * tone = the 2px ring (default neutral = canvas.handle), size = 20 · 24 · 28 · 32 (default md 28; it also steps the
 * bubble), radius = corners (2xl, the default, keeps the 14px pin radius; the tail stays xs), shadow = elevation (default 3).
 * The bubble's own common props are on CanvasCommentBubble.
 */
export interface CanvasCommentProps extends Omit<ComponentProps<'div'>, 'children' | 'onClick'>, CommonProps {
  /** human = coral pin with initials; agent = ink pin with the orb. */
  author?: 'human' | 'agent';
  /** Initials for the human pin (two letters). */
  initials?: string;
  /** Accessible name of the pin, e.g. "Comment by Mina Kim". Defaults to "Comment by {authorName}". */
  label?: string;
  /** Position in px from the canvas host origin. Applied as CSS custom properties. */
  rect?: OverlayRect;
  /** The thread is open: the bubble shows beside the pin. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Author name, shown on its own line in the bubble. */
  authorName?: string;
  /** The message in the bubble. */
  body?: ReactNode;
  /** A custom bubble part (a CanvasCommentBubble with its own variant or rect), shown in place of the default one when open. */
  children?: ReactNode;
  /** The pin is activated. Toggles open unless the handler calls preventDefault. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** A comment pinned to the canvas: the pin marker and, when open, its speech bubble beside it. */
export function CanvasComment({
  author = 'human', initials = 'MK', label, rect, open: openProp, defaultOpen = false, onOpenChange, authorName, body, children, onClick,
  tone, variant, radius, shadow, size, className, style, ...props
}: CanvasCommentProps) {
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const thread = children != null || body != null;
  const name = label ?? (authorName ? `Comment by ${authorName}` : author === 'agent' ? 'Comment by Caustic' : 'Comment');
  // The default bubble stays mounted while it closes, so its exit plays. A custom bubble (children) is shown while open.
  const bubbles = usePresence(open && children == null && body != null ? [{ authorName, size, body }] : [], () => 'bubble');
  return (
    <div
      data-slot="canvas-comment"
      data-author={author}
      data-state={open ? 'open' : 'closed'}
      className={cn(canvasCommentVariants({ placed: rect !== undefined }), className)}
      style={overlayRectStyle(rect, style)}
      {...props}
    >
      <button
        type="button"
        data-slot="canvas-comment-pin"
        aria-label={name}
        aria-expanded={thread ? open : undefined}
        className={cn(
          canvasCommentPinVariants({ author, variant, tone, shadow, size }),
          radius && radius !== '2xl' && radiusClass[radius], radius && radius !== '2xl' && radius !== 'none' && 'rounded-bl-xs',
        )}
        onClick={event => { onClick?.(event); if (!event.defaultPrevented) setOpen(o => !o); }}
      >
        {author === 'agent'
          ? <span data-slot="canvas-comment-orb" aria-hidden className={canvasCommentOrbVariants({ author })} />
          : <span data-slot="canvas-comment-initials" aria-hidden>{initials}</span>}
      </button>
      {bubbles.entries.map(({ item, present }) => (
        <CanvasCommentBubble
          key="bubble" authorName={item.authorName} size={item.size} data-state={present ? 'open' : 'closed'} aria-hidden={present ? undefined : true} inert={!present}
          onAnimationEnd={e => { if (e.target === e.currentTarget) bubbles.exited('bubble'); }}
        >{item.body}</CanvasCommentBubble>
      ))}
      {open && children}
    </div>
  );
}

/**
 * Common props (lib/common-props.ts) of the bubble: variant = surface (default solid: thick floating material),
 * tone = author name colour (default neutral), size = padding and type (default md: footnote), radius = corners (2xl,
 * the default, keeps the 14px bubble radius; the tail corner stays square), shadow = elevation (default 3).
 */
export interface CanvasCommentBubbleProps extends ComponentProps<'div'>, CommonProps {
  /** Author name, on its own line above the message. */
  authorName?: string;
  /** Position in px from the comment root (the pin's top-left), replacing the place beside the pin. Pass left and top. */
  rect?: OverlayRect;
  /** The message. */
  children: ReactNode;
}

/** The bubble part (formerly CommentBubble): a thick-glass speech bubble with the author on its own line and the message under it. */
export function CanvasCommentBubble({ authorName, rect, tone, variant, radius, shadow, size, className, style, children, ...props }: CanvasCommentBubbleProps) {
  const surface = variant ?? 'solid';
  const cls = cn(
    canvasCommentBubbleVariants({ placed: rect !== undefined, surface, elevation: shadow, bubbleSize: size }),
    surface !== 'solid' && shadow && shadow !== '3' && shadowClass[shadow],
    // An explicit radius replaces the bubble radius; the tail corner stays square.
    radius && radius !== '2xl' && radiusClass[radius], radius && radius !== '2xl' && 'rounded-bl-none',
    className,
  );
  return (
    <div data-slot="canvas-comment-bubble" className={cls} style={overlayRectStyle(rect, style)} {...props}>
      {authorName != null && <><b data-slot="canvas-comment-author" className={canvasCommentAuthorVariants({ authorTone: tone, bubbleSize: size })}>{authorName}</b>{' '}</>}
      <span data-slot="canvas-comment-body">{children}</span>
    </div>
  );
}
