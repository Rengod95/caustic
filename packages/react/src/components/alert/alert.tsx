'use client';
import { CircleAlert, Info, TriangleAlert } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { alertIcon, alertVariants, type AlertVariantProps } from './alert.variants.ts';

export interface AlertProps extends ComponentProps<'div'>, AlertVariantProps {
  /** Replaces the default tone icon. */
  icon?: ReactNode;
  /** Action button (a Button xs). */
  action?: ReactNode;
}

const defaultIcon = { info: <Info />, warning: <TriangleAlert />, danger: <CircleAlert /> } as const;

/** Inline notice inside a card, panel or form. Danger announces as an alert, the other tones as status. */
export function Alert({ tone, icon, action, className, children, ...props }: AlertProps) {
  const t = tone ?? 'info';
  return (
    <div
      role={t === 'danger' ? 'alert' : 'status'} data-slot="alert" data-tone={t}
      className={cn(alertVariants({ tone: t, action: action != null }), className)} {...props}
    >
      <span data-slot="alert-icon" aria-hidden="true" className={alertIcon({ tone: t })}>{icon ?? defaultIcon[t]}</span>
      <div data-slot="alert-body" className="[&_b]:font-semibold">{children}</div>
      {action != null && <div data-slot="alert-action" className="flex items-center">{action}</div>}
    </div>
  );
}
