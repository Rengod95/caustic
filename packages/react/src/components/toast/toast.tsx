'use client';
import { Check, CircleAlert, Info, TriangleAlert, X } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react';
import { useFlip } from '../../hooks/use-flip.ts';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size } from '../../lib/common-props.ts';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { toastMark, toastVariants, toastViewport, type ToastTone, type ToastVariant } from './toast.variants.ts';
import { getServerSnapshot, getSnapshot, subscribe, toast } from './toast.store.ts';
import { DismissTimer } from './toast.timer.ts';

export interface ToastProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Status: success (default), info, warning, danger (role alert, never auto-dismisses), agent (rim and orb), neutral or accent (plain news). */
  tone?: ToastTone | undefined;
  /** Surface: glass (default) or one of the common variants. */
  variant?: ToastVariant | undefined;
  radius?: Radius | undefined;
  shadow?: Shadow | undefined;
  size?: Size | undefined;
  title: ReactNode;
  /** One line of detail. */
  description?: ReactNode;
  /** Label of the action button; omit for none. */
  actionLabel?: string;
  /** aria-label of a trailing close button (IconButton xs, after the action); omit for none. Clicking it calls onDismiss. */
  dismissLabel?: string;
  /** Milliseconds before auto-dismiss; 0 keeps it until dismissed. Paused while hovered or focused. A danger toast never auto-dismisses. */
  duration?: number;
  /** Hidden status word read before the title ("Failed"); use it with tone="danger". */
  statusLabel?: string;
  /** Render in place without auto-dismiss (docs and tests). */
  inline?: boolean;
  onAction?: () => void;
  onDismiss?: () => void;
}

const glyph = {
  neutral: <Info strokeWidth={2.25} />,
  accent: <Info strokeWidth={2.25} />,
  success: <Check strokeWidth={2.5} />,
  info: <Info strokeWidth={2.25} />,
  warning: <TriangleAlert strokeWidth={2.25} />,
  danger: <CircleAlert strokeWidth={2.25} />,
} as const;

/** Transient confirmation on thick glass. Slides in (gentle), auto-dismisses, pauses while hovered or focused. A failure (tone danger) stays until dismissed. */
export function Toast({
  tone, variant, radius, shadow, size, title, description, actionLabel, dismissLabel, statusLabel, duration = 3600, inline = false, onAction, onDismiss, className, onKeyDown, ...props
}: ToastProps) {
  const t = tone ?? 'success';
  const [paused, setPaused] = useState(false);
  // The countdown calls the latest onDismiss; a parent that re-renders with a new function does not restart it.
  const dismissRef = useRef(onDismiss);
  useLayoutEffect(() => { dismissRef.current = onDismiss; });
  const timer = useRef<DismissTimer | null>(null);
  const armed = !inline && t !== 'danger' && duration > 0;
  useEffect(() => {
    if (!armed) return;
    const clock = new DismissTimer(duration, () => dismissRef.current?.());
    timer.current = clock;
    return () => { clock.stop(); timer.current = null; };
  }, [armed, duration]);
  // Hover or focus pauses the countdown; leaving resumes it with the time that was left.
  useEffect(() => {
    const clock = timer.current;
    if (!clock) return;
    if (paused) clock.pause(); else clock.start();
  }, [armed, duration, paused]);
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (!e.defaultPrevented && e.key === 'Escape') onDismiss?.();
  };
  return (
    <div
      role={t === 'danger' ? 'alert' : 'status'} tabIndex={-1} data-slot="toast" data-tone={t}
      className={cn(toastVariants({ tone: t, variant, action: actionLabel != null || dismissLabel != null, size, radius, shadow }), className)}
      onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onKeyDown={handleKeyDown} {...props}
    >
      {t === 'agent'
        ? <span data-slot="toast-orb" aria-hidden="true" className={toastMark({ tone: 'agent' })} />
        : <span data-slot="toast-icon" aria-hidden="true" className={toastMark({ tone: t })}>{glyph[t]}</span>}
      <div data-slot="toast-main" className="min-w-0 flex-1">
        <div data-slot="toast-title" className="text-ui-strong text-text-primary">{statusLabel != null && <span className="sr-only">{statusLabel}: </span>}{title}</div>
        {description != null && <div data-slot="toast-description" className={cn('text-ui-sm font-normal', t === 'danger' ? 'text-danger-text' : 'text-text-secondary')}>{description}</div>}
      </div>
      {actionLabel != null && (
        <Button data-slot="toast-action" size="xs" tone="ghost" onClick={() => onAction?.()}>{actionLabel}</Button>
      )}
      {dismissLabel != null && (
        <IconButton data-slot="toast-close" size="xs" variant="ghost" label={dismissLabel} className={actionLabel != null ? '-ml-1.5' : undefined} onClick={() => onDismiss?.()}><X /></IconButton>
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

/** Mount once near the app root; toast() feeds it. A new or removed toast slides the others to their new place (useFlip). */
export function Toaster(props: ToastViewportProps) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const region = useRef<HTMLDivElement>(null);
  // A closing toast stays in its place until its exit has played: it is left out, so its exit translate is not read as movement.
  useFlip(region, '[data-toast-id]:not([data-state="closed"])', 'toastId');
  return (
    <ToastViewport ref={region} {...props}>
      {items.map(({ id, open, ...item }) => (
        <Toast key={id} data-toast-id={id} data-state={open ? 'open' : 'closed'} {...item} onDismiss={() => toast.dismiss(id)} />
      ))}
    </ToastViewport>
  );
}

export { toast };
