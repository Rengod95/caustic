import { cva } from 'class-variance-authority';

/**
 * The box: 20px by default (size lg; owner 2026-10-27 asked for 1–2px over the 18px md, which stays size-check): surface.base with a border.control ring; checked and mixed fill it with the accent solid slot and the
 * mark in accent.on (tone accent, variant solid). Other tones and variants change only the checked / mixed look:
 * solid = tone solid fill, soft = tone soft fill with tone text mark, outline = a 1.5px tone border-strong edge with
 * the mark in tone text, ghost = the mark alone. Invalid draws the danger border-strong edge together with the focus
 * ring in every checked state; disabled is a colour (disabled.fill / text / border), never opacity, and wins over both.
 */
export const checkboxVariants = cva(
  [
    'inline-grid size-check shrink-0 place-items-center rounded-sm bg-surface-base text-accent-on transition-[background-color] duration-120 ease-out',
    'shadow-[inset_0_0_0_1px_var(--cs-color-border-control)] outline-none focus-visible:shadow-focus',
    // Invalid: scoped to enabled boxes because disabled wins (the tone drops out). The extra :enabled also lifts it
    // above data-[state=checked|indeterminate]:shadow-none, so checked and mixed boxes keep it.
    'enabled:aria-invalid:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] enabled:aria-invalid:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]',
    'data-[state=checked]:bg-accent-solid data-[state=checked]:shadow-none data-[state=indeterminate]:bg-accent-solid data-[state=indeterminate]:shadow-none',
    'data-[state=checked]:focus-visible:shadow-focus data-[state=indeterminate]:focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
    'disabled:data-[state=checked]:bg-disabled-fill disabled:data-[state=indeterminate]:bg-disabled-fill',
  ],
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: { solid: '', soft: '', outline: '', ghost: '' },
      size: { xs: 'size-3.5', sm: 'size-4', md: '', lg: 'size-5' },
    },
    compoundVariants: [
      { tone: 'neutral', variant: 'solid', class: 'text-neutral-on data-[state=checked]:bg-neutral-solid data-[state=indeterminate]:bg-neutral-solid' },
      { tone: 'success', variant: 'solid', class: 'text-success-on data-[state=checked]:bg-success-solid data-[state=indeterminate]:bg-success-solid' },
      { tone: 'warning', variant: 'solid', class: 'text-warning-on data-[state=checked]:bg-warning-solid data-[state=indeterminate]:bg-warning-solid' },
      { tone: 'danger', variant: 'solid', class: 'text-danger-on data-[state=checked]:bg-danger-solid data-[state=indeterminate]:bg-danger-solid' },
      { tone: 'info', variant: 'solid', class: 'text-info-on data-[state=checked]:bg-info-solid data-[state=indeterminate]:bg-info-solid' },
      { tone: 'agent', variant: 'solid', class: 'text-agent-on data-[state=checked]:bg-agent-solid data-[state=indeterminate]:bg-agent-solid' },
      { tone: 'neutral', variant: 'soft', class: 'text-neutral-text data-[state=checked]:bg-neutral-soft data-[state=indeterminate]:bg-neutral-soft' },
      { tone: 'accent', variant: 'soft', class: 'text-accent-text data-[state=checked]:bg-accent-soft data-[state=indeterminate]:bg-accent-soft' },
      { tone: 'success', variant: 'soft', class: 'text-success-text data-[state=checked]:bg-success-soft data-[state=indeterminate]:bg-success-soft' },
      { tone: 'warning', variant: 'soft', class: 'text-warning-text data-[state=checked]:bg-warning-soft data-[state=indeterminate]:bg-warning-soft' },
      { tone: 'danger', variant: 'soft', class: 'text-danger-text data-[state=checked]:bg-danger-soft data-[state=indeterminate]:bg-danger-soft' },
      { tone: 'info', variant: 'soft', class: 'text-info-text data-[state=checked]:bg-info-soft data-[state=indeterminate]:bg-info-soft' },
      { tone: 'agent', variant: 'soft', class: 'text-agent-text data-[state=checked]:bg-agent-soft data-[state=indeterminate]:bg-agent-soft' },
      { tone: 'neutral', variant: 'outline', class: 'text-neutral-text data-[state=checked]:bg-surface-base data-[state=indeterminate]:bg-surface-base data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-neutral-border-strong)] data-[state=indeterminate]:shadow-[inset_0_0_0_1.5px_var(--cs-color-neutral-border-strong)]' },
      { tone: 'accent', variant: 'outline', class: 'text-accent-text data-[state=checked]:bg-surface-base data-[state=indeterminate]:bg-surface-base data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-border-strong)] data-[state=indeterminate]:shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-border-strong)]' },
      { tone: 'success', variant: 'outline', class: 'text-success-text data-[state=checked]:bg-surface-base data-[state=indeterminate]:bg-surface-base data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-success-border-strong)] data-[state=indeterminate]:shadow-[inset_0_0_0_1.5px_var(--cs-color-success-border-strong)]' },
      { tone: 'warning', variant: 'outline', class: 'text-warning-text data-[state=checked]:bg-surface-base data-[state=indeterminate]:bg-surface-base data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-warning-border-strong)] data-[state=indeterminate]:shadow-[inset_0_0_0_1.5px_var(--cs-color-warning-border-strong)]' },
      { tone: 'danger', variant: 'outline', class: 'text-danger-text data-[state=checked]:bg-surface-base data-[state=indeterminate]:bg-surface-base data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-border-strong)] data-[state=indeterminate]:shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-border-strong)]' },
      { tone: 'info', variant: 'outline', class: 'text-info-text data-[state=checked]:bg-surface-base data-[state=indeterminate]:bg-surface-base data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-info-border-strong)] data-[state=indeterminate]:shadow-[inset_0_0_0_1.5px_var(--cs-color-info-border-strong)]' },
      { tone: 'agent', variant: 'outline', class: 'text-agent-text data-[state=checked]:bg-surface-base data-[state=indeterminate]:bg-surface-base data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--cs-color-agent-border-strong)] data-[state=indeterminate]:shadow-[inset_0_0_0_1.5px_var(--cs-color-agent-border-strong)]' },
      { tone: 'neutral', variant: 'ghost', class: 'text-neutral-text data-[state=checked]:bg-transparent data-[state=indeterminate]:bg-transparent' },
      { tone: 'accent', variant: 'ghost', class: 'text-accent-text data-[state=checked]:bg-transparent data-[state=indeterminate]:bg-transparent' },
      { tone: 'success', variant: 'ghost', class: 'text-success-text data-[state=checked]:bg-transparent data-[state=indeterminate]:bg-transparent' },
      { tone: 'warning', variant: 'ghost', class: 'text-warning-text data-[state=checked]:bg-transparent data-[state=indeterminate]:bg-transparent' },
      { tone: 'danger', variant: 'ghost', class: 'text-danger-text data-[state=checked]:bg-transparent data-[state=indeterminate]:bg-transparent' },
      { tone: 'info', variant: 'ghost', class: 'text-info-text data-[state=checked]:bg-transparent data-[state=indeterminate]:bg-transparent' },
      { tone: 'agent', variant: 'ghost', class: 'text-agent-text data-[state=checked]:bg-transparent data-[state=indeterminate]:bg-transparent' },
    ],
    defaultVariants: { tone: 'accent', variant: 'solid', size: 'lg' },
  },
);

/** Explicit radius and elevation of the box, applied after it so an explicit value wins. */
export const checkboxShapeVariants = cva('', {
  variants: {
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: '', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { 'none': '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'sm', shadow: 'none' },
});

/** The check mark (or the mixed dash) centered in the box; it steps with the box size. */
export const checkboxMarkVariants = cva('stroke-3', {
  variants: { size: { xs: 'size-2.5', sm: 'size-icon-xs', md: 'size-icon-sm', lg: 'size-icon-md' } },
  defaultVariants: { size: 'lg' },
});
