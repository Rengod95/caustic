import { cva } from 'class-variance-authority';

/**
 * Same box as Input; the whole box is the button. Focus shows focus-field (P9: the border.default hairline) and, like a
 * focused Input, turns the fill neutral.well (soft, already grey: surface.base; owner 2026-10-28, field/input proposal 2).
 * Common props (owner 2026-10-26), unset = today: variant outline (default) is the opaque surface fill with a border.default
 * edge (a hue: its border 6); solid is surface.base with the edge; ghost has no fill or edge until hover (neutral.hover).
 * soft is the inspector appearance (round 3 merge, owner proposal A: InspectorSelect folded in): the sunken neutral.well
 * box of an inspector row, no edge, on the control scale (xs 24 / sm 28 / md 32 / lg 40, ui-sm type, size radius md / md /
 * lg / xl), neutral.hover under the pointer and surface.base while focused; the leading glyph and the chevron are 14px in
 * the text colour, 6px before the value. A hue fills it with its soft 3 (hover soft-hover 4).
 * size: xs 28 / ui-sm · sm 32 · md 36 (field-md) · lg 40 / ui-md, the inline padding steps with it.
 * Hover (owner 2026-10-28, proposal A): an edged box (outline, solid) steps its edge to border.strong (a hue: its
 * border-strong 7), so the trigger answers the pointer. Open (proposal B): data-state=open keeps the focus-field edge for
 * as long as the popup is open, tying the trigger to its list. Both are (0,2,0) and give way to focus, invalid, disabled.
 */
export const pickerTriggerVariants = cva([
  // group: the indicator turns on data-state=open (dropdown indicator).
  'group flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-xl bg-surface-translucent text-left text-text-primary outline-none',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] transition-control press',
  'focus-visible:bg-neutral-well focus-visible:shadow-[var(--cs-focus-field)] hover:focus-visible:shadow-[var(--cs-focus-field)]',
  'data-[state=open]:shadow-[var(--cs-focus-field)] data-[state=open]:hover:shadow-[var(--cs-focus-field)]',
  // Invalid is the danger border-strong edge; invalid + focus keeps it and adds the outer focus ring.
  // It is for an enabled trigger: the invalid danger edge drops while disabled (the tone drops out).
  'data-[invalid]:not-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] data-[invalid]:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]',
  // Disabled is a colour, not opacity: fill, text and edge from the disabled axis; the glyphs follow.
  'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  'disabled:[&_[data-slot^=picker-trigger-]]:text-disabled-text',
], {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    // Open keeps the focused fill on a white or bare box; soft (already grey) keeps its fill while open.
    variant: {
      solid: 'data-[state=open]:bg-neutral-well data-[state=open]:hover:bg-neutral-well', soft: '',
      outline: 'data-[state=open]:bg-neutral-well data-[state=open]:hover:bg-neutral-well', ghost: 'data-[state=open]:bg-neutral-well data-[state=open]:hover:bg-neutral-well',
    },
    size: { xs: 'h-control-md px-2 text-ui-sm', sm: 'h-field-sm px-2.5 text-ui', md: 'h-field-md px-3 text-ui', lg: 'h-field-lg px-3.5 text-ui-md' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-border-strong)]' },
    { variant: 'solid', tone: 'accent', className: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)]' },
    { variant: 'solid', tone: 'success', className: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong)]' },
    { variant: 'solid', tone: 'warning', className: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)]' },
    { variant: 'solid', tone: 'danger', className: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)]' },
    { variant: 'solid', tone: 'info', className: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong)]' },
    { variant: 'solid', tone: 'agent', className: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-agent-border-strong)]' },
    // soft: the inspector appearance. The glyph rules are (0,2,1)+ and beat the leading span's own 16px tertiary icon.
    {
      variant: 'soft',
      className: [
        'gap-1.5 font-normal shadow-none hover:bg-neutral-hover focus-visible:bg-surface-base disabled:shadow-none',
        '[&_[data-slot=picker-trigger-leading]]:text-text-primary [&_[data-slot=picker-trigger-indicator]]:ml-0.5 [&_[data-slot=picker-trigger-indicator]]:text-text-primary',
        '[&_[data-slot=picker-trigger-leading]_svg]:size-icon-sm',
      ],
    },
    { variant: 'soft', size: 'xs', className: 'h-control-xs rounded-md px-2 text-ui-xs [&_[data-slot=picker-trigger-leading]_svg]:size-icon-xs [&_[data-slot=picker-trigger-indicator]_svg]:size-icon-xs' },
    { variant: 'soft', size: 'sm', className: 'h-control-sm rounded-md px-2.5 text-ui-sm' },
    { variant: 'soft', size: 'md', className: 'h-control-md rounded-lg px-2.5 text-ui-sm' },
    { variant: 'soft', size: 'lg', className: 'h-control-lg rounded-xl px-3 text-ui [&_[data-slot=picker-trigger-leading]_svg]:size-icon-md [&_[data-slot=picker-trigger-indicator]_svg]:size-icon-md' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-well' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft hover:bg-accent-soft-hover' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft hover:bg-success-soft-hover' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft hover:bg-warning-soft-hover' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft hover:bg-danger-soft-hover' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft hover:bg-info-soft-hover' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft hover:bg-agent-soft-hover' },
    { variant: 'outline', tone: 'neutral', className: 'hover:shadow-[inset_0_0_0_1px_var(--cs-color-border-strong)]' },
    { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)]' },
    { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong)]' },
    { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)]' },
    { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)]' },
    { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong)]' },
    { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-agent-border-strong)]' },
    { variant: 'ghost', tone: 'neutral', className: 'bg-transparent shadow-none hover:bg-neutral-hover' },
    { variant: 'ghost', tone: 'accent', className: 'bg-transparent shadow-none hover:bg-neutral-hover' },
    { variant: 'ghost', tone: 'success', className: 'bg-transparent shadow-none hover:bg-neutral-hover' },
    { variant: 'ghost', tone: 'warning', className: 'bg-transparent shadow-none hover:bg-neutral-hover' },
    { variant: 'ghost', tone: 'danger', className: 'bg-transparent shadow-none hover:bg-neutral-hover' },
    { variant: 'ghost', tone: 'info', className: 'bg-transparent shadow-none hover:bg-neutral-hover' },
    { variant: 'ghost', tone: 'agent', className: 'bg-transparent shadow-none hover:bg-neutral-hover' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'outline', size: 'md' },
});

/**
 * Common radius / shadow, applied after the box classes so an explicit value wins. xl (the default) adds no class: the box
 * keeps its own radius (xl for the field variants, the size radius for soft).
 */
export const pickerTriggerFrameVariants = cva('', {
  variants: {
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'xl', shadow: 'none' },
});
