import { cva, type VariantProps } from 'class-variance-authority';

/** Opaque surface with a very quiet accent glow in the top-right corner (decorative, behind the content). */
export const cardFeatureVariants = cva(
  [
    'isolate overflow-hidden bg-surface-base shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--cs-elevation-1)]',
    'before:pointer-events-none before:absolute before:-top-[40%] before:-right-[30%] before:-z-10 before:aspect-square before:w-4/5 before:rounded-full before:content-[""]',
    'before:bg-[radial-gradient(closest-side,var(--cs-color-accent-soft),transparent)]',
  ],
  {
    variants: {
      fill: { hug: '', fill: 'justify-between' },
    },
    defaultVariants: { fill: 'hug' },
  },
);

export const cardFeatureHeadlineVariants = cva('block font-ui text-title-feature text-balance text-text-primary');

export const cardFeatureVisualVariants = cva('mt-auto grid min-h-feature-visual-min flex-1 place-items-center rounded-xl bg-bg-inset');

export type CardFeatureVariantProps = VariantProps<typeof cardFeatureVariants>;
