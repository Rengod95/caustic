import { cva, type VariantProps } from 'class-variance-authority';

export const stepperVariants = cva('w-full', {
  variants: { orientation: { horizontal: 'flex items-start', vertical: 'grid max-w-stepper-max' } },
  defaultVariants: { orientation: 'horizontal' },
});

export const stepperItem = cva('relative', {
  variants: {
    orientation: {
      horizontal: 'grid min-w-0 flex-1 justify-items-center gap-2 text-center',
      vertical: 'grid grid-cols-[var(--cs-control-sm)_1fr] gap-3 pb-4.5',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

export const stepperConnector = cva('absolute h-auto rounded-full', {
  variants: {
    orientation: {
      horizontal: 'top-3.5 left-[calc(-50%+(var(--spacing)*4.5))] right-[calc(50%+(var(--spacing)*4.5))] h-0.5',
      vertical: 'top-[calc(var(--spacing)*7.5)] bottom-0.5 left-[calc(var(--spacing)*3.25)] w-0.5',
    },
    active: { true: 'bg-accent-solid', false: 'bg-border-default' },
  },
  defaultVariants: { orientation: 'horizontal', active: false },
});

export const stepperIndicator = cva('relative grid size-control-sm place-items-center rounded-full font-ui text-ui-sm font-semibold', {
  variants: {
    status: {
      done: 'bg-accent-solid text-accent-on',
      current: 'bg-surface-base text-accent-text shadow-[inset_0_0_0_2px_var(--cs-color-accent-solid)]',
      upcoming: 'bg-surface-base text-text-secondary shadow-[inset_0_0_0_1px_var(--cs-color-border-control)]',
    },
  },
  defaultVariants: { status: 'upcoming' },
});

export const stepperLabel = cva('font-ui', {
  variants: {
    orientation: {
      horizontal: 'text-ui-dense font-medium',
      vertical: 'block pt-1 text-ui-strong',
    },
    dim: { true: 'text-text-tertiary', false: 'text-text-primary' },
  },
  defaultVariants: { orientation: 'horizontal', dim: false },
});

export const stepperDescription = cva('font-ui text-text-tertiary', {
  variants: {
    orientation: {
      horizontal: 'text-hint',
      vertical: 'mt-0.5 text-ui-dense',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

export type StepperVariantProps = VariantProps<typeof stepperVariants>;
