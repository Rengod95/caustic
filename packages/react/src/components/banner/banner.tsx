'use client';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { bannerIcon, bannerVariants, type BannerVariantProps } from './banner.variants.ts';

export interface BannerProps extends ComponentProps<'div'>, BannerVariantProps {
  /** Replaces the default tone icon. */
  icon?: ReactNode;
  /** Action button (a Button xs, ghost or secondary). */
  action?: ReactNode;
  /** Shows the dismiss button. The banner does not hide itself; remove it in onDismiss. */
  dismissible?: boolean;
  onDismiss?: () => void;
}

const defaultIcon = { info: <Info />, success: <CircleCheck />, warning: <TriangleAlert />, danger: <CircleAlert /> } as const;

/** Page-level notice spanning the whole region. Danger announces as an alert, the other tones as status. */
export function Banner({ tone, icon, action, dismissible = false, onDismiss, className, children, ...props }: BannerProps) {
  const t = tone ?? 'info';
  const trailing = action != null || dismissible;
  return (
    <div
      role={t === 'danger' ? 'alert' : 'status'} data-slot="banner" data-tone={t}
      className={cn(bannerVariants({ tone: t, trailing }), className)} {...props}
    >
      <span data-slot="banner-icon" aria-hidden="true" className={bannerIcon({ tone: t })}>{icon ?? defaultIcon[t]}</span>
      <span data-slot="banner-message" className="min-w-0 flex-1 [&_b]:font-semibold">{children}</span>
      {action != null && <span data-slot="banner-action" className="inline-flex flex-none items-center">{action}</span>}
      {dismissible && <IconButton data-slot="banner-dismiss" size="xs" label="Dismiss" onClick={() => onDismiss?.()}><X /></IconButton>}
    </div>
  );
}
