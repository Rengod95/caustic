'use client';
import { Check, ChevronRight, Eye, EyeOff, Lock, LockOpen } from 'lucide-react';
import {
  Children, createContext, isValidElement, useContext, useId, useRef, useState,
  type ComponentProps, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactElement, type ReactNode,
} from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import type { CommonProps, Radius, Size, Tone, Variant } from '../../lib/common-props.ts';
import {
  layerTreeCaptionVariants, layerTreeChevronVariants, layerTreeCheckVariants, layerTreeDropVariants, layerTreeEndVariants, layerTreeFrameVariants, layerTreeGhostIconVariants, layerTreeGhostVariants,
  layerTreeIconVariants, layerTreeLabelVariants, layerTreeMarkVariants, layerTreeRowRadiusVariants, layerTreeRowVariants, layerTreeTagVariants, layerTreeLockVariants,
  layerTreeTwistyVariants, layerTreeVisibilityVariants, layerTreeVariants,
} from './layer-tree.variants.ts';

export type LayerDropPosition = 'before' | 'after' | 'inside';
export interface LayerTreeMoveEvent { ids: string[]; targetId: string; position: LayerDropPosition }

/** Structured live-region event; `names` are layer names in tree order and its length is the count. */
export type LayerTreeAnnouncement =
  | { type: 'selected' | 'expanded' | 'collapsed' | 'hid' | 'showed' | 'locked' | 'unlocked'; names: string[] }
  | { type: 'moved'; names: string[]; position: LayerDropPosition; target: string }
  | { type: 'cancelled' };

export interface LayerTreeStateLabels { hidden: string; locked: string; agent: string }

export interface LayerTreeItemProps extends Omit<ComponentProps<'div'>, 'children' | 'content'> {
  /** Stable identity (selection, expansion, moves); rendered as data-item-id. */
  itemId: string;
  /** Zero-based nesting depth; aria-level is depth + 1. */
  depth?: number;
  /** The layer name. */
  label: ReactNode;
  /** Kind glyph. */
  icon?: ReactNode;
  /** The layer has children (rendered or not): shows a twisty and aria-expanded. */
  expandable?: boolean;
  /** Seeds the expanded set when the tree has no defaultExpanded; the tree-level set is the source of truth afterwards. */
  open?: boolean;
  /** State hook for fixtures; normally derived from the tree-level selection. */
  selected?: boolean;
  /** Selected but not the primary selection (neutral.pressed with the check, secondary text instead of primary). */
  secondary?: boolean;
  /** The layer is hidden on the canvas. */
  invisible?: boolean;
  /** The layer is locked. */
  locked?: boolean;
  /** A main component: component tint. */
  component?: boolean;
  /** Shows the agent mark. */
  agent?: boolean;
  /** Type tag, for example "Instance". */
  tag?: ReactNode;
  /** Layout summary in the end cluster, for example "auto · 12". */
  caption?: ReactNode;
  /** Extra trailing content before the built-in toggles. */
  end?: ReactNode;
  /** Drop target hook. Normally set internally while dragging. */
  drop?: LayerDropPosition;
}

export interface LayerTreeProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'value' | 'children'>, CommonProps {
  /** Accessible name of the tree. */
  'aria-label': string;
  /** Builds the live-region text from an event. */
  announce: (event: LayerTreeAnnouncement) => string;
  /** aria-label of the visibility toggle; required with onVisibilityChange. */
  visibilityLabel?: ((name: string, hidden: boolean) => string) | undefined;
  /** aria-label of the lock toggle; required with onLockChange. */
  lockLabel?: ((name: string, locked: boolean) => string) | undefined;
  /** Words of the hidden row description; required when a row can be invisible, locked or agent-marked. */
  stateLabels?: LayerTreeStateLabels | undefined;
  /** Controlled selection: the last id is the primary selection (it reads primary text). */
  value?: string[];
  defaultValue?: string[];
  /** Controlled set of expanded row ids. */
  expanded?: string[];
  /** Uncontrolled initial expanded ids. Defaults to the rows that have open set. */
  defaultExpanded?: string[];
  /** Name of the layer being dragged; renders the ghost. Normally set internally during a drag. */
  dragLabel?: string;
  /** Glyph in the ghost for a dragLabel set from outside. */
  dragIcon?: ReactNode;
  onValueChange?: (ids: string[]) => void;
  onExpandedChange?: (ids: string[]) => void;
  onMove?: (event: LayerTreeMoveEvent) => void;
  onVisibilityChange?: (event: { id: string; hidden: boolean }) => void;
  onLockChange?: (event: { id: string; locked: boolean }) => void;
  /** The LayerTreeItem rows that are visible (ancestors expanded). */
  children?: ReactNode;
}

