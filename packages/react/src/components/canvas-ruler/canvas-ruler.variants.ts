import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Measuring strip: thick-material fill over the canvas, a hairline on the inner edge and drawn ticks (5px every 10,
 * 9px every 100). size steps the strip thickness (xs 16, sm 18, md 20, lg 24) and the offset of the strips past the
 * corner block with it.
 */
export const canvasRulerVariants = cva(
  'pointer-events-none absolute overflow-hidden bg-material-thick font-mono text-mono-ruler text-text-tertiary backdrop-blur-ultrathin',
  {
    variants: {
      orientation: {
        horizontal:
          'top-0 right-0 left-control-2xs z-10 h-control-2xs border-b border-border-default bg-no-repeat [background-image:repeating-linear-gradient(90deg,var(--cs-color-border-strong)_0_1px,transparent_1px_calc(var(--spacing)*2.5)),repeating-linear-gradient(90deg,var(--cs-color-text-tertiary)_0_1px,transparent_1px_calc(var(--spacing)*25))] [background-position:0_100%,0_100%] [background-size:100%_5px,100%_9px]',
        vertical:
          'top-control-2xs bottom-0 left-0 z-10 w-control-2xs border-r border-border-default bg-no-repeat [background-image:repeating-linear-gradient(180deg,var(--cs-color-border-strong)_0_1px,transparent_1px_calc(var(--spacing)*2.5)),repeating-linear-gradient(180deg,var(--cs-color-text-tertiary)_0_1px,transparent_1px_calc(var(--spacing)*25))] [background-position:100%_0,100%_0] [background-size:5px_100%,9px_100%]',
        corner: 'top-0 left-0 z-20 size-control-2xs border-r border-b border-border-default',
      },
      radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { 'none': '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
      size: { xs: '', sm: '', md: '', lg: '' },
    },
    compoundVariants: [
      { orientation: 'horizontal', size: 'xs', class: 'left-4 h-4' },
      { orientation: 'horizontal', size: 'sm', class: 'left-control-compact-2xs h-control-compact-2xs' },
      { orientation: 'horizontal', size: 'lg', class: 'left-control-xs h-control-xs' },
      { orientation: 'vertical', size: 'xs', class: 'top-4 w-4' },
      { orientation: 'vertical', size: 'sm', class: 'top-control-compact-2xs w-control-compact-2xs' },
      { orientation: 'vertical', size: 'lg', class: 'top-control-xs w-control-xs' },
      { orientation: 'corner', size: 'xs', class: 'size-4' },
      { orientation: 'corner', size: 'sm', class: 'size-control-compact-2xs' },
      { orientation: 'corner', size: 'lg', class: 'size-control-xs' },
    ],
    defaultVariants: { orientation: 'horizontal', radius: 'none', shadow: 'none', size: 'md' },
  },
);

export type CanvasRulerVariantProps = VariantProps<typeof canvasRulerVariants>;

/** Number label at a position along the strip; vertical labels read bottom-to-top. */
export const canvasRulerMarkVariants = cva('absolute', {
  variants: {
    orientation: {
      horizontal: 'top-0.5 left-(--at)',
      vertical: 'top-(--at) left-0.5 rotate-180 [writing-mode:vertical-rl]',
      corner: 'hidden',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

/**
 * Selection range: the canvas marquee tint bounded by two lines in currentColor (canvas.selection for the accent tone,
 * the tone's graphic slot otherwise). variant: soft = tint + lines (default), outline = lines only, ghost = tint only,
 * solid = 2px lines.
 */
export const canvasRulerBandVariants = cva('absolute bg-canvas-marquee text-canvas-selection', {
  variants: {
    orientation: {
      horizontal: 'inset-y-0 left-(--at) w-(--size) shadow-[inset_1px_0_currentColor,inset_-1px_0_currentColor]',
      vertical: 'inset-x-0 top-(--at) h-(--size) shadow-[inset_0_1px_currentColor,inset_0_-1px_currentColor]',
      corner: 'hidden',
    },
      tone: { neutral: 'text-neutral-graphic', accent: '', success: 'text-success-graphic', warning: 'text-warning-graphic', danger: 'text-danger-graphic', info: 'text-info-graphic', agent: 'text-agent-graphic' },
    variant: { soft: '', outline: 'bg-transparent', ghost: 'shadow-none', solid: '' },
  },
  compoundVariants: [
    { orientation: 'horizontal', variant: 'solid', class: 'shadow-[inset_2px_0_currentColor,inset_-2px_0_currentColor]' },
    { orientation: 'vertical', variant: 'solid', class: 'shadow-[inset_0_2px_currentColor,inset_0_-2px_currentColor]' },
  ],
  defaultVariants: { orientation: 'horizontal', tone: 'accent', variant: 'soft' },
});

/**
 * Range end values (owner B): the selection's start and end in the band colour (currentColor), set just outside each
 * end on the strip fill so the regular numbers under them drop out. Vertical labels read bottom-to-top like the marks.
 */
export const canvasRulerBandLabelVariants = cva('absolute bg-material-thick font-mono text-mono-ruler whitespace-nowrap text-current', {
  variants: {
    orientation: {
      horizontal: 'top-0.5 px-0.5',
      vertical: 'left-0.5 rotate-180 py-0.5 [writing-mode:vertical-rl]',
      corner: 'hidden',
    },
    edge: { start: '', end: '' },
  },
  compoundVariants: [
    { orientation: 'horizontal', edge: 'start', class: 'right-full' },
    { orientation: 'horizontal', edge: 'end', class: 'left-full' },
    { orientation: 'vertical', edge: 'start', class: 'bottom-full' },
    { orientation: 'vertical', edge: 'end', class: 'top-full' },
  ],
  defaultVariants: { orientation: 'horizontal', edge: 'start' },
});
