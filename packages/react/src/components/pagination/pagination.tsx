'use client';
import { ChevronLeft, ChevronRight } from '../../icons/index.ts';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { paginationButton, paginationGap, paginationStepVariants, paginationVariants, type PaginationVariantProps } from './pagination.variants.ts';

/** tone, variant, radius, shadow and size style every page button (the root is a bare row). */
export interface PaginationProps extends Omit<ComponentProps<'nav'>, 'defaultValue' | 'onChange'>, PaginationVariantProps, CommonProps {
  /** Controlled current page, 1-based. */
  value?: number;
  /** Uncontrolled initial page. */
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Total pages (numbered). Derived from total and pageSize in compact. */
  pageCount?: number;
  /** Numbered: page numbers shown on each side of the current page. */
  siblingCount?: number;
  /** Compact: total item count. */
  total?: number;
  /** Compact: items per page. */
  pageSize?: number;
  /** Compact: plural noun after the total, for example "tokens". */
  itemLabel?: string;
  /** Numbered: Prev and Next as chevron and word (text, default) or as square chevron-only buttons (icon). */
  stepLabel?: 'text' | 'icon';
}

/** Always the first and last page, the current page and its siblings; any skipped run becomes one gap. */
function pageWindow(current: number, count: number, siblings: number): (number | 'gap')[] {
  const keep = new Set<number>([1, count]);
  for (let p = current - siblings; p <= current + siblings; p++) if (p >= 1 && p <= count) keep.add(p);
  const sorted = [...keep].sort((a, b) => a - b);
  const out: (number | 'gap')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1]! > 1) out.push('gap');
    out.push(p);
  });
  return out;
}

/** Moves between pages of a long result: numbered pages with Prev/Next, or a compact range summary with arrows. */
export function Pagination({
  value, defaultValue = 1, onValueChange, pageCount, layout, siblingCount = 1, total = 0, pageSize = 10, itemLabel, stepLabel = 'text', tone, variant, radius, shadow, size,
  'aria-label': ariaLabel = 'Pagination', className, ...props
}: PaginationProps) {
  const compact = layout === 'compact';
  const count = Math.max(1, compact ? Math.ceil(total / pageSize) : (pageCount ?? 1));
  const [current, setCurrent] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const page = Math.min(Math.max(current, 1), count);
  const go = (next: number) => setCurrent(Math.min(Math.max(next, 1), count));
  const button = cn(paginationButton({ tone, variant, radius, shadow, size }));
  const step = cn(button, paginationStepVariants({ stepLabel }));
  const words = stepLabel === 'text';
  // The compact arrows are IconButtons one step below the page buttons (md pages, sm arrows).
  const arrow = ({ xs: 'xs', sm: 'xs', md: 'sm', lg: 'md' } as const)[size ?? 'md'];

  if (compact) {
    const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);
    return (
      <nav data-slot="pagination" data-layout="compact" aria-label={ariaLabel} className={cn(paginationVariants({ layout: 'compact' }), className)} {...props}>
        <span data-slot="pagination-summary" className="text-footnote text-text-tertiary">
          {`${from}–${to} of ${total}${itemLabel ? ` ${itemLabel}` : ''}`}
        </span>
        <div data-slot="pagination-controls" className="flex gap-1">
          <IconButton data-slot="pagination-prev-icon" size={arrow} label="Previous" disabled={page <= 1} onClick={() => go(page - 1)}><ChevronLeft /></IconButton>
          <IconButton data-slot="pagination-next-icon" size={arrow} label="Next" disabled={page >= count} onClick={() => go(page + 1)}><ChevronRight /></IconButton>
        </div>
      </nav>
    );
  }

  return (
    <nav data-slot="pagination" data-layout="numbered" data-step-label={stepLabel} aria-label={ariaLabel} className={cn(paginationVariants({ layout }), className)} {...props}>
      <button type="button" data-slot="pagination-prev" aria-label="Previous page" disabled={page <= 1} className={step} onClick={() => go(page - 1)}>
        <ChevronLeft className="size-icon-sm" aria-hidden />{words && 'Prev'}
      </button>
      {pageWindow(page, count, siblingCount).map((p, i) => p === 'gap' ? (
        <span key={`gap-${i}`} data-slot="pagination-gap" aria-hidden="true" className={paginationGap()}>…</span>
      ) : (
        <button
          key={p} type="button" data-slot="pagination-page" className={button}
          aria-current={p === page ? 'page' : undefined} aria-label={p === page ? undefined : `Page ${p}`}
          onClick={() => go(p)}
        >
          {p}
        </button>
      ))}
      <button type="button" data-slot="pagination-next" aria-label="Next page" disabled={page >= count} className={step} onClick={() => go(page + 1)}>
        {words && 'Next'}<ChevronRight className="size-icon-sm" aria-hidden />
      </button>
    </nav>
  );
}
