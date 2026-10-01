'use client';
import { Slot } from '@radix-ui/react-slot';
import { LoaderCircle } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { buttonVariants, type ButtonVariantProps } from './button.variants.ts';

export interface ButtonProps extends Omit<ComponentProps<'button'>, 'children'>, ButtonVariantProps {
  /** Shows a spinner, sets aria-busy and blocks activation. */
  loading?: boolean;
  /** Render the child element (e.g. a link) with button styling. */
  asChild?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  children?: ReactNode;
}

export function Button({ tone, shape, size, loading = false, disabled = false, asChild = false, iconStart, iconEnd, className, children, onClick, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  const inert = disabled || loading;
  return (
    <Comp
      data-slot="button"
      data-tone={tone ?? 'ink'}
      data-size={size ?? 'md'}
      aria-busy={loading || undefined}
      disabled={asChild ? undefined : disabled}
      aria-disabled={asChild && inert ? true : undefined}
      className={cn(buttonVariants({ tone, shape, size }), className)}
      onClick={inert ? undefined : onClick}
      {...props}
    >
      {loading ? (
        <span data-slot="button-spinner" className="inline-flex"><LoaderCircle className="animate-spinner" aria-hidden /></span>
      ) : iconStart ? (
        <span data-slot="button-icon" className="inline-flex">{iconStart}</span>
      ) : null}
      {children}
      {iconEnd ? <span data-slot="button-icon" className="inline-flex">{iconEnd}</span> : null}
    </Comp>
  );
}
