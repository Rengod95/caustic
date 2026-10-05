'use client';
import { ChevronRight, CircleAlert } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Field } from '../field/field.tsx';
import { Select, SelectOption } from '../select/select.tsx';
import { Textarea } from '../textarea/textarea.tsx';
import {
  expressionEditorBindingVariants, expressionEditorChevronVariants, expressionEditorErrorVariants, expressionEditorHintVariants,
  expressionEditorPathVariants, expressionEditorToggleVariants, expressionEditorVariants,
} from './expression-editor.variants.ts';

export interface ExpressionEditorOption { value: string; label: string }

export interface ExpressionEditorBinding {
  id: string;
  /** Chosen source value, "" when none. */
  source: string;
  /** Chosen property value, "" when none. */
  property: string;
  /** Options of the property select for this source. */
  properties: ExpressionEditorOption[];
  /** Where in the composite value this reference sits. */
  path?: string | undefined;
}

export interface ExpressionEditorChange { index: number; source: string; property: string }

export interface ExpressionEditorProps extends Omit<ComponentProps<'div'>, 'children' | 'defaultValue'> {
  bindings: ExpressionEditorBinding[];
  sources: ExpressionEditorOption[];
  /** Controlled raw expression text. */
  raw?: string | undefined;
  defaultRaw?: string | undefined;
  /** Controlled disclosure state. */
  rawOpen?: boolean | undefined;
  defaultRawOpen?: boolean | undefined;
  /** Message for the raw expression: shows the error row and marks the textarea invalid. */
  error?: ReactNode;
  maxLength?: number | undefined;
  disabled?: boolean | undefined;
  hint?: ReactNode;
  sourceLabel: string;
  propertyLabel: string;
  sourcePlaceholder: string;
  sourceName: (index: number) => string;
  propertyName: (index: number) => string;
  /** Text of the disclosure trigger; the raw disclosure renders only when given. */
  rawToggleLabel?: string | undefined;
  /** aria-label of the raw textarea; required with rawToggleLabel. */
  rawLabel?: string | undefined;
  onBindingChange?: ((change: ExpressionEditorChange) => void) | undefined;
  onRawChange?: ((value: string) => void) | undefined;
  onRawOpenChange?: ((open: boolean) => void) | undefined;
}

/** Edits a token value made of references: a source and a property per reference, and an optional raw expression. */
export function ExpressionEditor({
  bindings, sources, raw, defaultRaw, rawOpen, defaultRawOpen, error, maxLength, disabled = false, hint,
  sourceLabel, propertyLabel, sourcePlaceholder, sourceName, propertyName, rawToggleLabel, rawLabel,
  onBindingChange, onRawChange, onRawOpenChange, className, ...props
}: ExpressionEditorProps) {
  const [text, setText] = useControllableState<string>({ value: raw, defaultValue: defaultRaw ?? '', onChange: onRawChange });
  const [open, setOpen] = useControllableState<boolean>({ value: rawOpen, defaultValue: defaultRawOpen ?? false, onChange: onRawOpenChange });
  const panelId = useId();
  const errorId = useId();
  const hasError = error != null && error !== false;
  return (
    <div data-slot="expression-editor" className={cn(expressionEditorVariants(), className)} {...props}>
      {hint != null && <p data-slot="expression-editor-hint" className={expressionEditorHintVariants()}>{hint}</p>}
      {bindings.map((b, index) => (
        <div key={b.id} data-slot="expression-editor-binding" role="group" className={expressionEditorBindingVariants()}>
          <div data-slot="expression-editor-source">
            <Field label={sourceLabel} disabled={disabled}>
              <Select
                aria-label={sourceName(index)} placeholder={sourcePlaceholder} value={b.source} disabled={disabled}
                onValueChange={source => onBindingChange?.({ index, source, property: '' })}
              >
                {sources.map(o => <SelectOption key={o.value} value={o.value}>{o.label}</SelectOption>)}
              </Select>
            </Field>
          </div>
          <div data-slot="expression-editor-property">
            <Field label={propertyLabel} disabled={disabled}>
              <Select
                aria-label={propertyName(index)} value={b.property} disabled={disabled}
                onValueChange={property => onBindingChange?.({ index, source: b.source, property })}
              >
                {b.properties.map(o => <SelectOption key={o.value} value={o.value}>{o.label}</SelectOption>)}
              </Select>
            </Field>
          </div>
          {b.path != null && <code data-slot="expression-editor-path" className={expressionEditorPathVariants()}>{b.path}</code>}
        </div>
      ))}
      {rawToggleLabel != null && (
        <div data-slot="expression-editor-raw" className="grid gap-1.5">
          <button
            type="button" data-slot="expression-editor-raw-toggle" aria-expanded={open} aria-controls={panelId} disabled={disabled}
            className={expressionEditorToggleVariants()} onClick={() => setOpen(!open)}
          >
            <ChevronRight aria-hidden className={expressionEditorChevronVariants({ open })} />
            {rawToggleLabel}
          </button>
          {open && (
            <div id={panelId} className="grid gap-1.5">
              <div data-slot="expression-editor-raw-input">
                <Textarea
                  rows={8} maxLength={maxLength} spellCheck={false} aria-label={rawLabel} className="font-mono text-mono"
                  value={text} invalid={hasError} disabled={disabled} aria-describedby={hasError ? errorId : undefined}
                  onValueChange={setText}
                />
              </div>
              {hasError && (
                <span data-slot="expression-editor-error" id={errorId} role="alert" className={expressionEditorErrorVariants()}>
                  <span aria-hidden className="inline-flex size-chip-icon shrink-0 [&_svg]:size-full [&_svg]:stroke-[1.75]"><CircleAlert /></span>
                  {error}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
