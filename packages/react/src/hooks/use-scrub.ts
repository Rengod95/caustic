import { useEffect, useRef, useState, type PointerEvent } from 'react';

/**
 * Drag-to-scrub for numeric labels. Every 2px of horizontal travel is one step;
 * Shift multiplies by 10, Alt by 0.1. Pure maths is exported for unit tests.
 */
export function scrubValue(start: number, dx: number, step: number, mods: { shift?: boolean; alt?: boolean }) {
  const m = mods.shift ? 10 : mods.alt ? 0.1 : 1;
  const next = start + Math.round(dx / 2) * step * m;
  return Math.round(next * 1000) / 1000;
}

export interface ScrubOptions {
  /** The pointer was released; `moved` is true when at least one value was produced. */
  onEnd?: ((moved: boolean) => void) | undefined;
  /** The drag was cancelled with Escape or by the browser (pointercancel). */
  onCancel?: (() => void) | undefined;
}

export function useScrub(get: () => number, set: (v: number) => void, step = 1, options: ScrubOptions = {}) {
  const origin = useRef<{ x: number; v: number; moved: boolean } | null>(null);
  const [scrubbing, setScrubbing] = useState(false);
  const opts = useRef(options); opts.current = options;
  useEffect(() => {
    if (!scrubbing) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !origin.current) return;
      origin.current = null; setScrubbing(false); opts.current.onCancel?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [scrubbing]);
  const release = (e: PointerEvent<HTMLElement>) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); };
  return {
    scrubbing,
    handlers: {
      onPointerDown: (e: PointerEvent<HTMLElement>) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); origin.current = { x: e.clientX, v: get(), moved: false }; setScrubbing(true); },
      onPointerMove: (e: PointerEvent<HTMLElement>) => { const o = origin.current; if (!o) return; o.moved = true; set(scrubValue(o.v, e.clientX - o.x, step, { shift: e.shiftKey, alt: e.altKey })); },
      onPointerUp: (e: PointerEvent<HTMLElement>) => { release(e); const o = origin.current; origin.current = null; setScrubbing(false); if (o) opts.current.onEnd?.(o.moved); },
      onPointerCancel: (e: PointerEvent<HTMLElement>) => { release(e); if (!origin.current) return; origin.current = null; setScrubbing(false); opts.current.onCancel?.(); },
    },
  };
}
