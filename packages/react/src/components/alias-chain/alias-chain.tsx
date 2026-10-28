'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { aliasChainArrowVariants, aliasChainItemVariants, aliasChainNameVariants, aliasChainResolvedVariants, aliasChainVariants } from './alias-chain.variants.ts';

/** Common props: variant / tone / radius / shadow draw the resolved name as a tag (ghost = the border.strong end node, default); tone also colours the arrows; size steps type and gap. */
export interface AliasChainProps extends Omit<ComponentProps<'ol'>, 'children'>, CommonProps {
  /** Names from the starting token to the resolved one (at least one). */
  items: string[];
  /** Accessible name of the chain. */
  'aria-label': string;
}

/** An elevation replaces the hairline edge (both are box-shadow); listed after the variant so it wins the merge. */
const ELEVATION = { '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' } as const;

/** Shows how a token resolves: the names it passes through as linked nodes (hairline boxes joined by long arrows), ending
 *  on the primitive (the strongest node). Read-only. */
export function AliasChain({ items, tone, variant, radius, shadow, size, className, ...props }: AliasChainProps) {
  return (
    <ol data-slot="alias-chain" role="list" className={cn(aliasChainVariants({ size }), className)} {...props}>
      {items.map((name, i) => {
        const last = i === items.length - 1;
        return last
          ? <li key={`${i}:${name}`} data-slot="alias-chain-resolved" aria-current="true" className={cn(aliasChainResolvedVariants({ variant, tone, radius, shadow }), shadow && shadow !== 'none' && ELEVATION[shadow])}>{name}</li>
          : (
            <li key={`${i}:${name}`} data-slot="alias-chain-item" className={aliasChainItemVariants({ size })}>
              <span data-slot="alias-chain-name" className={aliasChainNameVariants()}>{name}</span>
              <span data-slot="alias-chain-arrow" aria-hidden className={aliasChainArrowVariants({ tone, size })}><Connector /></span>
            </li>
          );
      })}
    </ol>
  );
}

/** Shaft from edge to edge plus an open head; the stroke does not scale with the box, so every size keeps a 1.5px line. */
function Connector() {
  return (
    <svg viewBox="0 0 16 12" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 6H15M11 2.5L15 6L11 9.5" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
