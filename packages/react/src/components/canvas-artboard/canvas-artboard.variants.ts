import { cva } from 'class-variance-authority';

/**
 * The sheet of a frame: the user content layer, so its fill never follows the interface theme.
 * Common props (lib/common-props.ts); each axis' default is the own look and adds no class:
 *   variant  solid = the artboard fill with the artboard shadow (own); soft = the tint (neutral.tint or the tone tint);
 *            outline = no fill, a tone outline (a wireframe frame); ghost = no fill and no shadow.
 *   tone     the colour family outside the own solid sheet.
 *   radius   the sheet corner (2xs). shadow: none = the own artboard shadow (elevation-artboard is not an elevation step);
 *            1–5 replace it. size: the outline weight, 1px (xs–md) or 2px (lg).
 * Hover draws a 1px canvas.hover outline inside the edge (owner B), in every variant.
 */
export const canvasArtboardVariants = cva('absolute top-(--rect-t) left-(--rect-l) h-(--rect-h) w-(--rect-w) rounded-2xs bg-canvas-artboard shadow-artboard hover:outline-1 hover:-outline-offset-1 hover:outline-canvas-hover hover:outline-solid', {
  variants: {
    variant: { solid: '', soft: '', outline: 'bg-transparent shadow-none outline -outline-offset-1', ghost: 'bg-transparent shadow-none' },
    tone: {
      neutral: 'outline-neutral-border', accent: 'outline-accent-border', success: 'outline-success-border', warning: 'outline-warning-border',
      danger: 'outline-danger-border', info: 'outline-info-border', agent: 'outline-agent-border',
    },
    radius: {
      none: 'rounded-none', '2xs': '', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    // The outline weight: 1px up to md, 2px at lg (outline variant only; the compound below).
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'solid', tone: 'success', className: 'bg-success-soft' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'solid', tone: 'info', className: 'bg-info-soft' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-soft' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-tint' },
    { variant: 'soft', tone: 'success', className: 'bg-success-tint' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-tint' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-tint' },
    { variant: 'soft', tone: 'info', className: 'bg-info-tint' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-tint' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-tint' },
    { variant: 'outline', size: 'lg', className: 'outline-2 -outline-offset-2' },
  ],
  defaultVariants: { variant: 'solid', tone: 'neutral', radius: '2xs', shadow: 'none', size: 'md' },
});

/** Optional frame title: 6px above the top-start corner, canvas.label footnote, one line, never a pointer target. */
export const canvasArtboardLabelClass = 'pointer-events-none absolute bottom-full left-0 mb-1.5 max-w-full truncate text-footnote text-canvas-label';
