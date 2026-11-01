import { cva } from 'class-variance-authority';

// Disabled is a colour, not opacity: the fields and buttons draw their own disabled colours; the quiet labels take disabled text.
export const gridTracksVariants = cva('group/grid-tracks grid gap-3 font-ui');

/** Common radius / shadow (lib/common-props) of the root; unset keeps the frameless stack. */
export const gridTracksFrameVariants = cva('', {
  variants: {
    // Common radius / shadow (lib/common-props): the default key is the component's own look (no class).
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'none', shadow: 'none' },
});

export const gridTracksHeading = cva('text-ui-xs font-semibold text-text-tertiary group-aria-disabled/grid-tracks:text-disabled-text');

/** One track row: as tall as the NumberField beside the switch (32px); lg rows are 40px. */
export const gridTracksRow = cva('animate-rise flex items-center gap-1.5', {
  variants: { size: { xs: 'h-control-md', sm: 'h-control-md', md: 'h-control-md', lg: 'h-control-lg' } },
  defaultVariants: { size: 'md' },
});

// Left-aligned in its 16px column (owner 2026-10-27: keep the numbers flush left, not centred), tabular so 1 and 10 share a start.
export const gridTracksIndex = cva('w-4 shrink-0 text-left font-mono text-mono-sm tabular-nums text-text-tertiary group-aria-disabled/grid-tracks:text-disabled-text');

// A 32px track (md) so the switch lines up with the NumberField beside it; item radius = track radius - 2px inset (P5).
// The three units share one column width (owner 2026-10-27): equal grid columns, at least the item minimum below, so
// fr, px and Auto are the same size and every row's switch lines up.
export const gridTracksUnit = cva('inline-grid shrink-0 grid-flow-col auto-cols-fr gap-px bg-neutral-track p-0.5', {
  variants: {
    size: {
      xs: 'h-control-xs rounded-sm',
      sm: 'h-control-sm rounded-md',
      md: 'h-control-md rounded-md',
      lg: 'h-control-lg rounded-lg',
    },
  },
  defaultVariants: { size: 'md' },
});

// The chosen unit is the raised segment thumb (control.raised + control.edge), never the selected inversion.
export const gridTracksUnitItem = cva(
  [
    'cursor-pointer whitespace-nowrap bg-transparent px-1.75 font-ui font-medium text-text-tertiary outline-none',
    'transition-control hover:text-text-primary focus-visible:shadow-focus',
    'aria-checked:bg-control-raised aria-checked:text-text-primary aria-checked:shadow-[inset_0_0_0_0.5px_var(--cs-color-control-edge),var(--cs-elevation-2)]',
    'aria-checked:focus-visible:shadow-[inset_0_0_0_0.5px_var(--cs-color-control-edge),var(--cs-elevation-2),var(--cs-focus)]',
    'disabled:pointer-events-none disabled:text-disabled-text disabled:aria-checked:text-disabled-text',
  ],
  {
    variants: {
      size: {
        xs: 'h-control-2xs min-w-7 rounded-2xs text-micro',
        sm: 'h-control-xs min-w-8 rounded-sm text-ui-xs',
        md: 'h-control-sm min-w-10 rounded-sm text-ui-xs',
        lg: 'h-control-md min-w-12 rounded-md px-2.5 text-ui-sm',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

/**
 * The add row. The variant is its emphasis and the tone its colour family (lib/common-props): outline neutral is the
 * dashed border.strong row (today); hued outline = border 6 dashes and the tone text, tint 2 on hover; soft = soft 3 fill;
 * solid = solid 9 fill (neutral: ink); ghost = no edge until hover.
 */
export const gridTracksAdd = cva(
  [
    // mt-2: 12px from the last track (the list gap is 4), so the add row reads as its own part (owner 2026-10-27).
    'mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-dashed px-3 font-ui outline-none',
    'transition-control focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:border-disabled-border disabled:bg-transparent disabled:text-disabled-text',
  ],
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: {
        solid: 'border-transparent bg-ink-solid text-ink-on hover:bg-ink-solid-hover',
        soft: 'border-transparent bg-neutral-soft text-text-primary hover:bg-neutral-soft-hover active:bg-neutral-soft-pressed',
        outline: 'border-border-strong bg-transparent text-text-secondary hover:bg-neutral-hover hover:text-text-primary',
        ghost: 'border-transparent bg-transparent text-text-secondary hover:bg-neutral-hover hover:text-text-primary',
      },
      size: {
        xs: 'h-control-sm text-ui-xs [&_svg]:size-icon-xs',
        sm: 'h-control-md text-ui-sm [&_svg]:size-icon-sm',
        md: 'h-add-row text-ui-dense [&_svg]:size-icon-sm',
        lg: 'h-control-xl text-ui-md [&_svg]:size-icon-md',
      },
    },
    compoundVariants: [
      // solid × tone
      { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on hover:bg-accent-solid-hover' },
      { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on hover:bg-success-solid-hover' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on hover:bg-warning-solid-hover' },
      { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on hover:bg-danger-solid-hover' },
      { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on hover:bg-info-solid-hover' },
      { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on hover:bg-agent-solid-hover' },
      // soft × tone
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text hover:bg-accent-soft-hover active:bg-accent-soft-pressed' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft text-success-text hover:bg-success-soft-hover active:bg-success-soft-pressed' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text hover:bg-warning-soft-hover active:bg-warning-soft-pressed' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text hover:bg-danger-soft-hover active:bg-danger-soft-pressed' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft text-info-text hover:bg-info-soft-hover active:bg-info-soft-pressed' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft text-agent-text hover:bg-agent-soft-hover active:bg-agent-soft-pressed' },
      // outline × tone
      { variant: 'outline', tone: 'accent', className: 'border-accent-border text-accent-text hover:bg-accent-tint hover:text-accent-text' },
      { variant: 'outline', tone: 'success', className: 'border-success-border text-success-text hover:bg-success-tint hover:text-success-text' },
      { variant: 'outline', tone: 'warning', className: 'border-warning-border text-warning-text hover:bg-warning-tint hover:text-warning-text' },
      { variant: 'outline', tone: 'danger', className: 'border-danger-border text-danger-text hover:bg-danger-tint hover:text-danger-text' },
      { variant: 'outline', tone: 'info', className: 'border-info-border text-info-text hover:bg-info-tint hover:text-info-text' },
      { variant: 'outline', tone: 'agent', className: 'border-agent-border text-agent-text hover:bg-agent-tint hover:text-agent-text' },
      // ghost × tone
      { variant: 'ghost', tone: 'accent', className: 'text-accent-text hover:bg-accent-tint hover:text-accent-text' },
      { variant: 'ghost', tone: 'success', className: 'text-success-text hover:bg-success-tint hover:text-success-text' },
      { variant: 'ghost', tone: 'warning', className: 'text-warning-text hover:bg-warning-tint hover:text-warning-text' },
      { variant: 'ghost', tone: 'danger', className: 'text-danger-text hover:bg-danger-tint hover:text-danger-text' },
      { variant: 'ghost', tone: 'info', className: 'text-info-text hover:bg-info-tint hover:text-info-text' },
      { variant: 'ghost', tone: 'agent', className: 'text-agent-text hover:bg-agent-tint hover:text-agent-text' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'outline', size: 'md' },
  },
);
