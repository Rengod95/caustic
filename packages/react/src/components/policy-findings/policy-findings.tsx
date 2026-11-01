'use client';
import { Check, TriangleAlert, X } from '../../icons/index.ts';
import { Children, cloneElement, createContext, isValidElement, useContext, type ComponentProps, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Size } from '../../lib/common-props.ts';
import { Chip } from '../chip/chip.tsx';
import {
  policyFindingsActionVariants, policyFindingsBodyVariants, policyFindingsFindingVariants, policyFindingsListVariants, policyFindingsLocationVariants,
  policyFindingsSeverityVariants, policyFindingsSummaryVariants, policyFindingsTitleVariants, policyFindingsVariants, type PolicyFindingsVariantProps,
} from './policy-findings.variants.ts';

const SizeContext = createContext<Size>('md');

export interface PolicyFindingsProps extends Omit<ComponentProps<'div'>, 'children'>, CommonProps {
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
  /** A small soft Button (xs) at the end, centred in the row; leave it out for a pass. */
  action?: ReactNode;
}

const SEVERITY = {
  error: { word: 'Error', Glyph: X },
  warning: { word: 'Warning', Glyph: TriangleAlert },
  pass: { word: 'Pass', Glyph: Check },
} as const;

/** The result of the foundation policy check: a summary of the counts, then one row per finding with one action. */
export function PolicyFindings({ summary, 'aria-label': ariaLabel, tone, variant, radius, shadow, size = 'md', className, children, ...props }: PolicyFindingsProps) {
  const { errors, warnings, passes } = summary;
  return (
    <div data-slot="policy-findings" className={cn(policyFindingsVariants({ tone, variant, radius, shadow }), className)} {...props}>
      <div data-slot="policy-findings-summary" role="group" aria-label="Summary" className={policyFindingsSummaryVariants()}>
        <Chip appearance="soft" tone="danger" size="sm">{errors} {errors === 1 ? 'error' : 'errors'}</Chip>
        <Chip appearance="soft" tone="warning" size="sm">{warnings} {warnings === 1 ? 'warning' : 'warnings'}</Chip>
        <Chip appearance="soft" tone="success" size="sm">{passes} pass</Chip>
      </div>
      <SizeContext.Provider value={size}>
        <ul data-slot="policy-findings-list" role="list" aria-label={ariaLabel} className={policyFindingsListVariants()}>
          {Children.map(children, (child, i) => (isValidElement<{ style?: CSSProperties }>(child)
            ? cloneElement(child, { style: { '--cs-stagger-index': i, ...child.props.style } as CSSProperties })
            : child))}
        </ul>
      </SizeContext.Provider>
    </div>
  );
}

/** One finding: a severity mark, the title with where it happens, and an optional action. */
export function PolicyFindingsItem({ severity, title, location, action, className, ...props }: PolicyFindingsItemProps) {
  const { word, Glyph } = SEVERITY[severity ?? 'error'];
  const size = useContext(SizeContext);
  return (
    <li data-slot="policy-findings-finding" data-severity={severity ?? 'error'} className={cn(policyFindingsFindingVariants({ size }), className)} {...props}>
      <span data-slot="policy-findings-severity" className={policyFindingsSeverityVariants({ severity })}>
        <Glyph aria-hidden />
        <span className="sr-only">{word}</span>
      </span>
      <div data-slot="policy-findings-body" className={policyFindingsBodyVariants()}>
        <b data-slot="policy-findings-title" className={policyFindingsTitleVariants({ size })}>{title}</b>
        <div data-slot="policy-findings-location" className={policyFindingsLocationVariants({ size })}>{location}</div>
      </div>
      {action != null && <div data-slot="policy-findings-action" className={policyFindingsActionVariants()}>{action}</div>}
    </li>
  );
}
