import { cva, type VariantProps } from 'class-variance-authority';

export const chipVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center whitespace-nowrap align-middle select-none font-ui',
    'outline-none focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:opacity-42',
    'aria-pressed:bg-ink-solid aria-pressed:text-ink-on',
  ],
  {
    variants: {
      appearance: {
        soft: 'bg-fill-pressed text-text-primary',
        outline: 'bg-transparent text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-border-strong)]',
        solid: 'bg-ink-solid text-ink-on',
        dashed: 'bg-transparent text-text-secondary outline outline-1 outline-dashed outline-border-control -outline-offset-1',
        surface: 'bg-surface-translucent text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
      },
      tone: {
        neutral: '',
        info: 'bg-info-soft text-info-text',
        success: 'bg-success-soft text-success-text',
        warning: 'bg-warning-soft text-warning-text',
        danger: 'bg-danger-soft text-danger-text',
      },
      shape: { pill: 'rounded-full', rounded: '' },
      size: {
        sm: 'h-control-2xs gap-1.25 px-1.75 text-ui-xs font-medium',
        md: 'h-control-xs gap-1.25 px-2 text-ui-sm',
        lg: 'h-control-sm gap-1.25 px-2.5 text-ui-dense font-medium',
      },
    },
    compoundVariants: [
      { shape: 'rounded', className: 'h-chip-h gap-1.5 rounded-md pl-2 pr-1.5 text-ui-sm' },
    ],
    defaultVariants: { appearance: 'soft', tone: 'neutral', shape: 'pill', size: 'md' },
  },
);

export const chipIconVariants = cva('inline-flex shrink-0 [&_svg]:size-full [&_svg]:stroke-[1.75]', {
  variants: { shape: { pill: 'size-icon-xs', rounded: 'size-chip-icon text-text-tertiary' } },
  defaultVariants: { shape: 'pill' },
});

export const chipRemoveVariants = cva(
  'inline-grid size-icon-md shrink-0 place-items-center rounded-xs text-text-tertiary outline-none hover:bg-fill-pressed hover:text-text-primary focus-visible:shadow-focus [&_svg]:size-icon-xs',
);

export type ChipVariantProps = VariantProps<typeof chipVariants>;
