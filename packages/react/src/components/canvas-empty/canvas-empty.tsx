'use client';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';

export interface CanvasEmptyProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** The prompt, in the agent voice. */
  title: ReactNode;
  /** One line of help. */
  description?: ReactNode;
  /** Buttons: Button tone="agent" size="sm" first, then secondary. */
  actions?: ReactNode;
}

/** The first question on a blank canvas: the agent orb, a serif prompt, one line of help and two ways to start. */
export function CanvasEmpty({ title, description, actions, className, ...props }: CanvasEmptyProps) {
  return (
    <div
      data-slot="canvas-empty"
      className={cn('canvas-grid grid justify-items-center gap-2.5 rounded-xl px-4 py-7 text-center [background-size:var(--cs-space-4)_var(--cs-space-4)]', className)}
      {...props}
    >
      <span data-slot="canvas-empty-orb" aria-hidden className="orb orb-lg" />
      <div data-slot="canvas-empty-title" className="font-voice text-voice-lg text-text-primary">{title}</div>
      {description != null && <div data-slot="canvas-empty-description" className="max-w-[34ch] font-ui text-ui-sm font-normal text-text-tertiary">{description}</div>}
      {actions != null && <div data-slot="canvas-empty-actions" className="flex flex-wrap items-center justify-center gap-2">{actions}</div>}
    </div>
  );
}
