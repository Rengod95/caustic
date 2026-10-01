'use client';
import { ArrowUp, ChevronDown, Plus } from 'lucide-react';
import { useRef, type ComponentProps, type FormEvent, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { composerInputVariants, composerModelVariants, composerStopVariants, composerVariants } from './composer.variants.ts';

const DEFAULT_MODES = ['Ask', 'Plan', 'Build'];
const RING_C = 50.27;

export interface ComposerProps extends Omit<ComponentProps<'form'>, 'onSubmit' | 'defaultValue' | 'children'> {
  /** Controlled text. */
  value?: string;
  /** Uncontrolled initial text. */
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
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
  value, defaultValue = '', placeholder = 'Ask Caustic to design, refine or explain…', rows = 3, context, modes = DEFAULT_MODES,
  mode, defaultMode, modelLabel, usage, running = false, disabled = false,
  onValueChange, onSubmit, onStop, onModeChange, onAttach, onModelClick, className, onClick, ...props
}: ComposerProps) {
  const [text, setText] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const [currentMode, setMode] = useControllableState({ value: mode, defaultValue: defaultMode ?? '', onChange: onModeChange });
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const submit = () => {
    const trimmed = text.trim();
    if (running || disabled || trimmed === '') return;
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
  const pct = usage === undefined ? 0 : Math.min(100, Math.max(0, usage));

  return (
    <form
      data-slot="composer" data-disabled={disabled || undefined} data-running={running || undefined}
      className={cn(composerVariants(), className)} onSubmit={handleSubmit} onClick={handleClick} {...props}
    >
      {context != null && <div data-slot="composer-context" className="flex flex-wrap gap-1.5">{context}</div>}
      <textarea
        ref={inputRef} data-slot="composer-input" aria-label="Message Caustic" rows={rows} placeholder={placeholder}
        value={text} disabled={disabled} className={composerInputVariants()}
        onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown}
      />
      <div data-slot="composer-bar" className="flex items-center gap-1">
        {onAttach !== undefined && <IconButton data-slot="composer-attach" size="xs" label="Add context" disabled={disabled} onClick={() => onAttach()}><Plus /></IconButton>}
        {modes.length > 0 && (
          <SegmentedControl data-slot="composer-mode" size="xs" aria-label="Mode" value={currentMode} onValueChange={setMode} disabled={disabled}>
            {modes.map(m => <SegmentedControlItem key={m} value={m}>{m}</SegmentedControlItem>)}
          </SegmentedControl>
        )}
        <span aria-hidden className="flex-1" />
        {modelLabel != null && (
          <button type="button" data-slot="composer-model" disabled={disabled} className={composerModelVariants()} onClick={onModelClick}>{modelLabel}<ChevronDown aria-hidden /></button>
        )}
        {usage !== undefined && (
          <svg data-slot="composer-usage" role="img" aria-label={`Context ${Math.round(pct)}%`} viewBox="0 0 22 22" className="size-usage-ring shrink-0 fill-none stroke-3">
            <circle cx="11" cy="11" r="8" className="stroke-fill-selected" />
            <circle cx="11" cy="11" r="8" transform="rotate(-90 11 11)" strokeLinecap="round" strokeDasharray={RING_C} strokeDashoffset={RING_C * (1 - pct / 100)} className="stroke-accent-solid" />
          </svg>
        )}
        {running ? (
          <IconButton data-slot="composer-send" tone="ink" shape="circle" size="sm" label="Stop" disabled={disabled} className={composerStopVariants()} onClick={() => onStop?.()}>
            <span aria-hidden className="block size-stop-glyph rounded-2xs bg-current" />
          </IconButton>
        ) : (
          <IconButton data-slot="composer-send" type="submit" tone="ink" shape="circle" size="sm" label="Send" disabled={disabled}><ArrowUp /></IconButton>
        )}
      </div>
    </form>
  );
}
