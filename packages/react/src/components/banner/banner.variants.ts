import { cva, type VariantProps } from 'class-variance-authority';

export const bannerVariants = cva(
  'flex min-h-control-xl w-full items-center gap-3 rounded-xl py-2 pl-3.5 font-ui text-ui text-text-primary',
  {
    variants: {
      tone: { info: 'bg-info-soft', success: 'bg-success-soft', warning: 'bg-warning-soft', danger: 'bg-danger-soft' },
      // A trailing xs control sits concentric with the 12px corner, so end padding tightens to 8 only when one is present.
      trailing: { true: 'pr-2', false: 'pr-3.5' },
    },
    defaultVariants: { tone: 'info', trailing: false },
  },
);

export const bannerIcon = cva('inline-flex size-icon-md flex-none items-center justify-center [&_svg]:size-icon-md', {
  variants: { tone: { info: 'text-info-text', success: 'text-success-text', warning: 'text-warning-text', danger: 'text-danger-text' } },
  defaultVariants: { tone: 'info' },
});

export type BannerVariantProps = Pick<VariantProps<typeof bannerVariants>, 'tone'>;
