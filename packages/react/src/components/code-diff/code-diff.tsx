'use client';
import { FileCode } from 'lucide-react';
import { Children, Fragment, isValidElement, useEffect, useRef, useState, type ComponentProps, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Button } from '../button/button.tsx';
import {
  codeDiffActions, codeDiffBody, codeDiffContent, codeDiffFilename, codeDiffHeader, codeDiffIcon, codeDiffLine,
  codeDiffNumber, codeDiffSign, codeDiffStatAdd, codeDiffStatDel, codeDiffToken, codeDiffVariants,
} from './code-diff.variants.ts';

export type CodeDiffKind = 'context' | 'add' | 'remove';
export type CodeDiffSyntax = 'keyword' | 'string' | 'property' | 'comment';

export interface CodeDiffLineProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** add = diff.add tint with a + sign; remove = diff.remove tint with a − sign. */
  kind?: CodeDiffKind;
  /** Line number (old for removed, new for added and context). */
  number: number;
  /** The code; wrap syntax spans in CodeDiffToken. */
  children?: ReactNode;
}

export interface CodeDiffTokenProps extends ComponentProps<'span'> {
  syntax?: CodeDiffSyntax;
}

export interface CodeDiffProps extends Omit<ComponentProps<'figure'>, 'children'> {
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

function countKind(children: ReactNode, kind: CodeDiffKind): number {
  return Children.toArray(children).reduce<number>((n, c) => {
    if (!isValidElement<{ kind?: CodeDiffKind; children?: ReactNode }>(c)) return n;
    if (c.type === Fragment) return n + countKind(c.props.children, kind);
    return n + (c.props.kind === kind ? 1 : 0);
  }, 0);
}

/** Review of agent-written code: file header with counts and Reject / Accept over unified diff lines. */
export function CodeDiff({ filename, added, removed, actions = true, onReject, onAccept, className, children, 'aria-label': ariaLabel, ...props }: CodeDiffProps) {
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
    <figure data-slot="code-diff" aria-label={ariaLabel} className={cn(codeDiffVariants(), className)} {...props}>
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
      >{children}</pre>
    </figure>
  );
}

/** One unified diff line: number, sign and content. */
export function CodeDiffLine({ kind = 'context', number, className, children, ...props }: CodeDiffLineProps) {
  return (
    <div data-slot="code-diff-line" data-kind={kind} className={cn(codeDiffLine({ kind }), className)} {...props}>
      <span data-slot="code-diff-number" aria-hidden="true" data-line={number} className={codeDiffNumber()} />
      <span data-slot="code-diff-sign" className={codeDiffSign({ kind })}>
        <span aria-hidden="true">{SIGN[kind]}</span>
        {kind !== 'context' && <span className="sr-only">{kind === 'add' ? 'added' : 'removed'}</span>}
      </span>
      <span data-slot="code-diff-content" className={codeDiffContent()}>{children}</span>
    </div>
  );
}

/** A syntax span inside a line. Never the agent spectrum. */
export function CodeDiffToken({ syntax = 'keyword', className, ...props }: CodeDiffTokenProps) {
  return <span data-slot="code-diff-token" data-syntax={syntax} className={cn(codeDiffToken({ syntax }), className)} {...props} />;
}
