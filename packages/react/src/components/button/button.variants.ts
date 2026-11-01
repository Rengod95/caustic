import { cva, type VariantProps } from 'class-variance-authority';

// Common props (lib/common-props.ts): tone is the colour family, variant the emphasis. Hover and press stay inside the
// emphasis (§2): solid 9 → 10 → 10 + a 1px text-11 edge, soft 3 → 4 → 5, outline / ghost tint 2 → soft 3. The legacy
// tones map onto the pair (button.tsx): ink = neutral solid, accent = accent solid, secondary = neutral outline,
// ghost = neutral ghost, danger = danger soft, destructive = danger solid, agent = agent solid.
export const buttonVariants = cva(
  [
    'relative inline-flex items-center justify-center whitespace-nowrap select-none',
    'font-ui transition-control press',
    'outline-none focus-visible:shadow-focus',
    // Disabled is a colour (disabled axis), not opacity: the tone drops out.
    'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-none',
    'aria-disabled:pointer-events-none aria-disabled:bg-disabled-fill aria-disabled:text-disabled-text aria-disabled:shadow-none',
    '[&_svg]:shrink-0',
  ],
  {
    variants: {
      // The pressed shadow keeps the drop shadow and, while held from the keyboard, the focus ring.
      tone: {
        neutral: '', accent: '', success: '', warning: '', danger: '', info: '',
        agent: 'agent-rim disabled:after:hidden aria-disabled:after:hidden',
      },
      variant: { solid: '', soft: '', outline: '', ghost: '' },
      // Opt-in: the height of the Input of the same size name (xs 32, sm 36, md 40, lg 44) for a button beside a field.
      fieldHeight: { true: '', false: '' },
      size: {
        xs: 'h-control-xs gap-1 px-2 text-ui-sm rounded-md [&_svg]:size-icon-sm',
        sm: 'h-control-sm gap-1.5 px-2.5 text-ui-strong rounded-lg [&_svg]:size-icon-md',
        md: 'h-control-md gap-1.5 px-3 text-ui-strong rounded-lg [&_svg]:size-icon-md',
        lg: 'h-control-lg gap-1.5 px-4 text-ui-lg rounded-xl [&_svg]:size-icon-md',
      },
    },
    compoundVariants: [
      { fieldHeight: true, size: 'xs', className: 'h-control-md' },
      { fieldHeight: true, size: 'sm', className: 'h-field-sm' },
      { fieldHeight: true, size: 'md', className: 'h-field-md' },
      { fieldHeight: true, size: 'lg', className: 'h-field-lg' },
      // solid: 9 → hover 10 → pressed 10 + a 1px text-11 edge; elevation 1 (neutral = ink: the control edge, no elevation)
      { variant: 'solid', tone: 'neutral', className: 'bg-ink-solid text-ink-on shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)] hover:bg-ink-solid-hover active:bg-ink-solid-hover' },
      { variant: 'solid', tone: 'accent', className: ['bg-accent-solid text-accent-on shadow-1 hover:bg-accent-solid-hover', 'active:bg-accent-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-accent-text),var(--cs-elevation-1)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-accent-text),var(--cs-focus)]'] },
      { variant: 'solid', tone: 'success', className: ['bg-success-solid text-success-on shadow-1 hover:bg-success-solid-hover', 'active:bg-success-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-success-text),var(--cs-elevation-1)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-success-text),var(--cs-focus)]'] },
      { variant: 'solid', tone: 'warning', className: ['bg-warning-solid text-warning-on shadow-1 hover:bg-warning-solid-hover', 'active:bg-warning-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-warning-text),var(--cs-elevation-1)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-warning-text),var(--cs-focus)]'] },
      { variant: 'solid', tone: 'danger', className: ['bg-danger-solid text-danger-on shadow-1 hover:bg-danger-solid-hover', 'active:bg-danger-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-danger-text),var(--cs-elevation-1)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-text),var(--cs-focus)]'] },
      { variant: 'solid', tone: 'info', className: ['bg-info-solid text-info-on shadow-1 hover:bg-info-solid-hover', 'active:bg-info-solid-hover active:shadow-[inset_0_0_0_1px_var(--cs-color-info-text),var(--cs-elevation-1)] active:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-info-text),var(--cs-focus)]'] },
      // agent solid is the own agent button: the spectrum rim (tone axis) on surface.base, elevation 2.
      { variant: 'solid', tone: 'agent', className: 'bg-surface-base text-text-primary shadow-2' },
      // soft: 3 → hover 4 → pressed 5
      { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft text-text-primary hover:bg-neutral-soft-hover active:bg-neutral-soft-pressed' },
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text hover:bg-accent-soft-hover active:bg-accent-soft-pressed' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft text-success-text hover:bg-success-soft-hover active:bg-success-soft-pressed' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text hover:bg-warning-soft-hover active:bg-warning-soft-pressed' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text hover:bg-danger-soft-hover active:bg-danger-soft-pressed' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft text-info-text hover:bg-info-soft-hover active:bg-info-soft-pressed' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft text-agent-text hover:bg-agent-soft-hover active:bg-agent-soft-pressed' },
      // outline: neutral = the raised secondary button (control.raised + control edge); a tone = no fill and its border 6, hover tint 2 + border-strong 7, pressed soft 3
      // Hover also steps the edge to border.strong (owner 2026-10-27, B): the fill change alone is faint in the light theme.
      { variant: 'outline', tone: 'neutral', className: 'bg-control-raised text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)] hover:bg-control-raised-hover hover:shadow-[inset_0_0_0_1px_var(--cs-color-border-strong)]' },
      { variant: 'outline', tone: 'accent', className: 'bg-transparent text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] hover:bg-accent-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)] active:bg-accent-soft disabled:bg-transparent aria-disabled:bg-transparent' },
      { variant: 'outline', tone: 'success', className: 'bg-transparent text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] hover:bg-success-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong)] active:bg-success-soft disabled:bg-transparent aria-disabled:bg-transparent' },
      { variant: 'outline', tone: 'warning', className: 'bg-transparent text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] hover:bg-warning-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)] active:bg-warning-soft disabled:bg-transparent aria-disabled:bg-transparent' },
      { variant: 'outline', tone: 'danger', className: 'bg-transparent text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] hover:bg-danger-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] active:bg-danger-soft disabled:bg-transparent aria-disabled:bg-transparent' },
      { variant: 'outline', tone: 'info', className: 'bg-transparent text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] hover:bg-info-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong)] active:bg-info-soft disabled:bg-transparent aria-disabled:bg-transparent' },
      { variant: 'outline', tone: 'agent', className: 'bg-transparent text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] hover:bg-agent-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-agent-border-strong)] active:bg-agent-soft disabled:bg-transparent aria-disabled:bg-transparent' },
      // ghost: no fill until hover (neutral.hover / pressed; a tone: tint 2 → soft 3)
      { variant: 'ghost', tone: 'neutral', className: 'bg-transparent text-text-secondary hover:bg-neutral-hover hover:text-text-primary active:bg-neutral-pressed disabled:bg-transparent aria-disabled:bg-transparent' },
      { variant: 'ghost', tone: 'accent', className: 'bg-transparent text-accent-text hover:bg-accent-tint active:bg-accent-soft disabled:bg-transparent aria-disabled:bg-transparent' },
      { variant: 'ghost', tone: 'success', className: 'bg-transparent text-success-text hover:bg-success-tint active:bg-success-soft disabled:bg-transparent aria-disabled:bg-transparent' },
      { variant: 'ghost', tone: 'warning', className: 'bg-transparent text-warning-text hover:bg-warning-tint active:bg-warning-soft disabled:bg-transparent aria-disabled:bg-transparent' },
      { variant: 'ghost', tone: 'danger', className: 'bg-transparent text-danger-text hover:bg-danger-tint active:bg-danger-soft disabled:bg-transparent aria-disabled:bg-transparent' },
      { variant: 'ghost', tone: 'info', className: 'bg-transparent text-info-text hover:bg-info-tint active:bg-info-soft disabled:bg-transparent aria-disabled:bg-transparent' },
      { variant: 'ghost', tone: 'agent', className: 'bg-transparent text-agent-text hover:bg-agent-tint active:bg-agent-soft disabled:bg-transparent aria-disabled:bg-transparent' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'solid', size: 'md', fieldHeight: false },
  },
);

/** Common radius / shadow, applied after the button classes so an explicit value wins (the default key adds no class). */
export const buttonFrameVariants = cva('', {
  variants: {
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: '', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'md', shadow: 'none' },
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
