'use client';
import { ArrowUp, ChevronDown, Plus } from '../../icons/index.ts';
import { Children, isValidElement, useRef, useState, type ComponentProps, type FormEvent, type KeyboardEvent, type MouseEvent, type ReactNode, type Ref } from 'react';
import { cn } from '../../lib/cn.ts';
import { radiusClass, type CommonProps } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFlip } from '../../hooks/use-flip.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import {
  composerBarVariants, composerContextVariants, composerInputVariants, composerModelVariants, composerStopVariants, composerSwapGlyphVariants, composerUsageVariants,
  composerVariants,
} from './composer.variants.ts';

const NO_MODES: string[] = [];
const RING_C = 50.27;
const USAGE_WARNING = 80;
const USAGE_DANGER = 95;

/**
 * Common props (lib/common-props.ts): variant = box surface (default solid: regular floating material), tone = usage
 * ring arc below 80% (default accent; above 80% warning, above 95% danger), size = padding, gap and text (default md), radius = corners (default 2xl), shadow =
 * elevation (default 3, kept under the focus ring).
 */
export interface ComposerProps extends Omit<ComponentProps<'form'>, 'onSubmit' | 'defaultValue' | 'children'>, CommonProps {
  /** Controlled text. */
  value?: string;
  /** Uncontrolled initial text. */
  defaultValue?: string;
  /** Placeholder text; no built-in default. */
  placeholder?: string | undefined;
  rows?: number | undefined;
  /** Passed to the textarea. */
  maxLength?: number | undefined;
  /** Ref to the native textarea. */
  inputRef?: Ref<HTMLTextAreaElement> | undefined;
  /** aria-label of the textarea. */
  inputLabel: string;
  /** aria-label of the send control. */
  sendLabel: string;
  /** aria-label of the stop control; required whenever running can be true. */
  stopLabel?: string | undefined;
  /** aria-label of the attach button; required with onAttach. */
  attachLabel?: string | undefined;
  /** aria-label of the mode control; required when modes is not empty. */
  modeLabel?: string | undefined;
  /** aria-label of the usage ring from the rounded percentage; required with usage. */
  usageLabel?: ((percent: number) => string) | undefined;
  /** Disables send and Enter submission only. */
  sendDisabled?: boolean | undefined;
  /** Context Chips shown above the text. */
  context?: ReactNode;
  /** Optional mode labels (e.g. Ask / Plan / Build). Omitted or [] hides the control (the default composition has none). */
  modes?: string[];
  /** Controlled mode. */
  mode?: string;
  /** Uncontrolled mode. */
  defaultMode?: string;
  /** Text of the model trigger. */
  modelLabel?: ReactNode;
  /** Context used, 0-100. Shows the ring; above 80 the arc turns warning, above 95 danger. */
  usage?: number;
  /** The agent is working: send becomes stop and Enter does not submit. */
  running?: boolean;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  /** Called with the trimmed text. */
  onSubmit?: (value: string) => void;
  onStop?: () => void;
  onModeChange?: (mode: string) => void;
  /** Shows the attach IconButton. */
  onAttach?: () => void;
  onModelClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** The agent prompt box. Enter sends, Shift+Enter breaks the line, IME composition never submits. */
export function Composer({
  value, defaultValue = '', placeholder, rows = 3, maxLength, inputRef: inputRefProp, inputLabel, sendLabel, stopLabel, attachLabel, modeLabel, usageLabel,
  sendDisabled = false, context, modes = NO_MODES,
  mode, defaultMode, modelLabel, usage, running = false, disabled = false,
  onValueChange, onSubmit, onStop, onModeChange, onAttach, onModelClick, tone, variant, radius, shadow, size, className, onClick, ...props
}: ComposerProps) {
  const [text, setText] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const [currentMode, setMode] = useControllableState({ value: mode, defaultValue: defaultMode ?? '', onChange: onModeChange });
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Context rows are keyed by their element key (index when unkeyed). Rows added after mount rise in; the rest glide to their new place.
  const contextRef = useRef<HTMLDivElement>(null);
  const contextRows = Children.toArray(context);
  const rowKey = (child: ReactNode, i: number) => (isValidElement(child) && child.key !== null ? String(child.key) : String(i));
  const [initialKeys] = useState(() => new Set(contextRows.map(rowKey)));
  useFlip(contextRef, '[data-slot=composer-context-row]', 'contextRow');

  const submit = () => {
    const trimmed = text.trim();
    if (running || disabled || sendDisabled || trimmed === '') return;
    onSubmit?.(trimmed);
    if (value === undefined) setText('');
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    e.preventDefault();
    submit();
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); if (!running) submit(); };
  const handleClick = (e: MouseEvent<HTMLFormElement>) => {
    onClick?.(e);
    if (!(e.target as HTMLElement).closest('button, textarea, input, [role="radio"], [role="radiogroup"]')) inputRef.current?.focus();
  };
  const setInput = (el: HTMLTextAreaElement | null) => {
    inputRef.current = el;
    if (typeof inputRefProp === 'function') inputRefProp(el);
    else if (inputRefProp) inputRefProp.current = el;
  };
  const pct = usage === undefined ? 0 : Math.min(100, Math.max(0, usage));
  // A nearly full context window warns: the arc turns warning above 80% and danger above 95%, whatever the tone.
  const usageTone = pct > USAGE_DANGER ? 'danger' : pct > USAGE_WARNING ? 'warning' : tone;

