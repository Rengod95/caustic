'use client';
import { Check, CircleAlert, Info, TriangleAlert, X } from '../../icons/index.ts';
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ComponentProps, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { useFlip } from '../../hooks/use-flip.ts';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size } from '../../lib/common-props.ts';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { toastMain, toastMark, toastOrb, toastVariants, toastViewport, type ToastTone, type ToastVariant } from './toast.variants.ts';
import { getServerSnapshot, getSnapshot, subscribe, toast } from './toast.store.ts';
import { DismissTimer } from './toast.timer.ts';

export interface ToastProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Status: success (default), info, warning, danger (role alert, never auto-dismisses), agent (rim and orb), neutral or accent (plain news). */
  tone?: ToastTone | undefined;
  /** Surface: outline (default) or one of the other common variants. */
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
  /** Milliseconds before auto-dismiss; 0 keeps it until dismissed. Default 4000, or 8000 for warning and for a toast with an action. Paused while the pointer moves over it or focus is inside. A danger toast never auto-dismisses. */
  duration?: number;
  /** Hidden status word read before the title ("Failed"); use it with tone="danger". */
  statusLabel?: string;
  /** Render in place without auto-dismiss (docs and tests). */
  inline?: boolean;
  onAction?: () => void;
  onDismiss?: () => void;
}

// neutral is plain news and reads as text only: no glyph.
const glyph = {
  accent: <Info />,
  success: <Check />,
  info: <Info />,
  warning: <TriangleAlert />,
  danger: <CircleAlert />,
} as const;

/** The auto-dismiss time when none is given: longer for a warning or a toast with an action (time to read and act). */
export function toastDuration(tone: ToastTone, hasAction: boolean): number {
  if (tone === 'danger') return 0;
  return tone === 'warning' || hasAction ? 8000 : 4000;
}

/** Transient confirmation on an outlined surface. Rises in (gentle), auto-dismisses, pauses while the pointer moves over it or focus is inside. A failure (tone danger) stays until dismissed. */
export function Toast({
  tone, variant, radius, shadow, size, title, description, actionLabel, dismissLabel, statusLabel, duration: durationProp, inline = false, onAction, onDismiss, className, onKeyDown, onPointerMove, onPointerLeave, ...props
}: ToastProps) {
  const t = tone ?? 'success';
  const z = size ?? 'md';
  const duration = durationProp ?? toastDuration(t, actionLabel != null);
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
  // Pointer movement over the toast or focus inside pauses the countdown; leaving resumes it with the time that was left.
  // Only real movement counts: a toast that appears under a resting pointer gets a pointerenter (and Chrome may send a
  // synthetic move with no movement) from the layout change alone, and pausing on that kept it open for as long as the
  // pointer did not move.
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
      className={cn(toastVariants({ tone: t, variant, action: actionLabel != null || dismissLabel != null, size: z, radius, shadow }), className)}
      onPointerMove={(e: PointerEvent<HTMLDivElement>) => { onPointerMove?.(e); if (e.movementX !== 0 || e.movementY !== 0) setPaused(true); }}
      onPointerLeave={(e: PointerEvent<HTMLDivElement>) => { onPointerLeave?.(e); setPaused(false); }}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      onKeyDown={handleKeyDown} {...props}
    >
      <div data-slot="toast-main" className={toastMain({ size: z })}>
        {t === 'agent'
          ? <span aria-hidden="true" className={toastMark({ kind: 'agent', size: z })}><span data-slot="toast-orb" className={toastOrb({ tone: 'agent' })} /></span>
          : t === 'neutral'
            ? null
            : <span data-slot="toast-icon" aria-hidden="true" className={toastMark({ size: z })}>{glyph[t]}</span>}
        <div data-slot="toast-title" className={cn('col-start-2', z === 'lg' ? 'text-ui-lg font-medium' : z === 'xs' ? 'text-ui-sm font-medium' : 'text-ui-strong', 'text-text-primary')}>{statusLabel != null && <span className="sr-only">{statusLabel}: </span>}{title}</div>
        {description != null && <div data-slot="toast-description" className={cn('col-start-2 text-ui-sm font-normal', t === 'danger' ? 'text-danger-text' : 'text-text-secondary')}>{description}</div>}
      </div>
      {actionLabel != null && (
        <Button data-slot="toast-action" size="xs" tone="ghost" onClick={() => onAction?.()}>{actionLabel}</Button>
      )}
      {dismissLabel != null && (
        <IconButton data-slot="toast-close" size="xs" variant="ghost" label={dismissLabel} className={actionLabel != null ? '-ms-1' : undefined} onClick={() => onDismiss?.()}><X /></IconButton>
      )}
    </div>
  );
}

export interface ToastViewportProps extends Omit<ComponentProps<'div'>, 'aria-label'> {
  /** aria-label of the region; supplied by the consumer (no built-in text). */
  label: string;
}

export interface ToasterProps extends ToastViewportProps {
  /** Most open toasts at once (3). A newer one closes the oldest open toast that is not danger. */
  max?: number;
}

/** The fixed region that stacks toasts at the bottom end: a polite live region named by `label`. */
export function ToastViewport({ label, className, ...props }: ToastViewportProps) {
  return <div role="region" aria-label={label} aria-live="polite" data-slot="toast-viewport" className={cn(toastViewport(), className)} {...props} />;
}

/** Mount once near the app root; toast() feeds it. Newest at the bottom, at most `max` open; a new or removed toast slides the others to their new place (useFlip). */
export function Toaster({ max = 3, ...props }: ToasterProps) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const region = useRef<HTMLDivElement>(null);
  // Over the limit: close the oldest open toast that is not a failure (a failure stays until it is dismissed).
  useEffect(() => {
    const open = items.filter(i => i.open);
    if (open.length <= max) return;
    const oldest = open.find(i => i.tone !== 'danger');
    if (oldest) toast.dismiss(oldest.id);
  }, [items, max]);
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
