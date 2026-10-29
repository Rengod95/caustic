import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';

/**
 * How loud a glyph reads. Each set maps it to its own weight or style:
 * Phosphor muted = light, default = regular, selected = fill; Solar muted and default = linear, selected = bold.
 */
export type IconEmphasis = 'muted' | 'default' | 'selected';

/** The props every caustic icon takes. A superset of lucide-react's, so call sites written for lucide keep working. */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** Width and height when no class sizes the glyph (a class such as `size-4` wins). Default 24. */
  size?: number | string;
  /** Accepted for lucide compatibility and ignored: each set draws at its own stroke (1.5 on a 24 grid). */
  strokeWidth?: number | string;
  /** Accepted for lucide compatibility and ignored. */
  absoluteStrokeWidth?: boolean;
  /** Weight or style step. Falls back to the nearest IconEmphasisProvider, then 'default'. */
  emphasis?: IconEmphasis;
}

/** A caustic icon component. */
export type Icon = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

/** Name of the active icon set. */
export type IconSetName = 'phosphor' | 'solar';
