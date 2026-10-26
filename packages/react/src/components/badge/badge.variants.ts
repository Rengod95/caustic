import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex h-control-2xs shrink-0 items-center gap-1 whitespace-nowrap px-1.75 font-ui text-hint font-medium',
  {
    variants: {
      tone: {
        neutral: 'bg-neutral-track text-text-secondary',
        accent: 'bg-accent-soft text-accent-text',
        success: 'bg-success-soft text-success-text',
        warning: 'bg-warning-soft text-warning-text',
        danger: 'bg-danger-soft text-danger-text',
        info: 'bg-info-soft text-info-text',
        solid: 'bg-ink-solid text-ink-on',
        outline: 'bg-transparent text-text-secondary shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
        agent: 'agent-rim bg-surface-base text-text-primary',
      },
      shape: { pill: 'rounded-full', square: 'rounded-xs' },
    },
    defaultVariants: { tone: 'neutral', shape: 'pill' },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

/** The agent spectrum orb; rendered only for tone="agent". */
export const badgeOrbVariants = cva('', {
  variants: {
    tone: {
      neutral: '', accent: '', success: '', warning: '', danger: '', info: '', solid: '', outline: '',
      agent: 'orb orb-dot',
    },
  },
  defaultVariants: { tone: 'neutral' },
});
