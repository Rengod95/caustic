'use client';
import { Check } from 'lucide-react';
import { Children, createContext, useContext, useId, useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { listHeadingVariants, listVariants } from '../list/list.variants.ts';
import {
  listSelectionDescriptionVariants, listSelectionIndicatorVariants, listSelectionRowVariants, listSelectionTickVariants, listSelectionTitleVariants,
  type ListSelectionVariantProps,
} from './list-selection.variants.ts';
import { listTextVariants } from '../list/list.variants.ts';

type Mode = NonNullable<ListSelectionVariantProps['mode']>;

interface Ctx { mode: Mode; selected: string[]; select: (value: string) => void; disabled: boolean }
const SelectionContext = createContext<Ctx>({ mode: 'single', selected: [], select: () => {}, disabled: false });
const IndexContext = createContext(0);

const toArray = (v: string | string[] | null | undefined): string[] => (v == null ? [] : Array.isArray(v) ? v : [v]);

const rowSelector = '[data-slot="list-selection-row"]:not(:disabled)';

export interface ListSelectionItemProps extends Omit<ComponentProps<'button'>, 'title' | 'value' | 'role'> {
  /** Choice label. */
  title: ReactNode;
  /** One line under the title. */
  description?: ReactNode;
  /** The value this row stands for. */
  itemValue: string;
}

export interface ListSelectionProps extends Omit<ComponentProps<'div'>, 'title' | 'defaultValue' | 'onChange'> {
  /** single = one choice with a tick; multiple = any number with a checkbox box. */
  mode?: Mode;
  /** Controlled selection: a string (or null) in single mode, string[] in multiple mode. */
  value?: string | null | string[];
  /** Uncontrolled initial selection. */
  defaultValue?: string | null | string[];
  /** Single mode reports the chosen value; multiple mode reports the full new array in row order. */
  onValueChange?: (value: string | string[]) => void;
  /** Caption inside the surface; also the accessible name. */
  heading?: ReactNode;
  /** Accessible name when there is no heading. */
  'aria-label'?: string;
  /** Disables every row. */
  disabled?: boolean;
}

/**
 * A grouped list of choices: radio rows with a tick (single) or checkbox rows (multiple).
 */
export function ListSelection({
  mode = 'single', value, defaultValue, onValueChange, heading, 'aria-label': ariaLabel, disabled = false,
  className, children, onKeyDown, ...props
}: ListSelectionProps) {
  const headingId = useId();
  const root = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useControllableState<string[]>({
    value: value === undefined ? undefined : toArray(value),
    defaultValue: toArray(defaultValue),
    onChange: next => onValueChange?.(mode === 'single' ? (next[0] as string) : next),
  });

  const select = (v: string) => {
    if (mode === 'single') {
      if (selected[0] !== v) setSelected([v]);
      return;
    }
    const on = selected.includes(v);
    const order = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-slot="list-selection-row"]') ?? []).map(r => r.dataset.value!);
    const next = on ? selected.filter(s => s !== v) : [...selected, v];
    setSelected(order.length ? order.filter(o => next.includes(o)).concat(next.filter(n => !order.includes(n))) : next);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || mode !== 'single') return;
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    const rows = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(rowSelector));
    const at = rows.indexOf(document.activeElement as HTMLElement);
    let to = -1;
    if (e.key in keys) to = (at + keys[e.key]! + rows.length) % rows.length;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = rows.length - 1;
    if (to < 0 || !rows[to]) return;
    e.preventDefault();
    rows[to]!.focus();
    select(rows[to]!.dataset.value!);
  };

  return (
    <SelectionContext.Provider value={{ mode, selected, select, disabled }}>
      <div
        ref={root} data-slot="list-selection" data-mode={mode}
        role={mode === 'single' ? 'radiogroup' : 'group'}
        aria-labelledby={heading != null ? headingId : undefined} aria-label={heading != null ? undefined : ariaLabel}
        className={cn(listVariants(), className)} onKeyDown={onKey} {...props}
      >
        {heading != null && <div data-slot="list-selection-heading" id={headingId} className={listHeadingVariants()}>{heading}</div>}
        {Children.toArray(children).map((child, i) => <IndexContext.Provider key={i} value={i}>{child}</IndexContext.Provider>)}
      </div>
    </SelectionContext.Provider>
  );
}

/** One choice. A button with role radio or checkbox. */
export function ListSelectionItem({ title, description, itemValue, disabled, className, onClick, ...props }: ListSelectionItemProps) {
  const ctx = useContext(SelectionContext);
  const index = useContext(IndexContext);
  const descId = useId();
  const checked = ctx.selected.includes(itemValue);
  const tabbable = ctx.mode === 'multiple' || checked || (ctx.selected.length === 0 && index === 0);
  return (
    <button
      type="button" data-slot="list-selection-row" data-mode={ctx.mode} data-lead={ctx.mode === 'multiple' ? 'check' : 'none'} data-value={itemValue}
      data-state={checked ? 'checked' : 'unchecked'}
      role={ctx.mode === 'single' ? 'radio' : 'checkbox'} aria-checked={checked} aria-describedby={description != null ? descId : undefined}
      tabIndex={tabbable ? 0 : -1} disabled={disabled || ctx.disabled}
      className={cn(listSelectionRowVariants({ mode: ctx.mode }), className)}
      onClick={e => { onClick?.(e); if (!e.defaultPrevented) ctx.select(itemValue); }}
      {...props}
    >
      {ctx.mode === 'multiple' && (
        <span data-slot="list-selection-indicator" aria-hidden className={listSelectionIndicatorVariants()}><Check /></span>
      )}
      <span data-slot="list-selection-text" className={listTextVariants()}>
        <span data-slot="list-selection-title" className={listSelectionTitleVariants()}>{title}</span>
        {description != null && <span data-slot="list-selection-description" id={descId} className={listSelectionDescriptionVariants()}>{description}</span>}
      </span>
      {ctx.mode === 'single' && <Check data-slot="list-selection-tick" aria-hidden className={listSelectionTickVariants()} />}
    </button>
  );
}
