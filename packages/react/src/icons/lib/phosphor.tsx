'use client';
import type { Icon as PhosphorGlyph, IconWeight } from '@phosphor-icons/react';
import { forwardRef } from 'react';
import { useIconEmphasis } from './emphasis.tsx';
import type { Icon, IconEmphasis } from './types.ts';

const WEIGHT: Record<IconEmphasis, IconWeight> = { muted: 'light', default: 'regular', selected: 'fill' };

export interface PhosphorIconOptions {
  /** Draw mirrored (a right-hand glyph from a left-hand one). */
  mirrored?: boolean;
  /** Weight for 'selected' when the fill form boxes the glyph (Check, X, Plus fill draw a filled square): 'bold' keeps the bare shape. */
  selected?: IconWeight;
}

/** Wraps one Phosphor glyph in the caustic Icon API. */
export function phosphorIcon(Glyph: PhosphorGlyph, name: string, options: PhosphorIconOptions = {}): Icon {
  const C = forwardRef<SVGSVGElement, Parameters<Icon>[0]>(function PhosphorIcon(
    { size = 24, strokeWidth: _strokeWidth, absoluteStrokeWidth: _absolute, emphasis, ...props },
    ref,
  ) {
    const e = useIconEmphasis(emphasis);
    const weight = e === 'selected' && options.selected !== undefined ? options.selected : WEIGHT[e];
    const labelled = props['aria-label'] != null || props['aria-labelledby'] != null;
    return (
      <Glyph
        ref={ref}
        size={size}
        weight={weight}
        mirrored={options.mirrored ?? false}
        data-icon={name}
        data-icon-set="phosphor"
        aria-hidden={labelled ? undefined : true}
        focusable="false"
        {...props}
      />
    );
  });
  C.displayName = name;
  return C;
}
