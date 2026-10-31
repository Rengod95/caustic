'use client';
import {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
  type ComponentProps, type CSSProperties, type ReactNode,
} from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Tone, Variant } from '../../lib/common-props.ts';
import {
  graphNodeHeadVariants, graphNodeIconVariants, graphNodeMetaVariants, graphNodeTitleVariants, graphNodeVariants,
  graphPortDotVariants, graphPortVariants, nodeGraphLabelVariants, nodeGraphToneVariants, nodeGraphVariants,
  nodeGraphWireEndVariants, nodeGraphWiresVariants, nodeGraphWireVariants,
} from './node-graph.variants.ts';

export type GraphWireState = 'idle' | 'done' | 'active' | 'draft' | 'invalid' | 'muted';
export type GraphPortSide = 'start' | 'end' | 'top' | 'bottom';
export type GraphPortState = 'idle' | 'connected' | 'target' | 'invalid' | 'active' | 'off';
export type GraphNodeState = 'idle' | 'active' | 'done' | 'failed' | 'invalid' | 'dimmed';

/** One wire from an output port to an input port (port ids, see GraphPort portId). */
export interface GraphEdge {
  id?: string;
  from: string;
  to: string;
  state?: GraphWireState;
  /** Dashed stroke for an exit or optional path; the state colour stays. */
  dashed?: boolean;
  /** Text on the wire's midpoint: a transition condition, a count. */
  label?: ReactNode;
}

/** The wire being connected: from a port to a point in graph coordinates (px from the graph origin, unscaled). */
export interface GraphDraft {
  from: string;
  to: { x: number; y: number };
  label?: ReactNode;
}

interface Pt { x: number; y: number; side: GraphPortSide }
interface Wire { key: string; d: string; state: GraphWireState; dashed: boolean; end: Pt; mid: { x: number; y: number } }

const edgeKey = (e: GraphEdge, i: number) => e.id ?? `${e.from}>${e.to}#${i}`;

const dir: Record<GraphPortSide, [number, number]> = { start: [-1, 0], end: [1, 0], top: [0, -1], bottom: [0, 1] };

function curve(a: Pt, b: Pt) {
  const reach = Math.max(36, Math.min(160, Math.hypot(b.x - a.x, b.y - a.y) / 2));
  const [ax, ay] = dir[a.side];
  const [bx, by] = dir[b.side];
  const c1 = { x: a.x + ax * reach, y: a.y + ay * reach };
  const c2 = { x: b.x + bx * reach, y: b.y + by * reach };
  // Cubic midpoint (t = 0.5) for the label.
  const mid = { x: (a.x + 3 * c1.x + 3 * c2.x + b.x) / 8, y: (a.y + 3 * c1.y + 3 * c2.y + b.y) / 8 };
  return { d: `M${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`, mid };
}

export interface NodeGraphProps extends ComponentProps<'div'>, Omit<CommonProps, 'variant' | 'size'> {
  edges: GraphEdge[];
  /** The wire being connected, drawn above the others. */
  draft?: GraphDraft | null;
  /** grid = the dot-grid canvas fill; none (default) = transparent, when the host already is the canvas. */
  surface?: 'grid' | 'none';
  /** Graph coordinate size in px. Nodes are placed in this space; the host may scale it with a CSS transform. */
  width: number;
  height: number;
}

/**
 * A node graph on a canvas: positioned GraphNodes with GraphPorts, and wires drawn between ports. Wires are measured from
 * the real port dots after layout, so they follow node size changes, fonts and a CSS scale on any ancestor. tone sets
 * --tone-solid (active and draft wires, active and selected nodes, drop targets); accent by default.
 */
