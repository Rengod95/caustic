'use client';
import { FileCode, Plus } from '../../icons/index.ts';
import { Children, createContext, Fragment, isValidElement, useContext, useEffect, useRef, useState, type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { radiusClass, shadowClass, type CommonProps, type Size } from '../../lib/common-props.ts';
import { Button } from '../button/button.tsx';
import {
  codeDiffActions, codeDiffBody, codeDiffContent, codeDiffFilename, codeDiffHeader, codeDiffIcon, codeDiffLine,
  codeDiffCommentAdd, codeDiffComment, codeDiffCommentAuthor, codeDiffHunk, codeDiffHunkActions, codeDiffHunkHeader, codeDiffNumber, codeDiffSign, codeDiffStatAdd, codeDiffStatDel, codeDiffToken, codeDiffVariants,
} from './code-diff.variants.ts';

export type CodeDiffKind = 'context' | 'add' | 'remove';
export type CodeDiffSyntax = 'keyword' | 'string' | 'property' | 'comment';

export interface CodeDiffLineProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** add = diff.add tint with a + sign; remove = diff.remove tint with a − sign. */
  kind?: CodeDiffKind;
  /** Line number (old for removed, new for added and context). */
  number: number;
  /** Shows the add-comment button over the line number on hover or focus. */
  onComment?: () => void;
  /** aria-label of the add-comment button; required with onComment. */
  commentLabel?: string | undefined;
  /** The code; wrap syntax spans in CodeDiffToken. */
  children?: ReactNode;
}

export type CodeDiffDecision = 'pending' | 'accepted' | 'rejected';

export interface CodeDiffHunkProps extends Omit<ComponentProps<'span'>, 'children'> {
  /** The hunk header text, e.g. "@@ -12,5 +12,6 @@ PricingCard". */
  header: ReactNode;
  /** The review decision of this hunk. Default pending. */
  decision?: CodeDiffDecision;
  /** Reject or Accept of this hunk is pressed. */
  onDecide?: (decision: 'accepted' | 'rejected') => void;
  /** Show Reject and Accept in the hunk header. Default true. */
  actions?: boolean;
  /** CodeDiffLine and CodeDiffComment elements. */
  children?: ReactNode;
}

export interface CodeDiffCommentProps extends ComponentProps<'span'> {
  /** Who wrote the comment. */
  author?: ReactNode;
}

export interface CodeDiffTokenProps extends ComponentProps<'span'> {
  syntax?: CodeDiffSyntax;
}

/**
 * Common props (lib/common-props.ts): variant = card emphasis (outline, the default: surface with the subtle edge),
 * tone = the edge (outline) or fill (soft) colour (default neutral), size = line height and code type (default md: 20px,
 * mono-relaxed), radius = card corners (default xl), shadow = card elevation (default none).
 */
export interface CodeDiffProps extends Omit<ComponentProps<'figure'>, 'children'>, CommonProps {
  /** Accessible name of the figure. */
  'aria-label': string;
  /** File name. */
  filename: ReactNode;
  /** Added line count for "+N". Derived from the lines when omitted. */
  added?: number;
  /** Removed line count for "−N". Derived from the lines when omitted. */
  removed?: number;
  /** Show Reject and Accept. */
  actions?: boolean;
  onReject?: (event: MouseEvent<HTMLButtonElement>) => void;
  onAccept?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** CodeDiffLine elements. */
  children?: ReactNode;
}

const SIGN: Record<CodeDiffKind, string> = { context: ' ', add: '+', remove: '−' };
const SizeCtx = createContext<Size | undefined>(undefined);

function countKind(children: ReactNode, kind: CodeDiffKind): number {
  return Children.toArray(children).reduce<number>((n, c) => {
    if (!isValidElement<{ kind?: CodeDiffKind; children?: ReactNode }>(c)) return n;
    if (c.type === Fragment) return n + countKind(c.props.children, kind);
    return n + (c.props.kind === kind ? 1 : 0);
  }, 0);
}

