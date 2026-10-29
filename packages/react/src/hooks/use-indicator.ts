import { useLayoutEffect, useState, type RefObject } from 'react';

export interface IndicatorBox { x: number; y: number; w: number; h: number; r: string }

/**
 * The box of the selected child in the container's padding-box coordinates (physical, so RTL needs nothing extra),
 * in whole pixels to match how the browser snaps the painted edge. Null until the first measure: render the thumb
 * only when it is not null, so it never slides in on mount. `key` is the selection; a change re-measures.
 */
export function useIndicator(root: RefObject<HTMLElement | null>, items: string, selected: string, key: unknown): IndicatorBox | null {
  const [box, setBox] = useState<IndicatorBox | null>(null);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      const sel = el.querySelector<HTMLElement>(selected);
      if (!sel) { setBox(null); return; }
      const c = el.getBoundingClientRect(), s = sel.getBoundingClientRect();
      const x = Math.round(s.left - c.left - el.clientLeft), y = Math.round(s.top - c.top - el.clientTop);
      const next: IndicatorBox = {
        x, y, w: Math.round(s.right - c.left - el.clientLeft) - x, h: Math.round(s.bottom - c.top - el.clientTop) - y,
        r: getComputedStyle(sel).borderTopLeftRadius,
      };
      setBox(prev => (prev && prev.x === next.x && prev.y === next.y && prev.w === next.w && prev.h === next.h && prev.r === next.r ? prev : next));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.querySelectorAll(items).forEach(n => ro.observe(n));
    return () => ro.disconnect();
  }, [root, items, selected, key]);
  return box;
}
