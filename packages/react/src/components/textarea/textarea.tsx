'use client';
import { type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { useFieldContext } from '../field/field-context.ts';
import { textareaControlVariants, textareaVariants } from './textarea.variants.ts';

export interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'size' | 'value' | 'defaultValue'>, CommonProps {
  value?: string;
  defaultValue?: string;
  invalid?: boolean;
  /** Footer toolbar content (icon buttons). */
  actions?: ReactNode;
  /** Footer submit control. */
  submit?: ReactNode;
  /** Called with the new string value on every edit. */
  onValueChange?: (value: string) => void;
  /** Class names for the outer container. */
  containerClassName?: string;
}

/** Multi-line text entry. The container owns the fill, edge and focus edge. Enter inserts a line break. */
export function Textarea({ tone, variant, radius, shadow, size, rows = 3, invalid, disabled, readOnly, actions, submit, id, onChange, onValueChange, className, containerClassName, ...props }: TextareaProps) {
  const field = useFieldContext();
  const isInvalid = invalid ?? field?.invalid ?? false;
  const isDisabled = disabled ?? field?.disabled ?? false;
  return (
    <div
      data-slot="textarea"
      data-size={size ?? 'md'}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      data-readonly={readOnly || undefined}
      className={cn(textareaVariants({ tone, variant, size, radius, shadow }), containerClassName)}
    >
      <textarea
        data-slot="textarea-control"
        id={id ?? field?.id}
        rows={rows}
        aria-invalid={isInvalid || undefined}
        aria-describedby={field?.describedBy}
        aria-required={field?.required || undefined}
        disabled={isDisabled}
        readOnly={readOnly}
        className={cn(textareaControlVariants({ size }), className)}
        onChange={e => { onChange?.(e); onValueChange?.(e.target.value); }}
        {...props}
      />
      {(actions != null || submit != null) && (
        <div data-slot="textarea-footer" className="flex items-center justify-between pb-2 pl-3 pr-2 pt-1.5">
          <div data-slot="textarea-actions" className="flex items-center gap-0.5">{actions}</div>
          {submit != null && <span data-slot="textarea-submit" className="inline-flex">{submit}</span>}
        </div>
      )}
    </div>
  );
}
