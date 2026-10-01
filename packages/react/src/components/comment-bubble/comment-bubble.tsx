'use client';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { overlayRectStyle, type OverlayRect } from '../../lib/overlay-rect.ts';
import { commentBubbleVariants } from './comment-bubble.variants.ts';

export interface CommentBubbleProps extends ComponentProps<'div'> {
  /** Author name. */
  author: string;
  /** Position in px from the canvas host origin. Applied as CSS custom properties. */
  rect?: OverlayRect;
  /** The message. */
  children: ReactNode;
}

/** A comment beside its pin: a thick-glass speech bubble with the author in bold and the message. */
export function CommentBubble({ author, rect, className, style, children, ...props }: CommentBubbleProps) {
  return (
    <div data-slot="comment-bubble" className={cn(commentBubbleVariants({ placed: rect !== undefined }), className)} style={overlayRectStyle(rect, style)} {...props}>
      <b data-slot="comment-bubble-author" className="font-semibold">{author}</b>{' '}
      <span data-slot="comment-bubble-body">{children}</span>
    </div>
  );
}
