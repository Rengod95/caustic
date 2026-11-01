'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { meterIndicator, meterVariants } from './meter.variants.ts';

export interface MeterProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Current measurement, 0 to max. */
  value: number;
  /** Upper bound (default 100). A value at or over max reads danger. */
  max?: number;
  /** A value at or under this reads warning (a quota that is running out). */
  low?: number;
  /** A value at or over this reads warning (a budget half spent). */
  high?: number;
  /** Force a level; unset resolves it from value, low, high and max. */
  level?: MeterLevel;
  size?: 'sm' | 'md';
  /** Accessible name (aria-label). */
  label?: string;
  /** Human text for the value (aria-valuetext). */
  valueText?: string;
}

export type MeterLevel = 'normal' | 'warning' | 'danger';

export function meterLevel(value: number, max: number, low?: number, high?: number): MeterLevel {
  if (value >= max) return 'danger';
  if (high !== undefined && value >= high) return 'warning';
  if (low !== undefined && value <= low) return 'warning';
  return 'normal';
}

export function Meter({ value, max = 100, low, high, level: levelProp, size, label, valueText, className, ...props }: MeterProps) {
  const clamped = Math.max(0, Math.min(max, value));
  const level = levelProp ?? meterLevel(value, max, low, high);
  const pct = max > 0 ? (clamped / max) * 100 : 0;
  const fill = { ['--cs-meter' as string]: `${pct}%` };
  return (
    <div
      role="meter" data-slot="meter" data-level={level} data-size={size ?? 'md'}
      aria-label={label} aria-valuetext={valueText} aria-valuemin={0} aria-valuemax={max} aria-valuenow={clamped}
      className={cn(meterVariants({ size }), className)} {...props}
    >
      <span data-slot="meter-indicator" className={meterIndicator({ level })} style={fill} />
    </div>
  );
}
