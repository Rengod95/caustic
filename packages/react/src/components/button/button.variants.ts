import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center whitespace-nowrap select-none',
    'font-ui transition-[background-color,box-shadow,transform,color] duration-120 ease-out active:scale-[0.97]',
    'outline-none focus-visible:shadow-focus',
    // Disabled is a colour (disabled axis), not opacity: the tone drops out.
    'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-none',
    'aria-disabled:pointer-events-none aria-disabled:bg-disabled-fill aria-disabled:text-disabled-text aria-disabled:shadow-none',
    '[&_svg]:shrink-0 [&_svg]:stroke-[1.75]',
  ],
  {
    variants: {
      // Hover and press stay inside the emphasis (§2): solid 9 → 10 → 10 + a 1px text-11 edge, soft 3 → 4 → 5.
      // The pressed shadow keeps the drop shadow and, while held from the keyboard, the focus ring.
      tone: {
        ink: 'bg-ink-solid text-ink-on shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)] hover:bg-ink-solid-hover active:bg-ink-solid-hover',
        accent: [
          'bg-accent-solid text-accent-on shadow-1 hover:bg-accent-solid-hover',
          'active:bg-accent-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-accent-text),var(--cs-elevation-1)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-accent-text),var(--cs-focus)]',
        ],
        secondary: 'bg-control-raised text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)] hover:bg-control-raised-hover',
        ghost: 'bg-transparent text-text-secondary hover:bg-neutral-hover hover:text-text-primary active:bg-neutral-pressed disabled:bg-transparent aria-disabled:bg-transparent',
        danger: 'bg-danger-soft text-danger-text hover:bg-danger-soft-hover active:bg-danger-soft-pressed',
        destructive: [
          'bg-danger-solid text-danger-on shadow-1 hover:bg-danger-solid-hover',
          'active:bg-danger-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-danger-text),var(--cs-elevation-1)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-text),var(--cs-focus)]',
        ],
        agent: 'agent-rim bg-surface-base text-text-primary shadow-2 disabled:after:hidden aria-disabled:after:hidden',
      },
      shape: { rounded: '', pill: 'rounded-full' },
      size: {
        xs: 'h-control-xs gap-1 px-2 text-ui-sm rounded-sm [&_svg]:size-icon-sm',
        sm: 'h-control-sm gap-1.5 px-2.5 text-ui-strong rounded-md [&_svg]:size-icon-md',
        md: 'h-control-md gap-1.5 px-3 text-ui-strong rounded-md [&_svg]:size-icon-md',
        lg: 'h-control-lg gap-1.5 px-4 text-ui-lg rounded-lg [&_svg]:size-icon-md',
      },
    },
    compoundVariants: [{ shape: 'pill', className: 'rounded-full' }],
    defaultVariants: { tone: 'ink', shape: 'rounded', size: 'md' },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
