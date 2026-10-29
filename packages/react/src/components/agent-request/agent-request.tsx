'use client';
import { Check, ShieldCheck, X } from 'lucide-react';
import { Fragment, useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import { Card } from '../card/card.tsx';
import {
  agentRequestBodyVariants, agentRequestButtonSize, agentRequestCardVariants, agentRequestCountVariants, agentRequestFooterVariants, agentRequestHeaderVariants,
  agentRequestHeadingVariants, agentRequestIconVariants, agentRequestOrbVariants, agentRequestPendingGlow, agentRequestProposalVariants, agentRequestProseVariants,
  agentRequestReviewVariants, agentRequestSubtitleVariants, agentRequestSummaryVariants, agentRequestTitleVariants,
  type AgentRequestKind, type AgentRequestStatus,
} from './agent-request.variants.ts';

export type { AgentRequestKind, AgentRequestStatus };

/** One outcome button. primary = the confirming action (ink); secondary = the quiet alternative; danger = the refusal. */
export interface AgentRequestAction {
  id: string;
  label: ReactNode;
  tone?: 'primary' | 'secondary' | 'danger';
}

/** The actions each kind shows when `actions` is unset. */
export const agentRequestDefaultActions: Record<AgentRequestKind, AgentRequestAction[]> = {
  proposal: [{ id: 'build', label: 'Build it', tone: 'primary' }, { id: 'edit', label: 'Edit plan', tone: 'secondary' }],
  review: [{ id: 'reject', label: 'Reject', tone: 'secondary' }, { id: 'approve', label: 'Approve all', tone: 'primary' }],
  permission: [{ id: 'deny', label: 'Deny', tone: 'danger' }, { id: 'always', label: 'Always for this project', tone: 'secondary' }, { id: 'once', label: 'Allow once', tone: 'primary' }],
};

export interface AgentRequestProps extends Omit<ComponentProps<'div'>, 'title'>, CommonProps {
  /** proposal (plan mode: orb, "Proposal · " lead-in, footer band), review (floating panel: orb, count title) or permission (shield tile). */
  kind?: AgentRequestKind;
  /** pending = the question; answered, allowed or denied collapse it into the one-line record (no actions). */
  status?: AgentRequestStatus;
  /** The request (proposal: the plan name after "Proposal · "), or the outcome on the record. */
  title: ReactNode;
  /** The line under the title (source, consequence and undo), or the record detail on the title line. */
  subtitle?: ReactNode;
  /** Header badge (Badge tone info), pushed to the end, e.g. "Plan mode". */
  badge?: ReactNode;
  /** Outcome buttons in reading order; unset = the kind's defaults. Pass [] for none. */
  actions?: AgentRequestAction[];
  /** Reports the id of the pressed action; the parent switches status. */
  onAction?: (id: string) => void;
  /** Free body: AgentRequestProse, AgentRequestSummary (chips), a TokenDiff, a ChoiceGroup… */
  children?: ReactNode;
}

const buttonLook = (kind: AgentRequestKind, tone: AgentRequestAction['tone']) => {
  if (tone === 'primary') return { tone: 'neutral', variant: 'solid' } as const;
  // proposal: a filled secondary, so it reads as a button next to the solid one (owner round 2); elsewhere ghost.
  if (kind === 'proposal' && tone !== 'danger') return { tone: 'neutral', variant: 'soft' } as const;
  return { tone: 'neutral', variant: 'ghost' } as const;
};

/**
 * An agent request in the transcript, on Card: a plan-mode proposal, a batch review, or a permission prompt. Header
 * (orb or tile, title, subtitle, badge), free body and a row of outcome buttons; once answered it collapses into a quiet
 * one-line record.
 */
export function AgentRequest({
  kind = 'proposal', status = 'pending', tone: toneProp, variant, radius, shadow, size, title, subtitle, badge, actions, onAction, className, children, ...props
}: AgentRequestProps) {
  const titleId = useId();
  const s = size ?? 'md';
  const record = status !== 'pending';
  const k: AgentRequestKind = record ? 'permission' : kind;
  const tone = toneProp ?? (record ? (status === 'denied' ? 'neutral' : 'success') : kind === 'permission' ? 'warning' : 'agent');
  // The spectrum rim (Card variant agent) marks a pending agent proposal or review; ghost drops it with the elevation.
  const rim = !record && kind !== 'permission' && tone === 'agent' && variant !== 'ghost';
  const list = record ? [] : (actions ?? agentRequestDefaultActions[kind]);

  let skin: string;
  if (k === 'proposal') skin = agentRequestProposalVariants({ tone, variant, size: s, radius: radius ?? null, shadow: shadow ?? null });
  else if (k === 'review') {
    // The glow is the pending cue of the rim; another elevation, or a ghost panel, keeps its own depth.
    skin = cn(agentRequestReviewVariants({ tone, variant, size: s, radius: radius ?? null, shadow: shadow ?? null }), rim && (shadow == null || shadow === '4') && agentRequestPendingGlow);
  } else {
    // Unset shadow follows the status: a pending prompt is on elevation 2, a record is flat (its hairline is the depth cue).
    const sh = shadow ?? (!record && variant !== 'ghost' ? '2' : 'none');
    skin = agentRequestCardVariants({ status, tone, variant, radius, shadow: sh, size: s });
  }

  const lead = record
    ? <span data-slot="agent-request-icon" aria-hidden className={agentRequestIconVariants({ tone, record: true })}>{status === 'denied' ? <X /> : <Check />}</span>
    : kind === 'permission'
      ? <span data-slot="agent-request-icon" aria-hidden className={agentRequestIconVariants({ tone, record: false })}><ShieldCheck /></span>
      : <span data-slot="agent-request-orb" aria-hidden className={agentRequestOrbVariants({ kind })} />;

  const lastDanger = k === 'proposal' ? -1 : list.reduce((at, a, i) => (a.tone === 'danger' && i === at + 1 ? i : at), -1);
  const footer = list.length > 0 && (
    <div data-slot="agent-request-footer" className={agentRequestFooterVariants({ kind: k, rim: rim && k === 'proposal', size: s })}>
      {list.map((a, i) => (
        <Fragment key={a.id}>
          <Button
            data-slot="agent-request-action" data-action={a.id} data-intent={a.tone ?? 'secondary'}
            {...buttonLook(k, a.tone)} size={agentRequestButtonSize[k][s]} onClick={() => onAction?.(a.id)}
          >
            {a.label}
          </Button>
          {/* The refusal starts the row; the confirming actions end it, as in every dialog. */}
          {i === lastDanger && i < list.length - 1 && <span aria-hidden className="flex-1" />}
        </Fragment>
      ))}
    </div>
  );

  return (
    <Card
      variant={rim ? 'agent' : 'plain'} size={s}
      role={kind === 'review' && !record ? 'dialog' : 'group'} aria-modal={kind === 'review' && !record ? false : undefined} aria-labelledby={titleId}
      data-slot="agent-request" data-kind={kind} data-status={status} data-tone={tone}
      className={cn(skin, 'transition-control', kind === 'review' ? 'animate-enter enter-scale' : 'animate-rise', className)}
      {...props}
    >
      <div data-slot="agent-request-header" className={cn(agentRequestHeaderVariants({ kind: k, record, size: s }))}>
        {lead}
        <div data-slot="agent-request-heading" className={agentRequestHeadingVariants({ record })}>
          <div id={titleId} data-slot="agent-request-title" className={cn(agentRequestTitleVariants({ kind: k, record, size: s }))}>
            {kind === 'proposal' && !record ? <>Proposal · {title}</> : title}
          </div>
          {subtitle != null && <div data-slot="agent-request-subtitle" className={cn(agentRequestSubtitleVariants({ kind: k, record }))}>{subtitle}</div>}
        </div>
        {badge != null && <Badge data-slot="agent-request-badge" tone="info" className="ml-auto">{badge}</Badge>}
      </div>
      {children != null && !record && <div data-slot="agent-request-body" className={agentRequestBodyVariants({ kind: k, size: s })}>{children}</div>}
      {footer}
    </Card>
  );
}

/** The agent's prose in the body: what it will do, in the voice serif (the proposal summary). */
export function AgentRequestProse({ className, ...props }: ComponentProps<'p'>) {
  return <p data-slot="agent-request-prose" className={cn(agentRequestProseVariants(), className)} {...props} />;
}

/** The chip row in the body: the footprint of a proposal ("+ 1 component") or the toned summary of a review. Read-only chips. */
export function AgentRequestSummary({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="agent-request-summary" className={cn(agentRequestSummaryVariants(), className)} {...props} />;
}

/** The number in a review title: tabular, at least two digits wide, left-aligned. */
export function AgentRequestCount({ className, ...props }: ComponentProps<'span'>) {
  return <span data-slot="agent-request-count" className={cn(agentRequestCountVariants(), className)} {...props} />;
}
