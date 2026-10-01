'use client';
import { Check, X } from 'lucide-react';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import {
  contrastInsightActionsVariants, contrastInsightLevelsVariants, contrastInsightLevelVariants, contrastInsightNoteVariants, contrastInsightRatioVariants,
  contrastInsightSampleVariants, contrastInsightSuggestionTextVariants, contrastInsightSuggestionVariants, contrastInsightSummaryVariants, contrastInsightUnitVariants,
  contrastInsightVariants, type ContrastInsightVariantProps,
} from './contrast-insight.variants.ts';

export interface ContrastInsightLevelProps extends ComponentProps<'span'>, ContrastInsightVariantProps {
  /** The level name ("AA", "AA large", "AAA"). */
  children: ReactNode;
}

export interface ContrastInsightProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Measured contrast ratio; shown with two decimals. */
  ratio: number;
  /** Levels to show with their result, for example AA, AA large, AAA. */
  levels: { label: string; pass: boolean }[];
  /** CSS colors of the measured pair (set as --pair-bg and --pair-fg). */
  sample: { background: string; foreground: string };
  /** The suggestion sentence (renders the suggestion card). Pair with actions. */
  suggestion?: ReactNode;
  /** Buttons of the suggestion card. */
  actions?: ReactNode;
  /** Caveat Alert rendered below. */
  note?: ReactNode;
}

/** One level badge: a check and "passes", or a cross and "fails", after the level name. */
export function ContrastInsightLevel({ result, className, children, ...props }: ContrastInsightLevelProps) {
  const pass = (result ?? 'pass') === 'pass';
  return (
    <span data-slot="contrast-insight-level" role="listitem" data-result={result ?? 'pass'} className={cn(contrastInsightLevelVariants({ result }), className)} {...props}>
      {pass ? <Check aria-hidden /> : <X aria-hidden />}
      {children}
      <span className="sr-only">{pass ? 'passes' : 'fails'}</span>
    </span>
  );
}

/** Explains the real contrast of the selected element: the ratio, the WCAG levels it reaches, a sample, and a suggestion the agent can apply. */
export function ContrastInsight({ ratio, levels, sample, suggestion, actions, note, className, ...props }: ContrastInsightProps) {
  return (
    <div data-slot="contrast-insight" className={cn(contrastInsightVariants(), className)} {...props}>
      <div data-slot="contrast-insight-summary" className={contrastInsightSummaryVariants()}>
        <div>
          <div data-slot="contrast-insight-ratio" className={contrastInsightRatioVariants()}>
            {ratio.toFixed(2)}
            <small data-slot="contrast-insight-unit" className={contrastInsightUnitVariants()}>{' : 1'}</small>
          </div>
          <div data-slot="contrast-insight-levels" role="list" aria-label="WCAG levels" className={contrastInsightLevelsVariants()}>
            {levels.map(level => <ContrastInsightLevel key={level.label} result={level.pass ? 'pass' : 'fail'}>{level.label}</ContrastInsightLevel>)}
          </div>
        </div>
        <div
          data-slot="contrast-insight-sample" aria-hidden className={contrastInsightSampleVariants()}
          style={{ '--pair-bg': sample.background, '--pair-fg': sample.foreground } as CSSProperties}
        >
          Aa
        </div>
      </div>
      {suggestion != null && (
        <div data-slot="contrast-insight-suggestion" className={contrastInsightSuggestionVariants()}>
          <div data-slot="contrast-insight-suggestion-text" className={contrastInsightSuggestionTextVariants()}>{suggestion}</div>
          {actions != null && <div data-slot="contrast-insight-actions" className={contrastInsightActionsVariants()}>{actions}</div>}
        </div>
      )}
      {note != null && <div data-slot="contrast-insight-note" className={contrastInsightNoteVariants()}>{note}</div>}
    </div>
  );
}
