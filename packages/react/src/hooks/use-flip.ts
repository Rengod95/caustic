import { useLayoutEffect, useRef, type RefObject } from 'react';

const FLIP_ID = 'cs-flip';

function token(name: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

function ms(raw: string): number {
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value)) return 200;
  return raw.endsWith('ms') ? value : raw.endsWith('s') ? value * 1000 : value;
}

/** The layout position (offsets, so transforms and running animations do not count) in document coordinates. */
function place(node: HTMLElement): { x: number; y: number } {
  let x = 0, y = 0;
  for (let n: HTMLElement | null = node; n; n = n.offsetParent as HTMLElement | null) { x += n.offsetLeft; y += n.offsetTop; }
  return { x, y };
}

/**
 * Layout motion for a list (FLIP). After every commit each item that changed place glides from where it was drawn to its
 * new place, so a row inserted above slides the rows below it down and a row removed lets them slide up. Items are the
 * elements under `root` matching `items`, keyed by their `data-<idAttr>` (camelCase, as in `dataset`). New items do not
 * move; give them their own enter (`animate-rise`). A move interrupted by the next commit continues from where it is.
 *
 * `enabled: false` (keyboard reorder, a drag in progress) makes that commit instant. Reduced motion is always instant.
 * The move runs on the `translate` property with `duration-base` and `ease-in-out`, through the Web Animations API, so the
 * items need no transition class and their own `transition-control` stays untouched.
 */
export function useFlip(root: RefObject<HTMLElement | null>, items: string, idAttr: string, enabled = true) {
  const last = useRef(new Map<string, { x: number; y: number }>());
  // No dependency list: runs after every commit, compares with the positions the previous commit left.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animate = enabled && !reduce && typeof Element.prototype.animate === 'function';
    const origin = place(el);
    const next = new Map<string, { x: number; y: number }>();
    const moves: { node: HTMLElement; dx: number; dy: number }[] = [];
    el.querySelectorAll<HTMLElement>(items).forEach(node => {
      const id = node.dataset[idAttr];
      if (id === undefined) return;
      // A move still running continues from where it is drawn: its offset is the difference its cancel makes.
      const running = node.getAnimations().filter(a => a.id === FLIP_ID);
      let ox = 0, oy = 0;
      if (running.length) {
        const drawn = node.getBoundingClientRect();
        running.forEach(a => a.cancel());
        const rest = node.getBoundingClientRect();
        ox = drawn.left - rest.left; oy = drawn.top - rest.top;
      }
      const p = place(node);
      const at = { x: p.x - origin.x, y: p.y - origin.y };
      next.set(id, at);
      const before = last.current.get(id);
      if (!animate || !before) return;
      const dx = before.x + ox - at.x, dy = before.y + oy - at.y;
      if (Math.abs(dx) >= 0.5 || Math.abs(dy) >= 0.5) moves.push({ node, dx, dy });
    });
    last.current = next;
    if (!moves.length) return;
    const duration = ms(token('--cs-duration-base', '200ms')), easing = token('--cs-ease-in-out', 'ease-in-out');
    for (const { node, dx, dy } of moves) {
      const a = node.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0 0' }], { duration, easing, composite: 'add' });
      a.id = FLIP_ID;
    }
  });
}
