'use client';
import type { ComponentProps, CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import { useRef } from 'react';
import { cn } from '../../lib/cn.ts';
import { radiusClass, shadowClass, type CommonProps } from '../../lib/common-props.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import {
  compareViewAfterVariants, compareViewDividerVariants, compareViewKnobVariants, compareViewLabelVariants, compareViewSideVariants, compareViewVariants,
} from './compare-view.variants.ts';

const MIN = 4;
const MAX = 96;
const clamp = (n: number) => Math.min(MAX, Math.max(MIN, n));

/**
 * Common props (lib/common-props.ts): size = caption pills (xs 16 · sm 18 · md 20 · lg 24 high), variant = caption
 * pill surface (default solid: thick material), tone = caption text (default neutral), radius = stage corners (default xl),
 * shadow = stage elevation (default none).
 */
export interface CompareViewProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'style'>, CommonProps {
  /** Accessible name of the stage. */
  'aria-label': string;
  /** split = divider reveals before / after; overlay = after at an adjustable opacity. */
  mode?: 'split' | 'overlay';
  /** Controlled divider position, in percent of the width (4 to 96). */
  value?: number;
  defaultValue?: number;
  /** The divider moves (drag or keys); percent, clamped to 4 to 96. */
  onValueChange?: (value: number) => void;
  /** Overlay mode: opacity of the after side (0 to 1). */
  opacity?: number;
  before: ReactNode;
  after: ReactNode;
  beforeLabel: ReactNode;
  afterLabel: ReactNode;
  /** aria-label of the split handle. */
  dividerLabel?: string;
  /** aria-valuetext of the split handle from the position in percent. */
  dividerValueText?: (position: number) => string;
}

/** A bounded stage comparing two renderings of a design, by a draggable split or an overlay opacity. */
export function CompareView({
  mode = 'split', value, defaultValue = 50, onValueChange, opacity = 0.5, before, after, beforeLabel, afterLabel,
  dividerLabel = 'Split position', dividerValueText = p => `${p}% before`, tone, variant, radius, shadow, size, className, ...props
}: CompareViewProps) {
  const [position, setPosition] = useControllableState({ value, defaultValue, onChange: onValueChange });
  const stage = useRef<HTMLDivElement>(null);
  const move = (n: number) => setPosition(clamp(Math.round(n)));

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    // Slider pattern: Left / Down decrease, Right / Up increase.
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') move(position - step);
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') move(position + step);
    else if (e.key === 'Home') move(MIN);
    else if (e.key === 'End') move(MAX);
    else return;
    e.preventDefault();
  };
  const fromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const r = stage.current?.getBoundingClientRect();
    if (r && r.width) move(((e.clientX - r.left) / r.width) * 100);
  };

  const vars = { '--split': `${position}%`, '--ov': opacity } as CSSProperties;
  return (
    <div
      ref={stage} role="group" data-slot="compare-view" data-mode={mode}
      className={cn(compareViewVariants(), radius && radius !== 'xl' && radiusClass[radius], shadow && shadow !== 'none' && shadowClass[shadow], className)}
      style={vars} {...props}
    >
      <div data-slot="compare-view-before" className={compareViewSideVariants()}>{before}</div>
      <div data-slot="compare-view-after" className={cn(compareViewSideVariants(), compareViewAfterVariants({ mode }))}>{after}</div>
      <span data-slot="compare-view-label-before" className={compareViewLabelVariants({ side: 'before', labelSize: size, labelVariant: variant, labelTone: tone })}>{beforeLabel}</span>
      <span data-slot="compare-view-label-after" className={compareViewLabelVariants({ side: 'after', labelSize: size, labelVariant: variant, labelTone: tone })}>{afterLabel}</span>
      {mode === 'split' && (
        <div
          role="slider" tabIndex={0} aria-label={dividerLabel} aria-orientation="horizontal" aria-valuemin={MIN} aria-valuemax={MAX}
          aria-valuenow={position} aria-valuetext={dividerValueText(position)} data-slot="compare-view-divider" className={compareViewDividerVariants()}
          onKeyDown={onKeyDown}
          onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); }}
          onPointerMove={e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e); }}
        >
          <span data-slot="compare-view-knob" aria-hidden="true" className={compareViewKnobVariants()} />
        </div>
      )}
    </div>
  );
}
