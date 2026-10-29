'use client';
import { GripVertical } from 'lucide-react';
import {
  Children, createContext, isValidElement, useContext, useId, useLayoutEffect, useRef, useState,
  type ComponentProps, type KeyboardEvent, type PointerEvent, type ReactElement, type ReactNode,
} from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { useFlip } from '../../hooks/use-flip.ts';
import { Badge } from '../badge/badge.tsx';
import {
  readingOrderHandleVariants, readingOrderIndexVariants, readingOrderItemVariants, readingOrderLabelVariants, readingOrderRowVariants, readingOrderVariants,
} from './reading-order.variants.ts';

export interface ReadingOrderEvent { id: string; from: number; to: number; order: string[] }

type Drop = { id: string; edge: 'above' | 'below' };

interface Ctx {
  common: CommonProps;
  shown: string[];
  host: string | undefined;
  picked: string | null;
  dragId: string | null;
  drop: Drop | null;
  instructionId: string;
  message: string;
  startPointer: (e: PointerEvent<HTMLElement>, id: string) => void;
  movePointer: (e: PointerEvent<HTMLElement>) => void;
  endPointer: (e: PointerEvent<HTMLElement>) => void;
  cancelPointer: (e: PointerEvent<HTMLElement>) => void;
  handleKey: (e: KeyboardEvent<HTMLButtonElement>, id: string) => void;
  handleClick: (id: string) => void;
  handleBlur: (id: string, el: HTMLElement) => void;
}
const OrderContext = createContext<Ctx | null>(null);

export interface ReadingOrderItemProps extends Omit<ComponentProps<'li'>, 'children'> {
  /** Stable identity (order array, announcements); rendered as data-item-id. */
  itemId: string;
  /** Element description. */
  children: ReactNode;
  /** The element reads out of visual order: the index and badge use the warning tint. */
  warning?: boolean;
  /** Badge text on a warning row. */
  note?: ReactNode;
  /** State hook for fixtures and tests: renders the picked-up look. Normally set internally. */
  dragging?: boolean;
}

/** The five common props apply to every row: see readingOrderRowVariants. */
export interface ReadingOrderProps extends Omit<ComponentProps<'ol'>, 'defaultValue'>, CommonProps {
  /** Controlled order: the item ids from first to last. */
  order?: string[];
  /** Uncontrolled initial order. Defaults to the order of the children. */
  defaultOrder?: string[];
  /** Accessible name of the list. */
  'aria-label': string;
  /** Reports a drop at a new position; not called for a drop in place or a cancel. */
  onReorder?: (event: ReadingOrderEvent) => void;
}

const text = (children: ReactNode, id: string) => (typeof children === 'string' ? children : id);

/**
 * The order in which a screen reader reads the elements of a frame, as a numbered list that can be reordered
 * by pointer drag or from the keyboard (the model of ListReorder). A flagged row says where it lands.
 */
