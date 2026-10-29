'use client';
import { CircleAlert, CircleCheck } from '../../icons/index.ts';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { Progress } from '../progress/progress.tsx';
import { toolActivity, toolBody, toolCallVariants, toolHeader, toolIcon, toolStatus, type ToolCallVariantProps } from './tool-call.variants.ts';

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
  /** Expandable result: a diff, a log line or the failure reason. */
  children?: ReactNode;
}

/** One agent tool invocation: running (spectrum rim), done or failed. */
export function ToolCall({ name, detail, icon, status, tone, variant, radius, shadow, size, duration, activity, failedLabel, progressLabel, progress, className, children, ...props }: ToolCallProps) {
  const s = status ?? 'done';
  return (
    <div data-slot="tool-call" data-status={s} data-size={size ?? 'md'} className={cn(toolCallVariants({ variant, status, radius, shadow }), 'animate-rise', className)} {...props}>
      <div data-slot="tool-call-header" className={toolHeader({ size })}>
        {icon != null && <span data-slot="tool-call-icon" aria-hidden className={toolIcon({ tone })}>{icon}</span>}
        <span data-slot="tool-call-name" className="whitespace-nowrap font-mono text-mono-strong text-text-primary">{name}</span>
        {detail != null && <span data-slot="tool-call-detail" className="min-w-0 flex-1 truncate text-text-tertiary">{detail}</span>}
        <span data-slot="tool-call-status" className={toolStatus({ status })}>
          {s === 'running' ? <span className={toolActivity({ status: s })}>{activity}</span> : s === 'failed' ? <><CircleAlert aria-hidden className="animate-pop" />{failedLabel}</> : <><CircleCheck aria-hidden className="animate-pop text-success-graphic" />{duration}</>}
        </span>
      </div>
      {s === 'running' && progress !== undefined && (
        <div data-slot="tool-call-progress" className="px-2.5 pb-2.5"><Progress tone="agent" value={progress} aria-label={progressLabel?.(name)} /></div>
      )}
      {children != null && <div data-slot="tool-call-body" className={toolBody({ status })}>{children}</div>}
    </div>
  );
}
