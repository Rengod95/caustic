'use client';
import { CircleAlert, CircleCheck } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Progress } from '../progress/progress.tsx';
import { toolBody, toolCallVariants, toolStatus, type ToolCallVariantProps } from './tool-call.variants.ts';

export interface ToolCallProps extends Omit<ComponentProps<'div'>, 'children'>, ToolCallVariantProps {
  /** Tool identifier, shown in mono. */
  name: string;
  /** Short argument summary. */
  detail?: ReactNode;
  icon?: ReactNode;
  /** Elapsed time for finished calls, e.g. "1.2s". */
  duration?: string;
  /** Running label, e.g. "Deriving". */
  activity?: string;
  /** 0–100 while running; omit when unknown. */
  progress?: number;
  /** Expandable result: a diff, a log line or the failure reason. */
  children?: ReactNode;
}

/** One agent tool invocation: running (spectrum rim), done or failed. */
export function ToolCall({ name, detail, icon, status, duration, activity = 'Running', progress, className, children, ...props }: ToolCallProps) {
  const s = status ?? 'done';
  return (
    <div data-slot="tool-call" data-status={s} className={cn(toolCallVariants({ status }), className)} {...props}>
      <div data-slot="tool-call-header" className="flex h-10 min-w-0 items-center gap-2 px-2.5 text-ui-dense">
        {icon != null && <span data-slot="tool-call-icon" className="inline-grid size-tool-icon shrink-0 place-items-center rounded-xs bg-fill-pressed text-text-secondary [&_svg]:size-icon-sm">{icon}</span>}
        <span data-slot="tool-call-name" className="whitespace-nowrap font-mono text-mono-strong text-text-primary">{name}</span>
        {detail != null && <span data-slot="tool-call-detail" className="min-w-0 flex-1 truncate text-text-tertiary">{detail}</span>}
        <span data-slot="tool-call-status" className={toolStatus({ status })}>
          {s === 'running' ? <span>{activity}</span> : s === 'failed' ? <><CircleAlert aria-hidden />Failed</> : <><CircleCheck aria-hidden className="text-success-solid" />{duration}</>}
        </span>
      </div>
      {s === 'running' && progress !== undefined && (
        <div data-slot="tool-call-progress" className="px-2.5 pb-2.5"><Progress tone="agent" value={progress} aria-label={`${name} progress`} /></div>
      )}
      {children != null && <div data-slot="tool-call-body" className={toolBody({ status })}>{children}</div>}
    </div>
  );
}