export function ReadingOrder({ order, defaultOrder, onReorder, tone, variant, radius, shadow, size, className, children, ...props }: ReadingOrderProps) {
  const instructionId = useId();
  const root = useRef<HTMLOListElement>(null);

  const nodes = Children.toArray(children)
    .filter((c): c is ReactElement<ReadingOrderItemProps> => isValidElement(c));
  const ids = nodes.map(n => n.props.itemId);
  const [stored, setOrder] = useControllableState<string[]>({ value: order, defaultValue: defaultOrder ?? ids });
  const resolve = (o: string[]) => [...o.filter(id => ids.includes(id)), ...ids.filter(id => !o.includes(id))];

  // Keyboard pick up works on a live preview; a pointer drag only shows a line and commits on release.
  const [preview, setPreview] = useState<string[] | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const pickedRef = useRef<{ id: string; from: number; original: string[] } | null>(null);
  const [drag, setDrag] = useState<{ id: string; drop: Drop | null } | null>(null);
  // The order a pointer drop committed. Only that order glides (useFlip); keyboard moves and drags stay instant.
  const [dropped, setDropped] = useState<string[] | null>(null);
  const [message, setMessage] = useState('');
  const shown = preview ?? resolve(stored);
  const flipOn = dropped !== null && picked === null && dropped.length === shown.length && dropped.every((id, i) => id === shown[i]);
  useFlip(root, '[data-item-id]', 'itemId', flipOn);
  const byId = new Map(nodes.map(n => [n.props.itemId, n.props]));
  const label = (id: string) => text(byId.get(id)?.children, id);
  const pos = (list: string[], id: string) => `position ${list.indexOf(id) + 1} of ${list.length}`;

  const commit = (id: string, from: number, next: string[]) => {
    const to = next.indexOf(id);
    setOrder(next);
    if (to !== from) onReorder?.({ id, from, to, order: next });
    setMessage(`Dropped at ${pos(next, id)}`);
  };

  // ── keyboard
  const cancelPick = () => {
    const p = pickedRef.current; if (!p) return;
    pickedRef.current = null; setPicked(null); setPreview(null);
    setMessage(`Cancelled, back at ${pos(p.original, p.id)}`);
  };
  const dropPick = () => {
    const p = pickedRef.current; if (!p) return;
    const next = preview ?? p.original;
    pickedRef.current = null; setPicked(null); setPreview(null);
    commit(p.id, p.from, next);
  };
  const moveTo = (id: string, target: number) => {
    const list = preview ?? shown;
    if (target === list.indexOf(id)) return;
    const without = list.filter(x => x !== id);
    const next = [...without.slice(0, target), id, ...without.slice(target)];
    setPreview(next);
    setMessage(`Moved to ${pos(next, id)}`);
  };
  const step = (id: string, dir: 1 | -1) => {
    const list = preview ?? shown;
    const t = list.indexOf(id) + dir;
    if (t < 0 || t >= list.length) return;
    moveTo(id, t);
  };
  const handleKey = (e: KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (pickedRef.current?.id === id) {
      if (e.key === 'ArrowUp') { e.preventDefault(); step(id, -1); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); step(id, 1); }
      else if (e.key === 'Home') { e.preventDefault(); moveTo(id, 0); }
      else if (e.key === 'End') { e.preventDefault(); moveTo(id, shown.length - 1); }
      else if (e.key === 'Escape') { e.preventDefault(); cancelPick(); }
      return;
    }
    if (pickedRef.current) return;
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const rows = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-slot="reading-order-row"]') ?? []);
    const at = rows.indexOf(e.currentTarget);
    rows[at + (e.key === 'ArrowDown' ? 1 : -1)]?.focus();
  };
  const suppressClick = useRef(false);
  const handleClick = (id: string) => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    if (pickedRef.current?.id === id) { dropPick(); return; }
    if (pickedRef.current) return;
    const original = resolve(stored);
    pickedRef.current = { id, from: original.indexOf(id), original };
    // A keyboard pick-up ends any pointer drop's glide: its drop and cancel are instant.
    setPicked(id); setPreview(original); setDropped(null);
    setMessage(`Picked up ${label(id)}, ${pos(original, id)}`);
  };
  // Losing focus while picked up cancels. The check is deferred because moving a row can blur it for a moment.
  const handleBlur = (id: string, el: HTMLElement) => {
    window.setTimeout(() => { if (pickedRef.current?.id === id && document.activeElement !== el) cancelPick(); }, 0);
  };
  useLayoutEffect(() => {
    if (!picked) return;
    const row = Array.from(root.current?.querySelectorAll<HTMLElement>('[data-item-id]') ?? []).find(r => r.dataset.itemId === picked);
    row?.querySelector<HTMLElement>('[data-slot="reading-order-row"]')?.focus();
  }, [preview, picked]);

  // ── pointer
  const pointer = useRef<{ id: string; pid: number; x: number; y: number; active: boolean; drop: Drop | null } | null>(null);
  const startPointer = (e: PointerEvent<HTMLElement>, id: string) => {
    suppressClick.current = false;
    if (e.button !== 0 || pickedRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointer.current = { id, pid: e.pointerId, x: e.clientX, y: e.clientY, active: false, drop: null };
  };
  const scrollParent = (el: HTMLElement | null) => {
    for (let n = el?.parentElement; n; n = n.parentElement) { const o = getComputedStyle(n).overflowY; if (o === 'auto' || o === 'scroll') return n; }
    return null;
  };
  const movePointer = (e: PointerEvent<HTMLElement>) => {
    const p = pointer.current; if (!p || p.pid !== e.pointerId) return;
    if (!p.active) {
      if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < 4) return;
      p.active = true;
    }
    const box = root.current!.getBoundingClientRect();
    let drop: Drop | null = null;
    if (e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom) {
      const rows = Array.from(root.current!.querySelectorAll<HTMLElement>('[data-slot="reading-order-row"]'));
      const hit = rows.find(r => { const b = r.getBoundingClientRect(); return e.clientY >= b.top && e.clientY <= b.bottom + 2; });
      const hitId = hit?.closest<HTMLElement>('[data-item-id]')?.dataset.itemId;
      if (hit && hitId && hitId !== p.id) {
        const b = hit.getBoundingClientRect();
        drop = { id: hitId, edge: e.clientY < b.top + b.height / 2 ? 'above' : 'below' };
      }
    }
    p.drop = drop;
    setDrag({ id: p.id, drop });
    const sp = scrollParent(root.current);
    if (sp) {
      const r = sp.getBoundingClientRect();
      if (e.clientY < r.top + 32) sp.scrollTop -= 8; else if (e.clientY > r.bottom - 32) sp.scrollTop += 8;
    }
  };
  const endPointer = (e: PointerEvent<HTMLElement>) => {
    const p = pointer.current; if (!p || p.pid !== e.pointerId) return;
    pointer.current = null; setDrag(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (!p.active) return;
    suppressClick.current = true;
    if (!p.drop) return;
    const list = resolve(stored);
    const from = list.indexOf(p.id);
    const without = list.filter(x => x !== p.id);
    const at = without.indexOf(p.drop.id) + (p.drop.edge === 'below' ? 1 : 0);
    const next = [...without.slice(0, at), p.id, ...without.slice(at)];
    setDropped(next);
    commit(p.id, from, next);
  };
  const cancelPointer = (e: PointerEvent<HTMLElement>) => {
    if (pointer.current?.pid !== e.pointerId) return;
    pointer.current = null; setDrag(null);
  };

  const ctx: Ctx = {
    common: { tone, variant, radius, shadow, size }, shown, host: ids[0], picked, dragId: drag?.id ?? null, drop: drag?.drop ?? null, instructionId, message,
    startPointer, movePointer, endPointer, cancelPointer, handleKey, handleClick, handleBlur,
  };
  const sorted = [...nodes].sort((a, b) => shown.indexOf(a.props.itemId) - shown.indexOf(b.props.itemId));

  return (
    <OrderContext.Provider value={ctx}>
      <ol ref={root} data-slot="reading-order" role="list" className={cn(readingOrderVariants(), className)} {...props}>
        {sorted}
      </ol>
    </OrderContext.Provider>
  );
}

