import { useCallback, useRef, useState } from 'react';

/**
 * Controlled/uncontrolled state in one hook.
 * - controlled when `value` is not undefined; `onChange` reports every requested change
 * - uncontrolled otherwise, starting from `defaultValue`
 */
export function useControllableState<T>({ value, defaultValue, onChange }: { value?: T | undefined; defaultValue: T; onChange?: ((next: T) => void) | undefined }) {
  const [inner, setInner] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? (value as T) : inner;
  const ref = useRef(current); ref.current = current;
  const set = useCallback((next: T | ((prev: T) => T)) => {
    const resolved = typeof next === 'function' ? (next as (p: T) => T)(ref.current) : next;
    if (Object.is(resolved, ref.current)) return;
    if (!controlled) setInner(resolved);
    onChange?.(resolved);
  }, [controlled, onChange]);
  return [current, set] as const;
}
