import { cva } from 'class-variance-authority';

// Common props (lib/common-props.ts): radius, shadow and size on the root (size steps the gap between the canvas and the
// stop list; the controls keep their own size); tone and variant on the preview frame (the gradient itself is data).
export const gradientEditorVariants = cva(
  'grid grid-cols-[repeat(auto-fit,minmax(min(100%,calc(var(--spacing)*75)),1fr))] gap-4 text-ui text-text-primary',
  {
    variants: {
      radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
      size: { xs: 'gap-2', sm: 'gap-3', md: '', lg: 'gap-5' },
    },
    defaultVariants: { radius: 'none', shadow: 'none', size: 'md' },
  },
);

// The canvas column: the preview and its strip read as one block (10px from the preview to the bar), then 16px after
// the hanging stop handles to the controls (owner 2026-10-27: clearer sections).
export const gradientCanvasVariants = cva('flex min-w-0 flex-col');

/** The strip in the editor: 10px under the preview (the 4px wrapper margin plus the strip's own 6px top margin, as before the merge). */
export const gradientStripSlotVariants = cva('mt-2.5');

export const gradientPreviewVariants = cva([
  'relative h-gradient-preview-h touch-none rounded-xl select-none',
  'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
  'bg-[image:var(--gradient),conic-gradient(var(--cs-color-canvas-checker-b)_25%,var(--cs-color-canvas-checker-a)_0_50%,var(--cs-color-canvas-checker-b)_0_75%,var(--cs-color-canvas-checker-a)_0)]',
  'bg-size-[100%_100%,calc(var(--spacing)*2.5)_calc(var(--spacing)*2.5)]',
], {
  // outline (default) is today's 1px swatch.edge frame (a tone takes its border). solid is a 2px graphic frame, soft keeps
  // the hairline and adds a 2px soft halo outside, ghost drops the frame (the tone has nothing to colour there).
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-neutral-graphic)]' },
    { variant: 'solid', tone: 'accent', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-accent-graphic)]' },
    { variant: 'solid', tone: 'success', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-success-graphic)]' },
    { variant: 'solid', tone: 'warning', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-warning-graphic)]' },
    { variant: 'solid', tone: 'danger', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-danger-graphic)]' },
    { variant: 'solid', tone: 'info', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-info-graphic)]' },
    { variant: 'solid', tone: 'agent', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-agent-graphic)]' },
    { variant: 'soft', tone: 'neutral', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge),0_0_0_2px_var(--cs-color-neutral-track)]' },
    { variant: 'soft', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge),0_0_0_2px_var(--cs-color-accent-soft)]' },
    { variant: 'soft', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge),0_0_0_2px_var(--cs-color-success-soft)]' },
    { variant: 'soft', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge),0_0_0_2px_var(--cs-color-warning-soft)]' },
    { variant: 'soft', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge),0_0_0_2px_var(--cs-color-danger-soft)]' },
    { variant: 'soft', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge),0_0_0_2px_var(--cs-color-info-soft)]' },
    { variant: 'soft', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge),0_0_0_2px_var(--cs-color-agent-soft)]' },
    { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'ghost', tone: 'neutral', className: 'shadow-none' },
    { variant: 'ghost', tone: 'accent', className: 'shadow-none' },
    { variant: 'ghost', tone: 'success', className: 'shadow-none' },
    { variant: 'ghost', tone: 'warning', className: 'shadow-none' },
    { variant: 'ghost', tone: 'danger', className: 'shadow-none' },
    { variant: 'ghost', tone: 'info', className: 'shadow-none' },
    { variant: 'ghost', tone: 'agent', className: 'shadow-none' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'outline' },
});

export const gradientGuideVariants = cva([
  'pointer-events-none absolute inset-0 size-full overflow-visible',
  '[&_line]:stroke-canvas-handle [&_line]:stroke-[1.5px] [&_line]:[filter:drop-shadow(0_0_1px_var(--cs-color-media-scrim))]',
  '[&_circle]:fill-none [&_circle]:stroke-canvas-handle [&_circle]:stroke-1 [&_circle]:[stroke-dasharray:4_4] [&_circle]:[filter:drop-shadow(0_0_1px_var(--cs-color-media-scrim))]',
]);

