import { cva, type VariantProps } from 'class-variance-authority';

export const bannerVariants = cva(
  'flex min-h-control-xl w-full items-center gap-3 rounded-xl py-2 pl-3.5 font-ui text-ui',
  {
    variants: {
      // Subtle emphasis: tint fill (step 2) with the tone border (step 6) drawn inside the edge, and the message in the tone text (step 11).
      tone: {
        info: 'bg-info-tint text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]',
        success: 'bg-success-tint text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]',
        warning: 'bg-warning-tint text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]',
        danger: 'bg-danger-tint text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]',
      },
      // A trailing xs control sits concentric with the 12px corner, so end padding tightens to 8 only when one is present.
      trailing: { true: 'pr-2', false: 'pr-3.5' },
    },
    defaultVariants: { tone: 'info', trailing: false },
  },
);

export const bannerIcon = cva('inline-flex size-icon-md flex-none items-center justify-center [&_svg]:size-icon-md', {
  variants: { tone: { info: 'text-info-graphic', success: 'text-success-graphic', warning: 'text-warning-graphic', danger: 'text-danger-graphic' } },
  defaultVariants: { tone: 'info' },
});

export type BannerVariantProps = Pick<VariantProps<typeof bannerVariants>, 'tone'>;
