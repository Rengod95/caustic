'use client';
import { Check, TriangleAlert, X } from '../../icons/index.ts';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { radiusClass, shadowClass, type CommonProps } from '../../lib/common-props.ts';
import {
  contrastInsightActionsVariants, contrastInsightLevelsVariants, contrastInsightLevelVariants, contrastInsightNoteVariants, contrastInsightRatioVariants,
  contrastInsightSampleVariants, contrastInsightSuggestionTextVariants, contrastInsightSuggestionVariants, contrastInsightSummaryVariants, contrastInsightUnitVariants,
  contrastInsightVariants, type ContrastInsightLevelVariantProps,
} from './contrast-insight.variants.ts';

export interface ContrastInsightLevelProps extends ComponentProps<'span'>, ContrastInsightLevelVariantProps {
  /** Hidden result word after the level name; defaults to the English word of the result. */
  resultLabel?: string;
  /** The level name ("AA", "AA large", "AAA"). */
  children: ReactNode;
}

/**
 * Common props (lib/common-props.ts): variant = readout card (default outline: opaque surface + subtle hairline), tone =
 * its hairline (outline) or tint (soft) (default neutral), size = the ratio figure (title-2 · stat · stat-lg · display,
 * default md stat-lg), radius = readout and suggestion card corners (default xl), shadow = their elevation (default none).
 */
export interface ContrastInsightProps extends Omit<ComponentProps<'div'>, 'children'>, CommonProps {
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
  /** aria-label of the levels list. */
  levelsLabel?: string;
  /** Hidden result words after each level name. */
  resultLabels?: Partial<Record<'pass' | 'warning' | 'fail', string>>;
}

const LEVEL = {
  pass: { Glyph: Check, word: 'passes' },
  warning: { Glyph: TriangleAlert, word: 'passes for large text only' },
  fail: { Glyph: X, word: 'fails' },
} as const;

/** One level badge: a check and "passes", a triangle and "passes for large text only", or a cross and "fails", after the level name. */
export function ContrastInsightLevel({ result, resultLabel, className, children, ...props }: ContrastInsightLevelProps) {
  const r = result ?? 'pass';
  const { Glyph, word: fallback } = LEVEL[r];
  const word = resultLabel ?? fallback;
  return (
    <span data-slot="contrast-insight-level" role="listitem" data-result={r} className={cn(contrastInsightLevelVariants({ result }), className)} {...props}>
      <Glyph aria-hidden />
      {children}
      <span className="sr-only">{word}</span>
    </span>
  );
}

/** Explains the real contrast of the selected element: the ratio, the WCAG levels it reaches, a sample, and a suggestion the agent can apply. */
export function ContrastInsight({
  ratio, levels, sample, suggestion, actions, note, levelsLabel = 'WCAG levels', resultLabels, tone, variant, radius, shadow, size, className, ...props
}: ContrastInsightProps) {
  // The cards take an explicit radius and elevation; the defaults (xl, none) are their own.
  const frame = cn(radius && radius !== 'xl' && radiusClass[radius], shadow && shadow !== 'none' && shadowClass[shadow]);
  // The best result reached colours the unit: any pass, else a large-text-only level, else fail.
  const results = levels.map(l => l.result ?? (l.pass ? 'pass' : 'fail'));
  const best = results.includes('pass') ? 'pass' : results.includes('warning') ? 'warning' : 'fail';
  return (
    <div data-slot="contrast-insight" className={cn(contrastInsightVariants(), className)} {...props}>
      <div data-slot="contrast-insight-summary" className={cn(contrastInsightSummaryVariants({ card: variant, cardTone: tone }), frame)}>
        <div>
          <div data-slot="contrast-insight-ratio" className={contrastInsightRatioVariants({ ratioSize: size })}>
            {ratio.toFixed(2)}
            <small data-slot="contrast-insight-unit" data-result={best} className={contrastInsightUnitVariants({ result: best })}>{' : 1'}</small>
          </div>
          <div data-slot="contrast-insight-levels" role="list" aria-label={levelsLabel} className={contrastInsightLevelsVariants()}>
            {levels.map(level => {
              const result = level.result ?? (level.pass ? 'pass' : 'fail');
              return <ContrastInsightLevel key={level.label} result={result} resultLabel={resultLabels?.[result]}>{level.label}</ContrastInsightLevel>;
            })}
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
        <div data-slot="contrast-insight-suggestion" className={cn(contrastInsightSuggestionVariants(), frame)}>
          <div data-slot="contrast-insight-suggestion-text" className={contrastInsightSuggestionTextVariants()}>{suggestion}</div>
          {actions != null && <div data-slot="contrast-insight-actions" className={contrastInsightActionsVariants()}>{actions}</div>}
        </div>
      )}
      {note != null && <div data-slot="contrast-insight-note" className={contrastInsightNoteVariants()}>{note}</div>}
    </div>
  );
}
