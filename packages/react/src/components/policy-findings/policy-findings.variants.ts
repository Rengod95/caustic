import { cva, type VariantProps } from 'class-variance-authority';

/** The panel content: summary, then the findings, 14px apart. */
export const policyFindingsVariants = cva('grid gap-3.5 font-ui text-ui-dense text-text-primary');

/** Counts: a wrapping row of three Chip sm. */
export const policyFindingsSummaryVariants = cva('flex flex-wrap items-center gap-2');

/** The ul: list style removed. */
export const policyFindingsListVariants = cva('m-0 list-none p-0');

/** One finding: auto / 1fr / auto, aligned to the start, with a 1px subtle top edge except on the first row. */
export const policyFindingsFindingVariants = cva('grid grid-cols-[auto_1fr_auto] items-start gap-2.5 border-t border-border-subtle py-2.5 text-ui-dense text-text-primary first:border-t-0');

/** Severity mark: a 20px square, soft status tint, 12px glyph. */
export const policyFindingsSeverityVariants = cva('grid size-control-2xs place-items-center rounded-sm [&_svg]:size-icon-xs [&_svg]:stroke-[1.75]', {
  variants: {
    severity: {
      error: 'bg-danger-soft text-danger-text',
      warning: 'bg-warning-soft text-warning-text',
      pass: 'bg-success-soft text-success-text',
    },
  },
  defaultVariants: { severity: 'error' },
});
export type PolicyFindingsVariantProps = VariantProps<typeof policyFindingsSeverityVariants>;

export const policyFindingsBodyVariants = cva('min-w-0');

export const policyFindingsTitleVariants = cva('text-ui-dense font-medium text-text-primary');

/** Where it applies: mono small, tertiary. */
export const policyFindingsLocationVariants = cva('font-mono text-mono-sm text-text-tertiary');

export const policyFindingsActionVariants = cva('flex items-center');
