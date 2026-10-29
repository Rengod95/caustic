'use client';
import { ArrowDownRight, ArrowUpRight } from '../../icons/index.ts';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Variant } from '../../lib/common-props.ts';
import { Card, cardSize, type CardSize } from '../card/index.ts';
import { cardStatDeltaVariants, cardStatSparkVariants, cardStatVariants, type CardStatDeltaVariantProps } from './card-stat.variants.ts';

export interface CardStatProps extends Omit<ComponentProps<'div'>, 'children' | 'title'>, Omit<CommonProps, 'size' | 'variant'>, CardStatDeltaVariantProps {
  /** surface = opaque surface with the hairline (default); solid / soft / outline / ghost repaint it in the tone slots. */
  variant?: 'surface' | Variant;
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
  /** Passed to Card (inset and gap). regular and compact are deprecated names for md and sm. */
  size?: CardSize;
  /** Extra sections, e.g. a divided CardFooter. */
  children?: ReactNode;
}

const sparkPaths = (trend: number[]) => {
  const last = Math.max(trend.length - 1, 1);
  const pts = trend.map((v, i) => `${i === 0 ? 'M' : 'L'}${+((i / last) * 100).toFixed(2)} ${+(32 - v).toFixed(2)}`);
  const line = pts.join(' ');
  return { line, area: `${line} L100 32 L0 32Z` };
};

/** One KPI: label, large tabular value, a coloured delta with a note and an optional edge-to-edge sparkline. Renders on Card (variant surface by default). */
export function CardStat({
  label, value, unit, delta, deltaTone, deltaDirection = 'up', deltaNote, trend, trendLabel, tone, variant, radius, shadow, size, className, children, ...props
}: CardStatProps) {
  const s = cardSize(size);
  const gradId = useId();
  const Arrow = deltaDirection === 'down' ? ArrowDownRight : ArrowUpRight;
  const paths = trend && trend.length > 1 ? sparkPaths(trend) : null;
  return (
    <Card
      data-slot="card-stat" variant={variant ?? 'surface'} tone={tone} radius={radius} shadow={shadow} size={size}
      className={cn(cardStatVariants({ tone, variant, size: s }), className)} {...props}
    >
      <div className="grid gap-1">
        <span data-slot="card-stat-label" className="flex items-center gap-1.5 font-ui text-ui-sm font-normal text-text-tertiary">{label}</span>
        <span data-slot="card-stat-value" className={cn('font-ui text-stat tabular-nums text-text-primary', unit != null && 'pb-1.25')}>
          {value}
          {unit != null && <>{' '}<small data-slot="card-stat-unit" className="font-ui text-ui-lg text-text-tertiary">{unit}</small></>}
        </span>
      </div>
      {(delta != null || deltaNote != null) && (
        <span data-slot="card-stat-trend" className="flex items-center gap-2 pt-0.75">
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
        <svg data-slot="card-stat-spark" viewBox="0 0 100 32" preserveAspectRatio="none" role="img" aria-label={trendLabel} className={cn(cardStatSparkVariants({ size: s }))}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--cs-color-chart-1)" stopOpacity="0.28" />
              <stop offset="1" stopColor="var(--cs-color-chart-1)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={paths.area} fill={`url(#${gradId})`} />
          <path d={paths.line} className="fill-none stroke-chart-1 stroke-2 [vector-effect:non-scaling-stroke]" />
        </svg>
      )}
      {children}
    </Card>
  );
}
