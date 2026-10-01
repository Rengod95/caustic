import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center whitespace-nowrap select-none',
    'font-ui transition-[background-color,box-shadow,transform,color] duration-120 ease-out active:scale-[0.97]',
    'outline-none focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:opacity-42 aria-disabled:pointer-events-none aria-disabled:opacity-42',
    '[&_svg]:shrink-0 [&_svg]:stroke-[1.75]',
  ],
  {
    variants: {
      tone: {
        ink: 'frost bg-ink-solid text-ink-on shadow-[0_0_0_1px_var(--cs-color-control-edge),var(--cs-elevation-1)] hover:bg-ink-hover',
        accent: 'frost bg-accent-fill text-accent-on shadow-1 hover:bg-accent-fill-hover',
        secondary: 'frost bg-control-raised text-text-primary shadow-[0_0_0_1px_var(--cs-color-control-edge),var(--cs-elevation-1)] hover:bg-control-raised-hover',
        ghost: 'bg-transparent text-text-secondary hover:bg-fill-pressed hover:text-text-primary',
        danger: 'bg-danger-soft text-danger-text hover:bg-danger-solid hover:text-danger-on',
        destructive: 'bg-danger-solid text-danger-on shadow-1',
        agent: 'agent-rim bg-surface-base text-text-primary shadow-2 hover:shadow-[var(--cs-elevation-2),0_6px_22px_-4px_var(--cs-color-agent-glow)]',
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
