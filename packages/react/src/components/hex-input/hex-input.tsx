'use client';
import { Link2 } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentProps, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { hexInputVariants } from './hex-input.variants.ts';

export interface HexInputProps extends Omit<ComponentProps<'label'>, 'defaultValue' | 'onChange'> {
  /** Hex digits without #, uppercase ("E2763F"). */
  value?: string;
  defaultValue?: string;
  /** Committed with Enter or blur when the value is 3, 4, 6 or 8 hex digits (uppercase). */
  onValueChange?: (value: string) => void;
  /** Token path the paint is bound to; replaces the input by the bound chip. */
  token?: string;
  /** Differing values in a multi-selection. */
  mixed?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  /** Names the input ("Hex", "Stroke color"). */
  'aria-label'?: string;
  /** Ids describing the input, e.g. an error message. */
  'aria-describedby'?: string;
}

const validHex = (v: string) => /^[0-9a-fA-F]+$/.test(v) && [3, 4, 6, 8].includes(v.length);
const clean = (v: string) => v.replace(/^#/, '').replace(/[^0-9a-fA-F]/g, '').slice(0, 8);

/** Hex digits editor in an uppercase mono field; also shows the bound, mixed and invalid paint states. */
export function HexInput({ value, defaultValue = '', onValueChange, token, mixed = false, invalid = false, disabled = false, className, 'aria-label': ariaLabel = 'Hex', 'aria-describedby': describedBy, ...props }: HexInputProps) {
  const [current, setCurrent] = useControllableState<string>({ value, defaultValue, onChange: v => onValueChange?.(v) });
  const [draft, setDraft] = useState(current);
  const editing = useRef(false);
  useEffect(() => { if (!editing.current) setDraft(current); }, [current]);
  const commit = () => {
    editing.current = false;
    if (validHex(draft)) setCurrent(draft.toUpperCase());
    else setDraft(current);
  };
  const keyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { editing.current = false; setDraft(current); }
  };
  const bound = token != null;
  return (
    <label data-slot="hex-input" data-bound={bound || undefined} data-invalid={invalid || undefined} data-mixed={mixed || undefined} data-disabled={disabled || undefined} className={cn(hexInputVariants(), className)} {...props}>
      {bound ? (
        <>
          <span data-slot="hex-input-icon" aria-hidden className="inline-grid size-icon-sm shrink-0 place-items-center text-accent-text [&_svg]:size-full [&_svg]:stroke-[1.75]"><Link2 /></span>
          <span data-slot="hex-input-token" className="min-w-0 truncate text-accent-text">{token}</span>
        </>
      ) : (
        <input
          data-slot="hex-input-control" type="text" spellCheck={false} autoComplete="off" disabled={disabled}
          aria-label={ariaLabel} aria-describedby={describedBy} aria-invalid={invalid || undefined}
          placeholder={mixed ? 'Mixed' : undefined}
          value={mixed && !editing.current ? '' : draft}
          onChange={e => { editing.current = true; setDraft(clean(e.target.value)); }}
          onKeyDown={keyDown}
          onBlur={() => { if (editing.current) commit(); }}
          className="h-full w-full min-w-0 flex-1 border-0 bg-transparent font-mono text-mono-md font-normal text-text-primary uppercase outline-none placeholder:text-text-secondary disabled:text-text-disabled"
        />
      )}
    </label>
  );
}
