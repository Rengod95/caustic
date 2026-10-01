'use client';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Button } from '../button/button.tsx';
import { TokenDiff, type TokenDiffRow } from '../token-diff/token-diff.tsx';
import { reviewActionsVariants, reviewHeaderVariants, reviewOrbVariants, reviewRequestVariants, reviewSubtitleVariants, reviewSummaryVariants, reviewTitleVariants } from './review-request.variants.ts';

export interface ReviewRequestProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Count title, e.g. "Review 9 changes". */
  title: ReactNode;
  /** Source line. */
  subtitle?: ReactNode;
  /** Chip elements for the summary row. */
  summary?: ReactNode;
  /** Rows of the token diff; omit to hide the block. */
  changes?: TokenDiffRow[];
  rejectLabel?: ReactNode;
  approveLabel?: ReactNode;
  onApprove?: () => void;
  onReject?: () => void;
}

/** The agent asks the person to review a batch of changes. Non-modal floating panel. */
export function ReviewRequest({ title, subtitle, summary, changes, rejectLabel = 'Reject', approveLabel = 'Approve all', onApprove, onReject, className, ...props }: ReviewRequestProps) {
  const titleId = useId();
  return (
    <div role="dialog" aria-modal="false" aria-labelledby={titleId} data-slot="review-request" className={cn(reviewRequestVariants(), className)} {...props}>
      <div data-slot="review-request-header" className={reviewHeaderVariants()}>
        <span data-slot="review-request-orb" aria-hidden className={reviewOrbVariants()} />
        <div>
          <div id={titleId} data-slot="review-request-title" className={reviewTitleVariants()}>{title}</div>
          {subtitle != null && <div data-slot="review-request-subtitle" className={reviewSubtitleVariants()}>{subtitle}</div>}
        </div>
      </div>
      {summary != null && <div data-slot="review-request-summary" className={reviewSummaryVariants()}>{summary}</div>}
      {changes != null && <div data-slot="review-request-diff"><TokenDiff rows={changes} /></div>}
      <div data-slot="review-request-actions" className={reviewActionsVariants()}>
        <Button data-slot="review-request-reject" tone="ghost" size="sm" onClick={onReject}>{rejectLabel}</Button>
        <Button data-slot="review-request-approve" tone="ink" size="sm" onClick={onApprove}>{approveLabel}</Button>
      </div>
    </div>
  );
}
