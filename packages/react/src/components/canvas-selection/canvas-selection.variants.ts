import { cva, type VariantProps } from 'class-variance-authority';

/**
 * One positioned rect over the canvas, drawn in currentColor: canvas.selection (select, marquee, draw) or canvas.hover
 * (hover) for the accent tone, the tone's graphic slot otherwise; the handles, rotate ring and stem take the same colour.
 * mode select = a 1.5px outline hugging the object; hover = a 1.5px ring; marquee = the translucent canvas.marquee tint
 * with a dashed 1px edge inside the rect and square corners (a proposal, not yet a selection outline: owner A); draw =
 * the tint with a dashed 1.5px border and the 2xs radius (the ghost of a shape being created).
 * variant: outline = the line only (select and hover default; no tint for marquee and draw), soft = the line plus the
 * canvas.marquee tint (marquee and draw default), solid = a 2px line, ghost = no line (handles only, or the tint only).
 * CanvasSelection picks the variant default per mode. Only handles take the pointer.
 */
export const canvasSelectionVariants = cva('pointer-events-none absolute top-(--rect-t) left-(--rect-l) z-10 h-(--rect-h) w-(--rect-w) rounded-2xs', {
  variants: {
    mode: {
      select: 'text-canvas-selection outline-[1.5px] outline-offset-0 outline-current outline-solid',
      hover: 'text-canvas-hover shadow-[0_0_0_1.5px_currentColor]',
      marquee: 'rounded-none bg-canvas-marquee text-canvas-selection outline-1 -outline-offset-1 outline-current outline-dashed',
      draw: 'rounded-2xs border-[1.5px] border-dashed border-current bg-canvas-marquee text-canvas-selection',
    },
    tone: { neutral: 'text-neutral-graphic', accent: '', success: 'text-success-graphic', warning: 'text-warning-graphic', danger: 'text-danger-graphic', info: 'text-info-graphic', agent: 'text-agent-graphic' },
    variant: { outline: 'bg-transparent', soft: 'bg-canvas-marquee', solid: '', ghost: 'border-transparent shadow-none outline-0' },
    radius: { none: 'rounded-none', '2xs': '', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { 'none': '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { mode: 'select', variant: 'solid', class: 'outline-2' },
    { mode: 'hover', variant: 'solid', class: 'shadow-[0_0_0_2px_currentColor]' },
    { mode: 'marquee', variant: 'solid', class: 'outline-2 -outline-offset-2' },
    { mode: 'draw', variant: 'solid', class: 'border-2' },
  ],
  defaultVariants: { mode: 'select', tone: 'accent', variant: 'outline', radius: '2xs', shadow: 'none', size: 'md' },
});

export type CanvasSelectionVariantProps = VariantProps<typeof canvasSelectionVariants>;

/** A 7px square resize handle, centered on its corner or edge midpoint. Other sizes scale it about its centre. */
export const canvasSelectionHandleVariants = cva('pointer-events-auto absolute size-1.75 rounded-2xs border-[1.5px] border-current bg-canvas-handle', {
  variants: { size: { xs: 'scale-70', sm: 'scale-85', md: '', lg: 'scale-130' } },
  defaultVariants: { size: 'md' },
});

export type CanvasSelectionHandle = 'tl' | 'tm' | 'tr' | 'ml' | 'mr' | 'bl' | 'bm' | 'br';

/** Position and resize cursor per handle (static literals so the scanner sees every class). */
export const canvasSelectionHandlePosition: Record<CanvasSelectionHandle, string> = {
  tl: '-top-1 -left-1 cursor-nwse-resize',
  tm: '-top-1 left-1/2 -ml-1 cursor-ns-resize',
  tr: '-top-1 -right-1 cursor-nesw-resize',
  ml: 'top-1/2 -left-1 -mt-1 cursor-ew-resize',
  mr: 'top-1/2 -right-1 -mt-1 cursor-ew-resize',
  bl: '-bottom-1 -left-1 cursor-nesw-resize',
  bm: '-bottom-1 left-1/2 -ml-1 cursor-ns-resize',
  br: '-right-1 -bottom-1 cursor-nwse-resize',
};

/** Rotate handle: a 14px circle 26px above the top edge, joined to the box by a 12px stem. Other sizes scale the circle. */
export const canvasSelectionRotateVariants = cva(
  'pointer-events-auto absolute -top-6.5 left-1/2 size-icon-sm -translate-x-1/2 cursor-grab rounded-full bg-canvas-handle shadow-[0_0_0_1.5px_currentColor] after:absolute after:top-3.5 after:left-1/2 after:h-3 after:w-[1.5px] after:-translate-x-1/2 after:bg-current',
  {
    variants: { size: { xs: 'scale-70', sm: 'scale-85', md: '', lg: 'scale-130' } },
    defaultVariants: { size: 'md' },
  },
);

/**
 * CanvasSelectionLabel, the size chip (formerly CanvasSizeLabel), centered 24px below the bottom edge. At its defaults
 * (accent tone, solid) the canvas.selection fill with canvas.selection-on mono text, 18px high, full radius (a pill,
 * owner 2026-10-27). The chip axes are prefixed (chip*) so they stay apart from the root axes; CanvasSelectionLabel maps
 * its tone / variant / radius / shadow / size props onto them, and CanvasSelection passes its own tone and size.
 */
export const canvasSelectionLabelVariants = cva('absolute -bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center whitespace-nowrap rounded-full font-mono', {
  variants: {
    chipTone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    chipVariant: { solid: '', soft: '', outline: '', ghost: '' },
    chipRadius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: '' },
    chipShadow: { 'none': '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    chipSize: {
      xs: 'h-3.5 px-1 font-mono text-mono-micro',
      sm: 'h-4 px-1.25 font-mono text-mono-micro',
      md: 'h-control-compact-2xs px-1.5 font-mono text-mono-sm',
      lg: 'h-control-compact-xs px-2 font-mono text-mono-md',
    },
  },
  compoundVariants: [
    { chipTone: 'accent', chipVariant: 'solid', class: 'bg-canvas-selection text-canvas-selection-on' },
    { chipTone: 'neutral', chipVariant: 'solid', class: 'bg-neutral-solid text-neutral-on' },
    { chipTone: 'success', chipVariant: 'solid', class: 'bg-success-solid text-success-on' },
    { chipTone: 'warning', chipVariant: 'solid', class: 'bg-warning-solid text-warning-on' },
    { chipTone: 'danger', chipVariant: 'solid', class: 'bg-danger-solid text-danger-on' },
    { chipTone: 'info', chipVariant: 'solid', class: 'bg-info-solid text-info-on' },
    { chipTone: 'agent', chipVariant: 'solid', class: 'bg-agent-solid text-agent-on' },
    { chipTone: 'neutral', chipVariant: 'soft', class: 'bg-neutral-soft text-neutral-text' },
    { chipTone: 'accent', chipVariant: 'soft', class: 'bg-accent-soft text-accent-text' },
    { chipTone: 'success', chipVariant: 'soft', class: 'bg-success-soft text-success-text' },
    { chipTone: 'warning', chipVariant: 'soft', class: 'bg-warning-soft text-warning-text' },
    { chipTone: 'danger', chipVariant: 'soft', class: 'bg-danger-soft text-danger-text' },
    { chipTone: 'info', chipVariant: 'soft', class: 'bg-info-soft text-info-text' },
    { chipTone: 'agent', chipVariant: 'soft', class: 'bg-agent-soft text-agent-text' },
    { chipTone: 'neutral', chipVariant: 'outline', class: 'bg-transparent text-neutral-text shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { chipTone: 'accent', chipVariant: 'outline', class: 'bg-transparent text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { chipTone: 'success', chipVariant: 'outline', class: 'bg-transparent text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { chipTone: 'warning', chipVariant: 'outline', class: 'bg-transparent text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { chipTone: 'danger', chipVariant: 'outline', class: 'bg-transparent text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { chipTone: 'info', chipVariant: 'outline', class: 'bg-transparent text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { chipTone: 'agent', chipVariant: 'outline', class: 'bg-transparent text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { chipTone: 'neutral', chipVariant: 'ghost', class: 'bg-transparent text-neutral-text' },
    { chipTone: 'accent', chipVariant: 'ghost', class: 'bg-transparent text-accent-text' },
    { chipTone: 'success', chipVariant: 'ghost', class: 'bg-transparent text-success-text' },
    { chipTone: 'warning', chipVariant: 'ghost', class: 'bg-transparent text-warning-text' },
    { chipTone: 'danger', chipVariant: 'ghost', class: 'bg-transparent text-danger-text' },
    { chipTone: 'info', chipVariant: 'ghost', class: 'bg-transparent text-info-text' },
    { chipTone: 'agent', chipVariant: 'ghost', class: 'bg-transparent text-agent-text' },
  ],
  defaultVariants: { chipTone: 'accent', chipVariant: 'solid', chipRadius: 'full', chipShadow: 'none', chipSize: 'md' },
});