/** One element in reading order: position badge, description, and a grip or a warning badge. */
export function ReadingOrderItem({ itemId, children, warning = false, note, dragging = false, className, ...props }: ReadingOrderItemProps) {
  const ctx = useContext(OrderContext)!;
  const position = ctx.shown.indexOf(itemId);
  const active = dragging || ctx.picked === itemId || ctx.dragId === itemId;
  const drop = ctx.drop?.id === itemId ? ctx.drop.edge : undefined;
  return (
    <li data-slot="reading-order-item" data-item-id={itemId} className={cn(readingOrderItemVariants(), className)} {...props}>
      <button
        type="button" data-slot="reading-order-row" aria-pressed={ctx.picked === itemId} aria-describedby={ctx.instructionId}
        data-warning={warning || undefined} data-dragging={active || undefined} data-drop={drop}
        className={cn(readingOrderRowVariants({ tone: ctx.common.tone, variant: ctx.common.variant, size: ctx.common.size, radius: ctx.common.radius ?? null, shadow: ctx.common.shadow ?? null }))}
        onKeyDown={e => ctx.handleKey(e, itemId)} onClick={() => ctx.handleClick(itemId)} onBlur={e => ctx.handleBlur(itemId, e.currentTarget)}
        onPointerDown={e => ctx.startPointer(e, itemId)} onPointerMove={ctx.movePointer} onPointerUp={ctx.endPointer} onPointerCancel={ctx.cancelPointer}
      >
        <span data-slot="reading-order-index" aria-hidden className={readingOrderIndexVariants()}>{position + 1}</span>
        <span data-slot="reading-order-label" className={readingOrderLabelVariants()}>{children}</span>
        {warning && note != null
          ? <Badge data-slot="reading-order-note" tone="warning">{note}</Badge>
          : !warning && <GripVertical data-slot="reading-order-handle" aria-hidden className={readingOrderHandleVariants()} />}
      </button>
      {ctx.host === itemId && (
        <>
          <span id={ctx.instructionId} hidden>Press Space to pick up, arrow keys to move, Space to drop, Escape to cancel.</span>
          <div data-slot="reading-order-status" role="status" aria-live="polite" className="sr-only">{ctx.message}</div>
        </>
      )}
    </li>
  );
}
