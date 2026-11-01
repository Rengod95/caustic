import { cva } from 'class-variance-authority';

// Five common props (lib/common-props.ts). Each axis' default is the tree's own look and adds no class.
// variant boxes the tree (ghost = bare, the default; solid = opaque tone soft, soft = tone tint, outline = tone edge);
// tone colours the box and the call glyphs; size steps the row height and type.
export const activityTreeVariants = cva('grid gap-3.5', {
  variants: {
    variant: { solid: 'rounded-xl p-3', soft: 'rounded-xl p-3', outline: 'rounded-xl p-3', ghost: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-surface-base' },
    { variant: 'solid', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'solid', tone: 'success', className: 'bg-success-soft' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'solid', tone: 'info', className: 'bg-info-soft' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-soft' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-tint' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-tint' },
    { variant: 'soft', tone: 'success', className: 'bg-success-tint' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-tint' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-tint' },
    { variant: 'soft', tone: 'info', className: 'bg-info-tint' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-tint' },
    { variant: 'outline', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
  ],
  defaultVariants: { variant: 'ghost', tone: 'neutral', radius: 'xl', shadow: 'none' },
});


/** List rows: glyph column, text, auto meta column. rise: a row that appears after the first paint rises in (see ActivityTree). */
export const activityStepVariants = cva('grid grid-cols-[var(--cs-size-check)_1fr_auto] items-center gap-2 text-text-primary', {
  variants: {
    rise: { true: 'animate-rise', false: '' },
    size: { xs: 'min-h-6 text-ui-xs', sm: 'min-h-6 text-ui-sm', md: 'min-h-7 text-ui-dense', lg: 'min-h-8 text-ui' },
  },
  defaultVariants: { rise: true, size: 'md' },
});
export const activityCallVariants = cva('grid grid-cols-[var(--cs-size-check)_1fr_auto] items-center gap-2 pl-check text-text-secondary', {
  variants: {
    rise: { true: 'animate-rise', false: '' },
    size: { xs: 'min-h-6 text-ui-xs', sm: 'min-h-6 text-ui-sm', md: 'min-h-7 text-ui-dense', lg: 'min-h-8 text-ui' },
  },
  defaultVariants: { rise: true, size: 'md' },
});
/** Step label: a finished step steps back to secondary, the running one stays primary in medium weight (owner B). */
export const activityLabelVariants = cva('', {
  variants: { status: { done: 'text-text-secondary', active: 'font-medium text-text-primary', failed: 'text-danger-text', pending: 'text-text-tertiary', skipped: 'text-text-tertiary line-through' } },
  defaultVariants: { status: 'done' },
});

export const activityStepGlyphVariants = cva('grid size-icon-md animate-pop place-items-center [&_svg]:size-icon-sm', {
  variants: { state: { done: 'text-success-text', failed: 'text-danger-text', quiet: 'text-text-tertiary' } },
  defaultVariants: { state: 'done' },
});
/** A collapsible step's label: a bare button in the label column with a trailing chevron that turns when the step is open. */
export const activityToggleVariants = cva('inline-flex min-w-0 cursor-pointer items-center gap-1 justify-self-start rounded-sm text-start outline-none focus-visible:shadow-focus');
export const activityChevronVariants = cva('size-icon-sm shrink-0 text-text-tertiary transition-control', {
  variants: { open: { true: '', false: '-rotate-90' } },
  defaultVariants: { open: true },
});
/** Call glyph: secondary, the tone graphic when a tone is set, danger when the call failed. */
export const activityCallGlyphVariants = cva('grid size-icon-md place-items-center [&_svg]:size-icon-sm', {
  variants: {
    tone: {
      neutral: 'text-text-secondary', accent: 'text-accent-graphic', success: 'text-success-graphic', warning: 'text-warning-graphic',
      danger: 'text-danger-graphic', info: 'text-info-graphic', agent: 'text-agent-graphic',
    },
    failed: { true: 'text-danger-text', false: '' },
  },
  defaultVariants: { tone: 'neutral', failed: false },
});

export const activityOrbVariants = cva('mx-0.5 orb orb-sm');
export const activityWorkerOrbVariants = cva('orb orb-dot animate-none');