interface RowInfo {
  id: string; depth: number; text: string; expandable: boolean; invisible: boolean; locked: boolean; icon: ReactNode;
  pos: number; size: number; parent: number;
}
type Drop = { id: string; position: LayerDropPosition };
interface Drag { ids: string[]; label: string; icon: ReactNode; x: number; y: number; drop: Drop | null }

interface Ctx {
  info: Map<string, RowInfo>;
  selected: Set<string>;
  primary: string | undefined;
  expanded: Set<string>;
  tabId: string | undefined;
  drop: Drop | null;
  hasVisibility: boolean;
  hasLock: boolean;
  /** The first row hosts the live region: a tree may only own treeitems, so the region lives inside one. */
  statusHost: string | undefined;
  message: string;
  visibilityLabel: LayerTreeProps['visibilityLabel'];
  lockLabel: LayerTreeProps['lockLabel'];
  stateLabels: LayerTreeProps['stateLabels'];
  /** Common props the rows read: drop colour and emphasis, row size and radius. */
  tone: Tone | undefined;
  variant: Variant | undefined;
  size: Size | undefined;
  radius: Radius | undefined;
  setFocus: (id: string) => void;
  click: (e: MouseEvent<HTMLElement>, id: string) => void;
  toggleExpanded: (id: string) => void;
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;
  pointerDown: (e: PointerEvent<HTMLElement>, id: string) => void;
  pointerMove: (e: PointerEvent<HTMLElement>) => void;
  pointerUp: (e: PointerEvent<HTMLElement>) => void;
  pointerCancel: (e: PointerEvent<HTMLElement>) => void;
}
const TreeContext = createContext<Ctx | null>(null);

const textOf = (label: ReactNode, id: string) => (typeof label === 'string' ? label : id);
const sameIds = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

/**
 * The layer panel: a flat ARIA tree of the canvas objects with expansion, single and multiple selection,
 * visibility and lock, and a drop indicator. The consumer owns the data and applies the reported moves.
 */
