import { cva } from 'class-variance-authority';

/**
 * Alignment aids: smart guide and measurement are the canvas guide magenta (canvas.guide), a user-placed guide is info blue (canvas.guide-user).
 * Position comes from the rect custom properties (--rect-*); the snap mark is centered on its point.
 * Common props (lib/common-props.ts); each axis' default is the own look and adds no class:
 *   tone / variant  the line colour: solid neutral = the kind's own colour; solid in a tone = its solid, soft = its
 *                   border-strong, outline = its border; ghost hides the line (a measure keeps its label).
 *   radius / shadow the line box (full: round line ends, owner B; flat). size: the stroke, 1px up to md, 2px at lg.
 */
export const canvasGuideVariants = cva('pointer-events-none absolute top-(--rect-t) right-(--rect-r) bottom-(--rect-b) left-(--rect-l) z-10 rounded-full', {
  variants: {
    kind: {
      smart: 'bg-canvas-guide',
      user: 'bg-canvas-guide-user',
      measure: 'flex items-center justify-center bg-canvas-guide before:absolute before:bg-canvas-guide after:absolute after:bg-canvas-guide',
      snap: 'size-1.75 -translate-x-1/2 -translate-y-1/2 before:absolute before:top-1/2 before:left-1/2 before:h-[1.5px] before:w-2.25 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:bg-canvas-guide after:absolute after:top-1/2 after:left-1/2 after:h-[1.5px] after:w-2.25 after:-translate-x-1/2 after:-translate-y-1/2 after:-rotate-45 after:bg-canvas-guide',
    },
    orientation: {
      horizontal: 'h-px w-(--rect-w)',
      vertical: 'h-(--rect-h) w-px',
    },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: '',
    },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { kind: 'measure', orientation: 'horizontal', class: 'before:-top-1 before:left-0 before:h-2.25 before:w-px after:-top-1 after:right-0 after:h-2.25 after:w-px' },
    { kind: 'measure', orientation: 'vertical', class: 'before:top-0 before:-left-1 before:h-px before:w-2.25 after:-left-1 after:bottom-0 after:h-px after:w-2.25' },
    { kind: 'snap', class: 'h-1.75 w-1.75' },
    { variant: 'solid', tone: 'accent', class: 'bg-accent-solid before:bg-accent-solid after:bg-accent-solid' },
    { variant: 'solid', tone: 'success', class: 'bg-success-solid before:bg-success-solid after:bg-success-solid' },
    { variant: 'solid', tone: 'warning', class: 'bg-warning-solid before:bg-warning-solid after:bg-warning-solid' },
    { variant: 'solid', tone: 'danger', class: 'bg-danger-solid before:bg-danger-solid after:bg-danger-solid' },
    { variant: 'solid', tone: 'info', class: 'bg-info-solid before:bg-info-solid after:bg-info-solid' },
    { variant: 'solid', tone: 'agent', class: 'bg-agent-solid before:bg-agent-solid after:bg-agent-solid' },
    { variant: 'soft', tone: 'neutral', class: 'bg-neutral-border-strong before:bg-neutral-border-strong after:bg-neutral-border-strong' },
    { variant: 'soft', tone: 'accent', class: 'bg-accent-border-strong before:bg-accent-border-strong after:bg-accent-border-strong' },
    { variant: 'soft', tone: 'success', class: 'bg-success-border-strong before:bg-success-border-strong after:bg-success-border-strong' },
    { variant: 'soft', tone: 'warning', class: 'bg-warning-border-strong before:bg-warning-border-strong after:bg-warning-border-strong' },
    { variant: 'soft', tone: 'danger', class: 'bg-danger-border-strong before:bg-danger-border-strong after:bg-danger-border-strong' },
    { variant: 'soft', tone: 'info', class: 'bg-info-border-strong before:bg-info-border-strong after:bg-info-border-strong' },
    { variant: 'soft', tone: 'agent', class: 'bg-agent-border-strong before:bg-agent-border-strong after:bg-agent-border-strong' },
    { variant: 'outline', tone: 'neutral', class: 'bg-neutral-border before:bg-neutral-border after:bg-neutral-border' },
    { variant: 'outline', tone: 'accent', class: 'bg-accent-border before:bg-accent-border after:bg-accent-border' },
    { variant: 'outline', tone: 'success', class: 'bg-success-border before:bg-success-border after:bg-success-border' },
    { variant: 'outline', tone: 'warning', class: 'bg-warning-border before:bg-warning-border after:bg-warning-border' },
    { variant: 'outline', tone: 'danger', class: 'bg-danger-border before:bg-danger-border after:bg-danger-border' },
    { variant: 'outline', tone: 'info', class: 'bg-info-border before:bg-info-border after:bg-info-border' },
    { variant: 'outline', tone: 'agent', class: 'bg-agent-border before:bg-agent-border after:bg-agent-border' },
    { variant: 'ghost', class: 'bg-transparent' },
    { orientation: 'horizontal', size: 'lg', class: 'h-0.5' },
    { orientation: 'vertical', size: 'lg', class: 'w-0.5' },
  ],
  defaultVariants: { kind: 'smart', orientation: 'horizontal', variant: 'solid', tone: 'neutral', radius: 'full', shadow: 'none', size: 'md' },
});

/** Measurement value, centered on the line, with a 1px canvas.artboard halo so its edge holds over busy work (owner A). */
export const canvasGuideLabelVariants = cva('relative z-10 inline-flex h-4 items-center rounded-xs bg-canvas-guide px-1 font-mono text-mono-sm font-semibold whitespace-nowrap text-canvas-guide-on shadow-[0_0_0_1px_var(--cs-color-canvas-artboard)]');
