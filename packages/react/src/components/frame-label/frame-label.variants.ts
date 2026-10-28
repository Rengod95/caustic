import { cva } from 'class-variance-authority';

/** Name and size of a frame, written above it. Artboard labels are canvas.label with a diamond (canvas.selection when selected); frame labels are quieter. */
export const frameLabelVariants = cva('pointer-events-none absolute top-(--rect-t) left-(--rect-l) flex items-center text-ui-xs font-medium whitespace-nowrap', {
  variants: {
    kind: {
      artboard: 'gap-1.25 text-canvas-label',
      frame: 'gap-1.5 text-text-tertiary',
    },
    // Common props (lib/common-props.ts). Ghost is today's label: text only, no fill or edge. The other variants turn the
    // label into a tag (fill or edge, 4px inline padding) and its marker and size take the label colour.
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    // The type steps; md is the canvas label (ui-xs).
    size: { xs: 'text-micro', sm: 'text-hint', md: '', lg: 'text-ui-sm' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-ink-solid px-1 text-ink-on *:text-current' },
    { variant: 'solid', tone: 'accent', className: 'bg-accent-solid px-1 text-accent-on *:text-current' },
    { variant: 'solid', tone: 'success', className: 'bg-success-solid px-1 text-success-on *:text-current' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-solid px-1 text-warning-on *:text-current' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-solid px-1 text-danger-on *:text-current' },
    { variant: 'solid', tone: 'info', className: 'bg-info-solid px-1 text-info-on *:text-current' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-solid px-1 text-agent-on *:text-current' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-track px-1 text-text-secondary *:text-current' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft px-1 text-accent-text *:text-current' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft px-1 text-success-text *:text-current' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft px-1 text-warning-text *:text-current' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft px-1 text-danger-text *:text-current' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft px-1 text-info-text *:text-current' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft px-1 text-agent-text *:text-current' },
    { variant: 'outline', tone: 'neutral', className: 'px-1 text-text-secondary shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)] *:text-current' },
    { variant: 'outline', tone: 'accent', className: 'px-1 text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] *:text-current' },
    { variant: 'outline', tone: 'success', className: 'px-1 text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] *:text-current' },
    { variant: 'outline', tone: 'warning', className: 'px-1 text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] *:text-current' },
    { variant: 'outline', tone: 'danger', className: 'px-1 text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] *:text-current' },
    { variant: 'outline', tone: 'info', className: 'px-1 text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] *:text-current' },
    { variant: 'outline', tone: 'agent', className: 'px-1 text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] *:text-current' },
    { variant: 'ghost', tone: 'accent', className: 'text-accent-text *:text-current' },
    { variant: 'ghost', tone: 'success', className: 'text-success-text *:text-current' },
    { variant: 'ghost', tone: 'warning', className: 'text-warning-text *:text-current' },
    { variant: 'ghost', tone: 'danger', className: 'text-danger-text *:text-current' },
    { variant: 'ghost', tone: 'info', className: 'text-info-text *:text-current' },
    { variant: 'ghost', tone: 'agent', className: 'text-agent-text *:text-current' },
  ],
  defaultVariants: { kind: 'artboard', tone: 'neutral', variant: 'ghost', radius: 'none', shadow: 'none', size: 'md' },
});

/** Marker: a 7px diamond (artboard) or a 12px frame icon (frame). The diamond is drawn by a rotated ring so the box stays 7px square. */
export const frameLabelMarkerVariants = cva('relative inline-flex shrink-0', {
  variants: {
    kind: {
      artboard: 'size-1.75 rounded-2xs before:absolute before:inset-0 before:rotate-45 before:rounded-2xs before:shadow-[inset_0_0_0_1.5px_currentColor]',
      frame: 'size-icon-xs text-text-tertiary [&_svg]:size-icon-xs',
    },
  },
  defaultVariants: { kind: 'artboard' },
});

/** The dimensions: mono and quiet on an artboard, the same type as the name on a frame. */
export const frameLabelSizeVariants = cva('', {
  variants: {
    kind: {
      artboard: 'shrink-0 font-mono text-mono-sm text-text-tertiary',
      frame: 'shrink-0 text-text-tertiary',
    },
  },
  defaultVariants: { kind: 'artboard' },
});
