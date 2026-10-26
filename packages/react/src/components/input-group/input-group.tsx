'use client';
import { useRef, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFieldContext } from '../field/field-context.ts';
import { inputGroupVariants, type InputGroupVariantProps } from './input-group.variants.ts';

export interface InputGroupProps extends Omit<ComponentProps<'input'>, 'size' | 'value' | 'defaultValue'>, InputGroupVariantProps {
  /** Leading add-on content, e.g. "https://". */
  start?: ReactNode;
  /** Trailing add-on content, e.g. ".co". */
  end?: ReactNode;
  invalid?: boolean;
  value?: string;
  defaultValue?: string;
  /** Called with the new string value on every edit. */
  onValueChange?: (value: string) => void;
  /** Class names for the outer container. */
  containerClassName?: string;
}

// Add-ons are raised segments set off by a subtle divider; in a disabled group they go flat, the text and divider take the disabled axis.
const addon = 'flex shrink-0 items-center whitespace-nowrap border-border-subtle bg-surface-raised px-3 text-ui text-text-tertiary in-data-[disabled]:border-disabled-border in-data-[disabled]:bg-transparent in-data-[disabled]:text-disabled-text';

export function InputGroup({ size, start, end, invalid, disabled, value, defaultValue = '', id, onChange, onValueChange, className, containerClassName, ...props }: InputGroupProps) {
  const field = useFieldContext();
  const ref = useRef<HTMLInputElement>(null);
  const [text, setText] = useControllableState<string>({ value, defaultValue, onChange: onValueChange });
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isDisabled = disabled ?? field?.disabled ?? false;
  return (
    <div
      data-slot="input-group"
      data-size={size ?? 'md'}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      aria-disabled={isDisabled || undefined}
      className={cn(inputGroupVariants({ size }), containerClassName)}
      onMouseDown={e => { if (e.target !== ref.current && !(e.target as HTMLElement).closest('button,a,input,select,textarea,[role=button]')) { e.preventDefault(); ref.current?.focus(); } }}
    >
      {start != null && <span data-slot="input-group-start" className={cn(addon, 'border-e')}>{start}</span>}
      <input
        ref={ref}
        data-slot="input-group-control"
        id={id ?? field?.id}
        aria-invalid={isInvalid || undefined}
        aria-describedby={field?.describedBy}
        aria-required={field?.required || undefined}
        disabled={isDisabled}
        className={cn('min-w-0 flex-1 border-0 bg-transparent px-3 text-text-primary outline-none placeholder:text-text-placeholder disabled:text-disabled-text disabled:placeholder:text-disabled-text', className)}
        {...props}
        value={text}
        onChange={e => { onChange?.(e); setText(e.target.value); }}
      />
      {end != null && <span data-slot="input-group-end" className={cn(addon, 'border-s')}>{end}</span>}
    </div>
  );
}
