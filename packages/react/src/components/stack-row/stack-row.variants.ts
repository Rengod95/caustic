import { cva, type VariantProps } from 'class-variance-authority';

// Common props (owner 2026-10-26). variant is the row emphasis: ghost = no fill until hover (today); soft = the tone soft
// row; outline = a 1px tone border edge; solid = a raised control row with the control edge. tone colours the soft /
// outline row. radius / shadow shape the row (null when unset keeps md and flat). size steps the row height (field-
// compact sm / md / lg; control-md at xs) and the label type (md = 36px / ui-sm, today).
export const stackRowVariants = cva(
  'animate-rise transition-control group/stack-row grid grid-cols-[auto_1fr_auto_auto] items-center gap-1.5 rounded-md pl-1 pr-0.5 font-ui',
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: {
        solid: 'bg-control-raised shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)] hover:bg-control-raised-hover',
        soft: '',
        outline: 'hover:bg-neutral-hover',
        ghost: 'hover:bg-neutral-hover',
      },
      radius: {
        none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
        xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
      },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
      size: { xs: 'h-control-md', sm: 'h-field-compact-sm', md: 'h-field-compact-md', lg: 'h-field-compact-lg' },
    },
    compoundVariants: [
      { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft hover:bg-neutral-soft-hover' },
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft hover:bg-accent-soft-hover' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft hover:bg-success-soft-hover' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft hover:bg-warning-soft-hover' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft hover:bg-danger-soft-hover' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft hover:bg-info-soft-hover' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft hover:bg-agent-soft-hover' },
      { variant: 'outline', tone: 'neutral', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
      { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'ghost', radius: 'md', shadow: 'none', size: 'md' },
  },
);

// A hidden layer (data-state=hidden) takes the disabled colour (PROPOSAL A9): name, detail, meta and icon use
// disabled-text and the meta no longer brightens. The swatch is user paint (content), so it only steps back to 64 %.
export const stackRowLeadVariants = cva('inline-flex shrink-0 transition-control', {
  variants: {
    lead: {
      swatch: 'group-data-[state=hidden]/stack-row:opacity-64',
      icon: 'size-control-2xs place-items-center rounded-xs bg-neutral-track text-text-secondary [&_svg]:size-icon-sm [&_svg]:stroke-[1.75] group-data-[state=hidden]/stack-row:text-disabled-text',
    },
  },
  defaultVariants: { lead: 'swatch' },
});

export const stackRowLabelVariants = cva('transition-control flex min-w-0 items-baseline gap-1.5 overflow-hidden whitespace-nowrap font-normal text-text-primary group-data-[state=hidden]/stack-row:text-disabled-text', {
  variants: { size: { xs: 'text-ui-xs', sm: 'text-ui-sm', md: 'text-ui-sm', lg: 'text-ui-md' } },
  defaultVariants: { size: 'md' },
});

export const stackRowTitleVariants = cva('truncate font-normal text-text-primary group-data-[state=hidden]/stack-row:text-disabled-text', {
  variants: {
    mono: { true: 'font-mono text-mono-md', false: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { mono: false, size: 'xs', className: 'text-ui-xs' },
    { mono: false, size: ['sm', 'md'], className: 'text-ui-sm' },
    { mono: false, size: 'lg', className: 'text-ui-md' },
  ],
  defaultVariants: { mono: false, size: 'md' },
});

// Tabular figures so values like "24 px" do not shift from row to row (owner 2026-10-28, C).
export const stackRowMetaVariants = cva('shrink-0 text-hint tabular-nums text-text-tertiary group-data-[state=hidden]/stack-row:text-disabled-text');

// A hidden layer pins the actions (pinned: always visible), so it can be shown again. A touch screen has no hover, so on a
// coarse pointer the actions are always shown (owner 2026-10-28, B).
export const stackRowActionsVariants = cva('flex transition-opacity duration-quick ease-out', {
  variants: {
    actions: {
      hover: 'opacity-0 group-hover/stack-row:opacity-100 group-focus-within/stack-row:opacity-100 pointer-coarse:opacity-100',
      always: 'opacity-100',
    },
    // cn() in the component resolves the opacity conflict with the hover mode (last wins).
    pinned: { true: 'opacity-100', false: '' },
  },
  defaultVariants: { actions: 'hover', pinned: false },
});

export type StackRowVariantProps = VariantProps<typeof stackRowVariants>;
