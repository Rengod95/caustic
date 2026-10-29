import { cva } from 'class-variance-authority';

// The variant is the emphasis and the tone its colour family (lib/common-props). ghost neutral is the quiet default;
// solid neutral is the ink action (the deprecated tone="ink"): one depth cue, the control edge, and a 1.06 scale on hover.
// Pressed inverts in every tone and variant (selected utility: ink fill, paper icon, no edge); disabled drops the
// inversion and the tone (disabled is a colour, not opacity).
export const iconButtonVariants = cva(
  [
    'relative inline-grid shrink-0 place-items-center select-none font-ui',
    'transition-control',
    'outline-none focus-visible:shadow-focus',
    'aria-pressed:not-disabled:selected aria-pressed:not-disabled:shadow-none aria-pressed:not-disabled:hover:bg-selection-fill-hover aria-pressed:not-disabled:focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:text-disabled-text disabled:aria-pressed:bg-disabled-fill disabled:aria-pressed:text-disabled-text disabled:aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  ],
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: {
        solid: 'bg-ink-solid text-ink-on shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)] hover:scale-[1.06] disabled:bg-disabled-fill disabled:shadow-none',
        soft: 'bg-neutral-soft text-text-primary hover:bg-neutral-soft-hover active:bg-neutral-soft-pressed disabled:bg-disabled-fill',
        outline: 'bg-transparent text-text-secondary shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)] hover:bg-neutral-hover hover:text-text-primary disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
        ghost: 'bg-transparent text-text-secondary hover:bg-neutral-hover hover:text-text-primary',
      },
      size: {
        // xs is the minimum target (24px): an invisible ::after widens the hit area 2px on every side without moving the
        // layout (owner 2026-10-27, B), so a pointer that lands just outside a dense row's button still hits it.
        // Press: the small icon targets (24 and 28px) press to 0.94, the larger ones to 0.97.
        xs: 'size-control-xs rounded-sm press-sm after:absolute after:-inset-0.5 after:content-[""]',
        sm: 'size-control-sm rounded-md press-sm',
        md: 'size-control-md rounded-md press',
        lg: 'size-control-lg rounded-lg press',
      },
    },
    compoundVariants: [
      // Hued solid keeps the ink action's single depth cue as its own solid: solid 9 → hover solid-hover 10, no edge.
      // solid × tone
      { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on shadow-none hover:scale-100 hover:bg-accent-solid-hover' },
      { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on shadow-none hover:scale-100 hover:bg-success-solid-hover' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on shadow-none hover:scale-100 hover:bg-warning-solid-hover' },
      { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on shadow-none hover:scale-100 hover:bg-danger-solid-hover' },
      { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on shadow-none hover:scale-100 hover:bg-info-solid-hover' },
      { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on shadow-none hover:scale-100 hover:bg-agent-solid-hover' },
      // soft × tone
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text hover:bg-accent-soft-hover active:bg-accent-soft-pressed' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft text-success-text hover:bg-success-soft-hover active:bg-success-soft-pressed' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text hover:bg-warning-soft-hover active:bg-warning-soft-pressed' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text hover:bg-danger-soft-hover active:bg-danger-soft-pressed' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft text-info-text hover:bg-info-soft-hover active:bg-info-soft-pressed' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft text-agent-text hover:bg-agent-soft-hover active:bg-agent-soft-pressed' },
      // outline × tone
      { variant: 'outline', tone: 'accent', className: 'text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] hover:bg-accent-tint hover:text-accent-text active:bg-accent-soft' },
      { variant: 'outline', tone: 'success', className: 'text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] hover:bg-success-tint hover:text-success-text active:bg-success-soft' },
      { variant: 'outline', tone: 'warning', className: 'text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] hover:bg-warning-tint hover:text-warning-text active:bg-warning-soft' },
      { variant: 'outline', tone: 'danger', className: 'text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] hover:bg-danger-tint hover:text-danger-text active:bg-danger-soft' },
      { variant: 'outline', tone: 'info', className: 'text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] hover:bg-info-tint hover:text-info-text active:bg-info-soft' },
      { variant: 'outline', tone: 'agent', className: 'text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] hover:bg-agent-tint hover:text-agent-text active:bg-agent-soft' },
      // ghost × tone
      { variant: 'ghost', tone: 'accent', className: 'text-accent-text hover:bg-accent-tint hover:text-accent-text active:bg-accent-soft' },
      { variant: 'ghost', tone: 'success', className: 'text-success-text hover:bg-success-tint hover:text-success-text active:bg-success-soft' },
      { variant: 'ghost', tone: 'warning', className: 'text-warning-text hover:bg-warning-tint hover:text-warning-text active:bg-warning-soft' },
      { variant: 'ghost', tone: 'danger', className: 'text-danger-text hover:bg-danger-tint hover:text-danger-text active:bg-danger-soft' },
      { variant: 'ghost', tone: 'info', className: 'text-info-text hover:bg-info-tint hover:text-info-text active:bg-info-soft' },
      { variant: 'ghost', tone: 'agent', className: 'text-agent-text hover:bg-agent-tint hover:text-agent-text active:bg-agent-soft' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'ghost', size: 'md' },
  },
);

export const iconButtonIconVariants = cva('inline-grid place-items-center [&_svg]:size-full [&_svg]:stroke-[1.75]', {
  variants: {
    size: { xs: 'size-icon-sm', sm: 'size-icon-md', md: 'size-icon-md', lg: 'size-icon-lg' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
  },
  // The send arrow: solid at sm (the composer and textarea send button).
  compoundVariants: [{ variant: 'solid', size: 'sm', className: 'size-icon-send [&_svg]:stroke-[2.25]' }],
  defaultVariants: { size: 'md', variant: 'ghost' },
});

/** A toggle (pressed or defaultPressed set) in the ghost variant rests on a faint neutral.well, so the off state reads as
 *  a two-state control and not as a plain action (owner 2026-10-27, A; from icon-toggle). Hover still takes
 *  neutral.hover (or the tone tint), on still inverts (selected), disabled drops the well. */
export const iconButtonToggleVariants = cva('', {
  variants: { variant: { solid: '', soft: '', outline: '', ghost: 'bg-neutral-well disabled:bg-transparent' } },
  defaultVariants: { variant: 'ghost' },
});

/** Common radius / shadow (lib/common-props), applied after the button classes so an explicit value wins. */
export const iconButtonFrameVariants = cva('', {
  variants: {
    // Common radius / shadow (lib/common-props): the default key is the component's own look (no class).
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: '', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'md', shadow: 'none' },
});
