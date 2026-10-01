import { useRef, useState, type PointerEvent } from 'react';

/**
 * Drag-to-scrub for numeric labels. Every 2px of horizontal travel is one step;
 * Shift multiplies by 10, Alt by 0.1. Pure maths is exported for unit tests.
 */
export function scrubValue(start: number, dx: number, step: number, mods: { shift?: boolean; alt?: boolean }) {
  const m = mods.shift ? 10 : mods.alt ? 0.1 : 1;
  const next = start + Math.round(dx / 2) * step * m;
  return Math.round(next * 1000) / 1000;
}

export function useScrub(get: () => number, set: (v: number) => void, step = 1) {
  const origin = useRef<{ x: number; v: number } | null>(null);
  const [scrubbing, setScrubbing] = useState(false);
  return {
    scrubbing,
    handlers: {
      onPointerDown: (e: PointerEvent<HTMLElement>) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); origin.current = { x: e.clientX, v: get() }; setScrubbing(true); },
      onPointerMove: (e: PointerEvent<HTMLElement>) => { const o = origin.current; if (!o) return; set(scrubValue(o.v, e.clientX - o.x, step, { shift: e.shiftKey, alt: e.altKey })); },
      onPointerUp: (e: PointerEvent<HTMLElement>) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); origin.current = null; setScrubbing(false); },
    },
  };
}
