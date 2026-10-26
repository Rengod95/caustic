import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva(
  'grid min-h-field-lg grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl py-2.5 pl-3 font-ui text-ui-dense',
  {
    variants: {
      // Subtle emphasis: tint fill (step 2) with the tone border (step 6) drawn inside the edge, and the message in the tone text (step 11).
      tone: {
        info: 'bg-info-tint text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]',
        success: 'bg-success-tint text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]',
        warning: 'bg-warning-tint text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]',
        danger: 'bg-danger-tint text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]',
      },
      // The xs action sits concentric with the 12px corner, so the end padding tightens to 10 only when one is present.
      action: { true: 'pr-2.5', false: 'pr-3' },
    },
    defaultVariants: { tone: 'info', action: false },
  },
);

export const alertIcon = cva('inline-flex size-icon-md items-center justify-center [&_svg]:size-icon-md', {
  variants: { tone: { info: 'text-info-graphic', success: 'text-success-graphic', warning: 'text-warning-graphic', danger: 'text-danger-graphic' } },
  defaultVariants: { tone: 'info' },
});

export type AlertVariantProps = Pick<VariantProps<typeof alertVariants>, "tone">;
