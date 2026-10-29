'use client';
import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type RefObject } from 'react';
import { useControllableState } from '../../hooks/use-controllable-state.ts';

export interface ListReorderEvent { id: string; from: number; to: number; order: string[] }

/** Structured live-region event; position is 1-based (the original position for 'cancelled'). */
export interface ListReorderAnnouncement { type: 'picked' | 'moved' | 'dropped' | 'cancelled'; title: string; position: number; size: number }

/** A live pointer drag: the held row follows the pointer by dy; the rows between from and to slide by h to open its slot. */
type Drag = { id: string; dy: number; from: number; to: number; h: number };

export interface ListReorderItem {
  id: string;
  /** Used in the handle name and the announcements (the id when absent). */
  title?: string | undefined;
  /** The item cannot be moved; other items skip over it. */
  disabled?: boolean | undefined;
}

export interface UseListReorderOptions {
  /** The items in their resting (children) order. */
  items: ListReorderItem[];
  /** Controlled order: the item ids from first to last. */
  order?: string[] | undefined;
  /** Uncontrolled initial order. Defaults to the order of the items. */
  defaultOrder?: string[] | undefined;
  /** Reports a drop at a new position; not called for a drop in place or a cancel. */
  onReorder?: ((event: ListReorderEvent) => void) | undefined;
  /** aria-label of each drag handle from the item title. */
  handleLabel: (title: string) => string;
  /** Hidden instruction the handles are described by. */
  instructions: string;
  /** Builds the live-region text from an event. */
  announce: (event: ListReorderAnnouncement) => string;
  /** Show the position badge. */
  numbered?: boolean | undefined;
  /** Off: the hook is inert (List calls it unconditionally). */
  enabled?: boolean | undefined;
}

/** The reorder state a List (and its rows and ListRowHandle) reads. */
export interface ListReorder {
  enabled: boolean;
  numbered: boolean;
  /** The order on screen (the live preview while a row is picked up). */
  shown: string[];
  picked: string | null;
  drag: Drag | null;
  settling: boolean;
  message: string;
  instructions: string;
  instructionId: string;
  rootRef: RefObject<HTMLElement | null>;
  handleLabel: (id: string) => string;
  isDisabled: (id: string) => boolean;
  /** The vertical offset of a row: the held row follows the pointer; the rows it passes slide aside. */
  offset: (id: string) => number;
  startPointer: (e: PointerEvent<HTMLElement>, id: string) => void;
  movePointer: (e: PointerEvent<HTMLElement>) => void;
  endPointer: (e: PointerEvent<HTMLElement>) => void;
  cancelPointer: (e: PointerEvent<HTMLElement>) => void;
  handleKey: (e: KeyboardEvent<HTMLElement>, id: string) => void;
  handleClick: (id: string) => void;
  handleBlur: (id: string, el: HTMLElement) => void;
}

export interface UseListReorderResult extends ListReorder {
  /** Spread on List: it sorts its rows, renders the handles, the live region and the instruction. */
  rootProps: { reorder: ListReorder };
  /** Spread on ListRow: its identity in the order. */
  rowProps: (id: string) => { itemValue: string };
  /** For a custom row element: identity, drag state, the pointer handlers and the offset (a CSS custom property). */
  itemProps: (id: string) => {
    'data-item-value': string; 'data-dragging': true | undefined; 'data-follow': true | undefined; style: CSSProperties | undefined;
    onPointerDown: (e: PointerEvent<HTMLElement>) => void; onPointerMove: (e: PointerEvent<HTMLElement>) => void;
    onPointerUp: (e: PointerEvent<HTMLElement>) => void; onPointerCancel: (e: PointerEvent<HTMLElement>) => void;
  };
}

const HANDLE = '[data-slot="list-handle"]';

/**
 * Headless reorder for a List (the former ListReorder): pointer drag (the row lifts, follows the pointer while the rows it
 * passes slide aside to open its slot, and glides into place, reduced-motion aware) and keyboard pick-up from the handle with
 * a live preview and announcements. List calls it for its reorderable props; a custom list calls it directly.
 */
