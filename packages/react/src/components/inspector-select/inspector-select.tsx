'use client';
import { Slot } from '@radix-ui/react-slot';
import { ChevronDown } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { inspectorSelectVariants } from './inspector-select.variants.ts';

export interface InspectorSelectProps extends ComponentProps<'button'> {
  /** Content before the value. */
  leading?: ReactNode;
  /** Mirrors the popup state: aria-expanded and data-state="open". */
  open?: boolean;
  /** Render the child element (a Radix Trigger) with trigger styling. */
  asChild?: boolean;
  /** The chosen value is not valid: aria-invalid and the danger border-strong edge (kept next to the focus ring). */
  invalid?: boolean;
}

/** The sunken select trigger of an inspector row. It carries no popup logic. */
export function InspectorSelect({ leading, open = false, disabled = false, invalid = false, asChild = false, className, children, type, ...props }: InspectorSelectProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      data-slot="inspector-select"
      data-state={open ? 'open' : 'closed'}
      type={asChild ? undefined : (type ?? 'button')}
      aria-expanded={open}
      aria-haspopup={props['aria-haspopup'] ?? 'listbox'}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      data-invalid={invalid || undefined}
      className={cn(inspectorSelectVariants(), className)}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        {leading != null && <span data-slot="inspector-select-leading" aria-hidden="true" className="inline-flex shrink-0 items-center [&_svg]:size-icon-sm">{leading}</span>}
        <span data-slot="inspector-select-value" className="min-w-0 truncate">{children}</span>
      </span>
      <span data-slot="inspector-select-indicator" aria-hidden="true" className="inline-flex shrink-0 items-center [&_svg]:size-icon-sm"><ChevronDown /></span>
    </Comp>
  );
}
