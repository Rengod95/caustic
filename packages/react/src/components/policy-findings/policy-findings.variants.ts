import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The panel content: summary, then the findings, 14px apart. A bare column (variant ghost, the default). Common props
 * (owner 2026-10-26): solid, soft and outline put it on a 12px-inset panel (surface.raised with a hairline, the tone's soft
 * 3, or the tone's border 6 edge; a hue on solid draws its border 6); a hue colours nothing else; radius and shadow
 * shape the panel. size steps the finding rows (policyFindingsFindingVariants).
 */
export const policyFindingsVariants = cva('grid gap-3.5 font-ui text-ui-dense text-text-primary', {
  variants: {
    tone: {
      neutral: '',
      accent: '',
      success: '',
      warning: '',
      danger: '',
      info: '',
      agent: '',
    },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-surface-raised p-3 shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)]' },
    { variant: 'solid', tone: 'accent', className: 'bg-surface-raised p-3 shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'solid', tone: 'success', className: 'bg-surface-raised p-3 shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'solid', tone: 'warning', className: 'bg-surface-raised p-3 shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'solid', tone: 'danger', className: 'bg-surface-raised p-3 shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'solid', tone: 'info', className: 'bg-surface-raised p-3 shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'solid', tone: 'agent', className: 'bg-surface-raised p-3 shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft p-3' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft p-3' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft p-3' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft p-3' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft p-3' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft p-3' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft p-3' },
    { variant: 'outline', tone: 'neutral', className: 'p-3 shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'p-3 shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'p-3 shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'p-3 shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'p-3 shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'p-3 shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'p-3 shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'ghost', radius: 'none', shadow: 'none' },
});

/** Counts: a wrapping row of three Chip sm. */
export const policyFindingsSummaryVariants = cva('flex flex-wrap items-center gap-2');

/** The ul: list style removed. */
export const policyFindingsListVariants = cva('m-0 list-none p-0');

/**
 * One finding: line / 1fr / auto, no rule between rows (owner 2026-10-28): the block padding separates them.
 * The severity line stretches the row; the action cell centres. size steps the block padding and type:
 * xs 6 / ui-xs · sm 8 / ui-sm · md 10 / ui-dense · lg 12 / ui (the title follows).
 * The rows of one check enter as a group: rise and stagger by their index (set by PolicyFindings).
 */
export const policyFindingsFindingVariants = cva('grid grid-cols-[auto_1fr_auto] items-stretch gap-3 text-text-primary animate-rise stagger', {
  variants: { size: { xs: 'py-1.5 text-ui-xs', sm: 'py-2 text-ui-sm', md: 'py-2.5 text-ui-dense', lg: 'py-3 text-ui' } },
  defaultVariants: { size: 'md' },
});

/**
 * Severity mark: a 3px line at the row start, full height, in the status solid colour (proposal A). The glyph is
 * not drawn; the visually hidden word still names the severity.
 */
export const policyFindingsSeverityVariants = cva('w-0.75 self-stretch rounded-full [&_svg]:hidden', {
  variants: {
    severity: {
      error: 'bg-danger-solid',
      warning: 'bg-warning-solid',
      pass: 'bg-success-solid',
    },
  },
  defaultVariants: { severity: 'error' },
});
export type PolicyFindingsVariantProps = VariantProps<typeof policyFindingsSeverityVariants>;

export const policyFindingsBodyVariants = cva('grid min-w-0 content-center gap-0.5');

/** Title: the list title role (ui-md at md), stepped with size. */
export const policyFindingsTitleVariants = cva('font-medium text-text-primary', {
  variants: { size: { xs: 'text-ui-xs', sm: 'text-ui-strong', md: 'text-ui-md', lg: 'text-ui-lg' } },
  defaultVariants: { size: 'md' },
});

/** Where it applies: the regular-weight footnote in tertiary, under the title. */
export const policyFindingsLocationVariants = cva('font-normal text-text-tertiary', {
  variants: { size: { xs: 'text-ui-xs', sm: 'text-ui-xs', md: 'text-footnote', lg: 'text-footnote' } },
  defaultVariants: { size: 'md' },
});

/** The action cell: centred in the row; the consumer passes a small soft Button (xs). */
export const policyFindingsActionVariants = cva('flex items-center self-center');
