'use client';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from '../../icons/index.ts';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { alertBody, alertIcon, alertVariants } from './alert.variants.ts';

/** One tone-matched action button rendered by the alert. */
export interface AlertAction {
  label: ReactNode;
  onClick?: (() => void) | undefined;
  /** Renders the button as a link. */
  href?: string | undefined;
  /** The main call to action (e.g. Upgrade): the tone solid button. Others (e.g. Learn more) are the tone soft button. */
  primary?: boolean | undefined;
}

export interface AlertProps extends ComponentProps<'div'> {
  /** Meaning; also selects the default icon and the live-region role (danger = alert). */
  tone?: Tone | undefined;
  /** soft (default) = tint fill with the tone border; solid = tone solid fill; outline = border only; ghost = text only. */
  variant?: Variant | undefined;
  /** Root radius. Unset keeps xl. */
  radius?: Radius | undefined;
  /** Root elevation. Unset keeps none. */
  shadow?: Shadow | undefined;
  /** Height, padding, type and icon. inline: xs 32 · sm 40 · md 44 (default) · lg 48. page: xs 32 · sm 40 · md 48 · lg 48 with ui-lg type. */
  size?: Size | undefined;
  /** inline (default) = the card / form notice (grid, ui-dense); page = the page-level notice (full-width row, ui, 48 tall). */
  layout?: 'inline' | 'page' | undefined;
  /** inline (default) = rounded box with the tone edge all round; page = spans the page: no radius, bottom tone edge only. */
  placement?: 'inline' | 'page' | undefined;
  /** tone (default) = the whole message in the tone text; lead = message in text.primary, only the <b> lead-in in the tone text. */
  emphasis?: 'tone' | 'lead' | undefined;
  /** Replaces the default tone icon. */
  icon?: ReactNode | undefined;
  /**
   * One or two actions drawn by the alert in its tone, so they sit in the alert's colour: the primary one is the tone
   * solid button, the others the tone soft button (on a solid alert both are the raised neutral button). Button xs.
   */
  actions?: AlertAction[] | undefined;
  /** Free action content (any node, e.g. a Button xs). Rendered as given after actions. */
  action?: ReactNode | undefined;
  /** Shows the dismiss button. The alert does not hide itself; remove it in onDismiss. */
  dismissible?: boolean | undefined;
  /** aria-label of the dismiss button; supply it whenever dismissible (no built-in text). */
  dismissLabel?: string | undefined;
  onDismiss?: (() => void) | undefined;
}

const defaultIcon: Record<Tone, ReactNode> = { neutral: <Info />, accent: <Info />, info: <Info />, success: <CircleCheck />, warning: <TriangleAlert />, danger: <CircleAlert />, agent: <Info /> };

/**
 * Notice in two layouts: inline inside a card, panel or form, or page spanning the whole region.
 * Danger announces as an alert, the other tones as status.
 */
export function Alert({
  tone, variant, radius, shadow, size, layout, placement, emphasis, icon, actions, action, dismissible = false, dismissLabel, onDismiss,
  className, children, ...props
}: AlertProps) {
  const t = tone ?? 'info';
  const v = variant ?? 'soft';
  const l = layout ?? 'inline';
  const hasActions = (actions?.length ?? 0) > 0;
  const hasAction = action != null || hasActions;
  return (
    <div
      role={t === 'danger' ? 'alert' : 'status'} data-slot="alert" data-tone={t} data-variant={v} data-layout={l} data-placement={placement ?? 'inline'}
      className={cn(alertVariants({ tone: t, variant, layout: l, placement, radius, shadow, size, trailing: hasAction || dismissible, dismissible }), className)}
      {...props}
    >
      <span data-slot="alert-icon" aria-hidden="true" className={cn(alertIcon({ tone: t, variant, size }))}>{icon ?? defaultIcon[t]}</span>
      <div data-slot="alert-body" className={alertBody({ layout: l, emphasis, variant, tone: t })}>{children}</div>
      {hasAction && (
        <div data-slot="alert-action" className="flex flex-none items-center gap-1.5">
          {actions?.map((a, i) => {
            // Tone-matched: primary = tone solid, the rest tone soft; a solid alert takes the raised neutral button.
            const tv = v === 'solid' ? { tone: 'neutral' as const, variant: 'outline' as const } : { tone: t, variant: a.primary ? 'solid' as const : 'soft' as const };
            return a.href != null
              ? <Button key={i} asChild size="xs" {...tv}><a href={a.href} onClick={a.onClick}>{a.label}</a></Button>
              : <Button key={i} size="xs" {...tv} onClick={a.onClick}>{a.label}</Button>;
          })}
          {action}
        </div>
      )}
      {/* label is required by IconButton's type; when the consumer omits it the aria-label attribute is simply absent (no English fallback). */}
      {dismissible && <IconButton data-slot="alert-dismiss" size="xs" label={dismissLabel as string} onClick={() => onDismiss?.()}><X /></IconButton>}
    </div>
  );
}
