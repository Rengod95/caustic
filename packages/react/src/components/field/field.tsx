'use client';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { FieldContext } from './field-context.ts';

export interface FieldProps extends Omit<ComponentProps<'div'>, 'children'> {
  label?: ReactNode;
  hint?: ReactNode;
  /** Error message. Marks the control invalid and replaces the hint. */
  error?: ReactNode;
  required?: boolean;
  /** Shows “Optional” next to the label. */
  optional?: boolean;
  /** Trailing label-row content, e.g. a character count. */
  count?: ReactNode;
  disabled?: boolean;
  /** Control id; generated when omitted. */
  controlId?: string;
  children?: ReactNode;
}

export function Field({ label, hint, error, required = false, optional = false, count, disabled = false, controlId, className, children, ...props }: FieldProps) {
  const auto = useId();
  const id = controlId ?? `field-${auto}`;
  const hintId = hint ? `${id}-hint` : undefined, errorId = error ? `${id}-error` : undefined;
  return (
    <FieldContext.Provider value={{ id, describedBy: errorId ?? hintId, invalid: !!error, disabled, required }}>
      <div data-slot="field" className={cn('grid min-w-0 gap-1.5', className)} {...props}>
        {(label || count) && (
          <div className="flex items-baseline justify-between gap-2">
            {label && (
              <label data-slot="field-label" htmlFor={id} className="inline-flex items-center gap-1 text-ui-sm text-text-secondary">
                {label}
                {required && <span aria-hidden className="text-danger-text">*</span>}
                {optional && <span className="text-hint text-text-tertiary">Optional</span>}
              </label>
            )}
            {count && <span data-slot="field-count" className="text-hint tabular-nums text-text-tertiary">{count}</span>}
          </div>
        )}
        {children}
        {error ? (
          <span data-slot="field-error" id={errorId} className="inline-flex items-center gap-1.5 text-hint text-danger-text [&_svg]:size-icon-xs">{error}</span>
        ) : hint ? (
          <span data-slot="field-hint" id={hintId} className="inline-flex items-center gap-1.5 text-hint text-text-tertiary [&_svg]:size-icon-xs">{hint}</span>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}
