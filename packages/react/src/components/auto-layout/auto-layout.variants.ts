import { cva } from 'class-variance-authority';

// Disabled is a colour, not opacity: every control draws its own disabled colours; the quiet labels take disabled text.
// Five common props (lib/common-props.ts); each axis' default is the block's own look and adds no class:
//   variant  ghost = the bare block (own); solid / soft / outline box it (12px padding): solid = an opaque surface
//            (surface.base, or the tone soft), soft = the tint, outline = a 1px tone border, no fill.
//   tone     the box colour family and the preview's dashed outline (accent = the own border-strong outline).
//   radius / shadow the box (xl, flat). size: the spacing between and inside the columns (md = the own 16 / 12).
export const autoLayoutVariants = cva('group/auto-layout grid grid-cols-[repeat(auto-fit,minmax(min(100%,var(--cs-size-popover-md)),1fr))] font-ui', {
  variants: {
    variant: { solid: 'rounded-xl p-3', soft: 'rounded-xl p-3', outline: 'rounded-xl p-3', ghost: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'gap-2', sm: 'gap-3', md: 'gap-4', lg: 'gap-5' },
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
    { variant: 'outline', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
  ],
  defaultVariants: { variant: 'ghost', tone: 'accent', radius: 'xl', shadow: 'none', size: 'md' },
});

/** The two columns: their stack gap follows the size (md = 12). */
export const autoLayoutColumn = cva('grid', {
  variants: { size: { xs: 'gap-1.5', sm: 'gap-2', md: 'gap-3', lg: 'gap-4' } },
  defaultVariants: { size: 'md' },
});

export const autoLayoutHeading = cva('text-ui-xs font-semibold text-text-tertiary group-aria-disabled/auto-layout:text-disabled-text');

export const autoLayoutRow = cva('flex items-center justify-between text-footnote text-text-primary group-aria-disabled/auto-layout:text-disabled-text');

// A live illustration: flow, alignment and gap come from the value (--gap is data). Disabled drops the accent tone:
// the dashed outline takes disabled-border; the items are neutral and keep their fill and edge.
export const autoLayoutPreview = cva(
  'relative flex h-layout-preview gap-(--gap) rounded-xl bg-bg-inset p-2.5 outline outline-1 outline-dashed -outline-offset-1 transition-all duration-gentle ease-spring group-aria-disabled/auto-layout:outline-disabled-border',
  {
    variants: {
      tone: {
        neutral: 'outline-neutral-border-strong', accent: 'outline-accent-border-strong', success: 'outline-success-border-strong',
        warning: 'outline-warning-border-strong', danger: 'outline-danger-border-strong', info: 'outline-info-border-strong', agent: 'outline-agent-border-strong',
      },
      flow: { row: 'flex-row', column: 'flex-col', grid: 'flex-row flex-wrap content-start', free: '' },
      justify: { start: 'justify-start', center: 'justify-center', end: 'justify-end', between: 'justify-between' },
      align: { start: 'items-start', center: 'items-center', end: 'items-end' },
    },
    defaultVariants: { tone: 'accent', flow: 'row', justify: 'start', align: 'center' },
  },
);

export const autoLayoutPreviewItem = cva(
  'w-toolbar-item flex-none rounded-sm bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] transition-all duration-gentle ease-spring',
  {
    variants: {
      // The three sample heights (not the common size axis).
      height: { a: 'h-control-inline', b: 'h-10', c: 'h-4.5' },
      free: { true: 'absolute top-(--y) left-(--x)', false: '' },
    },
    defaultVariants: { height: 'a', free: false },
  },
);
