import { cva } from 'class-variance-authority';

/**
 * The stage. Common props (lib/common-props.ts): size, variant and tone = the two caption pills (label variants below;
 * the stage height stays size-compare-h), radius / shadow = the stage, applied by CompareView with radiusClass / shadowClass after these
 * classes. The divider and knob are a position thumb and never take the tone.
 */
export const compareViewVariants = cva('relative h-compare-h w-full overflow-hidden rounded-xl bg-bg-canvas', {
  variants: {
    size: { xs: '', sm: '', md: '', lg: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
    shadow: { none: '', '1': '', '2': '', '3': '', '4': '', '5': '' },
  },
  defaultVariants: { size: 'md', variant: 'solid', tone: 'neutral', radius: 'xl', shadow: 'none' },
});

export const compareViewSideVariants = cva('absolute inset-0 grid place-items-center');

/** The after side: clipped from the divider in split mode, faded by --ov in overlay mode. */
export const compareViewAfterVariants = cva('bg-bg-canvas', {
  variants: {
    mode: {
      split: '[clip-path:inset(0_0_0_var(--split))]',
      overlay: 'opacity-(--ov)',
    },
  },
  defaultVariants: { mode: 'split' },
});

/** Caption pill: the size steps its height, padding and type; the variant is its surface (solid = thick floating material); the tone its text. */
export const compareViewLabelVariants = cva('absolute top-2.5 z-10 grid place-items-center rounded-full font-medium', {
  variants: {
    labelSize: {
      xs: 'h-4 px-1.5 text-micro',
      sm: 'h-control-compact-2xs px-1.75 text-ui-xs',
      md: 'h-control-2xs px-2 text-ui-xs',
      lg: 'h-control-xs px-2.5 text-ui-sm',
    },
    side: { before: 'left-2.5', after: 'right-2.5' },
    labelVariant: {
      solid: 'glass glass-thick',
      soft: 'bg-neutral-track',
      outline: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
      ghost: 'bg-transparent',
    },
    labelTone: {
      neutral: 'text-text-primary', accent: 'text-accent-text', success: 'text-success-text', warning: 'text-warning-text',
      danger: 'text-danger-text', info: 'text-info-text', agent: 'text-agent-text',
    },
  },
  defaultVariants: { side: 'before', labelSize: 'md', labelVariant: 'solid', labelTone: 'neutral' },
});

/** The drag thumb (line and knob) carries a strong shadow so it lifts off any art on either side: the line elevation 2
 *  under its 0.5px edge, the knob elevation 5 under the same edge. */
export const compareViewDividerVariants = cva(
  'absolute top-0 bottom-0 left-(--split) z-20 w-0.5 cursor-ew-resize touch-none bg-control-thumb shadow-[0_0_0_0.5px_var(--cs-color-swatch-edge),var(--cs-elevation-2)] outline-none focus-visible:shadow-focus',
);

export const compareViewKnobVariants = cva('pointer-events-none absolute top-1/2 left-1/2 size-6.5 -translate-1/2 rounded-full bg-control-thumb shadow-[0_0_0_0.5px_var(--cs-color-swatch-edge),var(--cs-elevation-5)]');
