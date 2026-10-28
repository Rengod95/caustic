import { cva } from 'class-variance-authority';

// Common props (lib/common-props.ts); each axis' default is the trail's own look and adds no class:
//   variant / tone  the current page: ghost = plain primary text (own); solid / soft / outline draw it as a chip in the tone.
//                   A tone also colours the separators (graphic step; neutral = neutral.graphic, own).
//   radius          the item and current-page corners (sm); shadow the current-page chip (flat).
//   size            type and padding: xs ui-xs · sm ui-sm · md ui (own) · lg ui-lg.
export const breadcrumbVariants = cva('flex flex-wrap items-center font-ui', {
  variants: { size: { xs: 'gap-0.5 text-ui-xs', sm: 'gap-1 text-ui-sm', md: 'gap-1 text-ui', lg: 'gap-1.5 text-ui-lg' } },
  defaultVariants: { size: 'md' },
});

/** Item and current-page padding by size (md = the own 3px 6px). */
const pad = { xs: 'px-1 py-0.5', sm: 'px-1.25 py-0.5', md: 'px-1.5 py-0.75', lg: 'px-2 py-1' } as const;

/** Item and current-page radius (sm is the own radius; it adds no class). */
const corner = {
  none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: '', md: 'rounded-md', lg: 'rounded-lg',
  xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
} as const;

// The ancestor just before the current page takes text.secondary (owner 2026-10-27, A): the likeliest step back stands out
// from the tertiary trail. Hover still lifts every item to primary.
export const breadcrumbItem = cva(
  'inline-flex items-center gap-1.5 rounded-sm text-text-tertiary no-underline outline-none transition-[background-color,color] duration-120 ease-out group-data-[parent=true]/crumb:not-hover:text-text-secondary hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus',
  { variants: { size: pad, radius: corner }, defaultVariants: { size: 'md', radius: 'sm' } },
);

export const breadcrumbIcon = cva('inline-flex size-icon-sm flex-none items-center justify-center [&_svg]:size-full');

export const breadcrumbSeparator = cva('inline-flex size-icon-sm flex-none items-center justify-center [&_svg]:size-full', {
  variants: {
    tone: {
      neutral: 'text-neutral-graphic', accent: 'text-accent-graphic', success: 'text-success-graphic', warning: 'text-warning-graphic',
      danger: 'text-danger-graphic', info: 'text-info-graphic', agent: 'text-agent-graphic',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export const breadcrumbCurrent = cva('rounded-sm font-medium text-text-primary', {
  variants: {
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    size: pad,
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: '', md: 'rounded-md', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-ink-solid text-ink-on' },
    { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on' },
    { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on' },
    { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft text-text-primary' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft text-success-text' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft text-info-text' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft text-agent-text' },
    { variant: 'outline', tone: 'neutral', className: 'bg-transparent text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'bg-transparent text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'bg-transparent text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'bg-transparent text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'bg-transparent text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'bg-transparent text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'bg-transparent text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'ghost', tone: 'accent', className: 'bg-transparent text-accent-text shadow-none' },
    { variant: 'ghost', tone: 'success', className: 'bg-transparent text-success-text shadow-none' },
    { variant: 'ghost', tone: 'warning', className: 'bg-transparent text-warning-text shadow-none' },
    { variant: 'ghost', tone: 'danger', className: 'bg-transparent text-danger-text shadow-none' },
    { variant: 'ghost', tone: 'info', className: 'bg-transparent text-info-text shadow-none' },
    { variant: 'ghost', tone: 'agent', className: 'bg-transparent text-agent-text shadow-none' },
  ],
  defaultVariants: { variant: 'ghost', tone: 'neutral', size: 'md', radius: 'sm', shadow: 'none' },
});
