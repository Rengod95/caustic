import { cva, type VariantProps } from 'class-variance-authority';

/** The stack of binding rows and the add row. */
export const inspectorBindingsVariants = cva('grid gap-2 font-ui');

/**
 * Common radius / shadow (lib/common-props). The stack is frameless, so they apply to its cards: every row and the add
 * row (InspectorBindings passes them down). Unset keeps the lg radius and no elevation.
 */
export const inspectorBindingsFrameVariants = cva('', {
  variants: {
    // Common radius / shadow (lib/common-props): the default key is the component's own look (no class).
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: '', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'lg', shadow: 'none' },
});

/**
 * One bound property: a 1fr / auto grid, 6px between lines and columns (owner 2026-10-27: the title line needs more room
 * above the selector, most visibly next to the mixed count badge), solid base surface with a subtle hairline edge.
 */
export const inspectorBindingsRowVariants = cva(
  'group/row grid grid-cols-[1fr_auto] items-center gap-1.5 rounded-lg bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
  {
    variants: { size: { xs: 'p-1.5', sm: 'p-1.5', md: 'p-2', lg: 'p-2.5' } },
    defaultVariants: { size: 'md' },
  },
);

export const inspectorBindingsPropertyVariants = cva('flex min-w-0 items-center gap-1.5 text-hint font-medium text-text-secondary');

export const inspectorBindingsPropertyIconVariants = cva('inline-flex size-icon-sm flex-none items-center justify-center [&_svg]:size-full [&_svg]:stroke-[1.75]');

/**
 * End of the first line: Unbind or the count badge. Unbind shows only while its card is hovered or holds focus
 * (owner 2026-10-27, A), so a long list does not repeat it next to every token; it stays on a coarse pointer (touch has no
 * hover). The mixed count badge is always shown.
 */
export const inspectorBindingsActionVariants = cva('flex items-center justify-self-end', {
  variants: {
    reveal: {
      true: 'opacity-0 group-hover/row:opacity-100 group-focus-within/row:opacity-100 pointer-coarse:opacity-100',
      false: '',
    },
  },
  defaultVariants: { reveal: false },
});

/**
 * The bound token as a button across the full row. The variant is its emphasis and the tone its colour family
 * (lib/common-props): soft accent (default) is the accent soft selector with mono primary text; solid = solid 9 fill
 * with the tone on text (neutral: ink); outline = border 6 edge, no fill; ghost = no fill or edge.
 * Mixed overrides the tone and the variant: warning soft with the warning border-strong edge (the compounds below run last).
 */
export const inspectorBindingsSelectorVariants = cva(
  [
    'col-span-full flex w-full min-w-0 cursor-pointer items-center gap-1.5 rounded-md border-0 ps-1 pe-1.5 text-left font-mono font-normal text-text-primary outline-none',
    'transition-[background-color,box-shadow] duration-120 ease-out focus-visible:shadow-focus',
  ],
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: {
        solid: 'bg-ink-solid text-ink-on',
        soft: 'bg-neutral-soft',
        outline: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]',
        ghost: 'bg-transparent',
      },
      binding: { bound: '', mixed: '' },
      size: {
        xs: 'h-control-xs font-mono text-mono-sm',
        sm: 'h-control-sm font-mono text-mono-md',
        md: 'h-control-md font-mono text-mono-md',
        lg: 'h-control-lg font-mono text-mono',
      },
    },
    compoundVariants: [
      // solid × tone
      { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on' },
      { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on' },
      { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on' },
      { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on' },
      { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on' },
      // soft × tone
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
      // outline × tone
      { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
      // mixed (last, so it wins over the tone and variant cells)
      { binding: 'mixed', className: 'bg-warning-soft text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)] focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong),var(--cs-focus)]' },
    ],
    defaultVariants: { tone: 'accent', variant: 'soft', binding: 'bound', size: 'md' },
  },
);
export type InspectorBindingsVariantProps = Pick<VariantProps<typeof inspectorBindingsSelectorVariants>, 'binding'>;

/** Link glyph and chevron: 12px in the tone text (on text on a solid selector); warning text on a mixed row. */
export const inspectorBindingsGlyphVariants = cva('size-icon-xs flex-none stroke-[1.75]', {
  variants: {
    tone: {
      neutral: 'text-text-secondary', accent: 'text-accent-text', success: 'text-success-text', warning: 'text-warning-text',
      danger: 'text-danger-text', info: 'text-info-text', agent: 'text-agent-text',
    },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    binding: { bound: '', mixed: '' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'text-ink-on' },
    { variant: 'solid', tone: 'accent', className: 'text-accent-on' },
    { variant: 'solid', tone: 'success', className: 'text-success-on' },
    { variant: 'solid', tone: 'warning', className: 'text-warning-on' },
    { variant: 'solid', tone: 'danger', className: 'text-danger-on' },
    { variant: 'solid', tone: 'info', className: 'text-info-on' },
    { variant: 'solid', tone: 'agent', className: 'text-agent-on' },
    { binding: 'mixed', className: 'text-warning-text' },
  ],
  defaultVariants: { tone: 'accent', variant: 'soft', binding: 'bound' },
});

/** Token color: an 18px square with a 1px inset ring; the fill is the --swatch custom property. */
export const inspectorBindingsSwatchVariants = cva('inline-flex size-check flex-none rounded-xs bg-(--swatch) shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]');

export const inspectorBindingsNameVariants = cva('min-w-0 truncate');

/**
 * Context line across the full row: one span per fact. On a bound row it is reference only (type, alias depth, themes), so
 * it shows only while the card is hovered or holds focus, like Unbind (owner 2026-10-28, option 3), and stays on a coarse
 * pointer (touch has no hover). It is removed from layout at rest (display none, as in the approved preview), so the card
 * grows by one line under the pointer. A mixed row's line explains the state and is always shown.
 */
export const inspectorBindingsContextVariants = cva('col-span-full flex-wrap gap-2 text-ui-xs text-text-tertiary', {
  variants: {
    binding: {
      bound: 'hidden group-hover/row:flex group-focus-within/row:flex pointer-coarse:flex',
      mixed: 'flex',
    },
  },
  defaultVariants: { binding: 'bound' },
});

/** The bind-a-property row: a dashed strong border all round. */
export const inspectorBindingsAddVariants = cva(
  [
    'flex w-full cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-border-strong bg-transparent px-3 text-left font-ui text-ui-dense text-text-secondary outline-none',
    'transition-[background-color,color] duration-120 ease-out hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:border-disabled-border disabled:text-disabled-text',
    '[&_svg]:size-icon-sm [&_svg]:flex-none [&_svg]:stroke-[1.75]',
  ],
  {
    variants: { size: { xs: 'py-1.25 text-ui-xs', sm: 'py-1.75 text-ui-sm', md: 'py-2.25', lg: 'py-3 text-ui' } },
    defaultVariants: { size: 'md' },
  },
);
