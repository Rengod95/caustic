'use client';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Card } from '../card/index.ts';
import { cardStatDeltaVariants, cardStatSparkVariants, cardStatVariants, type CardStatDeltaVariantProps } from './card-stat.variants.ts';

export interface CardStatProps extends Omit<ComponentProps<'div'>, 'children' | 'title'>, CardStatDeltaVariantProps {
  /** Metric name. */
  label: ReactNode;
  /** The figure. */
  value: ReactNode;
  /** Unit after the figure ("of 96"). */
  unit?: ReactNode;
  /** Change, e.g. "12.4%". */
  delta?: ReactNode;
  /** Arrow direction; the color (deltaTone) says good or bad. */
  deltaDirection?: 'up' | 'down';
  /** Comparison basis ("vs last week"). */
  deltaNote?: ReactNode;
  /** Sparkline values in 0..32 (higher is higher), spread across a 100 x 32 viewBox. */
  trend?: number[];
  /** Accessible label of the sparkline. */
  trendLabel?: string;
  size?: 'regular' | 'compact';
  /** Extra sections, e.g. a divided CardFooter. */
  children?: ReactNode;
}

const sparkPaths = (trend: number[]) => {
  const last = Math.max(trend.length - 1, 1);
  const pts = trend.map((v, i) => `${i === 0 ? 'M' : 'L'}${+((i / last) * 100).toFixed(2)} ${+(32 - v).toFixed(2)}`);
  const line = pts.join(' ');
  return { line, area: `${line} L100 32 L0 32Z` };
};

/** One KPI: label, large tabular value, delta pill with a note and an optional edge-to-edge sparkline. */
export function CardStat({
  label, value, unit, delta, deltaTone, deltaDirection = 'up', deltaNote, trend, trendLabel, size, className, children, ...props
}: CardStatProps) {
  const gradId = useId();
  const Arrow = deltaDirection === 'down' ? ArrowDownRight : ArrowUpRight;
  const paths = trend && trend.length > 1 ? sparkPaths(trend) : null;
  return (
    <Card data-slot="card-stat" size={size} className={cn(cardStatVariants(), className)} {...props}>
      <div className="grid gap-1">
        <span data-slot="card-stat-label" className="flex items-center gap-1.5 font-ui text-ui-sm font-normal text-text-tertiary">{label}</span>
        <span data-slot="card-stat-value" className={cn('font-ui text-stat tabular-nums text-text-primary', unit != null && 'pb-1.25')}>
          {value}
          {unit != null && <>{' '}<small data-slot="card-stat-unit" className="font-ui text-ui-lg text-text-tertiary">{unit}</small></>}
        </span>
      </div>
      {(delta != null || deltaNote != null) && (
        <span data-slot="card-stat-trend" className="flex items-center gap-1 pt-0.75">
          {delta != null && (
            <span data-slot="card-stat-delta" data-tone={deltaTone ?? 'good'} className={cardStatDeltaVariants({ deltaTone })}>
              <Arrow aria-hidden />
              {delta}
            </span>
          )}
          {deltaNote != null && <span data-slot="card-stat-delta-note" className="font-ui text-ui-sm font-normal text-text-tertiary">{deltaNote}</span>}
        </span>
      )}
      {paths && (
        <svg data-slot="card-stat-spark" viewBox="0 0 100 32" preserveAspectRatio="none" role="img" aria-label={trendLabel} className={cardStatSparkVariants({ size })}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--cs-color-accent-solid)" stopOpacity="0.28" />
              <stop offset="1" stopColor="var(--cs-color-accent-solid)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={paths.area} fill={`url(#${gradId})`} />
          <path d={paths.line} className="fill-none stroke-accent-solid stroke-2 [vector-effect:non-scaling-stroke]" />
        </svg>
      )}
      {children}
    </Card>
  );
}
