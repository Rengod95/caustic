'use client';
import type { Icon as SolarGlyph } from '@solar-icons/react/lib/types';
import { forwardRef } from 'react';
import { useIconEmphasis } from './emphasis.tsx';
import type { Icon } from './types.ts';

/** Solar's linear stroke on its 24 grid. Passed explicitly (it lands inline) because the package default is a CSS var in a presentation attribute. */
const STROKE = 1.5;

export interface SolarIconOptions {
  /** Draw mirrored (a counter-clockwise glyph from a clockwise one). */
  mirrored?: boolean;
}

/**
 * Wraps one Solar glyph pair in the caustic Icon API: Linear for muted and default, Bold for selected.
 * Pass Linear twice when the Bold form boxes the glyph (hamburger-menu bold is a filled square).
 */
export function solarIcon(Linear: SolarGlyph, Bold: SolarGlyph, name: string, options: SolarIconOptions = {}): Icon {
  const C = forwardRef<SVGSVGElement, Parameters<Icon>[0]>(function SolarIcon(
    { size = 24, strokeWidth: _strokeWidth, absoluteStrokeWidth: _absolute, emphasis, style, ...props },
    ref,
  ) {
    const selected = useIconEmphasis(emphasis) === 'selected';
    const Glyph = selected ? Bold : Linear;
    const labelled = props['aria-label'] != null || props['aria-labelledby'] != null;
    // Solar draws at width = height = 1em. font-size carries `size`, so a sizing class (size-4) still wins over it, as with lucide.
    return (
      <Glyph
        ref={ref}
        color="currentColor"
        strokeWidth={STROKE}
        style={{ fontSize: typeof size === 'number' ? `${size}px` : size, ...(options.mirrored ? { transform: 'scaleX(-1)' } : {}), ...style }}
        data-icon={name}
        data-icon-set="solar"
        aria-hidden={labelled ? undefined : true}
        focusable="false"
        {...props}
      />
    );
  });
  C.displayName = name;
  return C;
}
