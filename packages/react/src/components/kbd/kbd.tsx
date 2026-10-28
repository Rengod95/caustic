'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { kbdFrameVariants, kbdVariants } from './kbd.variants.ts';

export interface KbdProps extends ComponentProps<'kbd'>, CommonProps {}

/** A keyboard key or shortcut chord, e.g. <Kbd>⌘K</Kbd>. */
export function Kbd({ tone, variant, radius, shadow, size, className, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(kbdVariants({ tone, variant, size }), kbdFrameVariants({ radius, shadow }), className)}
      {...props}
    />
  );
}