  return (
    <form
      data-slot="composer" data-disabled={disabled || undefined} data-running={running || undefined}
      className={cn(composerVariants({ variant, shadow, size }), radius && radius !== '2xl' && radiusClass[radius], className)}
      onSubmit={handleSubmit} onClick={handleClick} {...props}
    >
      {context != null && (
        <div ref={contextRef} data-slot="composer-context" inert={disabled || undefined} className={composerContextVariants()}>
          {contextRows.map((child, i) => {
            const key = rowKey(child, i);
            return <div key={key} data-slot="composer-context-row" data-context-row={key} className={cn('inline-flex', !initialKeys.has(key) && 'animate-rise')}>{child}</div>;
          })}
        </div>
      )}
      <textarea
        ref={setInput} data-slot="composer-input" aria-label={inputLabel} rows={rows} maxLength={maxLength} placeholder={placeholder}
        value={text} disabled={disabled} className={composerInputVariants({ inputSize: size })}
        onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown}
      />
      <div data-slot="composer-bar" className={composerBarVariants()}>
        {onAttach !== undefined && <IconButton data-slot="composer-attach" size="xs" label={attachLabel ?? ''} disabled={disabled} onClick={() => onAttach()}><Plus /></IconButton>}
        {modes.length > 0 && (
          <SegmentedControl data-slot="composer-mode" size="xs" aria-label={modeLabel} value={currentMode} onValueChange={setMode} disabled={disabled}>
            {modes.map(m => <SegmentedControlItem key={m} value={m}>{m}</SegmentedControlItem>)}
          </SegmentedControl>
        )}
        <span aria-hidden className="flex-1" />
        {modelLabel != null && (
          <button type="button" data-slot="composer-model" disabled={disabled} className={composerModelVariants()} onClick={onModelClick}>{modelLabel}<ChevronDown aria-hidden /></button>
        )}
        {usage !== undefined && (
          <svg data-slot="composer-usage" data-level={usageTone === 'danger' || usageTone === 'warning' ? usageTone : undefined} role="img" aria-label={usageLabel?.(Math.round(pct))} viewBox="0 0 22 22" className={composerUsageVariants({ usageTone })}>
            <circle cx="11" cy="11" r="8" className="stroke-neutral-track" />
            <circle cx="11" cy="11" r="8" transform="rotate(-90 11 11)" strokeLinecap="round" strokeDasharray={RING_C} strokeDashoffset={RING_C * (1 - pct / 100)} className="stroke-current transition-[stroke-dashoffset] duration-gentle ease-standard" />
          </svg>
        )}
        {/* One button for send and stop: the arrow and the stop square cross-fade in place (no layout shift, focus stays). */}
        <IconButton
          data-slot="composer-send" type={running ? 'button' : 'submit'} tone="ink" shape="circle" size="sm"
          label={running ? (stopLabel ?? '') : sendLabel} disabled={running ? disabled : disabled || sendDisabled}
          className={running ? composerStopVariants() : undefined} onClick={running ? () => onStop?.() : undefined}
        >
          <ArrowUp className={composerSwapGlyphVariants({ active: !running })} />
          <span aria-hidden className={cn('block size-stop-glyph rounded-2xs bg-current', composerSwapGlyphVariants({ active: running }))} />
        </IconButton>
      </div>
    </form>
  );
}
