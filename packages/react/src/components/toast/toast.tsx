'use client';
import { Check } from 'lucide-react';
import { useEffect, useState, useSyncExternalStore, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Button } from '../button/button.tsx';
import { toastMark, toastVariants, toastViewport, type ToastVariantProps } from './toast.variants.ts';
import { getServerSnapshot, getSnapshot, subscribe, toast } from './toast.store.ts';

export interface ToastProps extends Omit<ComponentProps<'div'>, 'title'>, ToastVariantProps {
  title: ReactNode;
  /** One line of detail. */
  description?: ReactNode;
  /** Label of the action button; omit for none. */
  actionLabel?: string;
  /** Milliseconds before auto-dismiss; 0 keeps it until dismissed. Paused while hovered or focused. */
  duration?: number;
  /** Render in place without auto-dismiss (docs and tests). */
  inline?: boolean;
  onAction?: () => void;
  onDismiss?: () => void;
}

/** Transient confirmation on thick glass. Springs in, auto-dismisses, pauses while hovered or focused. */
export function Toast({
  tone, title, description, actionLabel, duration = 3600, inline = false, onAction, onDismiss, className, onKeyDown, ...props
}: ToastProps) {
  const t = tone ?? 'success';
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (inline || duration <= 0 || paused) return;
    const id = setTimeout(() => onDismiss?.(), duration);
    return () => clearTimeout(id);
  }, [inline, duration, paused, onDismiss]);
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (!e.defaultPrevented && e.key === 'Escape') onDismiss?.();
  };
  return (
    <div
      role="status" tabIndex={-1} data-slot="toast" data-tone={t}
      className={cn(toastVariants({ tone: t, action: actionLabel != null }), className)}
      onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onKeyDown={handleKeyDown} {...props}
    >
      {t === 'agent'
        ? <span data-slot="toast-orb" aria-hidden="true" className={toastMark({ tone: t })} />
        : <span data-slot="toast-icon" aria-hidden="true" className={toastMark({ tone: t })}><Check strokeWidth={2.5} /></span>}
      <div data-slot="toast-main" className="min-w-0 flex-1">
        <div data-slot="toast-title" className="text-ui-strong text-text-primary">{title}</div>
        {description != null && <div data-slot="toast-description" className="text-ui-sm font-normal text-text-tertiary">{description}</div>}
      </div>
      {actionLabel != null && (
        <Button data-slot="toast-action" size="xs" tone={t === 'agent' ? 'ink' : 'ghost'} onClick={() => onAction?.()}>{actionLabel}</Button>
      )}
    </div>
  );
}

/** The fixed region that stacks toasts at the bottom end: a polite live region labelled "Notifications". */
export function ToastViewport({ className, ...props }: ComponentProps<'div'>) {
  return <div role="region" aria-label="Notifications" aria-live="polite" data-slot="toast-viewport" className={cn(toastViewport(), className)} {...props} />;
}

/** Mount once near the app root; toast() feeds it. */
export function Toaster(props: ComponentProps<'div'>) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <ToastViewport {...props}>
      {items.map(({ id, open, ...item }) => (
        <Toast key={id} data-state={open ? 'open' : 'closed'} {...item} onDismiss={() => toast.dismiss(id)} />
      ))}
    </ToastViewport>
  );
}

export { toast };
