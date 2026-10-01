'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { tokenDiffArrowVariants, tokenDiffFromVariants, tokenDiffKeyVariants, tokenDiffToVariants, tokenDiffVariants } from './token-diff.variants.ts';

export interface TokenDiffRow {
  name: string;
  from: string;
  to: string;
}

export interface TokenDiffProps extends Omit<ComponentProps<'div'>, 'children'> {
  rows: TokenDiffRow[];
}

/** Compact before / after list of token changes. Read-only machine output. */
export function TokenDiff({ rows, className, ...props }: TokenDiffProps) {
  return (
    <div role="list" data-slot="token-diff" className={cn(tokenDiffVariants(), className)} {...props}>
      {rows.map(row => (
        <div key={row.name} role="listitem" data-slot="token-diff-row" aria-label={`${row.name} changed from ${row.from} to ${row.to}`} className="contents">
          <span data-slot="token-diff-key" className={tokenDiffKeyVariants()}>{row.name}</span>
          <del data-slot="token-diff-from" className={tokenDiffFromVariants()}>{row.from}</del>
          <span data-slot="token-diff-arrow" aria-hidden className={tokenDiffArrowVariants()}>→</span>
          <ins data-slot="token-diff-to" className={tokenDiffToVariants()}>{row.to}</ins>
        </div>
      ))}
    </div>
  );
}
