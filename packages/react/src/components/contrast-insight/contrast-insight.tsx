'use client';
import { Check, TriangleAlert, X } from 'lucide-react';
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
  /** Levels to show with their result, for example AA, AA large, AAA. `result` overrides `pass`; "warning" marks a level reached only for large text. */
  levels: { label: string; pass: boolean; result?: 'pass' | 'warning' | 'fail' }[];
  /** CSS colors of the measured pair (set as --pair-bg and --pair-fg). */
  sample: { background: string; foreground: string };
  /** The suggestion sentence (renders the suggestion card). Pair with actions. */
  suggestion?: ReactNode;
  /** Buttons of the suggestion card. */
  actions?: ReactNode;
  /** Caveat Alert rendered below. */
  note?: ReactNode;
}

const LEVEL = {
  pass: { Glyph: Check, word: 'passes' },
  warning: { Glyph: TriangleAlert, word: 'passes for large text only' },
  fail: { Glyph: X, word: 'fails' },
} as const;

/** One level badge: a check and "passes", a triangle and "passes for large text only", or a cross and "fails", after the level name. */
export function ContrastInsightLevel({ result, className, children, ...props }: ContrastInsightLevelProps) {
  const r = result ?? 'pass';
  const { Glyph, word } = LEVEL[r];
  return (
    <span data-slot="contrast-insight-level" role="listitem" data-result={r} className={cn(contrastInsightLevelVariants({ result }), className)} {...props}>
      <Glyph aria-hidden />
      {children}
      <span className="sr-only">{word}</span>
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
            {levels.map(level => <ContrastInsightLevel key={level.label} result={level.result ?? (level.pass ? 'pass' : 'fail')}>{level.label}</ContrastInsightLevel>)}
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
