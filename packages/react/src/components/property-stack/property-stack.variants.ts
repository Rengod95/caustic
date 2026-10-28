import { cva } from 'class-variance-authority';

/**
 * A titled stack is an InspectorSection (its padding, gap and bottom rule follow the panel size). Common props (owner
 * 2026-10-26), unset = today: variant ghost (default) is the bare section (a hue colours the title); solid puts it on
 * surface.raised (a hue adds its border 6 edge), soft on the tone's soft 3, outline draws the tone's border 6 edge. radius
 * and shadow shape that panel. size sets the section rhythm itself: xs 8 / 6 · sm 10 / 8 · lg 16 / 12 (padding / gap);
 * md (default) keeps the panel's rhythm.
 */
export const propertyStackVariants = cva('', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'gap-1.5 p-2', sm: 'gap-2 p-2.5', md: '', lg: 'gap-3 p-4' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-surface-raised' },
    { variant: 'solid', tone: 'accent', className: 'bg-surface-raised shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'solid', tone: 'success', className: 'bg-surface-raised shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'solid', tone: 'warning', className: 'bg-surface-raised shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'solid', tone: 'danger', className: 'bg-surface-raised shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'solid', tone: 'info', className: 'bg-surface-raised shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'solid', tone: 'agent', className: 'bg-surface-raised shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
    { variant: 'outline', tone: 'neutral', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'ghost', tone: 'accent', className: '[&_[data-slot=property-stack-title]]:text-accent-text' },
    { variant: 'ghost', tone: 'success', className: '[&_[data-slot=property-stack-title]]:text-success-text' },
    { variant: 'ghost', tone: 'warning', className: '[&_[data-slot=property-stack-title]]:text-warning-text' },
    { variant: 'ghost', tone: 'danger', className: '[&_[data-slot=property-stack-title]]:text-danger-text' },
    { variant: 'ghost', tone: 'info', className: '[&_[data-slot=property-stack-title]]:text-info-text' },
    { variant: 'ghost', tone: 'agent', className: '[&_[data-slot=property-stack-title]]:text-agent-text' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'ghost', radius: 'none', shadow: 'none', size: 'md' },
});

/**
 * An untitled stack is the bare list (the former EffectsStack): no section and no box of its own. radius and shadow style
 * the root (unset: none); tone, variant and size are forwarded to every StackRow (see the component).
 */
export const propertyStackBareVariants = cva('', {
  variants: {
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'none', shadow: 'none' },
});

/**
 * The row list. paint: a grid, rows 8px apart. effect: one list, rows 4px apart (owner 2026-10-27, proposal A: the
 * section spacing belongs between the stack and the editor, not between rows); in the bare stack size steps that gap
 * (xs 0, sm 2, md 4, lg 8).
 */
export const propertyStackListVariants = cva('', {
  variants: {
    kind: { paint: 'grid gap-2', effect: 'flex flex-col gap-1' },
    bare: { true: '', false: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { kind: 'effect', bare: true, size: 'xs', className: 'gap-0' },
    { kind: 'effect', bare: true, size: 'sm', className: 'gap-0.5' },
    { kind: 'effect', bare: true, size: 'lg', className: 'gap-2' },
  ],
  defaultVariants: { kind: 'paint', bare: false, size: 'md' },
});

/** The section title in the inspector caption style (owner 2026-10-28, as InspectorSectionHeader): uppercase caption type
 *  with the caption tracking, text.tertiary, at every size; a ghost hued stack colours it with the tone text. */
export const propertyStackTitleVariants = cva('text-caption uppercase text-text-tertiary');

/** The item being edited (aria-current): the selected inversion (ink fill, paper text; the utility re-points the text
 *  tokens so the name, meta and actions invert with it), and the icon tile drops its track fill so it does not sit as a
 *  pale square on the ink. Owner 2026-10-27: the preview filled the row in the text colour; the text must invert. */
export const propertyStackRowSelectedVariants = cva('selected hover:bg-selection-fill-hover [&_[data-slot=stack-row-icon]]:bg-transparent');