export function LayerTree({
  announce, visibilityLabel, lockLabel, stateLabels, value, defaultValue, expanded: expandedProp, defaultExpanded, dragLabel, dragIcon,
  onValueChange, onExpandedChange, onMove, onVisibilityChange, onLockChange,
  tone, variant, radius, shadow, size, className, style, children, onKeyDown, ...props
}: LayerTreeProps) {
  const root = useRef<HTMLDivElement>(null);
  const nodes = Children.toArray(children).filter((c): c is ReactElement<LayerTreeItemProps> => isValidElement(c));

  const [sel, setSel] = useControllableState<string[]>({ value, defaultValue: defaultValue ?? [], onChange: onValueChange });
  const [open, setOpen] = useControllableState<string[]>({
    value: expandedProp, defaultValue: defaultExpanded ?? nodes.filter(n => n.props.open).map(n => n.props.itemId), onChange: onExpandedChange,
  });
  const [focusId, setFocusId] = useState<string | undefined>();
  const [message, setMessage] = useState('');
  const [drag, setDrag] = useState<Drag | null>(null);
  const anchor = useRef<string | undefined>(undefined);
  const toggleMode = useRef(false);
  const typed = useRef({ text: '', timer: 0 });

  // Row model: depth, siblings, parent.
  const rows: RowInfo[] = [];
  {
    const parents: number[] = [];
    const counts = new Map<string, number>();
    nodes.forEach((n, i) => {
      const p = n.props; const depth = p.depth ?? 0;
      while (parents.length && rows[parents[parents.length - 1]!]!.depth >= depth) parents.pop();
      const parent = parents.length ? parents[parents.length - 1]! : -1;
      const key = `${parent}:${depth}`;
      const pos = (counts.get(key) ?? 0) + 1; counts.set(key, pos);
      rows.push({ id: p.itemId, depth, text: textOf(p.label, p.itemId), expandable: !!p.expandable, invisible: !!p.invisible, locked: !!p.locked, icon: p.icon, pos, size: 0, parent });
      parents.push(i);
    });
    const sizes = new Map<string, number>();
    for (const r of rows) { const key = `${r.parent}:${r.depth}`; sizes.set(key, (sizes.get(key) ?? 0) + 1); }
    for (const r of rows) r.size = sizes.get(`${r.parent}:${r.depth}`)!;
  }
  const info = new Map(rows.map(r => [r.id, r]));
  const indexOf = (id: string) => rows.findIndex(r => r.id === id);
  const selected = new Set(sel);
  const primary = sel.length ? sel[sel.length - 1] : undefined;
  const expanded = new Set(open);
  const tabId = [focusId, primary, rows[0]?.id].find(id => id !== undefined && info.has(id));

  const orderedSelection = () => rows.filter(r => selected.has(r.id)).map(r => r.id);
  const label = (id: string) => info.get(id)?.text ?? id;
  const say = (event: LayerTreeAnnouncement) => setMessage(announce(event));

  const focusRow = (id: string) => {
    setFocusId(id);
    root.current?.querySelector<HTMLElement>(`[data-item-id="${CSS.escape(id)}"]`)?.focus();
  };

  // ── selection
  const announceSelection = (next: string[]) => say({ type: 'selected', names: next.map(label) });
  const select = (next: string[]) => {
    if (sameIds(next, sel)) return;
    setSel(next); announceSelection(next);
  };
  const selectOnly = (id: string) => { anchor.current = id; select([id]); };
  const toggleIn = (id: string) => {
    anchor.current = id;
    select(selected.has(id) ? sel.filter(x => x !== id) : [...sel, id]);
  };
  const rangeTo = (id: string) => {
    const from = indexOf(anchor.current ?? primary ?? id), to = indexOf(id);
    if (from < 0 || to < 0) { selectOnly(id); return; }
    const slice = rows.slice(Math.min(from, to), Math.max(from, to) + 1).map(r => r.id);
    select(from <= to ? slice : slice.reverse());
  };

  // ── expansion
  const setExpandedIds = (ids: string[]) => setOpen(ids);
  const toggleExpanded = (id: string) => {
    const was = expanded.has(id);
    setExpandedIds(was ? open.filter(x => x !== id) : [...open, id]);
    say({ type: was ? 'collapsed' : 'expanded', names: [label(id)] });
  };

  // ── visibility and lock
  const toggleVisibility = (id: string) => {
    const hidden = !info.get(id)?.invisible;
    onVisibilityChange?.({ id, hidden });
    say({ type: hidden ? 'hid' : 'showed', names: [label(id)] });
  };
  const toggleLock = (id: string) => {
    const locked = !info.get(id)?.locked;
    onLockChange?.({ id, locked });
    say({ type: locked ? 'locked' : 'unlocked', names: [label(id)] });
  };
  const toggleSelected = (kind: 'visibility' | 'lock') => {
    const ids = orderedSelection(); if (!ids.length) return;
    if (kind === 'visibility') {
      ids.forEach(id => onVisibilityChange?.({ id, hidden: !info.get(id)?.invisible }));
      const hide = !info.get(ids[0]!)?.invisible;
      say({ type: hide ? 'hid' : 'showed', names: ids.map(label) });
    } else {
      ids.forEach(id => onLockChange?.({ id, locked: !info.get(id)?.locked }));
      const lock = !info.get(ids[0]!)?.locked;
      say({ type: lock ? 'locked' : 'unlocked', names: ids.map(label) });
    }
  };

  // ── moves from the keyboard
  const previousSibling = (i: number) => {
    for (let j = i - 1; j >= 0; j--) { if (rows[j]!.depth < rows[i]!.depth) return -1; if (rows[j]!.depth === rows[i]!.depth) return j; }
    return -1;
  };
  const nextSibling = (i: number) => {
    for (let j = i + 1; j < rows.length; j++) { if (rows[j]!.depth < rows[i]!.depth) return -1; if (rows[j]!.depth === rows[i]!.depth) return j; }
    return -1;
  };
  const moveSelected = (dir: 'up' | 'down' | 'in' | 'out', fallback: string) => {
    const ids = selected.size ? orderedSelection() : [fallback];
    const first = indexOf(ids[0]!), last = indexOf(ids[ids.length - 1]!);
    let target = -1; let position: LayerDropPosition = 'before';
    if (dir === 'up') { target = previousSibling(first); position = 'before'; }
    else if (dir === 'down') { target = nextSibling(last); position = 'after'; }
    else if (dir === 'in') { target = previousSibling(first); position = 'inside'; }
    else { target = rows[first]!.parent; position = 'after'; }
    if (target < 0) return;
    const t = rows[target]!;
    onMove?.({ ids, targetId: t.id, position });
    say({ type: 'moved', names: ids.map(label), position, target: t.text });
  };

  // ── keyboard
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    const rowEl = target.closest<HTMLElement>('[role="treeitem"]');
    const id = rowEl?.dataset.itemId; if (!id) return;
    const i = indexOf(id); if (i < 0) return;
    const row = rows[i]!;
    const mod = e.ctrlKey || e.metaKey;
    const key = e.key;
    const consume = () => e.preventDefault();

    if (key === 'Escape') {
      if (drag) { consume(); cancelDrag(); }
      else if (sel.length > 1 && primary) { consume(); anchor.current = primary; select([primary]); }
      return;
    }
    if (e.altKey && !mod && !e.shiftKey) {
      const dir = { ArrowUp: 'up', ArrowDown: 'down', ArrowRight: 'in', ArrowLeft: 'out' }[key] as 'up' | 'down' | 'in' | 'out' | undefined;
      if (dir) { consume(); moveSelected(dir, id); }
      return;
    }
    if (mod && e.shiftKey && (key === 'h' || key === 'H')) { consume(); toggleSelected('visibility'); return; }
    if (mod && e.shiftKey && (key === 'l' || key === 'L')) { consume(); toggleSelected('lock'); return; }
    if (mod && (key === 'a' || key === 'A')) { consume(); anchor.current = rows[0]?.id; select(rows.map(r => r.id)); return; }

    const go = (j: number) => {
      const t = rows[Math.max(0, Math.min(rows.length - 1, j))]; if (!t) return;
      consume();
      if (e.shiftKey) { rangeTo(t.id); toggleMode.current = false; }
      else if (mod) toggleMode.current = true;
      else { toggleMode.current = false; if (sel.length <= 1) selectOnly(t.id); }
      focusRow(t.id);
    };
    if (key === 'ArrowDown') { go(i + 1); return; }
    if (key === 'ArrowUp') { go(i - 1); return; }
    if (key === 'Home') { go(0); return; }
    if (key === 'End') { go(rows.length - 1); return; }
    if (key === 'ArrowRight') {
      consume();
      if (row.expandable && !expanded.has(id)) toggleExpanded(id);
      else if (row.expandable && rows[i + 1] && rows[i + 1]!.depth > row.depth) focusRow(rows[i + 1]!.id);
      return;
    }
    if (key === 'ArrowLeft') {
      consume();
      if (row.expandable && expanded.has(id)) toggleExpanded(id);
      else if (row.parent >= 0) focusRow(rows[row.parent]!.id);
      return;
    }
    if (key === ' ' || key === 'Enter') {
      consume();
      if (key === ' ' && (mod || toggleMode.current)) toggleIn(id); else selectOnly(id);
      toggleMode.current = false;
      return;
    }
    if (key === '*') {
      consume();
      const siblings = rows.filter(r => r.parent === row.parent && r.depth === row.depth && r.expandable && !expanded.has(r.id)).map(r => r.id);
      if (siblings.length) { setExpandedIds([...open, ...siblings]); say({ type: 'expanded', names: siblings.map(label) }); }
      return;
    }
    if (key.length === 1 && !mod && !e.altKey) {
      window.clearTimeout(typed.current.timer);
      typed.current.text += key.toLowerCase();
      typed.current.timer = window.setTimeout(() => { typed.current.text = ''; }, 600);
      const next = [...rows.slice(i + 1), ...rows.slice(0, i + 1)].find(r => r.text.toLowerCase().startsWith(typed.current.text));
      if (next) { focusRow(next.id); if (sel.length <= 1) selectOnly(next.id); }
    }
  };

  // ── pointer
  const press = useRef<{ id: string; pid: number; x: number; y: number; active: boolean; ids: string[]; drop: Drop | null } | null>(null);
  const suppressClick = useRef(false);
  const hoverTimer = useRef<{ id: string; timer: number } | null>(null);
  const clearHover = () => { if (hoverTimer.current) { window.clearTimeout(hoverTimer.current.timer); hoverTimer.current = null; } };

  const click = (e: MouseEvent<HTMLElement>, id: string) => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    setFocusId(id);
    if (e.shiftKey) rangeTo(id);
    else if (e.ctrlKey || e.metaKey) toggleIn(id);
    else selectOnly(id);
  };

  const descendantsOf = (ids: string[]) => {
    const out = new Set(ids);
    for (const id of ids) {
      const i = indexOf(id); if (i < 0) continue;
      for (let j = i + 1; j < rows.length && rows[j]!.depth > rows[i]!.depth; j++) out.add(rows[j]!.id);
    }
    return out;
  };
  const inPlace = (ids: string[], d: Drop) => {
    const idx = ids.map(indexOf).sort((a, b) => a - b);
    const first = idx[0]!, last = idx[idx.length - 1]!;
    if (idx.some((x, k) => x !== first + k)) return false;
    const t = indexOf(d.id);
    if (d.position === 'before') return t === last + 1 && rows[t]?.depth === rows[first]!.depth;
    if (d.position === 'after') return t === first - 1 && rows[t]?.depth === rows[first]!.depth;
    return false;
  };

  const pointerDown = (e: PointerEvent<HTMLElement>, id: string) => {
    suppressClick.current = false;
    if (e.button !== 0 || e.shiftKey || e.ctrlKey || e.metaKey) return;
    if ((e.target as HTMLElement).closest('button, [data-slot="layer-tree-twisty"]')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const ids = selected.has(id) ? orderedSelection() : [id];
    press.current = { id, pid: e.pointerId, x: e.clientX, y: e.clientY, active: false, ids, drop: null };
  };
  const pointerMove = (e: PointerEvent<HTMLElement>) => {
    const p = press.current; if (!p || p.pid !== e.pointerId) return;
    if (!p.active) {
      if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < 4) return;
      p.active = true;
    }
    const box = root.current!.getBoundingClientRect();
    const blocked = descendantsOf(p.ids);
    let drop: Drop | null = null;
    if (e.clientX >= box.left && e.clientX <= box.right && e.clientY >= box.top && e.clientY <= box.bottom) {
      const els = Array.from(root.current!.querySelectorAll<HTMLElement>('[data-slot="layer-tree-row"]'));
      const hit = els.find(el => { const b = el.getBoundingClientRect(); return e.clientY >= b.top && e.clientY <= b.bottom + 1; });
      const tid = hit?.dataset.itemId;
      if (hit && tid && !blocked.has(tid)) {
        const b = hit.getBoundingClientRect(); const f = (e.clientY - b.top) / b.height;
        const expandable = !!info.get(tid)?.expandable;
        const position: LayerDropPosition = expandable ? (f < 1 / 3 ? 'before' : f > 2 / 3 ? 'after' : 'inside') : (f < 0.5 ? 'before' : 'after');
        drop = { id: tid, position };
      }
    }
    p.drop = drop;
    const dragged = info.get(p.id);
    setDrag({ ids: p.ids, label: dragged?.text ?? p.id, icon: dragged?.icon, x: e.clientX - box.left + 12, y: e.clientY - box.top + 8, drop });
    // Hovering a collapsed branch while dragging opens it after a short delay.
    const branch = drop?.position === 'inside' && !expanded.has(drop.id) ? drop.id : null;
    if (!branch) clearHover();
    else if (hoverTimer.current?.id !== branch) {
      clearHover();
      hoverTimer.current = { id: branch, timer: window.setTimeout(() => { hoverTimer.current = null; setOpen(prev => (prev.includes(branch) ? prev : [...prev, branch])); }, 700) };
    }
  };
  const endPress = (e: PointerEvent<HTMLElement>) => {
    const p = press.current;
    press.current = null; clearHover(); setDrag(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    return p;
  };
  const pointerUp = (e: PointerEvent<HTMLElement>) => {
    if (press.current?.pid !== e.pointerId) return;
    const p = endPress(e); if (!p?.active) return;
    suppressClick.current = true;
    if (!p.drop || inPlace(p.ids, p.drop)) return;
    onMove?.({ ids: p.ids, targetId: p.drop.id, position: p.drop.position });
    say({ type: 'moved', names: p.ids.map(label), position: p.drop.position, target: label(p.drop.id) });
  };
  const pointerCancel = (e: PointerEvent<HTMLElement>) => {
    if (press.current?.pid !== e.pointerId) return;
    endPress(e);
  };
  const cancelDrag = () => {
    press.current = null; clearHover(); setDrag(null);
    suppressClick.current = true;
    say({ type: 'cancelled' });
  };

  const ctx: Ctx = {
    info, selected, primary, expanded, tabId, drop: drag?.drop ?? null,
    hasVisibility: !!onVisibilityChange, hasLock: !!onLockChange, statusHost: rows[0]?.id, message, visibilityLabel, lockLabel, stateLabels,
    tone, variant, size, radius,
    setFocus: setFocusId, click, toggleExpanded, toggleVisibility, toggleLock, pointerDown, pointerMove, pointerUp, pointerCancel,
  };

  const ghostLabel = dragLabel ?? drag?.label;
  const ghostIcon = drag ? drag.icon : dragIcon;
  const rootStyle = drag ? ({ ...style, '--ghost-x': `${drag.x}px`, '--ghost-y': `${drag.y}px` } as CSSProperties) : style;

  return (
    <TreeContext.Provider value={ctx}>
      <div
        ref={root} data-slot="layer-tree" role="tree" aria-multiselectable="true"
        className={cn(layerTreeVariants(), layerTreeFrameVariants({ shadow }), className)} style={rootStyle} onKeyDown={handleKeyDown} {...props}
      >
        {children}
        {ghostLabel != null && (
          <div data-slot="layer-tree-ghost" aria-hidden className={layerTreeGhostVariants({ size })}>
            {ghostIcon != null && <span data-slot="layer-tree-ghost-icon" className={layerTreeGhostIconVariants()}>{ghostIcon}</span>}
            {ghostLabel}
          </div>
        )}
        {!rows.length && <div data-slot="layer-tree-status" role="status" aria-live="polite" className="sr-only">{message}</div>}
      </div>
    </TreeContext.Provider>
  );
}

