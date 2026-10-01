import { cva, type VariantProps } from 'class-variance-authority';

export const changeDetailVariants = cva('m-0 grid list-none p-0');

export const changeDetailItemVariants = cva('grid grid-cols-[auto_1fr] gap-1 border-t border-border-subtle py-2 first:border-t-0');

export const changeDetailKindVariants = cva('mr-1 inline-grid h-4.5 place-items-center self-start rounded-xs px-1.5 text-micro', {
  variants: {
    kind: {
      mod: 'bg-info-soft text-info-text',
      add: 'bg-success-soft text-success-text',
      del: 'bg-danger-soft text-danger-text',
    },
  },
  defaultVariants: { kind: 'mod' },
});
export type ChangeDetailKindProps = VariantProps<typeof changeDetailKindVariants>;

export const changeDetailPathVariants = cva('font-mono text-mono-md font-normal text-text-primary');
export const changeDetailValuesVariants = cva('col-start-2 flex flex-wrap items-center gap-1.5 font-mono text-mono-md font-normal');
export const changeDetailFromVariants = cva('inline-flex items-center gap-1 rounded-xs bg-diff-remove px-1.25 py-px text-danger-text');
export const changeDetailToVariants = cva('inline-flex items-center gap-1 rounded-xs bg-diff-add px-1.25 py-px text-success-text no-underline');
export const changeDetailArrowVariants = cva('inline-flex size-icon-sm shrink-0 text-text-tertiary [&_svg]:size-full');
export const changeDetailSwatchVariants = cva('size-2.5 shrink-0 rounded-xs bg-(--swatch) shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]');
