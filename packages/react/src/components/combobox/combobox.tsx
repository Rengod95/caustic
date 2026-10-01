'use client';
import * as Popover from '@radix-ui/react-popover';
import { Search } from 'lucide-react';
import { Children, isValidElement, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Input, type InputProps } from '../input/input.tsx';
import { menuItemVariants, menuSurfaceVariants } from '../menu/menu.variants.ts';
import { comboboxEmptyVariants, comboboxListboxVariants, comboboxMetaVariants } from './combobox.variants.ts';

export interface ComboboxOptionData { value: string; label: string; meta?: string; leading?: ReactNode }
export interface ComboboxOptionProps extends ComboboxOptionData { disabled?: boolean }

/** Declarative option. It renders nothing itself: Combobox reads its props, so it can filter and highlight. */
export function ComboboxOption(_props: ComboboxOptionProps): null { return null; }

export interface ComboboxProps extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'onValueChange' | 'children' | 'size' | 'appearance' | 'prefix' | 'suffix'> {
  /** Controlled chosen option value. */
  value?: string;
  defaultValue?: string;
  /** Controlled text of the input. */
  inputValue?: string;
  defaultInputValue?: string;
  /** Controlled list visibility. Defaults to open while the input is focused and the text is not empty. */
  open?: boolean;
  defaultOpen?: boolean;
  /** Data-driven options; or pass ComboboxOption children. */
  options?: ComboboxOptionData[];
  /** Defaults to a case-insensitive substring match. */
  filter?: (label: string, query: string) => boolean;
  /** Shown when nothing matches. */
  emptyMessage?: ReactNode;
  /** Render the listbox in place under the input (in flow), without portal or positioning. */
  inline?: boolean;
  /** Fixtures: the first option is the chosen one. */
  selected?: boolean;
  onValueChange?: (value: string) => void;
  onInputValueChange?: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

const defaultFilter = (label: string, query: string) => label.toLowerCase().includes(query.trim().toLowerCase());

function highlight(label: string, query: string) {
  const q = query.trim();
  const at = q ? label.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (at < 0) return label;
  return (
    <>
      {label.slice(0, at)}
      <mark data-slot="combobox-match" className="bg-transparent font-semibold text-accent-text">{label.slice(at, at + q.length)}</mark>
      {label.slice(at + q.length)}
    </>
  );
}

/** Chooses from a long list by typing. A search Input filters a thick-glass listbox. */
export function Combobox({
  value, defaultValue, inputValue, defaultInputValue, open, defaultOpen, options, filter = defaultFilter, emptyMessage, inline = false, selected,
  onValueChange, onInputValueChange, onOpenChange, className, children, onKeyDown, onFocus, onBlur, 'aria-label': ariaLabel, ...props
}: ComboboxProps) {
  const [val, setVal] = useControllableState<string>({ value, defaultValue: defaultValue ?? '', onChange: onValueChange });
  const [text, setText] = useControllableState<string>({ value: inputValue, defaultValue: defaultInputValue ?? '', onChange: onInputValueChange });
  // null = automatic (open while the input is focused and has text; always while it has text when inline).
  const [manual, setManual] = useState<boolean | null>(defaultOpen ?? null);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const declared: ComboboxOptionData[] = [
    ...(options ?? []),
    ...Children.toArray(children).flatMap(c => (isValidElement(c) && c.type === ComboboxOption ? [c.props as ComboboxOptionProps] : [])),
  ];
  const matches = declared.filter(o => filter(o.label, text));
  const auto = (inline || focused) && text !== '';
  const wanted = open ?? manual ?? auto;
  const showList = wanted && (matches.length > 0 || emptyMessage != null);
  const focusInput = () => rootRef.current?.querySelector<HTMLInputElement>('input')?.focus();
  const optionId = (i: number) => `${listId}-${i}`;

  const setOpen = (next: boolean) => {
    if (next !== wanted) onOpenChange?.(next);
    setManual(next);
  };
  const choose = (o: ComboboxOptionData) => {
    setVal(o.value);
    setText(o.label);
    setActive(-1);
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const n = matches.length;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (n === 0) return;
      e.preventDefault();
      if (!showList) setOpen(true);
      setActive(a => (e.key === 'ArrowDown' ? (a + 1) % n : (a <= 0 ? n - 1 : a - 1)));
    } else if (e.key === 'Enter') {
      const o = showList ? matches[active] : undefined;
      if (o) { e.preventDefault(); choose(o); }
    } else if (e.key === 'Escape') {
      if (showList) { e.preventDefault(); setOpen(false); } else if (text !== '') { e.preventDefault(); setText(''); }
    } else if (e.key === 'Tab') {
      if (showList) setOpen(false);
    }
  };

