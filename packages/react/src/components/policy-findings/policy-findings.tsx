'use client';
import { Check, TriangleAlert, X } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Chip } from '../chip/chip.tsx';
import {
  policyFindingsActionVariants, policyFindingsBodyVariants, policyFindingsFindingVariants, policyFindingsListVariants, policyFindingsLocationVariants,
  policyFindingsSeverityVariants, policyFindingsSummaryVariants, policyFindingsTitleVariants, policyFindingsVariants, type PolicyFindingsVariantProps,
} from './policy-findings.variants.ts';

export interface PolicyFindingsProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Counts shown in the summary chips. */
  summary: { errors: number; warnings: number; passes: number };
  /** Accessible name of the findings list. */
  'aria-label'?: string;
  /** PolicyFindingsItem rows: violations first, passes last. */
  children?: ReactNode;
}

export interface PolicyFindingsItemProps extends Omit<ComponentProps<'li'>, 'title'>, PolicyFindingsVariantProps {
  /** Finding title. */
  title: ReactNode;
  /** Where it applies. */
  location: ReactNode;
  /** The Button xs at the end; leave it out for a pass. */
  action?: ReactNode;
}

const SEVERITY = {
  error: { word: 'Error', Glyph: X },
  warning: { word: 'Warning', Glyph: TriangleAlert },
  pass: { word: 'Pass', Glyph: Check },
} as const;

/** The result of the foundation policy check: a summary of the counts, then one row per finding with one action. */
export function PolicyFindings({ summary, 'aria-label': ariaLabel, className, children, ...props }: PolicyFindingsProps) {
  const { errors, warnings, passes } = summary;
  return (
    <div data-slot="policy-findings" className={cn(policyFindingsVariants(), className)} {...props}>
      <div data-slot="policy-findings-summary" role="group" aria-label="Summary" className={policyFindingsSummaryVariants()}>
        <Chip appearance="soft" tone="danger" size="sm">{errors} {errors === 1 ? 'error' : 'errors'}</Chip>
        <Chip appearance="soft" tone="warning" size="sm">{warnings} {warnings === 1 ? 'warning' : 'warnings'}</Chip>
        <Chip appearance="soft" tone="success" size="sm">{passes} pass</Chip>
      </div>
      <ul data-slot="policy-findings-list" role="list" aria-label={ariaLabel} className={policyFindingsListVariants()}>{children}</ul>
    </div>
  );
}

/** One finding: a severity mark, the title with where it happens, and an optional action. */
export function PolicyFindingsItem({ severity, title, location, action, className, ...props }: PolicyFindingsItemProps) {
  const { word, Glyph } = SEVERITY[severity ?? 'error'];
  return (
    <li data-slot="policy-findings-finding" data-severity={severity ?? 'error'} className={cn(policyFindingsFindingVariants(), className)} {...props}>
      <span data-slot="policy-findings-severity" className={policyFindingsSeverityVariants({ severity })}>
        <Glyph aria-hidden />
        <span className="sr-only">{word}</span>
      </span>
      <div data-slot="policy-findings-body" className={policyFindingsBodyVariants()}>
        <b data-slot="policy-findings-title" className={policyFindingsTitleVariants()}>{title}</b>
        <div data-slot="policy-findings-location" className={policyFindingsLocationVariants()}>{location}</div>
      </div>
      {action != null && <div data-slot="policy-findings-action" className={policyFindingsActionVariants()}>{action}</div>}
    </li>
  );
}
