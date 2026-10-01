'use client';
import { Check, ShieldCheck } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Button } from '../button/button.tsx';
import { permissionIconVariants, permissionRequestVariants, permissionTitleVariants, type PermissionRequestVariantProps } from './permission-request.variants.ts';

export type PermissionDecision = 'allow-once' | 'allow-always' | 'deny';

export interface PermissionRequestProps extends Omit<ComponentProps<'div'>, 'title'>, PermissionRequestVariantProps {
  /** The question or the outcome. */
  title: ReactNode;
  /** Consequence and undo hint, or the record detail. */
  description?: ReactNode;
  allowLabel?: ReactNode;
  /** Pass null to hide the standing-permission control. */
  alwaysLabel?: ReactNode;
  denyLabel?: ReactNode;
  /** Reports the pressed action; the parent switches status. */
  onDecision?: (decision: PermissionDecision) => void;
}

/** Inline permission prompt (pending) that collapses into a quiet record (allowed). */
export function PermissionRequest({ status, title, description, allowLabel = 'Allow once', alwaysLabel = 'Always for this project', denyLabel = 'Deny', onDecision, className, ...props }: PermissionRequestProps) {
  const s = status ?? 'pending';
  const titleId = useId();
  return (
    <div role="group" aria-labelledby={titleId} data-slot="permission-request" data-status={s} className={cn(permissionRequestVariants({ status }), className)} {...props}>
      <div data-slot="permission-request-header" className="flex items-center gap-3">
        <span data-slot="permission-request-icon" aria-hidden className={permissionIconVariants({ status })}>{s === 'pending' ? <ShieldCheck /> : <Check />}</span>
        <div data-slot="permission-request-text">
          <div id={titleId} data-slot="permission-request-title" className={permissionTitleVariants({ status })}>{title}</div>
          {description != null && <div data-slot="permission-request-description" className="mt-0.5 text-ui-sm font-normal text-text-secondary">{description}</div>}
        </div>
      </div>
      {s === 'pending' && (
        <div data-slot="permission-request-actions" className="flex flex-wrap gap-1.5">
          <Button data-slot="permission-request-allow" tone="ink" size="xs" onClick={() => onDecision?.('allow-once')}>{allowLabel}</Button>
          {alwaysLabel !== null && <Button data-slot="permission-request-always" tone="ghost" size="xs" onClick={() => onDecision?.('allow-always')}>{alwaysLabel}</Button>}
          <span aria-hidden className="flex-1" />
          <Button data-slot="permission-request-deny" tone="ghost" size="xs" onClick={() => onDecision?.('deny')}>{denyLabel}</Button>
        </div>
      )}
    </div>
  );
}