  const listbox = showList && (
    <div
      id={listId} role="listbox" aria-label={ariaLabel ?? 'Results'} data-slot="combobox-listbox"
      className={cn(menuSurfaceVariants(), comboboxListboxVariants())}
    >
      {matches.length === 0
        ? <div role="option" aria-disabled="true" aria-selected="false" data-slot="combobox-empty" className={comboboxEmptyVariants()}>{emptyMessage}</div>
        : matches.map((o, i) => {
          const chosen = o.value === val && val !== '' ? true : (selected === true && i === 0 && val === '');
          const disabled = (o as ComboboxOptionProps).disabled === true;
          return (
            <button
              key={o.value} id={optionId(i)} type="button" role="option" tabIndex={-1} aria-selected={chosen} aria-disabled={disabled || undefined}
              data-slot="combobox-option" data-selected={chosen ? '' : undefined} data-highlighted={active === i ? '' : undefined} data-disabled={disabled ? '' : undefined}
              className={cn('group', menuItemVariants())}
              onMouseDown={e => e.preventDefault()}
              onMouseMove={() => setActive(i)}
              onClick={() => { if (!disabled) { choose(o); focusInput(); } }}
            >
              {o.leading != null && <span data-slot="combobox-leading" aria-hidden="true" className="inline-flex shrink-0 items-center text-text-tertiary [&_svg]:size-icon-md">{o.leading}</span>}
              <span data-slot="combobox-label" className="min-w-0 truncate">{highlight(o.label, text)}</span>
              {o.meta != null && <span data-slot="combobox-meta" className={comboboxMetaVariants()}>{o.meta}</span>}
            </button>
          );
        })}
    </div>
  );

  return (
    <div
      ref={rootRef} data-slot="combobox" tabIndex={-1}
      className={cn('grid min-w-0 gap-1.5 outline-none', className)}
      onFocus={e => { if (e.target === e.currentTarget) focusInput(); }}
    >
      <Popover.Root open={!inline && showList} onOpenChange={next => { if (!next) setOpen(false); }}>
        <Popover.Anchor asChild>
          <div>
            <Input
              prefix={<Search className="size-icon-sm" />} autoComplete="off" aria-label={ariaLabel}
              role="combobox" aria-expanded={showList} aria-controls={showList ? listId : undefined} aria-autocomplete="list"
              aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
              value={text}
              onValueChange={v => { setText(v); setActive(-1); setManual(true); }}
              onKeyDown={handleKeyDown}
              onFocus={e => { setFocused(true); onFocus?.(e); }}
              onBlur={e => { setFocused(false); if (!inline) setManual(null); onBlur?.(e); }}
              {...props}
            />
          </div>
        </Popover.Anchor>
        {inline ? listbox : (
          <Popover.Portal>
            <Popover.Content
              side="bottom" align="start" sideOffset={6} className="z-60 w-[var(--radix-popover-trigger-width)] outline-none"
              onOpenAutoFocus={e => e.preventDefault()} onCloseAutoFocus={e => e.preventDefault()}
              onEscapeKeyDown={e => e.preventDefault()}
              onInteractOutside={e => { if (rootRef.current?.contains(e.target as Node)) e.preventDefault(); }}
            >
              {listbox}
            </Popover.Content>
          </Popover.Portal>
        )}
      </Popover.Root>
      <span role="status" aria-live="polite" className="sr-only">{showList ? `${matches.length} results` : ''}</span>
    </div>
  );
}
