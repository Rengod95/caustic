import { cva, type VariantProps } from 'class-variance-authority';

export const imageFillVariants = cva('flex min-w-0 flex-col gap-3.5 font-ui');

export const imageFillStageVariants = cva('checker relative h-image-preview-h overflow-hidden rounded-xl');

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

export const imageFillFileVariants = cva('flex gap-2 text-ui-sm font-normal');

export type ImageFillVariantProps = VariantProps<typeof imageFillVariants>;
