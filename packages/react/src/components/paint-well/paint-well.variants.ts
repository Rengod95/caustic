import { cva } from 'class-variance-authority';

/**
 * The paint row and its message: a bare column (variant ghost, the default). Common props (owner 2026-10-26): solid, soft
 * and outline put the row on a 6px-inset panel (surface.raised with a hairline, the tone's soft 3, or the tone's border 6
 * edge; a hue on solid draws its border 6); radius and shadow shape that panel. The tone never touches the paint itself.
 */
export const paintWellVariants = cva('flex min-w-0 flex-col gap-2', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: { solid: '', soft: '', outline: '', ghost: '' },
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-surface-raised p-1.5 shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)]' },
    { variant: 'solid', tone: 'accent', className: 'bg-surface-raised p-1.5 shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'solid', tone: 'success', className: 'bg-surface-raised p-1.5 shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'solid', tone: 'warning', className: 'bg-surface-raised p-1.5 shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'solid', tone: 'danger', className: 'bg-surface-raised p-1.5 shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'solid', tone: 'info', className: 'bg-surface-raised p-1.5 shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'solid', tone: 'agent', className: 'bg-surface-raised p-1.5 shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft p-1.5' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft p-1.5' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft p-1.5' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft p-1.5' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft p-1.5' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft p-1.5' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft p-1.5' },
    { variant: 'outline', tone: 'neutral', className: 'p-1.5 shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'p-1.5 shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'p-1.5 shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'p-1.5 shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'p-1.5 shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'p-1.5 shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'p-1.5 shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'ghost', radius: 'none', shadow: 'none' },
});

/** Well, hex and alpha (or Detach) in one row; size steps the row height (xs 22 · sm 24 · md 28 · lg 36), the parts follow. */
export const paintWellRowVariants = cva('grid grid-cols-[auto_1fr_var(--cs-size-field-alpha-w)] items-center gap-1.5', {
  variants: { size: { xs: 'h-control-xs', sm: 'h-control-sm', md: 'h-control-md', lg: 'h-control-lg' } },
  defaultVariants: { size: 'md' },
});

/**
 * Bound (owner 2026-10-28, proposal A): the hex and alpha columns become one token chip row, not a field, so a bound
 * paint does not look editable: the accent chip look (accent.soft fill, a 1px accent.border edge, lg radius like the
 * fields), the mono Badge (link icon and the token path in mono, accent text) and Detach inside at its end.
 * Disabled is colour; reserved keeps the look and sets aria-busy.
 */
export const paintWellTokenVariants = cva([
  'col-span-2 flex h-full min-w-0 items-center gap-1 rounded-lg bg-accent-soft pl-1 pr-0.5 shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]',
  'data-[disabled]:bg-disabled-fill data-[disabled]:text-disabled-text data-[disabled]:shadow-[inset_0_0_0_0.5px_var(--cs-color-disabled-border)]',
  'data-[disabled]:[&_[data-slot^=badge]]:text-disabled-text',
]);

/**
 * The error message (owner 2026-10-28): one thin row in a box, no glyph. danger.soft fill with a 1px danger.border edge,
 * the fields' lg radius, 8px inline and 2px block padding around hint text in danger.text (22px, a control-xs row).
 */
export const paintWellMessageVariants = cva('animate-rise flex min-h-control-xs items-center rounded-lg bg-danger-soft px-2 py-0.5 text-hint text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]');
