'use client';
import { Check, CircleAlert } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { FieldContext } from './field-context.ts';

export interface FieldProps extends Omit<ComponentProps<'div'>, 'children'> {
  label?: ReactNode;
  hint?: ReactNode;
  /** Icon before the hint text. Success and error add their own icon. */
  hintIcon?: ReactNode;
  /** Error message with a circle-alert icon. Marks the control invalid and replaces the hint. */
  error?: ReactNode;
  /** Success message with a check icon. Replaces the hint; ignored when error is set. */
  success?: ReactNode;
  required?: boolean;
  /** Shows “Optional” next to the label. */
  optional?: boolean;
  /** Trailing label-row content, e.g. a character count. */
  count?: ReactNode;
  /** Colours the count as an error when the limit is exceeded. */
  overLimit?: boolean;
  /** Group mode for multi-control fields (OTP cells, radios): role="group", labelled by the label; no control id wiring. */
  group?: boolean;
  disabled?: boolean;
  /** Control id; generated when omitted. */
  controlId?: string;
  children?: ReactNode;
}

const message = 'inline-flex items-center gap-1.25 text-hint';
const icon = 'inline-flex size-chip-icon shrink-0 [&_svg]:size-full [&_svg]:stroke-[1.75]';

export function Field({ label, hint, hintIcon, error, success, required = false, optional = false, count, overLimit = false, group = false, disabled = false, controlId, className, children, ...props }: FieldProps) {
  const auto = useId();
  const id = controlId ?? `field-${auto}`;
  const labelId = `${id}-label`;
  const showSuccess = !error && !!success;
  const messageId = error ? `${id}-error` : showSuccess ? `${id}-success` : hint ? `${id}-hint` : undefined;
  const wire = { describedBy: group ? undefined : messageId, invalid: !!error, disabled, required };
  return (
    <FieldContext.Provider value={group ? wire : { id, ...wire }}>
      <div
        data-slot="field"
        role={group ? 'group' : undefined}
        aria-labelledby={group && label ? labelId : undefined}
        aria-describedby={group ? messageId : undefined}
        className={cn('grid min-w-0 gap-1.5', className)}
        {...props}
      >
        {(label || count) && (
          <div className="flex items-baseline justify-between gap-2">
            {label && (
              group
                ? <span data-slot="field-label" id={labelId} className="inline-flex items-center gap-1 text-ui-sm text-text-secondary">{label}{marks(required, optional)}</span>
                : <label data-slot="field-label" id={labelId} htmlFor={id} className="inline-flex items-center gap-1 text-ui-sm text-text-secondary">{label}{marks(required, optional)}</label>
            )}
            {count && <span data-slot="field-count" className={cn('text-hint tabular-nums text-text-tertiary', overLimit && 'text-danger-text')}>{count}</span>}
          </div>
        )}
        {children}
        {error ? (
          <span data-slot="field-error" id={`${id}-error`} className={cn(message, 'text-danger-text')}><span data-slot="field-icon" aria-hidden className={icon}><CircleAlert /></span>{error}</span>
        ) : showSuccess ? (
          <span data-slot="field-success" id={`${id}-success`} className={cn(message, 'text-success-text')}><span data-slot="field-icon" aria-hidden className={icon}><Check /></span>{success}</span>
        ) : hint ? (
          <span data-slot="field-hint" id={`${id}-hint`} className={cn(message, 'text-text-tertiary')}>{hintIcon != null && <span data-slot="field-icon" aria-hidden className={icon}>{hintIcon}</span>}{hint}</span>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

function marks(required: boolean, optional: boolean) {
  return (
    <>
      {required && <span data-slot="field-required-mark" aria-hidden className="text-ui-sm font-semibold text-danger-text">*</span>}
      {optional && <span data-slot="field-optional-mark" className="text-hint text-text-tertiary">Optional</span>}
    </>
  );
}
