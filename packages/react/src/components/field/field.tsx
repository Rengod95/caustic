'use client';
import { Check, CircleAlert, TriangleAlert } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { FieldContext } from './field-context.ts';
import { fieldHintVariants, fieldIconVariants, fieldLabelVariants, fieldMessageVariants, fieldVariants } from './field.variants.ts';

export interface FieldProps extends Omit<ComponentProps<'div'>, 'children'> {
  label?: ReactNode;
  hint?: ReactNode;
  /** Icon before the hint text. Success and error add their own icon. */
  hintIcon?: ReactNode;
  /** Error message with a circle-alert icon. Marks the control invalid and replaces the hint. */
  error?: ReactNode;
  /** Warning message with a triangle-alert icon. Replaces the hint without marking the control invalid; ignored when error is set. */
  warning?: ReactNode;
  /** Success message with a check icon. Replaces the hint; ignored when error or warning is set. */
  success?: ReactNode;
  required?: boolean;
  /** Shows “Optional” next to the label. */
  optional?: boolean;
  /** Text of the optional mark; required with optional. */
  optionalLabel?: string | undefined;
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
  /** Colour family of the hint (error, warning and success keep their own). */
  tone?: Tone | undefined;
  /** Emphasis of the hint; ghost (default) is the plain tertiary line, the others box it. */
  variant?: Variant | undefined;
  /** Corner radius of the root; unset = none. */
  radius?: Radius | undefined;
  /** Elevation of the root; unset = none. */
  shadow?: Shadow | undefined;
  /** Gap and label type step: xs and sm ui-xs, md ui-sm (default), lg ui; the control keeps its own size. */
  size?: Size | undefined;
}

const message = fieldMessageVariants();
const icon = fieldIconVariants();

export function Field({ label, hint, hintIcon, error, warning, success, required = false, optional = false, optionalLabel, count, overLimit = false, group = false, disabled = false, controlId, tone, variant, radius, shadow, size, className, children, ...props }: FieldProps) {
  const auto = useId();
  const id = controlId ?? `field-${auto}`;
  const labelId = `${id}-label`;
  const showWarning = !error && !!warning;
  const showSuccess = !error && !showWarning && !!success;
  const messageId = error ? `${id}-error` : showWarning ? `${id}-warning` : showSuccess ? `${id}-success` : hint ? `${id}-hint` : undefined;
  const wire = { describedBy: group ? undefined : messageId, invalid: !!error, disabled, required };
  return (
    <FieldContext.Provider value={group ? wire : { id, ...wire }}>
      <div
        data-slot="field"
        role={group ? 'group' : undefined}
        aria-labelledby={group && label ? labelId : undefined}
        aria-describedby={group ? messageId : undefined}
        className={cn(fieldVariants({ radius, shadow, size }), className)}
        {...props}
      >
        {(label || count) && (
          <div className="flex items-baseline justify-between gap-2">
            {label && (
              group
                ? <span data-slot="field-label" id={labelId} className={cn(fieldLabelVariants({ size }))}>{label}{marks(required, optional, optionalLabel)}</span>
                : <label data-slot="field-label" id={labelId} htmlFor={id} className={cn(fieldLabelVariants({ size }))}>{label}{marks(required, optional, optionalLabel)}</label>
            )}
            {count && <span data-slot="field-count" className={cn('text-hint tabular-nums text-text-tertiary transition-colors duration-quick ease-standard', overLimit && 'text-danger-text')}>{count}</span>}
          </div>
        )}
        {children}
        {error ? (
          <span data-slot="field-error" role="alert" id={`${id}-error`} className={cn(message, 'text-danger-text')}><span data-slot="field-icon" aria-hidden className={icon}><CircleAlert /></span>{error}</span>
        ) : showWarning ? (
          <span data-slot="field-warning" id={`${id}-warning`} className={cn(message, 'text-warning-text')}><span data-slot="field-icon" aria-hidden className={icon}><TriangleAlert /></span>{warning}</span>
        ) : showSuccess ? (
          <span data-slot="field-success" id={`${id}-success`} className={cn(message, 'text-success-text')}><span data-slot="field-icon" aria-hidden className={icon}><Check /></span>{success}</span>
        ) : hint ? (
          <span data-slot="field-hint" id={`${id}-hint`} className={cn(fieldHintVariants({ tone, variant }))}>{hintIcon != null && <span data-slot="field-icon" aria-hidden className={icon}>{hintIcon}</span>}{hint}</span>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

function marks(required: boolean, optional: boolean, optionalLabel: string | undefined) {
  return (
    <>
      {required && <span data-slot="field-required-mark" aria-hidden className="text-ui-sm font-semibold text-required-mark">*</span>}
      {optional && <span data-slot="field-optional-mark" className="text-hint text-text-tertiary">{optionalLabel}</span>}
    </>
  );
}
