'use client';
import { forwardRef, type ReactNode } from 'react';
import { useIconEmphasis } from './emphasis.tsx';
import type { Icon } from './types.ts';

/**
 * A caustic-drawn stroke glyph on a 24 grid, for shapes neither set has. Drawn at 1.5 to sit with Phosphor regular and Solar linear;
 * selected thickens to 2 (stroke glyphs have no fill form). `children` are the shapes, stroked in currentColor.
 */
export function customIcon(name: string, children: ReactNode): Icon {
  const C = forwardRef<SVGSVGElement, Parameters<Icon>[0]>(function CustomIcon(
    { size = 24, strokeWidth: _strokeWidth, absoluteStrokeWidth: _absolute, emphasis, ...props },
    ref,
  ) {
    const e = useIconEmphasis(emphasis);
    const labelled = props['aria-label'] != null || props['aria-labelledby'] != null;
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={e === 'selected' ? 2 : e === 'muted' ? 1.25 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        data-icon={name}
        data-icon-set="custom"
        aria-hidden={labelled ? undefined : true}
        focusable="false"
        {...props}
      >
        {children}
      </svg>
    );
  });
  C.displayName = name;
  return C;
}
