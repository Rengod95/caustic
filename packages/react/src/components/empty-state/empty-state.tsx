'use client';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { emptyStateIcon, emptyStateTitle, emptyStateVariants, type EmptyStateVariantProps } from './empty-state.variants.ts';

export interface EmptyStateProps extends Omit<ComponentProps<'div'>, 'title'>, EmptyStateVariantProps {
  /** Glyph inside the tile. */
  icon?: ReactNode;
  /** Short statement of what is missing. */
  title: ReactNode;
  /** One or two sentences: the reason and what to do. */
  description?: ReactNode;
  /** One or two buttons. */
  actions?: ReactNode;
}

/** Fills a region that has no content yet, or no results: icon tile, title, reason and the next action. */
export function EmptyState({ size, icon, title, description, actions, className, ...props }: EmptyStateProps) {
  return (
    <div data-slot="empty-state" data-size={size ?? 'md'} className={cn(emptyStateVariants({ size }), className)} {...props}>
      {icon != null && <span data-slot="empty-state-icon" aria-hidden="true" className={emptyStateIcon({ size })}>{icon}</span>}
      <b data-slot="empty-state-title" className={emptyStateTitle({ size })}>{title}</b>
      {description != null && <p data-slot="empty-state-description" className="m-0 max-w-[40ch] font-ui text-ui-relaxed text-text-secondary">{description}</p>}
      {actions != null && <div data-slot="empty-state-actions" className="flex items-center justify-center gap-2">{actions}</div>}
    </div>
  );
}
