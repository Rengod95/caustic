import { cva } from 'class-variance-authority';

// Common props (lib/common-props.ts): radius, shadow and size on the root (size steps the stack gap; the fields keep
// their own control size); tone and variant on the raw-expression disclosure trigger, the part's one button.
export const expressionEditorVariants = cva('grid min-w-0 gap-3 font-ui', {
  variants: {
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'gap-2', sm: 'gap-2.5', md: '', lg: 'gap-4' },
  },
  defaultVariants: { radius: 'none', shadow: 'none', size: 'md' },
});

export const expressionEditorHintVariants = cva('text-hint text-text-tertiary');

/**
 * One reference: a neutral.well block (12px padding, lg radius) so several references read apart (owner 2026-10-27, A);
 * no hairline. Inside, the field labels are the small secondary step and the select values primary (typography
 * hierarchy, owner memo): label < value.
 */
export const expressionEditorBindingVariants = cva('grid min-w-0 animate-rise gap-2 rounded-lg bg-neutral-well p-3');

/** The path is a neutral Badge (owner 2026-10-27, B + memo: a tag, as a badge): sm radius, mono, left-aligned. */
export const expressionEditorPathVariants = cva('justify-self-start font-mono');

// ghost (default) is today's quiet trigger: secondary text, neutral hover. The other variants follow the button emphasis.
export const expressionEditorToggleVariants = cva([
  'inline-flex h-control-sm w-fit cursor-pointer items-center gap-1 rounded-md px-2 text-left font-ui text-ui-sm text-text-secondary outline-none',
  'transition-control focus-visible:shadow-focus',
  'disabled:pointer-events-none disabled:text-disabled-text',
], {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    // The neutral hover lives on the quiet variants only, so a solid trigger never hovers out of its emphasis.
    variant: { solid: '', soft: '', outline: 'hover:bg-neutral-hover hover:text-text-primary', ghost: 'hover:bg-neutral-hover hover:text-text-primary' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-ink-solid text-ink-on hover:bg-ink-solid-hover hover:text-ink-on disabled:bg-disabled-fill' },
    { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on hover:bg-accent-solid-hover hover:text-accent-on disabled:bg-disabled-fill' },
    { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on hover:bg-success-solid-hover hover:text-success-on disabled:bg-disabled-fill' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on hover:bg-warning-solid-hover hover:text-warning-on disabled:bg-disabled-fill' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on hover:bg-danger-solid-hover hover:text-danger-on disabled:bg-disabled-fill' },
    { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on hover:bg-info-solid-hover hover:text-info-on disabled:bg-disabled-fill' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on hover:bg-agent-solid-hover hover:text-agent-on disabled:bg-disabled-fill' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-track text-text-primary hover:bg-neutral-hover disabled:bg-disabled-fill' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text hover:bg-accent-soft-hover hover:text-accent-text disabled:bg-disabled-fill' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft text-success-text hover:bg-success-soft-hover hover:text-success-text disabled:bg-disabled-fill' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text hover:bg-warning-soft-hover hover:text-warning-text disabled:bg-disabled-fill' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text hover:bg-danger-soft-hover hover:text-danger-text disabled:bg-disabled-fill' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft text-info-text hover:bg-info-soft-hover hover:text-info-text disabled:bg-disabled-fill' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft text-agent-text hover:bg-agent-soft-hover hover:text-agent-text disabled:bg-disabled-fill' },
    { variant: 'outline', tone: 'neutral', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)] disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]' },
    { variant: 'outline', tone: 'accent', className: 'text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] hover:bg-accent-tint hover:text-accent-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]' },
    { variant: 'outline', tone: 'success', className: 'text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] hover:bg-success-tint hover:text-success-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]' },
    { variant: 'outline', tone: 'warning', className: 'text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] hover:bg-warning-tint hover:text-warning-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]' },
    { variant: 'outline', tone: 'danger', className: 'text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] hover:bg-danger-tint hover:text-danger-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]' },
    { variant: 'outline', tone: 'info', className: 'text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] hover:bg-info-tint hover:text-info-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]' },
    { variant: 'outline', tone: 'agent', className: 'text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] hover:bg-agent-tint hover:text-agent-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]' },
    { variant: 'ghost', tone: 'accent', className: 'text-accent-text hover:bg-accent-tint hover:text-accent-text' },
    { variant: 'ghost', tone: 'success', className: 'text-success-text hover:bg-success-tint hover:text-success-text' },
    { variant: 'ghost', tone: 'warning', className: 'text-warning-text hover:bg-warning-tint hover:text-warning-text' },
    { variant: 'ghost', tone: 'danger', className: 'text-danger-text hover:bg-danger-tint hover:text-danger-text' },
    { variant: 'ghost', tone: 'info', className: 'text-info-text hover:bg-info-tint hover:text-info-text' },
    { variant: 'ghost', tone: 'agent', className: 'text-agent-text hover:bg-agent-tint hover:text-agent-text' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'ghost' },
});

export const expressionEditorChevronVariants = cva('size-icon-sm shrink-0 transition-[rotate] duration-base ease-out', {
  variants: { open: { true: 'rotate-90', false: '' } },
  defaultVariants: { open: false },
});

export const expressionEditorErrorVariants = cva('inline-flex animate-rise items-center gap-1.25 text-hint text-danger-text');

/** The raw panel's inner box: the 6px lead above the textarea (inside the reveal clip, so it opens with the panel). */
export const expressionEditorPanelVariants = cva('mt-1.5 grid gap-1.5');
