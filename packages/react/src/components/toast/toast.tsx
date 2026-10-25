'use client';
import { Check, CircleAlert } from 'lucide-react';
import { useEffect, useState, useSyncExternalStore, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Button } from '../button/button.tsx';
import { toastDangerMark, toastMark, toastVariants, toastViewport, type ToastVariantProps } from './toast.variants.ts';
import { getServerSnapshot, getSnapshot, subscribe, toast } from './toast.store.ts';

export interface ToastProps extends Omit<ComponentProps<'div'>, 'title'>, ToastVariantProps {
  title: ReactNode;
  /** One line of detail. */
  description?: ReactNode;
  /** Label of the action button; omit for none. */
  actionLabel?: string;
  /** Milliseconds before auto-dismiss; 0 keeps it until dismissed. Paused while hovered or focused. A danger toast never auto-dismisses. */
  duration?: number;
  /** Hidden status word read before the title ("Failed"); use it with tone="danger". */
  statusLabel?: string;
  /** Render in place without auto-dismiss (docs and tests). */
  inline?: boolean;
  onAction?: () => void;
  onDismiss?: () => void;
}

/** Transient confirmation on thick glass. Springs in, auto-dismisses, pauses while hovered or focused. A failure (tone danger) stays until dismissed. */
export function Toast({
  tone, title, description, actionLabel, statusLabel, duration = 3600, inline = false, onAction, onDismiss, className, onKeyDown, ...props
}: ToastProps) {
  const t = tone ?? 'success';
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (inline || t === 'danger' || duration <= 0 || paused) return;
    const id = setTimeout(() => onDismiss?.(), duration);
    return () => clearTimeout(id);
  }, [inline, t, duration, paused, onDismiss]);
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (!e.defaultPrevented && e.key === 'Escape') onDismiss?.();
  };
  return (
    <div
      role={t === 'danger' ? 'alert' : 'status'} tabIndex={-1} data-slot="toast" data-tone={t}
      className={cn(toastVariants({ tone: t === 'danger' ? 'success' : t, action: actionLabel != null }), className)}
      onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onKeyDown={handleKeyDown} {...props}
    >
      {t === 'agent'
        ? <span data-slot="toast-orb" aria-hidden="true" className={toastMark({ tone: 'agent' })} />
        : <span data-slot="toast-icon" aria-hidden="true" className={t === 'danger' ? toastDangerMark() : toastMark({ tone: 'success' })}>{t === 'danger' ? <CircleAlert strokeWidth={2.25} /> : <Check strokeWidth={2.5} />}</span>}
      <div data-slot="toast-main" className="min-w-0 flex-1">
        <div data-slot="toast-title" className="text-ui-strong text-text-primary">{statusLabel != null && <span className="sr-only">{statusLabel}: </span>}{title}</div>
        {description != null && <div data-slot="toast-description" className={cn('text-ui-sm font-normal', t === 'danger' ? 'text-danger-text' : 'text-text-tertiary')}>{description}</div>}
      </div>
      {actionLabel != null && (
        <Button data-slot="toast-action" size="xs" tone={t === 'agent' ? 'ink' : 'ghost'} onClick={() => onAction?.()}>{actionLabel}</Button>
      )}
    </div>
  );
}

export interface ToastViewportProps extends Omit<ComponentProps<'div'>, 'aria-label'> {
  /** aria-label of the region; supplied by the consumer (no built-in text). */
  label: string;
}

/** The fixed region that stacks toasts at the bottom end: a polite live region named by `label`. */
export function ToastViewport({ label, className, ...props }: ToastViewportProps) {
  return <div role="region" aria-label={label} aria-live="polite" data-slot="toast-viewport" className={cn(toastViewport(), className)} {...props} />;
}

/** Mount once near the app root; toast() feeds it. */
export function Toaster(props: ToastViewportProps) {
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
