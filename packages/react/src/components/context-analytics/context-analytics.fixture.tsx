import { defineFixture } from '../../lib/fixture.ts';
import { ContextAnalytics, type ContextAnalyticsRoundData, type ContextAnalyticsSeries } from './context-analytics.tsx';

const ROUNDS: ContextAnalyticsRoundData[] = [
  { total: 22, out: 6 }, { total: 35, out: 8 }, { total: 41, out: 5 }, { total: 48, out: 12 },
  { total: 55, out: 9 }, { total: 52, out: 7 }, { total: 64, out: 14 }, { total: 70, out: 10 },
  { total: 0, out: 0 }, { total: 0, out: 0 }, { total: 0, out: 0 }, { total: 0, out: 0 },
];

const segments = (series: ContextAnalyticsSeries = 'scene') => [
  { label: 'Scene', value: 34, series },
  { label: 'Tokens', value: 22, series: 'tokens' as const },
  { label: 'Transcript', value: 18, series: 'transcript' as const },
  { label: 'Tools', value: 10, series: 'tools' as const },
];

export default defineFixture({
  id: 'context-analytics',
  // Round / segment props (selected, series) apply to the first round, segment and legend item.
  render: ({ selected, series, ...props }) => (
    <ContextAnalytics
      aria-label="Context usage"
      rounds={ROUNDS}
      selectedRound={selected ? 0 : 6}
      segments={segments(series as ContextAnalyticsSeries | undefined)}
      summary="Round 7 · 18.4k in · 1.2k out"
      share="42% of window"
      {...props}
    />
  ),
  examples: {
    'context-analytics': () => (
      <ContextAnalytics
        aria-label="Context usage"
        rounds={ROUNDS}
        defaultSelectedRound={6}
        segments={segments()}
        summary="Round 7 · 18.4k in · 1.2k out"
        share="42% of window"
      />
    ),
  },
});