export function NodeGraph({ edges, draft = null, surface, width, height, tone, radius, shadow, className, style, children, ...props }: NodeGraphProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [wires, setWires] = useState<Wire[]>([]);

  const draw = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const r = root.getBoundingClientRect();
    const scale = root.offsetWidth > 0 ? r.width / root.offsetWidth : 1;
    const ports = new Map<string, Pt>();
    root.querySelectorAll<HTMLElement>('[data-port-id]').forEach(el => {
      const dot = el.querySelector<HTMLElement>('[data-slot="graph-port-dot"]') ?? el;
      const b = dot.getBoundingClientRect();
      ports.set(el.dataset.portId!, {
        x: (b.left + b.width / 2 - r.left) / scale,
        y: (b.top + b.height / 2 - r.top) / scale,
        side: (el.dataset.side as GraphPortSide | undefined) ?? 'start',
      });
    });
    const next: Wire[] = [];
    edges.forEach((e, i) => {
      const a = ports.get(e.from), b = ports.get(e.to);
      if (!a || !b) return;
      const { d, mid } = curve(a, b);
      next.push({ key: edgeKey(e, i), d, mid, end: b, state: e.state ?? 'idle', dashed: e.dashed ?? false });
    });
    if (draft) {
      const a = ports.get(draft.from);
      if (a) {
        const b: Pt = { ...draft.to, side: a.side === 'end' ? 'start' : a.side === 'start' ? 'end' : a.side === 'top' ? 'bottom' : 'top' };
        const { d, mid } = curve(a, b);
        next.push({ key: 'draft', d, mid, end: b, state: 'draft', dashed: false });
      }
    }
    // Children change every render; only commit when the geometry or a state changed, so drawing never loops.
    const sig = (ws: Wire[]) => ws.map(w => `${w.key}|${w.d}|${w.state}|${w.dashed}`).join(';');
    setWires(prev => (sig(prev) === sig(next) ? prev : next));
  }, [edges, draft]);

  useLayoutEffect(() => { draw(); }, [draw, children]);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => draw());
    ro?.observe(root);
    root.querySelectorAll('[data-slot="graph-node"]').forEach(n => ro?.observe(n));
    window.addEventListener('resize', draw);
    void document.fonts?.ready.then(draw);
    const frame = requestAnimationFrame(draw);
    return () => { ro?.disconnect(); window.removeEventListener('resize', draw); cancelAnimationFrame(frame); };
  }, [draw, children]);

  return (
    <div
      ref={rootRef} data-slot="node-graph" role="group"
      className={cn(nodeGraphVariants({ surface, radius, shadow }), nodeGraphToneVariants({ tone }), className)}
      style={{ width, height, ...style }}
      {...props}
    >
      <svg data-slot="node-graph-wires" aria-hidden="true" className={nodeGraphWiresVariants()}>
        <style>{'@keyframes cs-graph-flow { to { stroke-dashoffset: -12; } }'}</style>
        {wires.map(w => (
          <g key={w.key} data-slot="node-graph-wire" data-state={w.state}>
            <path d={w.d} className={nodeGraphWireVariants({ state: w.state, dashed: w.state === 'idle' || w.state === 'done' || w.state === 'muted' ? w.dashed : false })} />
            {w.state === 'draft' && <circle cx={w.end.x} cy={w.end.y} r={3.5} className={nodeGraphWireEndVariants({ state: 'draft' })} />}
          </g>
        ))}
      </svg>
      {wires.map(w => {
        // Labels come from the current props (not the measured state), so new label content never forces a redraw.
        const label = w.key === 'draft' ? draft?.label : edges.find((e, i) => edgeKey(e, i) === w.key)?.label;
        return label == null ? null : (
          <span key={`${w.key}-label`} data-slot="node-graph-label" data-state={w.state} className={nodeGraphLabelVariants({ state: w.state })} style={{ left: w.mid.x, top: w.mid.y }}>
            {label}
          </span>
        );
      })}
      {children}
    </div>
  );
}

export interface GraphNodeProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Left and top edge in graph px. */
  x: number;
  y: number;
  /** Node width in px (default 168). */
  width?: number;
  title: ReactNode;
  /** Small text after the title (a kind, a count, a budget). */
  meta?: ReactNode;
  /** Head icon on a tone face. */
  icon?: ReactNode;
  /** Tone of the icon face (neutral by default). */
  iconTone?: Tone;
  state?: GraphNodeState;
  selected?: boolean;
  /** outline (default) = lifted card; solid; soft; ghost = a dashed drop place. */
  variant?: Variant;
  /** Accessible name when title is not plain text. */
  label?: string;
}

/** A node on the graph: head (icon face, title, meta), then ports and any body. Focusable for keyboard selection. */
export function GraphNode({ x, y, width = 168, title, meta, icon, iconTone, state = 'idle', selected = false, variant, label, className, style, children, ...props }: GraphNodeProps) {
  return (
    <div
      data-slot="graph-node" data-state={state} data-selected={selected ? '' : undefined}
      role="group" aria-label={label ?? (typeof title === 'string' ? title : undefined)} tabIndex={0}
      className={cn(graphNodeVariants({ variant, state, selected }), className)}
      style={{ '--node-x': `${x}px`, '--node-y': `${y}px`, '--node-w': `${width}px`, ...style } as CSSProperties}
      {...props}
    >
      <div data-slot="graph-node-head" className={graphNodeHeadVariants()}>
        {icon != null && <span aria-hidden className={graphNodeIconVariants({ tone: iconTone })}>{icon}</span>}
        <span data-slot="graph-node-title" className={graphNodeTitleVariants()}>{title}</span>
        {meta != null && <span data-slot="graph-node-meta" className={graphNodeMetaVariants()}>{meta}</span>}
      </div>
      {children}
    </div>
  );
}

export interface GraphPortProps extends ComponentProps<'div'> {
  /** Identity used by GraphEdge.from / to. Unique in the graph. */
  portId: string;
  /** Which node edge the dot sits on: start (inputs, default), end (outputs), top, bottom. */
  side?: GraphPortSide;
  state?: GraphPortState;
}

/** A port row: a dot on the node edge and its label (children). */
export function GraphPort({ portId, side = 'start', state = 'idle', className, children, ...props }: GraphPortProps) {
  return (
    <div data-slot="graph-port" data-port-id={portId} data-side={side} data-state={state} className={cn(graphPortVariants({ side, state }), className)} {...props}>
      <span data-slot="graph-port-dot" aria-hidden className={graphPortDotVariants({ side, state })} />
      {children}
    </div>
  );
}
