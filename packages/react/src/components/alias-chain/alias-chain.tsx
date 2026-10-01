'use client';
import { ArrowRight } from 'lucide-react';
import { Fragment, type ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { aliasChainArrowVariants, aliasChainItemVariants, aliasChainResolvedVariants, aliasChainVariants } from './alias-chain.variants.ts';

export interface AliasChainProps extends Omit<ComponentProps<'ol'>, 'children'> {
  /** Names from the starting token to the resolved one (at least one). */
  items: string[];
  /** Accessible name of the chain. */
  'aria-label': string;
}

/** Shows how a token resolves: the names it passes through, joined by arrows, ending on the primitive. Read-only. */
export function AliasChain({ items, className, ...props }: AliasChainProps) {
  return (
    <ol data-slot="alias-chain" role="list" className={cn(aliasChainVariants(), className)} {...props}>
      {items.map((name, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={`${i}:${name}`}>
            {last
              ? <li data-slot="alias-chain-resolved" aria-current="true" className={aliasChainResolvedVariants()}>{name}</li>
              : <li data-slot="alias-chain-item" className={aliasChainItemVariants()}>{name}</li>}
            {!last && <span data-slot="alias-chain-arrow" aria-hidden className={aliasChainArrowVariants()}><ArrowRight /></span>}
          </Fragment>
        );
      })}
    </ol>
  );
}
