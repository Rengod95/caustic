'use client';
import { useRef, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useFieldContext } from '../field/field-context.ts';
import { inputPrefixVariants, inputSuffixClass, inputVariants, type InputVariantProps } from './input.variants.ts';

export interface InputProps extends Omit<ComponentProps<'input'>, 'size' | 'prefix'>, InputVariantProps {
  /** Leading content: an icon or a short text such as "$". */
  prefix?: ReactNode;
  /** Trailing content: a unit, a clear button or a Kbd hint. */
  suffix?: ReactNode;
  invalid?: boolean;
  /** Called with the new string value on every edit. */
  onValueChange?: (value: string) => void;
  /** Class names for the outer field container. */
  containerClassName?: string;
}

export function Input({ size, appearance, prefix, suffix, invalid, disabled, readOnly, id, onChange, onValueChange, className, containerClassName, ...props }: InputProps) {
  const field = useFieldContext();
  const ref = useRef<HTMLInputElement>(null);
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isDisabled = disabled ?? field?.disabled ?? false;
  return (
    <div
      data-slot="input"
      data-size={size ?? 'md'}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      data-readonly={readOnly || undefined}
      aria-disabled={isDisabled || undefined}
      className={cn(inputVariants({ size, appearance }), containerClassName)}
      onMouseDown={e => { if (e.target !== ref.current) { e.preventDefault(); ref.current?.focus(); } }}
    >
      {prefix != null && <span data-slot="input-prefix" className={inputPrefixVariants({ appearance })}>{prefix}</span>}
      <input
        ref={ref}
        data-slot="input-control"
        id={id ?? field?.id}
        aria-invalid={isInvalid || undefined}
        aria-describedby={field?.describedBy}
        aria-required={field?.required || undefined}
        disabled={isDisabled}
        readOnly={readOnly}
        className={cn('h-full w-full min-w-0 flex-1 border-0 bg-transparent px-0.5 text-text-primary outline-none placeholder:text-text-placeholder in-data-[readonly]:text-text-secondary', className)}
        onChange={e => { onChange?.(e); onValueChange?.(e.target.value); }}
        {...props}
      />
      {suffix != null && <span data-slot="input-suffix" className={inputSuffixClass}>{suffix}</span>}
    </div>
  );
}