/** One layer row: twisty, kind glyph, name, optional type tag, and the trailing cluster. */
export function LayerTreeItem({
  itemId, depth = 0, label, icon, expandable = false, open: _open, selected: selectedProp, secondary: secondaryProp, invisible = false, locked = false,
  component = false, agent = false, tag, caption, end, drop: dropProp, className, style, ...props
}: LayerTreeItemProps) {
  const ctx = useContext(TreeContext)!;
  const labelId = useId();
  const descId = useId();
  const row = ctx.info.get(itemId);
  const isSelected = selectedProp ?? ctx.selected.has(itemId);
  const isSecondary = isSelected && (secondaryProp ?? (selectedProp !== undefined ? false : ctx.primary !== itemId));
  const isPrimary = isSelected && !isSecondary;
  const isExpanded = ctx.expanded.has(itemId);
  const dropPos = dropProp ?? (ctx.drop?.id === itemId ? ctx.drop.position : undefined);
  const name = textOf(label, itemId);
  const notes = [invisible && ctx.stateLabels?.hidden, locked && ctx.stateLabels?.locked, agent && ctx.stateLabels?.agent].filter(Boolean).join(', ');
  const showEnd = isSelected || caption != null || agent || end != null || ctx.hasVisibility || ctx.hasLock;
  return (
    <div
      data-slot="layer-tree-row" role="treeitem" data-item-id={itemId}
      aria-level={depth + 1} aria-setsize={row?.size} aria-posinset={row?.pos}
      aria-selected={isSelected} aria-expanded={expandable ? isExpanded : undefined}
      aria-labelledby={labelId} aria-describedby={notes ? descId : undefined}
      tabIndex={ctx.tabId === itemId ? 0 : -1}
      data-selected={isSelected || undefined} data-primary={isPrimary || undefined} data-secondary={isSecondary || undefined}
      data-hidden={invisible || undefined} data-locked={locked || undefined} data-component={component || undefined} data-drop={dropPos}
      style={{ ...style, '--depth': depth } as CSSProperties}
      className={cn(layerTreeRowVariants({ tone: ctx.tone, variant: ctx.variant, size: ctx.size }), layerTreeRowRadiusVariants({ radius: ctx.radius }), className)}
      onFocus={e => { if (e.target === e.currentTarget) ctx.setFocus(itemId); }}
      onClick={e => ctx.click(e, itemId)}
      onPointerDown={e => ctx.pointerDown(e, itemId)} onPointerMove={ctx.pointerMove} onPointerUp={ctx.pointerUp} onPointerCancel={ctx.pointerCancel}
      {...props}
    >
      <span
        data-slot="layer-tree-twisty" aria-hidden className={layerTreeTwistyVariants()}
        onClick={expandable ? e => { e.stopPropagation(); ctx.toggleExpanded(itemId); } : undefined}
      >
        {expandable ? <ChevronRight className={layerTreeChevronVariants({ open: isExpanded })} /> : null}
      </span>
      {icon != null && <span data-slot="layer-tree-icon" aria-hidden className={layerTreeIconVariants()}>{icon}</span>}
      <span data-slot="layer-tree-label" id={labelId} aria-disabled={invisible || undefined} className={layerTreeLabelVariants()}>{label}</span>
      {tag != null && <span data-slot="layer-tree-tag" className={layerTreeTagVariants()}>{tag}</span>}
      {showEnd && (
        <div data-slot="layer-tree-end" className={layerTreeEndVariants()}>
          {caption != null && <span data-slot="layer-tree-caption" className={layerTreeCaptionVariants()}>{caption}</span>}
          {agent && <span data-slot="layer-tree-mark" aria-hidden className={layerTreeMarkVariants()} />}
          {end}
          {isSelected && <span data-slot="layer-tree-check" aria-hidden="true" className={layerTreeCheckVariants()}><Check /></span>}
          {ctx.hasVisibility && (
            <button
              type="button" tabIndex={-1} data-slot="layer-tree-visibility" aria-label={ctx.visibilityLabel?.(name, invisible)} aria-pressed={invisible}
              className={layerTreeVisibilityVariants()}
              onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); ctx.toggleVisibility(itemId); }}
            >
              {invisible ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
            </button>
          )}
          {ctx.hasLock && (
            <button
              type="button" tabIndex={-1} data-slot="layer-tree-lock" aria-label={ctx.lockLabel?.(name, locked)} aria-pressed={locked}
              className={layerTreeLockVariants()}
              onPointerDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); ctx.toggleLock(itemId); }}
            >
              {locked ? <Lock aria-hidden /> : <LockOpen aria-hidden />}
            </button>
          )}
        </div>
      )}
      {dropPos && dropPos !== 'inside' && <span data-slot="layer-tree-drop-indicator" aria-hidden data-drop={dropPos} className={layerTreeDropVariants({ tone: ctx.tone })} />}
      {notes && <span id={descId} className="sr-only">{notes}</span>}
      {ctx.statusHost === itemId && <div data-slot="layer-tree-status" role="status" aria-live="polite" className="sr-only">{ctx.message}</div>}
    </div>
  );
}