export const gradientHandleVariants = cva(
  [
    'absolute top-(--hy) left-(--hx) z-10 size-icon-md -translate-1/2 cursor-grab touch-none rounded-full outline-none active:cursor-grabbing',
    'data-[disabled]:pointer-events-none',
    // On a stop (data-on-stop, a stop at 0 % or 100 %): a 4px transparent border shrinks the drawn mark to 8px inside the
    // stop diamond; the box, the hit area and the focus ring stay 16px.
    'data-[on-stop]:border-4 data-[on-stop]:border-solid data-[on-stop]:border-transparent data-[on-stop]:bg-clip-padding',
  ],
  {
    variants: {
      end: {
        false: 'bg-canvas-handle shadow-thumb-sm focus-visible:shadow-focus data-[on-stop]:not-focus-visible:shadow-none data-[disabled]:bg-disabled-fill data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
        // The ring is --ring wide: 3px, 2px inside a stop diamond.
        true: '[--ring:calc(var(--spacing)*0.75)] data-[on-stop]:[--ring:calc(var(--spacing)*0.5)] bg-transparent shadow-[inset_0_0_0_var(--ring)_var(--cs-color-canvas-handle),var(--cs-elevation-thumb-sm)] focus-visible:shadow-[inset_0_0_0_var(--ring)_var(--cs-color-canvas-handle),var(--cs-focus)] data-[on-stop]:not-focus-visible:shadow-[inset_0_0_0_var(--ring)_var(--cs-color-canvas-handle)] data-[disabled]:shadow-[inset_0_0_0_3px_var(--cs-color-disabled-fill),inset_0_0_0_4px_var(--cs-color-disabled-border)]',
      },
      // A mixed handle has no position to show; it stays reachable and appears while focused.
      mixed: { true: 'opacity-0 focus-visible:opacity-100', false: '' },
    },
    defaultVariants: { end: false, mixed: false },
  },
);

// The stop diamond, the batch thumb on paint (owner 2026-10-27): a 1.5px canvas.handle ring (thinner than 2px) and the
// stronger thumb shadow (thumb + thumb-sm). Selected: the ink ring outside it, no check.
export const gradientDotVariants = cva([
  'absolute top-(--dy) left-(--dx) size-3.5 -translate-1/2 rotate-45 cursor-grab touch-none rounded-xs bg-(--stop-color) transition-control active:cursor-grabbing',
  'shadow-[0_0_0_1.5px_var(--cs-color-canvas-handle),var(--cs-elevation-thumb),var(--cs-elevation-thumb-sm)]',
  'data-[selected]:shadow-[0_0_0_1.5px_var(--cs-color-canvas-handle),0_0_0_3px_var(--cs-color-selection-fill),var(--cs-elevation-thumb),var(--cs-elevation-thumb-sm)]',
  'data-[disabled]:pointer-events-none',
]);

export const gradientReadoutVariants = cva(
  'glass glass-thick pointer-events-none absolute top-(--ry) left-(--rx) -translate-x-1/2 -translate-y-[calc(100%+var(--spacing)*3)] rounded-sm px-2 py-0.75 text-center font-mono text-mono-sm whitespace-nowrap text-text-primary',
);

export const gradientControlsVariants = cva('mt-3.5 flex items-center justify-between gap-2');

// The stops column: head (8px under it), rows, and Start & end right after the rows (4px), one block (owner 2026-10-27).
export const gradientStopsVariants = cva('grid min-w-0 content-start gap-1');

/** Section titles of the stops column ("Stops", "Start & end"): one type, ui-xs semibold tertiary. */
export const gradientSectionTitleVariants = cva('text-ui-xs font-semibold text-text-tertiary');

/** One stop row. The selected row inverts (selected utility: ink fill, paper text, no edge); in a disabled editor it drops the inversion to disabled.fill. */
export const gradientRowVariants = cva(
  'transition-control grid grid-cols-[calc(var(--spacing)*16)_auto_1fr_auto] items-center gap-1.5 rounded-md p-0.5 data-[selected]:not-in-data-[disabled]:selected in-data-[disabled]:data-[selected]:bg-disabled-fill',
);

export const gradientSummaryVariants = cva(
  'flex h-control-xs cursor-pointer list-none items-center gap-1 text-ui-xs font-semibold text-text-tertiary outline-none focus-visible:shadow-focus [&::-webkit-details-marker]:hidden',
);