export function useListReorder({
  items, order, defaultOrder, onReorder, handleLabel, instructions, announce, numbered = false, enabled = true,
}: UseListReorderOptions): UseListReorderResult {
  const instructionId = useId();
  const rootRef = useRef<HTMLElement | null>(null);
  const ids = items.map(i => i.id);
  const [stored, setOrder] = useControllableState<string[]>({ value: order, defaultValue: defaultOrder ?? ids });
  const resolve = (o: string[]) => [...o.filter(id => ids.includes(id)), ...ids.filter(id => !o.includes(id))];

  // Keyboard pick up works on a live preview. Pointer drag (owner 2026-10-28) lifts the row, which follows the pointer while
  // the rows it passes slide aside to open its slot; on release it settles into that slot (or back into its own).
  const [preview, setPreview] = useState<string[] | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const pickedRef = useRef<{ id: string; from: number; original: string[] } | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  // The released row: where it was drawn, so it can glide from there into its slot (FLIP) after the order commits.
  const [settle, setSettle] = useState<{ id: string; top: number } | null>(null);
  const [message, setMessage] = useState('');
  const shown = preview ?? resolve(stored);
  const byId = new Map(items.map(i => [i.id, i]));
  const label = (id: string) => byId.get(id)?.title ?? id;
  const isDisabled = (id: string) => !!byId.get(id)?.disabled;
  const say = (type: ListReorderAnnouncement['type'], list: string[], id: string) => setMessage(announce({ type, title: label(id), position: list.indexOf(id) + 1, size: list.length }));

  const commit = (id: string, from: number, next: string[]) => {
    const to = next.indexOf(id);
    setOrder(next);
    if (to !== from) onReorder?.({ id, from, to, order: next });
    say('dropped', next, id);
  };

  // ── keyboard
  const cancelPick = () => {
    const p = pickedRef.current; if (!p) return;
    pickedRef.current = null; setPicked(null); setPreview(null);
    say('cancelled', p.original, p.id);
  };
  const dropPick = () => {
    const p = pickedRef.current; if (!p) return;
    const next = preview ?? p.original;
    pickedRef.current = null; setPicked(null); setPreview(null);
    commit(p.id, p.from, next);
  };
  const moveTo = (id: string, target: number) => {
    const list = preview ?? shown;
    const at = list.indexOf(id);
    if (target === at) return;
    const without = list.filter(x => x !== id);
    const next = [...without.slice(0, target), id, ...without.slice(target)];
    setPreview(next);
    say('moved', next, id);
  };
  const step = (id: string, dir: 1 | -1) => {
    const list = preview ?? shown;
    let t = list.indexOf(id) + dir;
    while (t >= 0 && t < list.length && isDisabled(list[t]!)) t += dir;
    if (t < 0 || t >= list.length) return;
    moveTo(id, t);
  };
  const edge = (id: string, dir: 1 | -1) => {
    const list = preview ?? shown;
    const free = list.map((x, i) => (x === id || !isDisabled(x) ? i : -1)).filter(i => i >= 0);
    moveTo(id, dir === 1 ? free[free.length - 1]! : free[0]!);
  };
  const handleKey = (e: KeyboardEvent<HTMLElement>, id: string) => {
    if (pickedRef.current?.id === id) {
      if (e.key === 'ArrowUp') { e.preventDefault(); step(id, -1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); step(id, 1); }
      else if (e.key === 'Home') { e.preventDefault(); edge(id, -1); }
      else if (e.key === 'End') { e.preventDefault(); edge(id, 1); }
      else if (e.key === 'Escape') { e.preventDefault(); cancelPick(); }
      return;
    }
    if (pickedRef.current) return;
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const handles = Array.from(rootRef.current?.querySelectorAll<HTMLElement>(HANDLE) ?? []);
    const at = handles.indexOf(e.currentTarget);
    handles[at + (e.key === 'ArrowDown' ? 1 : -1)]?.focus();
  };
  const handleClick = (id: string) => {
    if (pickedRef.current?.id === id) { dropPick(); return; }
    if (pickedRef.current || isDisabled(id)) return;
    const original = resolve(stored);
    pickedRef.current = { id, from: original.indexOf(id), original };
    setPicked(id); setPreview(original);
    say('picked', original, id);
  };
  // Losing focus while picked up cancels. The check is deferred because moving a row can blur it for a moment.
  const handleBlur = (id: string, el: HTMLElement) => {
    window.setTimeout(() => { if (pickedRef.current?.id === id && document.activeElement !== el) cancelPick(); }, 0);
  };
  useLayoutEffect(() => {
    if (!picked) return;
    const row = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[data-item-value]') ?? []).find(r => r.dataset.itemValue === picked);
    row?.querySelector<HTMLElement>(HANDLE)?.focus();
  }, [preview, picked]);

  // ── pointer
  const pointer = useRef<{
    id: string; pid: number; x: number; y: number; active: boolean; from: number; h: number; centers: number[]; scroll0: number;
    sp: HTMLElement | null; inside: boolean; dy: number; to: number;
  } | null>(null);
  const rowsInOrder = () => Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[data-item-value]') ?? []);
  const scrollParent = (el: HTMLElement | null) => {
    for (let n = el?.parentElement; n; n = n.parentElement) { const o = getComputedStyle(n).overflowY; if (o === 'auto' || o === 'scroll') return n; }
    return null;
  };
  const startPointer = (e: PointerEvent<HTMLElement>, id: string) => {
    if (!enabled || e.button !== 0 || isDisabled(id) || pickedRef.current || settle) return;
    const t = e.target as HTMLElement;
    const onHandle = !!t.closest(HANDLE);
    if (!onHandle && (e.pointerType === 'touch' || t.closest('button, a, input, select, textarea, [role="switch"]'))) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const sp = scrollParent(rootRef.current);
    pointer.current = {
      id, pid: e.pointerId, x: e.clientX, y: e.clientY, active: false, from: -1, h: 0, centers: [], scroll0: sp?.scrollTop ?? 0, sp,
      inside: true, dy: 0, to: -1,
    };
  };
  const movePointer = (e: PointerEvent<HTMLElement>) => {
    const p = pointer.current; if (!p || p.pid !== e.pointerId) return;
    if (!p.active) {
      if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < 4) return;
      // Measure the resting layout once: every row centre, and the held row's height (the slot the others open).
      const rows = rowsInOrder();
      const at = rows.findIndex(r => r.dataset.itemValue === p.id);
      if (at < 0) return;
      p.active = true; p.from = at; p.to = at;
      p.centers = rows.map(r => { const b = r.getBoundingClientRect(); return b.top + b.height / 2; });
      p.h = rows[at]!.getBoundingClientRect().height;
    }
    const box = rootRef.current!.getBoundingClientRect();
    p.inside = e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom;
    const scrolled = (p.sp?.scrollTop ?? 0) - p.scroll0;
    p.dy = e.clientY - p.y + scrolled;
    // The target slot: how many other rows the held row's centre has passed (resting centres, scroll-corrected).
    const centre = p.centers[p.from]! + p.dy - scrolled;
    let to = 0;
    p.centers.forEach((c, i) => { if (i !== p.from && centre > c - scrolled) to += 1; });
    p.to = p.inside ? to : p.from;
    setDrag({ id: p.id, dy: p.dy, from: p.from, to: p.to, h: p.h });
    if (p.sp) {
      const r = p.sp.getBoundingClientRect();
      if (e.clientY < r.top + 32) p.sp.scrollTop -= 8; else if (e.clientY > r.bottom - 32) p.sp.scrollTop += 8;
    }
  };
  const release = (p: NonNullable<typeof pointer.current>, drop: boolean) => {
    pointer.current = null;
    if (!p.active) { setDrag(null); return; }
    const row = rowsInOrder()[p.from];
    const top = row?.getBoundingClientRect().top;
    if (top !== undefined) setSettle({ id: p.id, top });
    setDrag(null);
    if (!drop || !p.inside) return;
    const list = resolve(stored);
    const without = list.filter(x => x !== p.id);
    commit(p.id, p.from, [...without.slice(0, p.to), p.id, ...without.slice(p.to)]);
  };
  const endPointer = (e: PointerEvent<HTMLElement>) => {
    const p = pointer.current; if (!p || p.pid !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    release(p, true);
  };
  const cancelPointer = (e: PointerEvent<HTMLElement>) => {
    const p = pointer.current; if (!p || p.pid !== e.pointerId) return;
    release(p, false);
  };
  // Settle: the order has committed and every row is back in flow without an offset. The released row starts where it was
  // drawn and glides into its slot; the root holds data-settling for that first frame so the rows that slid aside take their
  // new place without animating again. Reduced motion skips the glide.
  useLayoutEffect(() => {
    if (!settle) return;
    const el = rowsInOrder().find(r => r.dataset.itemValue === settle.id);
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const offset = el ? settle.top - el.getBoundingClientRect().top : 0;
    if (!el || reduce || Math.abs(offset) < 0.5) { setSettle(null); return; }
    el.style.transition = 'none';
    el.style.transform = `translateY(${offset}px)`;
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        el.style.transition = 'transform var(--cs-duration-base) var(--cs-ease-in-out)';
        el.style.transform = '';
      });
    });
    const done = () => { el.style.transition = ''; setSettle(null); };
    el.addEventListener('transitionend', done, { once: true });
    const guard = window.setTimeout(done, 600);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(guard); el.removeEventListener('transitionend', done); el.style.transition = ''; el.style.transform = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settle]);

  const offset = (id: string) => {
    const d = drag; if (!d) return 0;
    if (d.id === id) return d.dy;
    const position = shown.indexOf(id);
    if (d.from < d.to && position > d.from && position <= d.to) return -d.h;
    if (d.to < d.from && position >= d.to && position < d.from) return d.h;
    return 0;
  };

  const state: ListReorder = {
    enabled, numbered, shown, picked, drag, settling: settle != null, message, instructions, instructionId, rootRef,
    handleLabel: id => handleLabel(label(id)), isDisabled, offset,
    startPointer, movePointer, endPointer, cancelPointer, handleKey, handleClick, handleBlur,
  };
  return {
    ...state,
    rootProps: { reorder: state },
    rowProps: id => ({ itemValue: id }),
    itemProps: id => {
      const y = offset(id);
      const held = drag?.id === id;
      return {
        'data-item-value': id, 'data-dragging': held || picked === id || undefined, 'data-follow': held || undefined,
        style: y !== 0 ? ({ '--li-y': `${y}px` } as CSSProperties) : undefined,
        onPointerDown: e => startPointer(e, id), onPointerMove: movePointer, onPointerUp: endPointer, onPointerCancel: cancelPointer,
      };
    },
  };
}
