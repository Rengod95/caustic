'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { Card } from '../card/index.ts';
import { cardAgentOrbVariants, cardAgentVariants } from './card-agent.variants.ts';

export interface CardAgentProps extends ComponentProps<'div'> {
  size?: 'regular' | 'compact';
}

/** Output the agent produced and the user has not applied yet. After Apply, render a CardSurface instead. */
export function CardAgent({ size, className, ...props }: CardAgentProps) {
  return <Card data-slot="card-agent" size={size} className={cn(cardAgentVariants(), className)} {...props} />;
}

/** Leading spectrum orb for the header. Decorative; state the provenance in text as well. */
export function CardAgentOrb({ className, ...props }: ComponentProps<'span'>) {
  return <span aria-hidden data-slot="card-agent-orb" className={cn(cardAgentOrbVariants(), className)} {...props} />;
}
