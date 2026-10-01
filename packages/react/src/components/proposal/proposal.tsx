'use client';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import { proposalBodyVariants, proposalChipsVariants, proposalFooterVariants, proposalHeaderVariants, proposalOrbVariants, proposalSummaryVariants, proposalVariants } from './proposal.variants.ts';

export interface ProposalProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Proposal name; the component prefixes "Proposal · ". */
  title: ReactNode;
  /** Header badge text (tone info), e.g. "Plan mode". */
  badge?: ReactNode;
  /** Chip elements for the footprint row. */
  chips?: ReactNode;
  buildLabel?: ReactNode;
  /** Pass null to hide the secondary action. */
  editLabel?: ReactNode;
  onBuild?: () => void;
  onEdit?: () => void;
  /** The summary sentence(s). */
  children: ReactNode;
}

/** The plan-mode proposal card: summary, footprint chips and Build it / Edit plan. */
export function Proposal({ title, badge, chips, buildLabel = 'Build it', editLabel = 'Edit plan', onBuild, onEdit, className, children, ...props }: ProposalProps) {
  const titleId = useId();
  return (
    <div role="group" aria-labelledby={titleId} data-slot="proposal" className={cn(proposalVariants(), className)} {...props}>
      <div data-slot="proposal-header" className={proposalHeaderVariants()}>
        <span data-slot="proposal-orb" aria-hidden className={proposalOrbVariants()} />
        <span id={titleId} data-slot="proposal-title">Proposal · {title}</span>
        {badge != null && <Badge data-slot="proposal-badge" tone="info" className="ml-auto">{badge}</Badge>}
      </div>
      <div data-slot="proposal-body" className={proposalBodyVariants()}>
        <p data-slot="proposal-summary" className={proposalSummaryVariants()}>{children}</p>
        {chips != null && <div data-slot="proposal-chips" className={proposalChipsVariants()}>{chips}</div>}
      </div>
      <div data-slot="proposal-footer" className={proposalFooterVariants()}>
        <Button data-slot="proposal-build" tone="ink" size="xs" onClick={onBuild}>{buildLabel}</Button>
        {editLabel !== null && <Button data-slot="proposal-edit" tone="ghost" size="xs" onClick={onEdit}>{editLabel}</Button>}
      </div>
    </div>
  );
}
