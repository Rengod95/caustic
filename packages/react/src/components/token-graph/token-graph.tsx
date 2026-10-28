'use client';
import {
  createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState,
  type ComponentProps, type CSSProperties, type KeyboardEvent, type ReactNode,
} from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Size, Variant } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import {
  tokenGraphMetaVariants, tokenGraphNameVariants, tokenGraphNodeVariants, tokenGraphPortVariants, tokenGraphSwatchVariants,
  tokenGraphTierVariants, tokenGraphVariants, tokenGraphWireVariants, tokenGraphWiresVariants,
} from './token-graph.variants.ts';

interface NodeInfo { title: string; x: number; y: number; missing: boolean }
interface Ctx {
  edges: [string, string][];
  traced: Set<string>;
  nodes: Map<string, NodeInfo>;
  register: (id: string, info: NodeInfo) => () => void;
  press: (id: string) => void;
  variant?: Variant | undefined;
  size?: Size | undefined;
}
const GraphCtx = createContext<Ctx | null>(null);

interface Wire { key: string; d: string; traced: boolean; dimmed: boolean }

export interface TokenGraphProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'>, CommonProps {
  /** [source id, target id] of each edge. */
  edges: [string, string][];
  /** Controlled id of the traced node. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (id: string) => void;
}

const reach = (start: string, edges: [string, string][], dir: 'up' | 'down') => {
  const out = new Set<string>();
  const queue = [start];
  while (queue.length) {
    const id = queue.pop()!;
    for (const [a, b] of edges) {
      const [from, to] = dir === 'up' ? [b, a] : [a, b];
      if (from === id && !out.has(to)) { out.add(to); queue.push(to); }
    }
  }
  return out;
};

/** A three-tier token dependency graph on a dot-grid canvas. Press a node to trace its sources and consumers. */
export function TokenGraph({ edges, value, defaultValue = null, onValueChange, tone, variant, radius, shadow, size, className, children, onKeyDown, ...props }: TokenGraphProps) {
  const [current, setCurrent] = useControllableState<string | null>({ value, defaultValue, onChange: onValueChange as ((v: string | null) => void) | undefined });
  const [nodes, setNodes] = useState<Map<string, NodeInfo>>(() => new Map());
  const [wires, setWires] = useState<Wire[]>([]);
  const [box, setBox] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const rootRef = useRef<HTMLDivElement>(null);

  const register = useCallback((id: string, info: NodeInfo) => {
    setNodes(prev => {
      const old = prev.get(id);
      if (old && old.title === info.title && old.x === info.x && old.y === info.y && old.missing === info.missing) return prev;
      return new Map(prev).set(id, info);
    });
    return () => setNodes(prev => { if (!prev.has(id)) return prev; const next = new Map(prev); next.delete(id); return next; });
  }, []);

  const traced = useMemo(() => {
    const set = new Set<string>();
    if (current == null || nodes.get(current)?.missing) return set;
    set.add(current);
    reach(current, edges, 'up').forEach(id => set.add(id));
    reach(current, edges, 'down').forEach(id => set.add(id));
    nodes.forEach((n, id) => { if (n.missing) set.delete(id); });
    return set;
  }, [current, edges, nodes]);

  // Wires are measured from the real node boxes after layout; they redraw on resize and when fonts load.
  const draw = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const r = root.getBoundingClientRect();
    const all = Array.from(root.querySelectorAll<HTMLElement>('[data-item-id]'));
    const find = (id: string) => all.find(el => el.dataset.itemId === id);
    const next: Wire[] = [];
    for (const [a, b] of edges) {
      const ea = find(a), eb = find(b);
      if (!ea || !eb) continue;
      const A = ea.getBoundingClientRect(), B = eb.getBoundingClientRect();
      const x1 = A.right - r.left, y1 = A.top - r.top + A.height / 2, x2 = B.left - r.left, y2 = B.top - r.top + B.height / 2;
      const mx = (x1 + x2) / 2;
      next.push({ key: `${a}>${b}`, d: `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`, traced: traced.has(a) && traced.has(b), dimmed: traced.size > 0 && !(traced.has(a) && traced.has(b)) });
    }
    setBox(prev => (prev.w === r.width && prev.h === r.height ? prev : { w: r.width, h: r.height }));
    setWires(prev => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, [edges, traced]);

  useLayoutEffect(() => { draw(); }, [draw, nodes]);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => draw());
    observer?.observe(root);
    window.addEventListener('resize', draw);
    void document.fonts?.ready.then(draw);
    const frame = requestAnimationFrame(draw);
    return () => { observer?.disconnect(); window.removeEventListener('resize', draw); cancelAnimationFrame(frame); };
  }, [draw]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const id = (e.target as HTMLElement).closest<HTMLElement>('[data-item-id]')?.dataset.itemId;
    if (!id || !['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    const here = nodes.get(id);
    if (!here) return;
    const nearest = (ids: string[]) => ids.filter(i => nodes.has(i)).sort((p, q) => Math.abs(nodes.get(p)!.y - here.y) - Math.abs(nodes.get(q)!.y - here.y))[0];
    let target: string | undefined;
    if (e.key === 'ArrowRight') target = nearest(edges.filter(([a]) => a === id).map(([, b]) => b));
    else if (e.key === 'ArrowLeft') target = nearest(edges.filter(([, b]) => b === id).map(([a]) => a));
    else {
      const tier = [...nodes].filter(([, n]) => n.x === here.x).sort((p, q) => p[1].y - q[1].y).map(([i]) => i);
      target = tier[tier.indexOf(id) + (e.key === 'ArrowDown' ? 1 : -1)];
    }
    e.preventDefault();
    if (target) Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[data-item-id]') ?? []).find(el => el.dataset.itemId === target)?.focus();
  };

  const ctx = useMemo<Ctx>(() => ({ edges, traced, nodes, register, press: id => setCurrent(id), variant, size }), [edges, traced, nodes, register, setCurrent, variant, size]);

  return (
    <GraphCtx.Provider value={ctx}>
      <div ref={rootRef} role="group" data-slot="token-graph" className={cn(tokenGraphVariants({ tone, radius, shadow }), className)} onKeyDown={handleKeyDown} {...props}>
        <svg data-slot="token-graph-wires" aria-hidden="true" viewBox={`0 0 ${box.w} ${box.h}`} className={tokenGraphWiresVariants()}>
          {wires.map(w => <path key={w.key} data-slot="token-graph-wire" data-traced={w.traced ? '' : undefined} data-dimmed={w.dimmed ? '' : undefined} d={w.d} className={tokenGraphWireVariants()} />)}
        </svg>
        {children}
      </div>
    </GraphCtx.Provider>
  );
}

