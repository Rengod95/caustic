import { cva, type VariantProps } from 'class-variance-authority';

export const codeRealizationVariants = cva('grid gap-3.5');

export const codeRealizationPhasesVariants = cva('m-0 flex list-none flex-wrap items-center gap-1 p-0');

/** One phase pill: done = success tint with a check; now = raised pill with the agent orb; todo = quiet. */
export const codeRealizationPhaseVariants = cva('inline-flex h-control-xs items-center gap-1.25 rounded-full px-2 text-label font-medium', {
  variants: {
    phase: {
      done: 'bg-success-soft text-success-text',
      now: 'bg-surface-base text-text-primary shadow-1',
      todo: 'bg-fill-pressed text-text-tertiary',
    },
  },
  defaultVariants: { phase: 'todo' },
});
export type CodeRealizationPhaseVariantProps = VariantProps<typeof codeRealizationPhaseVariants>;

/** The agent orb: only on the current phase. */
export const codeRealizationOrbVariants = cva('', {
  variants: {
    phase: {
      done: '',
      now: 'orb orb-sm',
      todo: '',
    },
  },
  defaultVariants: { phase: 'todo' },
});

export const codeRealizationPhaseIconVariants = cva('size-icon-xs shrink-0 stroke-[2.25]');
export const codeRealizationSeparatorVariants = cva('h-px w-3 bg-border-strong');

export const codeRealizationFilesVariants = cva('m-0 grid list-none gap-px p-0');
export const codeRealizationFileVariants = cva('grid h-menu-item grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md px-2 text-ui-sm font-normal text-text-primary hover:bg-fill-hover');
export const codeRealizationFileIconVariants = cva('size-icon-sm shrink-0', {
  variants: { tone: { default: 'text-text-tertiary', warning: 'text-warning-text' } },
  defaultVariants: { tone: 'default' },
});
export type CodeRealizationFileVariantProps = VariantProps<typeof codeRealizationFileIconVariants>;
export const codeRealizationFileNameVariants = cva('truncate font-mono text-mono-md font-normal');
export const codeRealizationStatsVariants = cva('flex gap-1.5 font-mono text-mono-sm font-normal');
export const codeRealizationAddedVariants = cva('text-success-text');
export const codeRealizationRemovedVariants = cva('text-danger-text');

export const codeRealizationFooterVariants = cva('flex items-center justify-between gap-2');
export const codeRealizationTargetVariants = cva(
  [
    'flex h-control-md w-target-w items-center justify-between gap-2 rounded-md bg-fill-hover px-2.5 text-left font-ui text-ui-sm font-normal text-text-primary outline-none',
  ],
  {
    variants: {
      interactive: {
        true: [
          'cursor-pointer transition-[background-color,box-shadow] duration-120 ease-out hover:bg-fill-pressed',
          'focus-visible:bg-surface-base focus-visible:shadow-focus-field',
        ],
        false: '',
      },
    },
    defaultVariants: { interactive: true },
  },
);
export const codeRealizationTargetChevronVariants = cva('size-icon-sm shrink-0 text-text-tertiary');
