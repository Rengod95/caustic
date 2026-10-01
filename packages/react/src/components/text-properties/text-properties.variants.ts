import { cva, type VariantProps } from 'class-variance-authority';

export const textPropertiesVariants = cva('flex min-w-0 flex-col gap-2 font-ui');

export const textPropertiesTwoColumnVariants = cva('grid grid-cols-2 gap-1.5');

export const textPropertiesRowVariants = cva('flex items-center justify-between gap-2');

export const textPropertiesNoticeVariants = cva('grid grid-cols-[auto_1fr] gap-2 rounded-lg bg-warning-soft px-2.5 py-2 text-hint text-text-primary');

export const textPropertiesNoticeIconVariants = cva('mt-0.25 inline-flex size-icon-sm text-warning-text [&_svg]:size-full [&_svg]:stroke-[1.75]');

export type TextPropertiesVariantProps = VariantProps<typeof textPropertiesVariants>;
