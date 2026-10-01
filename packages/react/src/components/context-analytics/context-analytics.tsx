'use client';
import type { ComponentProps, CSSProperties, KeyboardEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import {
  contextAnalyticsComposition, contextAnalyticsLegend, contextAnalyticsLegendItem, contextAnalyticsLegendSwatch,
  contextAnalyticsRound, contextAnalyticsRoundButton, contextAnalyticsRoundOut, contextAnalyticsRounds, contextAnalyticsSegment,
  contextAnalyticsSummary, contextAnalyticsSummaryRound, contextAnalyticsSummaryShare, contextAnalyticsVariants,
} from './context-analytics.variants.ts';

export type ContextAnalyticsTone = 'scene' | 'tokens' | 'transcript' | 'tools' | 'free';

export interface ContextAnalyticsRoundData {
  /** Share of the window used by the round (0-100). */
  total: number;
  /** Output part of it (0-100 of the window); drawn as a share of the column. */
  out: number;
}

export interface ContextAnalyticsSegmentData {
  label: string;
  /** Percent of the window. */
  value: number;
  tone: ContextAnalyticsTone;
}

const COLUMNS = 12;

export interface ContextAnalyticsRoundProps extends Omit<ComponentProps<'i'>, 'children' | 'style'> {
  /** Share of the window used by the round (0-100); at least 4% is drawn. */
  total: number;
  /** Output part of the round (0-100 of the window). */
  out: number;
  /** Ring in text.primary. */
  selected?: boolean;
}

/** The column of one round. Sized by custom properties so heights are runtime data, not classes. */
export function ContextAnalyticsRound({ total, out, selected = false, className, ...props }: ContextAnalyticsRoundProps) {
  return (
    <i
      data-slot="context-analytics-round" data-selected={selected ? '' : undefined} className={cn(contextAnalyticsRound({ selected }), className)}
      {...props}
      style={{ '--ca-h': `${Math.max(4, total)}%`, '--ca-out': `${total ? (out / total) * 100 : 0}%` } as CSSProperties}
    >
      <b data-slot="context-analytics-round-out" className={contextAnalyticsRoundOut()} />
    </i>
  );
}

export interface ContextAnalyticsSegmentProps extends Omit<ComponentProps<'i'>, 'children' | 'style'> {
  /** Series color. */
  tone?: ContextAnalyticsTone;
  /** Percent of the window; Free takes the rest. */
  value?: number;
}

export function ContextAnalyticsSegment({ tone = 'scene', value = 0, className, ...props }: ContextAnalyticsSegmentProps) {
  return <i data-slot="context-analytics-segment" data-tone={tone} className={cn(contextAnalyticsSegment({ tone }), className)} {...props} style={{ '--ca-w': `${value}%` } as CSSProperties} />;
}

export interface ContextAnalyticsProps extends Omit<ComponentProps<'figure'>, 'children'> {
  /** Accessible name of the figure. */
  'aria-label': string;
  /** Per round. Fixed 12 columns; missing rounds render as the 4% stub. */
  rounds: ContextAnalyticsRoundData[];
  /** Selected round index (controlled). */
  selectedRound?: number;
  /** Uncontrolled initial selection. */
  defaultSelectedRound?: number;
  onSelectedRoundChange?: (index: number) => void;
  /** Composition in percent of the window. A trailing Free segment is added. */
  segments: ContextAnalyticsSegmentData[];
  /** Series color of the first segment and legend item (fixture convention). */
  tone?: ContextAnalyticsTone;
  /** Left summary text. */
  summary?: ReactNode;
  /** Right summary text. */
  share?: ReactNode;
}

/** How much of the model context window a session uses: rounds, a summary row, the composition bar and its legend. */
export function ContextAnalytics({
  rounds, selectedRound, defaultSelectedRound, onSelectedRoundChange, segments, tone, summary, share,
  className, 'aria-label': ariaLabel, ...props
}: ContextAnalyticsProps) {
  const [selected, setSelected] = useControllableState<number | undefined>({ value: selectedRound, defaultValue: defaultSelectedRound, onChange: v => { if (v !== undefined) onSelectedRoundChange?.(v); } });
  const columns = Array.from({ length: COLUMNS }, (_, i) => rounds[i] ?? { total: 0, out: 0 });
  const withData = columns.map((r, i) => (r.total > 0 ? i : -1)).filter(i => i >= 0);
  const tabbable = selected !== undefined && withData.includes(selected) ? selected : withData[0];

  const parts: ContextAnalyticsSegmentData[] = segments.map((s, i) => (i === 0 && tone ? { ...s, tone } : s));
  const used = parts.reduce((n, s) => n + s.value, 0);
  const all: ContextAnalyticsSegmentData[] = [...parts, { label: 'Free', value: Math.max(0, 100 - used), tone: 'free' }];

  const move = (e: KeyboardEvent<HTMLDivElement>) => {
    const at = selected === undefined ? -1 : withData.indexOf(selected);
    let next: number | undefined;
    if (e.key === 'ArrowLeft') next = withData[Math.max(0, at <= 0 ? 0 : at - 1)];
    else if (e.key === 'ArrowRight') next = withData[Math.min(withData.length - 1, at + 1)];
    else if (e.key === 'Home') next = withData[0];
    else if (e.key === 'End') next = withData[withData.length - 1];
    if (next === undefined) return;
    e.preventDefault();
    setSelected(next);
    e.currentTarget.querySelector<HTMLElement>(`[data-index="${next}"]`)?.focus();
  };

  return (
    <figure data-slot="context-analytics" aria-label={ariaLabel} className={cn(contextAnalyticsVariants(), className)} {...props}>
      <div data-slot="context-analytics-rounds" role="group" aria-label="Rounds" onKeyDown={move} className={contextAnalyticsRounds()}>
        {columns.map((r, i) => r.total > 0 ? (
          <button
            key={i} type="button" data-index={i} aria-pressed={selected === i}
            aria-label={`Round ${i + 1}, ${r.total}% of window`}
            tabIndex={tabbable === i ? 0 : -1}
            onClick={() => setSelected(i)}
            className={contextAnalyticsRoundButton()}
          >
            <ContextAnalyticsRound total={r.total} out={r.out} selected={selected === i} />
          </button>
        ) : (
          <ContextAnalyticsRound key={i} aria-hidden="true" total={0} out={0} />
        ))}
      </div>
      <div data-slot="context-analytics-summary" className={contextAnalyticsSummary()}>
        <span data-slot="context-analytics-summary-round" className={contextAnalyticsSummaryRound()}>{summary}</span>
        <span data-slot="context-analytics-summary-share" className={contextAnalyticsSummaryShare()}>{share}</span>
      </div>
      <div
        data-slot="context-analytics-composition" role="img"
        aria-label={all.map(s => `${s.label} ${s.value}%`).join(', ')}
        className={contextAnalyticsComposition()}
      >
        {all.map(s => <ContextAnalyticsSegment key={s.label} tone={s.tone} value={s.value} />)}
      </div>
      <ul data-slot="context-analytics-legend" className={contextAnalyticsLegend()}>
        {all.map(s => (
          <li key={s.label} data-slot="context-analytics-legend-item" className={contextAnalyticsLegendItem()}>
            <i data-slot="context-analytics-legend-swatch" aria-hidden="true" className={contextAnalyticsLegendSwatch({ tone: s.tone })} />
            {s.label}
          </li>
        ))}
      </ul>
    </figure>
  );
}
