'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';
import { commentPinOrbVariants, commentPinVariants } from './comment-pin.variants.ts';

export interface CommentPinProps extends Omit<ComponentProps<'button'>, 'children' | 'aria-label'> {
  /** human = coral pin with initials; agent = ink pin with the orb. */
  author?: 'human' | 'agent';
  /** Initials for the human pin (two letters). */
  initials?: string;
  /** Accessible name, e.g. "Comment by Mina Kim". */
  label: string;
  /** Position in px from the canvas host origin. Applied as CSS custom properties. */
  rect?: OverlayRect;
}

/** A comment marker pinned to the canvas. The thread opens from it as a CommentBubble. */
export function CommentPin({ author = 'human', initials = 'MK', label, rect, className, style, ...props }: CommentPinProps) {
  return (
    <button
      type="button"
      data-slot="comment-pin"
      data-author={author}
      aria-label={label}
      className={cn(commentPinVariants({ author, placed: rect !== undefined }), className)}
      style={overlayRectStyle(rect, style)}
      {...props}
    >
      {author === 'agent'
        ? <span data-slot="comment-pin-orb" aria-hidden className={commentPinOrbVariants({ author })} />
        : <span data-slot="comment-pin-initials" aria-hidden>{initials}</span>}
    </button>
  );
}