export interface TokenGraphTierProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** Tier caption. */
  label: ReactNode;
  /** Horizontal anchor: start 16px from the left, center 38%, end 16px from the right. */
  at?: 'start' | 'center' | 'end';
}

export function TokenGraphTier({ label, at = 'start', className, ...props }: TokenGraphTierProps) {
  return <span data-slot="token-graph-tier" data-at={at} className={cn(tokenGraphTierVariants({ at }), className)} {...props}>{label}</span>;
}

export interface TokenGraphNodeProps extends Omit<ComponentProps<'button'>, 'title' | 'children'> {
  /** Identity of the node (edges, value). */
  itemId: string;
  /** Left edge in percent of the canvas width. */
  x: number;
  /** Top edge in percent of the canvas height. */
  y: number;
  /** Token path. */
  title: string;
  /** Second line text. */
  description?: ReactNode;
  /** Color swatch: a CSS color string (set as --swatch) or a ready element. */
  swatch?: ReactNode;
  /** State hook for fixtures; normally derived from the graph value and edges. */
  traced?: boolean;
  /** The token is a reference to something that does not exist. */
  missing?: boolean;
}

export function TokenGraphNode({ itemId, x, y, title, description, swatch, traced = false, missing = false, className, style, onClick, ...props }: TokenGraphNodeProps) {
  const ctx = useContext(GraphCtx);
  const descId = useId();
  const register = ctx?.register;
  useEffect(() => register?.(itemId, { title, x, y, missing }), [register, itemId, title, x, y, missing]);
  const isTraced = !missing && (traced || (ctx?.traced.has(itemId) ?? false));
  // Off the trace while the graph traces something: the node steps back so the traced path stands out.
  const dimmed = !isTraced && !missing && (ctx?.traced.size ?? 0) > 0;
  const names = (ids: string[]) => ids.map(i => ctx?.nodes.get(i)?.title ?? i).join(', ');
  const edges = ctx?.edges ?? [];
  const sources = edges.filter(([, b]) => b === itemId).map(([a]) => a);
  const users = edges.filter(([a]) => a === itemId).map(([, b]) => b);
  const xs = [...new Set([...(ctx?.nodes.values() ?? [])].map(n => n.x))].sort((a, b) => a - b);
  const tier = xs.indexOf(x) + 1;
  const sentence = [
    tier > 0 ? `tier ${tier} of ${xs.length}` : '',
    missing ? 'missing reference' : '',
    sources.length ? `depends on ${names(sources)}` : '',
    users.length ? `used by ${names(users)}` : '',
  ].filter(Boolean).join('; ');
  return (
    <>
      <button
        type="button" data-slot="token-graph-node" data-item-id={itemId} data-traced={isTraced ? '' : undefined} data-missing={missing ? '' : undefined} data-dimmed={dimmed ? '' : undefined}
        aria-pressed={isTraced} aria-describedby={descId}
        className={cn(tokenGraphNodeVariants({ variant: ctx?.variant, size: ctx?.size, traced: isTraced, missing, dimmed }), className)}
        style={{ '--x': `${x}%`, '--y': `${y}%`, ...style } as CSSProperties}
        onClick={e => { onClick?.(e); if (!e.defaultPrevented) ctx?.press(itemId); }}
        {...props}
      >
        <span data-slot="token-graph-port-in" aria-hidden="true" className={tokenGraphPortVariants({ side: 'in' })} />
        <b data-slot="token-graph-name" className={tokenGraphNameVariants()}>{title}</b>
        <span data-slot="token-graph-meta" className={tokenGraphMetaVariants()}>
          {typeof swatch === 'string'
            ? <span data-slot="token-graph-swatch" aria-hidden="true" className={tokenGraphSwatchVariants()} style={{ '--swatch': swatch } as CSSProperties} />
            : swatch}
          {description}
        </span>
        <span data-slot="token-graph-port-out" aria-hidden="true" className={tokenGraphPortVariants({ side: 'out' })} />
      </button>
      <span id={descId} hidden>{sentence}</span>
    </>
  );
}