/** Review of agent-written code: file header with counts and Reject / Accept over unified diff lines. */
export function CodeDiff({
  filename, added, removed, actions = true, onReject, onAccept, tone, variant, radius, shadow, size, className, children, 'aria-label': ariaLabel, ...props
}: CodeDiffProps) {
  const body = useRef<HTMLPreElement>(null);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const el = body.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollWidth > el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children]);
  const add = added ?? countKind(children, 'add');
  const del = removed ?? countKind(children, 'remove');
  return (
    <figure
      data-slot="code-diff" aria-label={ariaLabel}
      className={cn(codeDiffVariants({ variant, tone, size }), radius && radius !== 'xl' && radiusClass[radius], shadow && shadow !== 'none' && [shadowClass[shadow], '[--code-diff-edge:transparent]'], className)}
      {...props}
    >
      <div data-slot="code-diff-header" className={codeDiffHeader()}>
        <span data-slot="code-diff-icon" aria-hidden="true" className={codeDiffIcon()}><FileCode /></span>
        <span data-slot="code-diff-filename" className={codeDiffFilename()}>{filename}</span>
        {add > 0 && <span data-slot="code-diff-stat-add" className={codeDiffStatAdd()}>+{add}</span>}
        {del > 0 && <span data-slot="code-diff-stat-del" className={codeDiffStatDel()}>−{del}</span>}
        {actions && (
          <span data-slot="code-diff-actions" className={codeDiffActions()}>
            <Button tone="ghost" size="xs" onClick={onReject}>Reject</Button>
            <Button tone="ink" size="xs" onClick={onAccept}>Accept</Button>
          </span>
        )}
      </div>
      <pre
        ref={body} data-slot="code-diff-body" className={codeDiffBody()}
        {...(overflows ? { tabIndex: 0, role: 'region', 'aria-label': ariaLabel } : {})}
      ><SizeCtx.Provider value={size}>{children}</SizeCtx.Provider></pre>
    </figure>
  );
}

/** One unified diff line: number, sign and content. */
export function CodeDiffLine({ kind = 'context', number, onComment, commentLabel, className, children, ...props }: CodeDiffLineProps) {
  const size = useContext(SizeCtx);
  return (
    // A span with display grid: the body is a <pre>, which only takes phrasing content.
    <span data-slot="code-diff-line" data-kind={kind} className={cn(codeDiffLine({ kind, lineSize: size }), className)} {...props}>
      <span data-slot="code-diff-number" aria-hidden="true" data-line={number} className={codeDiffNumber()} />
      <span data-slot="code-diff-sign" className={codeDiffSign({ kind })}>
        <span aria-hidden="true">{SIGN[kind]}</span>
        {kind !== 'context' && <span className="sr-only">{kind === 'add' ? 'added' : 'removed'}</span>}
      </span>
      <span data-slot="code-diff-content" className={codeDiffContent()}>{children}</span>
      {onComment !== undefined && (
        <button type="button" data-slot="code-diff-comment-add" aria-label={commentLabel ?? ''} className={codeDiffCommentAdd()} onClick={() => onComment()}><Plus aria-hidden /></button>
      )}
    </span>
  );
}

/** One hunk of a diff: a header with the hunk's own Reject / Accept, then its lines (and comments). */
export function CodeDiffHunk({ header, decision = 'pending', onDecide, actions = true, className, children, ...props }: CodeDiffHunkProps) {
  return (
    <span data-slot="code-diff-hunk" data-decision={decision} className={cn(codeDiffHunk(), className)} {...props}>
      <span data-slot="code-diff-hunk-header" className={codeDiffHunkHeader()}>
        <span data-slot="code-diff-hunk-title" className="min-w-0 break-all">{header}</span>
        {actions && (
          <span data-slot="code-diff-hunk-actions" className={codeDiffHunkActions()}>
            <Button data-slot="code-diff-hunk-reject" tone={decision === 'rejected' ? 'danger' : 'ghost'} variant={decision === 'rejected' ? 'soft' : undefined} size="xs" aria-pressed={decision === 'rejected'} onClick={() => onDecide?.('rejected')}>Reject</Button>
            <Button data-slot="code-diff-hunk-accept" tone={decision === 'accepted' ? 'success' : 'ink'} variant={decision === 'accepted' ? 'soft' : undefined} size="xs" aria-pressed={decision === 'accepted'} onClick={() => onDecide?.('accepted')}>Accept</Button>
          </span>
        )}
      </span>
      {children}
    </span>
  );
}

/** A review comment under a line, in the interface voice. */
export function CodeDiffComment({ author, className, children, ...props }: CodeDiffCommentProps) {
  return (
    <span data-slot="code-diff-comment" role="note" className={cn(codeDiffComment(), className)} {...props}>
      {author != null && <b data-slot="code-diff-comment-author" className={codeDiffCommentAuthor()}>{author}</b>}
      {children}
    </span>
  );
}

/** A syntax span inside a line. Never the agent spectrum. */
export function CodeDiffToken({ syntax = 'keyword', className, ...props }: CodeDiffTokenProps) {
  return <span data-slot="code-diff-token" data-syntax={syntax} className={cn(codeDiffToken({ syntax }), className)} {...props} />;
}
