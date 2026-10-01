import { cva, type VariantProps } from 'class-variance-authority';

export const toastVariants = cva(
  [
    'glass glass-shadow-4 flex min-h-toast-min min-w-0 items-center gap-3 rounded-toast py-2.5 pl-3.5 font-ui text-ui text-text-primary',
    '[--cs-material:var(--cs-color-material-regular)] [--cs-material-blur:var(--cs-blur-thick)]',
    'transition-[opacity,translate] duration-480 ease-spring starting:translate-y-2 starting:opacity-0',
    'data-[state=closed]:translate-y-2 data-[state=closed]:opacity-0 data-[state=closed]:duration-320 data-[state=closed]:ease-out',
    'motion-reduce:translate-y-0 motion-reduce:starting:translate-y-0 motion-reduce:data-[state=closed]:translate-y-0',
  ],
  {
    variants: {
      tone: { success: '', agent: 'agent-rim' },
      // The trailing xs button sits concentric with the corner, so end padding tightens to 12 only when an action is present.
      action: { true: 'pr-3', false: 'pr-3.5' },
    },
    defaultVariants: { tone: 'success', action: false },
  },
);

/** The status mark: a success circle with a check, or the agent orb. */
export const toastMark = cva('', {
  variants: {
    tone: {
      success: 'grid size-control-sm flex-none place-items-center rounded-full bg-success-solid text-accent-on [&_svg]:size-icon-md',
      agent: 'orb',
    },
  },
  defaultVariants: { tone: 'success' },
});

export const toastViewport = cva(
  'fixed end-4 bottom-4 z-(--cs-z-toast) grid w-toast-w max-w-full gap-2',
);

export type ToastVariantProps = Pick<VariantProps<typeof toastVariants>, 'tone'>;
