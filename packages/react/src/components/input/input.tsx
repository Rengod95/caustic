'use client';
import { useRef, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Variant } from '../../lib/common-props.ts';
import { useFieldContext } from '../field/field-context.ts';
import { inputAddonVariants, inputFrameVariants, inputPrefixVariants, inputSuffixClass, inputVariants } from './input.variants.ts';

export type InputVariant = Variant | 'sunken';

export interface InputProps extends Omit<ComponentProps<'input'>, 'size' | 'prefix'>, Omit<CommonProps, 'variant'> {
  /** Field emphasis: outline (default), soft, solid, ghost, or sunken (the 32px inspector well). */
  variant?: InputVariant;
  /** @deprecated use variant: "default" is variant="outline", "sunken" is variant="sunken". */
  appearance?: 'default' | 'sunken';
  /** Leading content: an icon or a short text such as "$". */
  prefix?: ReactNode;
  /** Trailing content: a unit, a clear button or a Kbd hint. */
  suffix?: ReactNode;
  /** Add-on mode: prefix and suffix become full-height segments set off by a hairline divider ("https://" … ".co"), for a fixed scheme, host or unit the user must not retype. */
  addons?: boolean | undefined;
  invalid?: boolean;
  /** Called with the new string value on every edit. */
  onValueChange?: ((value: string) => void) | undefined;
  /** Class names for the outer field container. */
  containerClassName?: string;
}

export function Input({ size, tone, variant: variantProp, appearance, radius, shadow, prefix, suffix, addons = false, invalid, disabled, readOnly, id, onChange, onValueChange, className, containerClassName, ...props }: InputProps) {
  const field = useFieldContext();
  const ref = useRef<HTMLInputElement>(null);
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isDisabled = disabled ?? field?.disabled ?? false;
  // Deprecated alias: appearance default / sunken → variant outline / sunken.
  const variant = variantProp ?? (appearance === 'sunken' ? 'sunken' : appearance === 'default' ? 'outline' : undefined);
  return (
    <div
      data-slot="input"
      data-size={size ?? 'md'}
      data-variant={variant ?? 'outline'}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      data-readonly={readOnly || undefined}
      aria-disabled={isDisabled || undefined}
      className={cn(inputVariants({ tone, variant, size, addons }), inputFrameVariants({ radius, shadow }), containerClassName)}
      // A press focuses the control; an add-on may hold its own control (a Copy button), which keeps its press.
      onMouseDown={e => { if (e.target !== ref.current && !(addons && (e.target as HTMLElement).closest('button,a,input,select,textarea,[role=button]'))) { e.preventDefault(); ref.current?.focus(); } }}
    >
      {prefix != null && <span data-slot="input-prefix" className={addons ? cn(inputAddonVariants({ side: 'start', size })) : inputPrefixVariants({ variant })}>{prefix}</span>}
      <input
        ref={ref}
        data-slot="input-control"
        id={id ?? field?.id}
        aria-invalid={isInvalid || undefined}
        aria-describedby={field?.describedBy}
        aria-required={field?.required || undefined}
        disabled={isDisabled}
        readOnly={readOnly}
        className={cn('h-full w-full min-w-0 flex-1 border-0 bg-transparent px-0.5 text-text-primary outline-none placeholder:text-text-placeholder in-data-[readonly]:not-disabled:text-text-secondary disabled:text-disabled-text disabled:placeholder:text-disabled-text', addons && 'px-3', className)}
        onChange={e => { onChange?.(e); onValueChange?.(e.target.value); }}
        {...props}
      />
      {suffix != null && <span data-slot="input-suffix" className={addons ? cn(inputAddonVariants({ side: 'end', size })) : inputSuffixClass}>{suffix}</span>}
    </div>
  );
}
