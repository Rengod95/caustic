import { cva } from 'class-variance-authority';

// Five common props (lib/common-props.ts). Each axis' default is the chain's own look and adds no class.
// The emphasis lands on the resolved name: ghost (default) = the end node with a border.strong hairline; solid / soft /
// outline draw it as a small tag in
// the tone. tone also colours the arrows (graphic step). radius and shadow shape that tag; size steps the type, gap and arrows.

/** The chain: a wrapping line of linked mono nodes. The gap is small on purpose: each connector touches the nodes on both
 *  sides, so the names read as one linked path, not as words with arrows between them. */
export const aliasChainVariants = cva('m-0 flex list-none flex-wrap items-center p-0 font-mono font-normal text-text-secondary', {
  variants: {
    size: { xs: 'gap-0.5 font-mono text-mono-ruler', sm: 'gap-0.5 font-mono text-mono-sm', md: 'gap-0.5 font-mono text-mono-md', lg: 'gap-1 font-mono text-mono' },
  },
  defaultVariants: { size: 'md' },
});

/** A name on the way plus the connector after it (the connector lives inside the li: an ol holds only list items). */
export const aliasChainItemVariants = cva('inline-flex items-center', {
  variants: { size: { xs: 'gap-0.5', sm: 'gap-0.5', md: 'gap-0.5', lg: 'gap-1' } },
  defaultVariants: { size: 'md' },
});

/** A node on the way: the name in a small hairline box (border.default, xs radius), secondary text. */
export const aliasChainNameVariants = cva('rounded-xs px-1 text-text-secondary shadow-[inset_0_0_0_0.5px_var(--cs-color-border-default)]');

/** Connector: a long arrow (shaft + head, 1.5px stroke at every size) whose shaft runs edge to edge, from node to node;
 *  secondary by default, a tone colours it with the graphic step. */
export const aliasChainArrowVariants = cva('inline-flex flex-none items-center justify-center [&_svg]:h-full [&_svg]:w-full', {
  variants: {
    tone: {
      neutral: 'text-text-secondary', accent: 'text-accent-graphic', success: 'text-success-graphic', warning: 'text-warning-graphic',
      danger: 'text-danger-graphic', info: 'text-info-graphic', agent: 'text-agent-graphic',
    },
    size: { xs: 'h-icon-xs w-icon-sm', sm: 'h-icon-xs w-icon-md', md: 'h-icon-xs w-icon-md', lg: 'h-icon-sm w-icon-lg' },
  },
  defaultVariants: { tone: 'neutral', size: 'md' },
});

/** The name the chain resolves to: the end node, primary text, medium weight. ghost (default) = a border.strong hairline
 *  box, one step stronger than the nodes on the way; solid / soft / outline = a tag in the tone. */
export const aliasChainResolvedVariants = cva('rounded-xs px-1 font-medium text-text-primary', {
  variants: {
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: '', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
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
    { variant: 'outline', tone: 'neutral', className: 'bg-transparent text-text-primary shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'bg-transparent text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'bg-transparent text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'bg-transparent text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'bg-transparent text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'bg-transparent text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'bg-transparent text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'ghost', tone: 'neutral', className: 'shadow-[inset_0_0_0_0.5px_var(--cs-color-border-strong)]' },
    { variant: 'ghost', tone: 'accent', className: 'bg-transparent text-accent-text shadow-[inset_0_0_0_0.5px_var(--cs-color-border-strong)]' },
    { variant: 'ghost', tone: 'success', className: 'bg-transparent text-success-text shadow-[inset_0_0_0_0.5px_var(--cs-color-border-strong)]' },
    { variant: 'ghost', tone: 'warning', className: 'bg-transparent text-warning-text shadow-[inset_0_0_0_0.5px_var(--cs-color-border-strong)]' },
    { variant: 'ghost', tone: 'danger', className: 'bg-transparent text-danger-text shadow-[inset_0_0_0_0.5px_var(--cs-color-border-strong)]' },
    { variant: 'ghost', tone: 'info', className: 'bg-transparent text-info-text shadow-[inset_0_0_0_0.5px_var(--cs-color-border-strong)]' },
    { variant: 'ghost', tone: 'agent', className: 'bg-transparent text-agent-text shadow-[inset_0_0_0_0.5px_var(--cs-color-border-strong)]' },
  ],
  defaultVariants: { variant: 'ghost', tone: 'neutral', radius: 'xs', shadow: 'none' },
});
