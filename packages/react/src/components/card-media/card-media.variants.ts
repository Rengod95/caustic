import { cva, type VariantProps } from 'class-variance-authority';

/** Opaque card that clips its cover to the corner radius. overlay has no inset: the cover is the whole card. */
export const cardMediaVariants = cva(
  'overflow-hidden bg-surface-base text-text-primary no-underline outline-none shadow-[0_0_0_1px_var(--cs-color-border-subtle)] focus-visible:shadow-[var(--cs-focus),var(--cs-elevation-2)]',
  {
    variants: {
      layout: {
        cover: '',
        overlay: 'gap-0 p-0 text-media-on',
      },
    },
    defaultVariants: { layout: 'cover' },
  },
);

/** The cover pulls out to the card edge with a negative margin equal to the inset; the 4px under it makes 14px before the header. */
export const cardMediaCoverVariants = cva(
  'relative -mx-inset-regular-x -mt-inset-regular-y mb-1 aspect-16/9 overflow-hidden group-data-[size=compact]/card:-mx-inset-compact-x group-data-[size=compact]/card:-mt-inset-compact-y group-data-[layout=overlay]/card:m-0 group-data-[layout=overlay]/card:aspect-4/5',
);

export type CardMediaVariantProps = VariantProps<typeof cardMediaVariants>;
