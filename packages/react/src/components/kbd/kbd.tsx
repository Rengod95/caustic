'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';

export interface KbdProps extends ComponentProps<'kbd'> {}

/** A keyboard key or shortcut chord, e.g. <Kbd>⌘K</Kbd>. */
export function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'inline-flex h-kbd-h min-w-kbd-h items-center justify-center gap-0.5 rounded-xs bg-neutral-well px-1 font-ui text-label text-text-tertiary',
        'shadow-[inset_0_0_0_1px_var(--cs-color-border-default),inset_0_-1px_0_var(--cs-color-border-default)]',
        className,
      )}
      {...props}
    />
  );
}
