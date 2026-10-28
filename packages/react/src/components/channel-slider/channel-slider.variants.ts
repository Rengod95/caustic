import { cva } from 'class-variance-authority';

/** Vertical stack, 12px gap. size steps the swatch and the readout; tone and variant go to the space switch (SegmentedControl). */
export const channelSliderVariants = cva('grid gap-3', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  defaultVariants: { tone: 'neutral', variant: 'solid', size: 'md' },
});

/** Explicit radius and elevation of the editor, applied after it so an explicit value wins. */
export const channelSliderShapeVariants = cva('', {
  variants: {
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { 'none': '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'none', shadow: 'none' },
});

/** Swatch of the current colour (the colour itself is the --c custom property), with an inset hairline. 40px, lg radius at md. */
export const channelSliderWellVariants = cva('shrink-0 bg-(color:--c) shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]', {
  variants: {
    size: {
      xs: 'size-control-md rounded-md',
      sm: 'size-control-compact-lg rounded-md',
      md: 'size-control-lg rounded-lg',
      lg: 'size-control-xl rounded-lg',
    },
  },
  defaultVariants: { size: 'md' },
});

/** The readout: one pair per channel (letter, value), ui type with tabular figures, 10px apart. */
export const channelSliderReadoutVariants = cva('flex min-w-0 flex-wrap items-baseline gap-x-2.5 font-medium tabular-nums text-text-primary', {
  variants: { size: { xs: 'text-ui-xs', sm: 'text-ui-sm', md: 'text-ui-md', lg: 'text-ui-lg' } },
  defaultVariants: { size: 'md' },
});

/** The channel letter of a readout pair: tertiary, regular weight. */
export const channelSliderChannelVariants = cva('font-normal text-text-tertiary');
