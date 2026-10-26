'use client';
import { ArrowUp, ChevronDown, Plus } from 'lucide-react';
import { useRef, type ComponentProps, type FormEvent, type KeyboardEvent, type MouseEvent, type ReactNode, type Ref } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { composerInputVariants, composerModelVariants, composerStopVariants, composerVariants } from './composer.variants.ts';

const NO_MODES: string[] = [];
const RING_C = 50.27;

export interface ComposerProps extends Omit<ComponentProps<'form'>, 'onSubmit' | 'defaultValue' | 'children'> {
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
  /** Mode labels; pass [] to hide the control. */
  modes?: string[];
  /** Controlled mode. */
  mode?: string;
  /** Uncontrolled mode. */
  defaultMode?: string;
  /** Text of the model trigger. */
  modelLabel?: ReactNode;
  /** Context used, 0-100. Shows the ring. */
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
  onValueChange, onSubmit, onStop, onModeChange, onAttach, onModelClick, className, onClick, ...props
}: ComposerProps) {
  const [text, setText] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const [currentMode, setMode] = useControllableState({ value: mode, defaultValue: defaultMode ?? '', onChange: onModeChange });
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  return (
    <form
      data-slot="composer" data-disabled={disabled || undefined} data-running={running || undefined}
      className={cn(composerVariants(), className)} onSubmit={handleSubmit} onClick={handleClick} {...props}
    >
      {context != null && <div data-slot="composer-context" inert={disabled || undefined} className="flex flex-wrap gap-1.5">{context}</div>}
      <textarea
        ref={setInput} data-slot="composer-input" aria-label={inputLabel} rows={rows} maxLength={maxLength} placeholder={placeholder}
        value={text} disabled={disabled} className={composerInputVariants()}
        onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown}
      />
      <div data-slot="composer-bar" className="flex items-center gap-1">
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
          <svg data-slot="composer-usage" role="img" aria-label={usageLabel?.(Math.round(pct))} viewBox="0 0 22 22" className="size-usage-ring shrink-0 fill-none stroke-3 text-accent-solid in-data-[disabled]:text-disabled-text">
            <circle cx="11" cy="11" r="8" className="stroke-neutral-track" />
            <circle cx="11" cy="11" r="8" transform="rotate(-90 11 11)" strokeLinecap="round" strokeDasharray={RING_C} strokeDashoffset={RING_C * (1 - pct / 100)} className="stroke-current" />
          </svg>
        )}
        {running ? (
          <IconButton data-slot="composer-send" tone="ink" shape="circle" size="sm" label={stopLabel ?? ''} disabled={disabled} className={composerStopVariants()} onClick={() => onStop?.()}>
            <span aria-hidden className="block size-stop-glyph rounded-2xs bg-current" />
          </IconButton>
        ) : (
          <IconButton data-slot="composer-send" type="submit" tone="ink" shape="circle" size="sm" label={sendLabel} disabled={disabled || sendDisabled}><ArrowUp /></IconButton>
        )}
      </div>
    </form>
  );
}
