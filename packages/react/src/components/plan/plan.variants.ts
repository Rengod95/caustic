import { cva, type VariantProps } from 'class-variance-authority';

export const planVariants = cva('grid gap-px rounded-xl bg-surface-base p-1.5 text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]');

export const planStepVariants = cva('flex min-h-7 items-center gap-2 rounded-sm px-1.5 text-ui-dense', {
  variants: {
    status: {
      done: 'text-text-tertiary',
      now: 'bg-fill-hover font-medium',
      todo: '',
    },
  },
  defaultVariants: { status: 'todo' },
});

export const planIndicatorVariants = cva('grid size-icon-md shrink-0 place-items-center', {
  variants: {
    status: {
      done: 'rounded-full bg-success-soft text-success-text [&_svg]:size-icon-xs [&_svg]:stroke-3',
      now: '',
      todo: '',
    },
  },
  defaultVariants: { status: 'todo' },
});

export const planLabelVariants = cva('', {
  variants: {
    status: {
      done: 'line-through decoration-border-strong',
      now: '',
      todo: '',
    },
  },
  defaultVariants: { status: 'todo' },
});

export type PlanStepVariantProps = VariantProps<typeof planStepVariants>;

/** The 12px spectrum orb; rendered only for the now step. */
export const planOrbVariants = cva('', {
  variants: { status: { done: '', now: 'orb orb-sm motion-reduce:animate-none', todo: '' } },
  defaultVariants: { status: 'todo' },
});

/** The failed step (outside the status variants): danger text on the row, danger glyph in the indicator. */
export const planFailedStepClass = 'text-danger-text';
export const planFailedIndicatorClass = 'text-danger-text [&_svg]:size-icon-sm';
