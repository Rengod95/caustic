'use client';
import { Copy, RotateCcw } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { messageOrbVariants, messageVariants, type MessageVariantProps } from './message.variants.ts';

export interface MessageProps extends Omit<ComponentProps<'div'>, 'children'>, MessageVariantProps {
  /** The agent is still writing this message: aria-busy while true. */
  streaming?: boolean;
  /** Agent only. Summary text of the meta row. */
  meta?: ReactNode;
  /** Agent only. Shows the copy IconButton. */
  onCopy?: () => void;
  /** Agent only. Shows the retry IconButton. */
  onRetry?: () => void;
  /** Agent only. aria-label of the copy button; required with onCopy. */
  copyLabel?: string | undefined;
  /** Agent only. aria-label of the retry button; required with onRetry. */
  retryLabel?: string | undefined;
  /** User: inline text. Agent: paragraphs (`<p>`) and MessageCode. */
  children: ReactNode;
}

/** One turn of the transcript: a grey bubble for a person, serif prose with a meta row for the agent. */
export function Message({ author, streaming = false, meta, onCopy, onRetry, copyLabel, retryLabel, className, children, ...props }: MessageProps) {
  const a = author ?? 'agent';
  const busy = streaming ? true : undefined;
  if (a === 'user') {
    return <div data-slot="message" data-author={a} aria-busy={busy} className={cn(messageVariants({ author: a }), className)} {...props}>{children}</div>;
  }
  const hasMeta = meta != null || onCopy !== undefined || onRetry !== undefined;
  return (
    <div data-slot="message" data-author="agent" aria-busy={busy} className={cn(messageVariants({ author: 'agent' }), className)} {...props}>
      <div data-slot="message-body" className="font-voice text-voice text-text-primary [&_p]:mb-2">{children}</div>
      {hasMeta && (
        <div data-slot="message-meta" className="flex items-center gap-1.5 text-hint tracking-[var(--cs-text-voice-tracking)] text-text-tertiary">
          <span data-slot="message-orb" aria-hidden className={messageOrbVariants({ author: 'agent' })} />
          {meta != null && <span data-slot="message-summary">{meta}</span>}
          {(onCopy !== undefined || onRetry !== undefined) && (
            <span data-slot="message-actions" className="ml-auto flex items-center gap-2">
              {onCopy !== undefined && <IconButton data-slot="message-copy" size="xs" label={copyLabel ?? ''} onClick={() => onCopy()}><Copy /></IconButton>}
              {onRetry !== undefined && <IconButton data-slot="message-retry" size="xs" label={retryLabel ?? ''} onClick={() => onRetry()}><RotateCcw /></IconButton>}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export type MessageCodeProps = ComponentProps<'code'>;

/** Inline code inside agent prose. */
export function MessageCode({ className, ...props }: MessageCodeProps) {
  return <code data-slot="message-code" className={cn('rounded-sm bg-fill-pressed px-1.25 py-0.25 font-mono text-mono', className)} {...props} />;
}
