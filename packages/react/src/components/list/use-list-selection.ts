'use client';
import { useRef, type KeyboardEvent, type MouseEvent, type RefObject } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state.ts';

export type ListSelectionMode = 'none' | 'single' | 'multiple';
/** How a single-mode row marks its choice: the end tick (default) or a leading radio circle. */
export type ListSelectionIndicator = 'check' | 'radio';

export interface UseListSelectionOptions {
  /** none = rows are not choices; single = one choice (radio group); multiple = any number (checkbox group). */
  mode?: ListSelectionMode;
  /** Single mode only: check = the tick at the end of the checked row; radio = an 18px radio circle at the start. */
  indicator?: ListSelectionIndicator;
  /** Controlled selection: a string (or null) in single mode, string[] in multiple mode. */
  value?: string | null | string[];
  /** Uncontrolled initial selection. */
  defaultValue?: string | null | string[];
  /** Single mode reports the chosen value; multiple mode reports the full new array in row order. */
  onValueChange?: (value: string | string[]) => void;
  /** Disables every choice. */
  disabled?: boolean;
}

/** The selection state a List (and its rows and ListRowIndicator) reads. */
export interface ListSelection {
  mode: ListSelectionMode;
  indicator: ListSelectionIndicator;
  selected: string[];
  disabled: boolean;
  isSelected: (value: string) => boolean;
  select: (value: string) => void;
  /** The element that holds the rows; multiple mode reports values in its row order, single mode roves focus in it. */
  rootRef: RefObject<HTMLElement | null>;
  /** Root keyboard: single mode moves the choice with the arrow keys, Home and End. */
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
}

export interface UseListSelectionResult extends ListSelection {
  /** Spread on List: it renders the group role, the rows' radio or checkbox triggers and the marks. */
  rootProps: { selection: ListSelection };
  /** Spread on ListRow: its identity in the selection. */
  rowProps: (value: string) => { itemValue: string };
  /** For a custom row element that is itself the choice: role, aria-checked, roving tabindex and the press handler. */
  itemProps: (value: string, opts?: { disabled?: boolean; first?: boolean }) => {
    role: 'radio' | 'checkbox'; 'aria-checked': boolean; tabIndex: number; disabled: boolean; 'data-state': 'checked' | 'unchecked';
    'data-item-value': string; onClick: (e: MouseEvent<HTMLElement>) => void;
  };
}

const toArray = (v: string | null | string[] | undefined): string[] => (v == null ? [] : Array.isArray(v) ? v : [v]);

/** The focusable choice of each row: a ListRow trigger, or a custom row that is itself the choice. */
const CHOICE = '[data-item-value]:not([data-disabled]) [data-slot=list-trigger]:not(:disabled), [role=radio][data-item-value]:not(:disabled)';

/**
 * Headless single or multiple selection for a List (the former ListSelection). List calls it for its selectionMode props;
 * a custom list calls it directly and spreads rootProps on List and rowProps on each ListRow.
 */
export function useListSelection({
  mode = 'single', indicator = 'check', value, defaultValue, onValueChange, disabled = false,
}: UseListSelectionOptions = {}): UseListSelectionResult {
  const rootRef = useRef<HTMLElement | null>(null);
  const [selected, setSelected] = useControllableState<string[]>({
    value: value === undefined ? undefined : toArray(value),
    defaultValue: toArray(defaultValue),
    onChange: next => onValueChange?.(mode === 'multiple' ? next : (next[0] as string)),
  });

  const select = (v: string) => {
    if (mode === 'none' || disabled) return;
    if (mode === 'single') {
      if (selected[0] !== v) setSelected([v]);
      return;
    }
    const on = selected.includes(v);
    const order = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[data-item-value]') ?? []).map(r => r.dataset.itemValue!);
    const next = on ? selected.filter(s => s !== v) : [...selected, v];
    setSelected(order.length ? order.filter(o => next.includes(o)).concat(next.filter(n => !order.includes(n))) : next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.defaultPrevented || mode !== 'single') return;
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    const choices = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(CHOICE));
    const at = choices.indexOf(document.activeElement as HTMLElement);
    if (at < 0) return;
    let to = -1;
    if (e.key in keys) to = (at + keys[e.key]! + choices.length) % choices.length;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = choices.length - 1;
    if (to < 0 || !choices[to]) return;
    e.preventDefault();
    choices[to]!.focus();
    const v = choices[to]!.closest<HTMLElement>('[data-item-value]')?.dataset.itemValue;
    if (v != null) select(v);
  };

  const state: ListSelection = {
    mode, indicator, selected, disabled, isSelected: v => selected.includes(v), select, rootRef, onKeyDown,
  };
  return {
    ...state,
    rootProps: { selection: state },
    rowProps: v => ({ itemValue: v }),
    itemProps: (v, opts = {}) => {
      const checked = selected.includes(v);
      const off = disabled || !!opts.disabled;
      const tabbable = mode === 'multiple' || checked || (selected.length === 0 && !!opts.first);
      return {
        role: mode === 'multiple' ? 'checkbox' : 'radio', 'aria-checked': checked, tabIndex: tabbable ? 0 : -1, disabled: off,
        'data-state': checked ? 'checked' : 'unchecked', 'data-item-value': v,
        onClick: e => { if (!e.defaultPrevented && !off) select(v); },
      };
    },
  };
}
