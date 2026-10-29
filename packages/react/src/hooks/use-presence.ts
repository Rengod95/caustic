import { useCallback, useLayoutEffect, useReducer, useRef } from 'react';

export interface PresenceEntry<T> {
  key: string;
  item: T;
  /** False while the item is leaving: render it with `data-state="closed"` and an exit animation. */
  present: boolean;
}

/**
 * Keeps removed items rendered until their exit has played, for lists that unmount items themselves (Radix Presence
 * does this for Radix parts). Returns the items to render: the current ones in order, plus each removed one at the
 * place it had, with `present: false`. Call `exited(key)` from the leaving element's `onAnimationEnd` (check
 * `event.target === event.currentTarget`); a guard drops it after `duration-slow` if no animation ends. Pair with
 * `useFlip` so the rows after it slide up once it is gone.
 */
export function usePresence<T>(items: readonly T[], keyOf: (item: T) => string) {
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  const shown = useRef<PresenceEntry<T>[]>([]);
  const gone = useRef(new Set<string>());
  const keys = new Set(items.map(keyOf));
  const entries: PresenceEntry<T>[] = items.map(item => ({ key: keyOf(item), item, present: true }));
  shown.current.forEach((entry, i) => {
    if (keys.has(entry.key) || gone.current.has(entry.key)) return;
    entries.splice(Math.min(i, entries.length), 0, { ...entry, present: false });
  });

  const exited = useCallback((key: string) => {
    if (gone.current.has(key)) return;
    gone.current.add(key);
    rerender();
  }, []);

  useLayoutEffect(() => {
    shown.current = entries;
    // A key that left and was dropped can come back as a new item.
    gone.current.forEach(key => { if (!entries.some(e => e.key === key)) gone.current.delete(key); });
  });

  const leaving = entries.filter(e => !e.present).map(e => e.key).join('\n');
  useLayoutEffect(() => {
    if (!leaving) return;
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--cs-duration-slow').trim();
    const value = Number.parseFloat(raw);
    const wait = Number.isFinite(value) ? (raw.endsWith('ms') ? value : raw.endsWith('s') ? value * 1000 : value) : 400;
    const timer = window.setTimeout(() => leaving.split('\n').forEach(exited), wait + 100);
    return () => window.clearTimeout(timer);
  }, [leaving, exited]);

  return { entries, exited };
}
