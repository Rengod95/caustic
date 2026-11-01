'use client';
import { ChevronDown, CircleAlert, CircleCheck } from '../../icons/index.ts';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { Progress } from '../progress/progress.tsx';
import { toolActivity, toolBody, toolCallBareClass, toolChevron, toolHeaderToggle, toolCallVariants, toolHeader, toolIcon, toolStatus, type ToolCallVariantProps } from './tool-call.variants.ts';

export interface ToolCallProps extends Omit<ComponentProps<'div'>, 'children'>, Pick<ToolCallVariantProps, 'status'>, CommonProps {
  /** Tool identifier, shown in mono. */
  name: string;
  /** Short argument summary. */
  detail?: ReactNode;
  icon?: ReactNode;
  /** Elapsed time for finished calls, e.g. "1.2s". */
  duration?: string;
  /** Running label, e.g. "Deriving"; required while running. */
  activity?: string | undefined;
  /** Status text of a failed call; required when failed. */
  failedLabel?: string | undefined;
  /** aria-label of the progress bar from the tool name; required with progress. */
  progressLabel?: ((name: string) => string) | undefined;
  /** 0–100 while running; omit when unknown. */
  progress?: number;
  /** No card of its own (no fill, hairline, rim, corner clip), for use inside a well or panel that already draws one; the status pill still carries the state. */
  bare?: boolean;
  /** The header becomes a toggle (aria-expanded) that folds the result; without a result there is nothing to fold. */
  collapsible?: boolean;
  /** Uncontrolled initial open state with collapsible (default true). */
  defaultOpen?: boolean;
  /** Controlled open state with collapsible. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Expandable result: a diff, a log line or the failure reason. */
  children?: ReactNode;
}

/** One agent tool invocation: running (spectrum rim), done or failed. */
export function ToolCall({ name, detail, icon, status, tone, variant, radius, shadow, size, duration, activity, failedLabel, progressLabel, progress, bare = false, collapsible = false, defaultOpen = true, open: openProp, onOpenChange, className, children, ...props }: ToolCallProps) {
  const s = status ?? 'done';
  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });
  const folded = collapsible && !open;
  const content = (
    <>
      {icon != null && <span data-slot="tool-call-icon" aria-hidden className={toolIcon({ tone })}>{icon}</span>}
      <span data-slot="tool-call-name" className="whitespace-nowrap font-mono text-mono-strong text-text-primary">{name}</span>
      {detail != null && <span data-slot="tool-call-detail" className="min-w-0 flex-1 truncate text-text-tertiary">{detail}</span>}
      <span data-slot="tool-call-status" className={toolStatus({ status })}>
        {s === 'running' ? <span className={toolActivity({ status: s })}>{activity}</span> : s === 'failed' ? <><CircleAlert aria-hidden className="animate-pop" />{failedLabel}</> : <><CircleCheck aria-hidden className="animate-pop text-success-graphic" />{duration}</>}
      </span>
      {collapsible && <ChevronDown aria-hidden data-slot="tool-call-chevron" className={toolChevron({ open })} />}
    </>
  );
  const headerClass = cn(toolHeader({ size }), collapsible && toolHeaderToggle());
  const header = collapsible
    ? <button type="button" data-slot="tool-call-header" aria-expanded={open} className={headerClass} onClick={() => setOpen(!open)}>{content}</button>
    : <div data-slot="tool-call-header" className={headerClass}>{content}</div>;
  return (
    <div data-slot="tool-call" data-status={s} data-size={size ?? 'md'} className={cn(toolCallVariants({ variant, status, radius, shadow }), bare && toolCallBareClass, 'animate-rise', className)} {...props}>
      {header}
      {s === 'running' && progress !== undefined && (
        <div data-slot="tool-call-progress" className="px-2.5 pb-2.5"><Progress tone="agent" value={progress} aria-label={progressLabel?.(name)} /></div>
      )}
      {children != null && !folded && <div data-slot="tool-call-body" className={toolBody({ status })}>{children}</div>}
    </div>
  );
}
