import { cva, type VariantProps } from 'class-variance-authority';

/** Border-only surface: a 1px inset ring (solid) or a 1px dashed outline inside the edge (dashed). */
export const cardOutlineVariants = cva('bg-transparent', {
  variants: {
    border: {
      solid: 'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] transition-shadow duration-quick hover:shadow-[inset_0_0_0_1px_var(--cs-color-border-strong)]',
      dashed: 'min-h-card-add cursor-pointer flex-row items-center justify-center gap-1.5 text-ui text-text-secondary outline-1 -outline-offset-1 outline-dashed outline-border-strong focus-visible:shadow-focus',
    },
  },
  defaultVariants: { border: 'solid' },
});

export type CardOutlineVariantProps = VariantProps<typeof cardOutlineVariants>;
