'use client';
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode, type RefObject } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import type { Tone, Variant } from '../../lib/common-props.ts';

/** One row action: a tray button (swipe) or an icon button in the hover tools. */
export interface ListRowAction {
  /** Reported by onAction. */
  id: string;
  /** Visible label (tray) and accessible name. */
  label: string;
  /** Glyph. */
  icon?: ReactNode;
  /** Intent colour of the tray action (default neutral). */
  tone?: Tone;
  /** Emphasis of the tray action (default solid). */
  variant?: Variant;
}

export type ListRowActionsMode = 'none' | 'hover' | 'swipe';

export interface UseRowActionsOptions {
  /** hover = icon buttons on row hover or focus (desktop); swipe = a labelled tray under a row that slides (touch). */
  mode?: ListRowActionsMode;
  actions?: ListRowAction[] | undefined;
  /** An action is activated; a swipe row closes afterwards. */
  onAction?: ((event: { id: string }) => void) | undefined;
  /** Swipe mode. Controlled open state of the row. */
  open?: boolean | undefined;
  /** Swipe mode. Uncontrolled initial open state. */
  defaultOpen?: boolean | undefined;
  /** Swipe mode: the row opens or closes by swipe, tap, Escape, outside press or focus entering the tray. */
  onOpenChange?: ((open: boolean) => void) | undefined;
}

/** The row actions state ListRowTray reads. */
export interface RowActions {
  mode: ListRowActionsMode;
  actions: ListRowAction[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  /** Runs an action: reports it and closes a swipe row. */
  run: (id: string) => void;
  trayRef: RefObject<HTMLDivElement | null>;
  /** Focus entering the tray opens the row. */
  onTrayFocus: () => void;
}

export interface UseRowActionsResult extends RowActions {
  /** Spread on ListRowTray in a custom row. */
  trayProps: { controller: RowActions };
  /** Spread on the row element (the li): Escape closes, the open state, outside presses close. */
  rowProps: { ref: RefObject<HTMLLIElement | null>; onKeyDown: (e: KeyboardEvent<HTMLElement>) => void; 'data-actions': ListRowActionsMode };
  /** Spread on the sliding body (swipe): the gesture and the offset (a CSS custom property). */
  bodyProps: {
    ref: RefObject<HTMLDivElement | null>; tabIndex: number | undefined; style: CSSProperties | undefined; 'data-state': 'open' | 'closed';
    'data-dragging': true | undefined; onPointerDown: (e: PointerEvent<HTMLElement>) => void; onPointerMove: (e: PointerEvent<HTMLElement>) => void;
    onPointerUp: (e: PointerEvent<HTMLElement>) => void; onPointerCancel: (e: PointerEvent<HTMLElement>) => void;
  };
}

/** Only one row is open at a time: a row that opens tells the others to close. */
const OPEN_EVENT = 'caustic:list-row-open';

/**
 * Headless row actions (the former ListActions): a swipe tray (touch) or hover tools (desktop). ListRow calls it for its
 * actions props; a custom row calls it directly and renders ListRowTray.
 */
export function useRowActions({ mode = 'hover', actions = [], onAction, open, defaultOpen = false, onOpenChange }: UseRowActionsOptions = {}): UseRowActionsResult {
  const swipe = mode === 'swipe';
  const uid = useId();
  const [isOpen, setOpen] = useControllableState<boolean>({ value: open, defaultValue: defaultOpen, onChange: onOpenChange });
  const rowRef = useRef<HTMLLIElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const trayRef = useRef<HTMLDivElement | null>(null);
  const [trayWidth, setTrayWidth] = useState(0);
  const [dragX, setDragX] = useState<number | null>(null);
  const gesture = useRef<{ pid: number; x: number; y: number; active: boolean; dx: number } | null>(null);

  useLayoutEffect(() => {
    if (swipe && trayRef.current) setTrayWidth(trayRef.current.offsetWidth);
  }, [swipe, actions.length]);

  // One open row per page, and a press outside closes this one.
  useEffect(() => {
    if (!swipe || !isOpen) return;
    const closeOther = (e: Event) => { if ((e as CustomEvent).detail !== uid) setOpen(false); };
    const outside = (e: globalThis.PointerEvent) => { if (!rowRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener(OPEN_EVENT, closeOther);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener(OPEN_EVENT, closeOther); document.removeEventListener('pointerdown', outside); };
  }, [swipe, isOpen, uid, setOpen]);
  const openRow = () => { setOpen(true); document.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: uid })); };

  const down = (e: PointerEvent<HTMLElement>) => {
    if (!swipe || e.button !== 0 || (e.target as HTMLElement).closest('button, a, input, select, textarea')) return;
    gesture.current = { pid: e.pointerId, x: e.clientX, y: e.clientY, active: false, dx: 0 };
  };
  const move = (e: PointerEvent<HTMLElement>) => {
    const g = gesture.current; if (!g || g.pid !== e.pointerId) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (!g.active) {
      if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(dy)) return;
      g.active = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    g.dx = dx;
    const base = isOpen ? -trayWidth : 0;
    setDragX(Math.min(0, Math.max(-trayWidth, base + dx)));
  };
  const up = (e: PointerEvent<HTMLElement>) => {
    const g = gesture.current; if (!g || g.pid !== e.pointerId) return;
    gesture.current = null; setDragX(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (!g.active) { if (isOpen) setOpen(false); return; }
    if (g.dx <= -30 && !isOpen) openRow();
    else if (g.dx >= 30 && isOpen) setOpen(false);
  };
  const cancel = (e: PointerEvent<HTMLElement>) => { if (gesture.current?.pid === e.pointerId) { gesture.current = null; setDragX(null); } };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.defaultPrevented || !swipe || e.key !== 'Escape' || !isOpen) return;
    e.preventDefault(); setOpen(false); bodyRef.current?.focus();
  };

  const x = dragX ?? (isOpen ? -trayWidth : 0);
  const run = (id: string) => { onAction?.({ id }); if (swipe) setOpen(false); };
  const state: RowActions = { mode, actions, isOpen, setOpen, run, trayRef, onTrayFocus: () => { if (swipe && !isOpen) openRow(); } };
  return {
    ...state,
    trayProps: { controller: state },
    rowProps: { ref: rowRef, onKeyDown, 'data-actions': mode },
    bodyProps: {
      ref: bodyRef, tabIndex: swipe ? -1 : undefined, style: swipe ? ({ '--row-x': `${x}px` } as CSSProperties) : undefined,
      'data-state': isOpen ? 'open' : 'closed', 'data-dragging': dragX != null || undefined,
      onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: cancel,
    },
  };
}
