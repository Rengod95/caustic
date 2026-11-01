'use client';
import type { ComponentProps, ReactNode } from 'react';
import { IconEmphasisProvider } from '../../icons/index.ts';
import { cn } from '../../lib/cn.ts';
import { Button } from '../button/button.tsx';
import { systemRowIconVariants, systemRowTextVariants, systemRowVariants } from './system-row.variants.ts';

export interface SystemRowProps extends ComponentProps<'div'> {
  /** The glyph before the text (an icon element); drawn muted. */
  icon?: ReactNode;
  /** Label of the single action. Unset renders no action. */
  actionLabel?: ReactNode;
  /** Called when the action is pressed. */
  onAction?: () => void;
}

/** A quiet transcript row for what the system did: a muted icon, one secondary line, at most one action. */
export function SystemRow({ icon, actionLabel, onAction, className, children, ...props }: SystemRowProps) {
  return (
    <div data-slot="system-row" className={cn(systemRowVariants(), className)} {...props}>
      {icon != null && <span data-slot="system-row-icon" aria-hidden className={systemRowIconVariants()}><IconEmphasisProvider value="muted">{icon}</IconEmphasisProvider></span>}
      <span data-slot="system-row-text" className={systemRowTextVariants()}>{children}</span>
      {actionLabel != null && (
        <Button data-slot="system-row-action" size="xs" tone="neutral" variant="ghost" onClick={() => onAction?.()}>{actionLabel}</Button>
      )}
    </div>
  );
}
