'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { tokenDiffArrowVariants, tokenDiffFromVariants, tokenDiffKeyVariants, tokenDiffLeaderVariants, tokenDiffToVariants, tokenDiffVariants } from './token-diff.variants.ts';

export interface TokenDiffRow {
  name: string;
  from: string;
  to: string;
}

export interface TokenDiffProps extends Omit<ComponentProps<'div'>, 'children'>, CommonProps {
  rows: TokenDiffRow[];
}

/** Compact before / after list of token changes. Read-only machine output. */
export function TokenDiff({ rows, tone, variant, radius, shadow, size, className, ...props }: TokenDiffProps) {
  return (
    <div role="list" data-slot="token-diff" data-size={size ?? 'md'} className={cn(tokenDiffVariants({ size, shadow }), className)} {...props}>
      {rows.map((row, i) => (
        <div key={row.name} role="listitem" data-slot="token-diff-row" data-stripe={i % 2 === 1 ? '' : undefined} aria-label={`${row.name} changed from ${row.from} to ${row.to}`} className="contents">
          <span data-slot="token-diff-key" className={tokenDiffKeyVariants({ tone, stripe: i % 2 === 1 })}>
            <span data-slot="token-diff-name" className="min-w-0 truncate">{row.name}</span>
            <span data-slot="token-diff-leader" aria-hidden className={tokenDiffLeaderVariants()} />
          </span>
          <del data-slot="token-diff-from" className={cn(tokenDiffFromVariants({ variant, radius }))}>{row.from}</del>
          <span data-slot="token-diff-arrow" aria-hidden className={tokenDiffArrowVariants()}>→</span>
          <ins data-slot="token-diff-to" className={cn(tokenDiffToVariants({ variant, radius }))}>{row.to}</ins>
        </div>
      ))}
    </div>
  );
}
