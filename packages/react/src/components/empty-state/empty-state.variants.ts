import { cva, type VariantProps } from 'class-variance-authority';

export const emptyStateVariants = cva(
  'grid w-full justify-items-center gap-2.5 rounded-2xl px-4 text-center outline-1 -outline-offset-1 outline-dashed outline-border-strong',
  {
    variants: { size: { md: 'py-[calc(var(--spacing)*7)]', sm: 'py-4.5' } },
    defaultVariants: { size: 'md' },
  },
);

export const emptyStateIcon = cva('grid place-items-center rounded-xl bg-fill-pressed text-text-secondary [&_svg]:size-empty-glyph', {
  variants: { size: { md: 'size-control-xl', sm: 'size-control-lg' } },
  defaultVariants: { size: 'md' },
});

export const emptyStateTitle = cva('font-ui text-text-primary', {
  variants: { size: { md: 'text-title-3', sm: 'text-title-4' } },
  defaultVariants: { size: 'md' },
});

export type EmptyStateVariantProps = VariantProps<typeof emptyStateVariants>;
