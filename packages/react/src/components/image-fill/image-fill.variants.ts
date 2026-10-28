import { cva, type VariantProps } from 'class-variance-authority';

export const imageFillVariants = cva('flex min-w-0 flex-col gap-3.5 font-ui');

/**
 * The preview stage, the visible frame of the component. The variant is the emphasis of its edge and the tone the edge
 * colour (lib/common-props): outline (default, owner 2026-10-27 proposal A) = a 1px edge over the image, border.subtle in
 * neutral (border 6 in a hue), so a pale or transparent image still shows the shape it fills; ghost = no edge;
 * soft = a 3px soft 3 ring outside; solid = a 1.5px solid 9 edge (neutral: ink).
 * The edge is drawn over the image (z-10 pseudo) so it stays visible in every mode. size steps the stage height.
 */
export const imageFillStageVariants = cva(
  'checker relative overflow-hidden rounded-xl after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-[inherit] after:content-[""]',
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: {
        solid: 'after:shadow-[inset_0_0_0_1.5px_var(--cs-color-ink-solid)]',
        soft: 'shadow-[0_0_0_3px_var(--cs-color-neutral-soft)]',
        outline: 'after:shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
        ghost: '',
      },
      // Off-scale stage heights borrow existing size tokens until the owner names image-preview sizes (xs 64, sm 72, lg 150).
      size: { xs: 'h-16', sm: 'h-18', md: 'h-image-preview-h', lg: 'h-color-plane-h' },
    },
    compoundVariants: [
      // solid × tone
      { variant: 'solid', tone: 'accent', className: 'after:shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-solid)]' },
      { variant: 'solid', tone: 'success', className: 'after:shadow-[inset_0_0_0_1.5px_var(--cs-color-success-solid)]' },
      { variant: 'solid', tone: 'warning', className: 'after:shadow-[inset_0_0_0_1.5px_var(--cs-color-warning-solid)]' },
      { variant: 'solid', tone: 'danger', className: 'after:shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-solid)]' },
      { variant: 'solid', tone: 'info', className: 'after:shadow-[inset_0_0_0_1.5px_var(--cs-color-info-solid)]' },
      { variant: 'solid', tone: 'agent', className: 'after:shadow-[inset_0_0_0_1.5px_var(--cs-color-agent-solid)]' },
      // soft × tone
      { variant: 'soft', tone: 'accent', className: 'shadow-[0_0_0_3px_var(--cs-color-accent-soft)]' },
      { variant: 'soft', tone: 'success', className: 'shadow-[0_0_0_3px_var(--cs-color-success-soft)]' },
      { variant: 'soft', tone: 'warning', className: 'shadow-[0_0_0_3px_var(--cs-color-warning-soft)]' },
      { variant: 'soft', tone: 'danger', className: 'shadow-[0_0_0_3px_var(--cs-color-danger-soft)]' },
      { variant: 'soft', tone: 'info', className: 'shadow-[0_0_0_3px_var(--cs-color-info-soft)]' },
      { variant: 'soft', tone: 'agent', className: 'shadow-[0_0_0_3px_var(--cs-color-agent-soft)]' },
      // outline × tone
      { variant: 'outline', tone: 'accent', className: 'after:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { variant: 'outline', tone: 'success', className: 'after:shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { variant: 'outline', tone: 'warning', className: 'after:shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { variant: 'outline', tone: 'danger', className: 'after:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { variant: 'outline', tone: 'info', className: 'after:shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { variant: 'outline', tone: 'agent', className: 'after:shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'outline', size: 'md' },
  },
);

/** Common radius / shadow (lib/common-props), on the stage: the root is a frameless stack, the stage is the frame. */
export const imageFillFrameVariants = cva('', {
  variants: {
    // Common radius / shadow (lib/common-props): the default key is the component's own look (no class).
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'xl', shadow: 'none' },
});

/** The image moves between the four layouts (inset, radius) with a spring; reduced motion drops the animation. */
export const imageFillImageVariants = cva(
  'absolute bg-(image:--img) bg-cover bg-center transition-[inset,border-radius] duration-320 ease-spring motion-reduce:transition-none',
  {
    variants: {
      mode: {
        fill: 'inset-0 rounded-none',
        fit: 'inset-y-0 inset-x-[22%] rounded-none',
        crop: 'top-[-20%] right-[-10%] bottom-[-10%] left-[-30%] rounded-md',
        tile: 'inset-0 rounded-none bg-auto bg-repeat bg-size-[33.33%_50%]',
      },
    },
    defaultVariants: { mode: 'fill' },
  },
);

export const imageFillCropFrameVariants = cva(
  'pointer-events-none absolute left-[calc(var(--spacing)*7.5)] right-[calc(var(--spacing)*7.5)] top-3.5 bottom-3.5 rounded-xs border-[1.5px] border-dashed border-canvas-handle shadow-[0_0_0_999px_var(--cs-color-media-scrim)] transition-opacity duration-base ease-out motion-reduce:transition-none',
  {
    variants: { mode: { fill: 'opacity-0', fit: 'opacity-0', crop: 'opacity-100', tile: 'opacity-0' } },
    defaultVariants: { mode: 'fill' },
  },
);

export const imageFillControlsVariants = cva('flex items-center justify-between gap-2');

// ---- crop popover (owner 2026-10-28, option 2: the 110px stage is too small to crop precisely) -----------------------
/** Holds the stage and, in crop mode, the edit button over it; an inline crop popover flows under the stage. */
export const imageFillStageBoxVariants = cva('relative grid gap-2.5');
/** Edit crop: a secondary xs button over the stage's top-right corner, above the edge overlay. */
export const imageFillCropEditVariants = cva('absolute top-2 right-2 z-20');
/** The large 4:3 canvas: checkerboard, lg radius, the swatch.edge hairline, the image clipped to it. */
export const imageFillCropCanvasVariants = cva(
  'checker relative aspect-4/3 w-full touch-none overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
);
/** The image covers the canvas at its zoom, scaled from the centre. */
export const imageFillCropImageVariants = cva('absolute inset-0 scale-(--zoom) bg-(image:--img) bg-cover bg-center');
/** The kept area: a 1.5px media.on frame (white in both themes: it sits on the image) that dims everything outside it with media.scrim; drag to move. */
export const imageFillCropRectVariants = cva(
  [
    'absolute top-(--crop-t) right-(--crop-r) bottom-(--crop-b) left-(--crop-l) cursor-move rounded-2xs outline-none',
    'border-[1.5px] border-media-on shadow-[0_0_0_999px_var(--cs-color-media-scrim)]',
    'focus-visible:shadow-[0_0_0_999px_var(--cs-color-media-scrim),var(--cs-focus)]',
  ],
);
/** Corner handles: 8px media.on squares centred on the frame corners, with a media.scrim hairline. */
export const imageFillCropHandleVariants = cva(
  'absolute size-2 rounded-2xs bg-media-on shadow-[0_0_0_1px_var(--cs-color-media-scrim)]',
  {
    variants: {
      handle: {
        nw: '-top-1.25 -left-1.25 cursor-nwse-resize',
        ne: '-top-1.25 -right-1.25 cursor-nesw-resize',
        sw: '-bottom-1.25 -left-1.25 cursor-nesw-resize',
        se: '-right-1.25 -bottom-1.25 cursor-nwse-resize',
      },
    },
  },
);
/** Reset on the left, Done on the right. */
export const imageFillCropFootVariants = cva('flex items-center justify-between gap-2');

// A long file name truncates; the facts keep their width (owner 2026-10-27, proposal B).
export const imageFillFileVariants = cva('flex min-w-0 gap-2 text-ui-sm font-normal');

export type ImageFillVariantProps = VariantProps<typeof imageFillVariants>;
