'use client';
import { Check, Copy, RotateCcw } from 'lucide-react';
import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { messageActionsVariants, messageBodyVariants, messageOrbVariants, messageVariants, type MessageVariantProps } from './message.variants.ts';

export interface MessageProps extends Omit<ComponentProps<'div'>, 'children'>, Omit<MessageVariantProps, keyof CommonProps>, CommonProps {
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

/** How long the copied check stays before the copy icon returns (feedback, not a motion token). */
const COPIED_FOR_MS = 1500;

/** One turn of the transcript: a grey bubble for a person, serif prose with a meta row for the agent. */
export function Message({ author, tone, variant, radius, shadow, size, streaming = false, meta, onCopy, onRetry, copyLabel, retryLabel, className, children, ...props }: MessageProps) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), COPIED_FOR_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);
  const a = author ?? 'agent';
  const busy = streaming ? true : undefined;
  // Unset variant keeps each voice's own look: the user bubble is soft, the agent prose has no panel (ghost).
  const look = { tone, variant: variant ?? (a === 'user' ? 'soft' : 'ghost'), radius, shadow, size };
  if (a === 'user') {
    return <div data-slot="message" data-author={a} aria-busy={busy} className={cn(messageVariants({ author: a, ...look }), className)} {...props}>{children}</div>;
  }
  const hasMeta = meta != null || onCopy !== undefined || onRetry !== undefined;
  return (
    <div data-slot="message" data-author="agent" aria-busy={busy} className={cn('group/message', messageVariants({ author: 'agent', ...look }), className)} {...props}>
      <div data-slot="message-body" className={messageBodyVariants({ size })}>{children}</div>
      {hasMeta && (
        <div data-slot="message-meta" className="flex items-center gap-1.5 text-hint tracking-[var(--cs-text-voice-tracking)] text-text-tertiary">
          <span data-slot="message-orb" aria-hidden className={messageOrbVariants({ author: 'agent', streaming })} />
          {meta != null && <span data-slot="message-summary">{meta}</span>}
          {(onCopy !== undefined || onRetry !== undefined) && (
            <span data-slot="message-actions" className={messageActionsVariants()}>
              {onCopy !== undefined && (
                <IconButton data-slot="message-copy" size="xs" label={copyLabel ?? ''} onClick={() => { onCopy(); setCopied(true); }}>
                  {copied ? <Check className="animate-pop" /> : <Copy />}
                </IconButton>
              )}
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
  return <code data-slot="message-code" className={cn('rounded-sm bg-neutral-track px-1.25 py-0.25 font-mono text-mono', className)} {...props} />;
}
