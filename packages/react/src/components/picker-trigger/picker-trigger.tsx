'use client';
import { Slot } from '@radix-ui/react-slot';
import { ChevronDown, ChevronsUpDown } from '../../icons/index.ts';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { pickerTriggerFrameVariants, pickerTriggerVariants } from './picker-trigger.variants.ts';

export interface PickerTriggerProps extends Omit<ComponentProps<'button'>, 'placeholder'>, CommonProps {
  /** select = chevrons-up-down, dropdown = chevron-down. */
  indicator?: 'select' | 'dropdown';
  /** Content before the value. */
  leading?: ReactNode;
  /** Shown, in the placeholder color, when there are no children. */
  placeholder?: ReactNode;
  /** Mirrors the popup state: aria-expanded and data-state="open". */
  open?: boolean;
  invalid?: boolean | undefined;
  /** Render the child element (a Radix Trigger) with trigger styling. */
  asChild?: boolean;
}

/**
 * The field-looking button that opens a picker. It carries no popup logic. variant="soft" is the inspector appearance
 * (the sunken 32px well of an inspector row; was InspectorSelect).
 */
export function PickerTrigger({ tone, variant, radius, shadow, size, indicator = 'select', leading, placeholder, open = false, invalid, disabled, asChild = false, id, className, children, type, ...props }: PickerTriggerProps) {
  const Comp = asChild ? Slot : 'button';
  const Indicator = indicator === 'dropdown' ? ChevronDown : ChevronsUpDown;
  const hasValue = children != null && children !== false && children !== '';
  return (
    <Comp
      data-slot="picker-trigger"
      data-state={open ? 'open' : 'closed'}
      data-invalid={invalid || undefined}
      type={asChild ? undefined : (type ?? 'button')}
      id={id}
      aria-expanded={open}
      aria-haspopup={props['aria-haspopup'] ?? 'listbox'}
      aria-invalid={invalid || undefined}
      disabled={disabled}
      className={cn(pickerTriggerVariants({ tone, variant, size }), pickerTriggerFrameVariants({ radius, shadow }), className)}
      {...props}
    >
      {leading != null && <span data-slot="picker-trigger-leading" aria-hidden="true" className="inline-flex shrink-0 items-center text-text-tertiary [&_svg]:size-icon-md">{leading}</span>}
      {hasValue
        ? <span data-slot="picker-trigger-value" className="min-w-0 flex-1 truncate">{children}</span>
        : <span data-slot="picker-trigger-placeholder" className="min-w-0 flex-1 truncate text-text-placeholder">{placeholder}</span>}
      <span data-slot="picker-trigger-indicator" aria-hidden="true" className={cn('inline-flex shrink-0 items-center text-text-tertiary [&_svg]:size-icon-sm', indicator === 'dropdown' && 'transition-[rotate] duration-snappy ease-snappy group-data-[state=open]:rotate-180')}><Indicator /></span>
    </Comp>
  );
}
