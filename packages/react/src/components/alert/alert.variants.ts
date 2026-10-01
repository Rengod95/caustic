import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva(
  'grid min-h-field-lg grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl py-2.5 pl-3 font-ui text-ui-dense text-text-primary',
  {
    variants: {
      tone: { info: 'bg-info-soft', warning: 'bg-warning-soft', danger: 'bg-danger-soft' },
      // The xs action sits concentric with the 12px corner, so the end padding tightens to 10 only when one is present.
      action: { true: 'pr-2.5', false: 'pr-3' },
    },
    defaultVariants: { tone: 'info', action: false },
  },
);

export const alertIcon = cva('inline-flex size-icon-md items-center justify-center [&_svg]:size-icon-md', {
  variants: { tone: { info: 'text-info-text', warning: 'text-warning-text', danger: 'text-danger-text' } },
  defaultVariants: { tone: 'info' },
});

export type AlertVariantProps = Pick<VariantProps<typeof alertVariants>, "tone">;
