import { cva, type VariantProps } from 'class-variance-authority';

/** Card root: the one inset and the one gap. Transparent and unelevated; variants add the surface. */
export const cardVariants = cva('group/card relative flex min-w-0 flex-col rounded-3xl font-ui text-text-primary', {
  variants: {
    size: {
      regular: 'gap-2.5 px-inset-regular-x py-inset-regular-y',
      compact: 'gap-2 px-inset-compact-x py-inset-compact-y',
    },
  },
  defaultVariants: { size: 'regular' },
});

export const cardHeaderVariants = cva('flex gap-3', {
  variants: {
    headerAlign: { start: 'items-start', center: 'items-center' },
  },
  defaultVariants: { headerAlign: 'start' },
});

export const cardIconVariants = cva('grid size-card-tile flex-none place-items-center rounded-lg [&_svg]:size-card-glyph', {
  variants: {
    iconTone: {
      neutral: 'bg-fill-pressed text-text-primary',
      accent: 'bg-accent-soft text-accent-text',
    },
  },
  defaultVariants: { iconTone: 'neutral' },
});

export const cardTitleVariants = cva('block font-ui text-text-primary', {
  variants: {
    titleSize: { md: 'text-title-3', sm: 'text-title-4' },
  },
  defaultVariants: { titleSize: 'md' },
});

/** Divided footers bleed to the card edge with a negative margin equal to the inset. */
export const cardFooterVariants = cva('flex flex-wrap items-center gap-2', {
  variants: {
    footer: {
      start: '',
      end: 'justify-end',
      divided: '-mx-inset-regular-x -mb-inset-regular-y mt-1 border-t border-border-subtle px-inset-regular-x py-3 group-data-[size=compact]/card:-mx-inset-compact-x group-data-[size=compact]/card:-mb-inset-compact-y group-data-[size=compact]/card:px-inset-compact-x',
      block: '[&>*]:flex-1',
    },
  },
  defaultVariants: { footer: 'start' },
});

export type CardVariantProps = VariantProps<typeof cardVariants>;
export type CardHeaderVariantProps = VariantProps<typeof cardHeaderVariants>;
export type CardIconVariantProps = VariantProps<typeof cardIconVariants>;
export type CardTitleVariantProps = VariantProps<typeof cardTitleVariants>;
export type CardFooterVariantProps = VariantProps<typeof cardFooterVariants>;
