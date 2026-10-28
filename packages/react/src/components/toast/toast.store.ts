import type { ReactNode } from 'react';
import type { ToastTone } from './toast.variants.ts';

export interface ToastOptions {
  tone?: ToastTone;
  title: ReactNode;
  description?: ReactNode;
  actionLabel?: string;
  /** aria-label of a trailing close button; omit for none. */
  dismissLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  /** Milliseconds before auto-dismiss; 0 keeps it until dismissed. */
  duration?: number;
  /** Hidden status word read before the title, e.g. "Failed". */
  statusLabel?: string;
}

export interface ToastItem extends ToastOptions {
  id: number;
  open: boolean;
}

const EXIT_MS = 300;
let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit(next: ToastItem[]) {
  items = next;
  listeners.forEach(l => l());
}

export const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const getSnapshot = () => items;
const empty: ToastItem[] = [];
export const getServerSnapshot = () => empty;

/** Shows a toast in the mounted Toaster and returns its id. */
export function toast(options: ToastOptions): number {
  const id = nextId++;
  emit([...items, { ...options, id, open: true }]);
  return id;
}

/** Closes one toast (or all of them) with the exit animation. */
toast.dismiss = (id?: number) => {
  const closing = items.filter(i => i.open && (id === undefined || i.id === id));
  if (!closing.length) return;
  const ids = new Set(closing.map(i => i.id));
  emit(items.map(i => (ids.has(i.id) ? { ...i, open: false } : i)));
  closing.forEach(i => i.onDismiss?.());
  setTimeout(() => emit(items.filter(i => !ids.has(i.id))), EXIT_MS);
};
