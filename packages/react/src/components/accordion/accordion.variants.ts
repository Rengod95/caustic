import { cva, type VariantProps } from 'class-variance-authority';

// Five common props (lib/common-props.ts). Each axis' default is the accordion's own look and adds no class, so an
// unset prop renders exactly as before. flush and separated are the accordion's own variants; solid, soft, outline and
// ghost turn every item into a card (separated geometry) in that emphasis and the tone.

export const accordionVariants = cva('grid w-full', {
  variants: {
    variant: { flush: '', separated: 'gap-2', solid: 'gap-2', soft: 'gap-2', outline: 'gap-2', ghost: 'gap-2' },
  },
  defaultVariants: { variant: 'flush' },
});

/** One item. Tone, radius and shadow land here (the root is a bare grid). */
export const accordionItemVariants = cva('transition-control', {
  variants: {
    variant: {
      flush: 'border-b border-border-subtle',
      separated: 'rounded-xl bg-surface-base shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)] data-[state=open]:shadow-[0_0_0_1px_var(--cs-color-border-default)]',
      solid: 'rounded-xl [&_[data-slot=accordion-trigger]]:text-current [&_[data-slot=accordion-content]]:text-current [&_[data-slot=accordion-icon]]:text-current [&_[data-slot=accordion-chevron]]:text-current',
      soft: 'rounded-xl',
      outline: 'rounded-xl',
      ghost: 'rounded-xl',
    },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
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
    { variant: 'ghost', tone: 'neutral', className: 'bg-transparent text-text-primary shadow-none' },
    { variant: 'ghost', tone: 'accent', className: 'bg-transparent text-accent-text shadow-none' },
    { variant: 'ghost', tone: 'success', className: 'bg-transparent text-success-text shadow-none' },
    { variant: 'ghost', tone: 'warning', className: 'bg-transparent text-warning-text shadow-none' },
    { variant: 'ghost', tone: 'danger', className: 'bg-transparent text-danger-text shadow-none' },
    { variant: 'ghost', tone: 'info', className: 'bg-transparent text-info-text shadow-none' },
    { variant: 'ghost', tone: 'agent', className: 'bg-transparent text-agent-text shadow-none' },
  ],
  defaultVariants: { variant: 'flush', tone: 'neutral', radius: 'xl', shadow: 'none' },
});

/** Header row; size steps its height and type. Hover fills the row (md radius) with neutral.hover and lifts the chevron to
 *  secondary (neutral tone only; a tone keeps its graphic chevron), so the 48px row reads as clickable; the solid card keeps
 *  its ink fill. On a card (separated, solid, soft, outline, ghost) the card's inline inset lives on the trigger and the
 *  content instead of the item, so the hover fill runs edge to edge across the card (round 4): a 1px transparent border plus
 *  14px padding (= the 15px card inset) whose padding-box clip keeps the fill inside the card's 1px edge (hairline or tone
 *  outline) with the concentric inner corner; the corners are inherited from the item through the header, which squares
 *  its bottom corners while the item is open (the trigger also drops its bottom border then, so the fill meets the content). */
export const accordionTriggerVariants = cva(
  [
    'group flex w-full cursor-pointer items-center gap-2.5 rounded-md px-0.5 py-1 text-start font-ui text-text-primary',
    'outline-none focus-visible:rounded-md focus-visible:shadow-focus disabled:pointer-events-none disabled:text-disabled-text transition-control',
  ],
  {
    variants: {
      size: { xs: 'min-h-control-sm text-ui-sm', sm: 'min-h-control-md text-ui', md: 'min-h-control-xl text-ui-md', lg: 'min-h-control-xl py-2.5 text-ui-lg' },
      variant: {
        flush: 'hover:bg-neutral-hover',
        separated: 'rounded-[inherit] border border-transparent bg-clip-padding px-3.5 focus-visible:rounded-[inherit] data-[state=open]:border-b-0 hover:bg-neutral-hover',
        solid: 'rounded-[inherit] border border-transparent bg-clip-padding px-3.5 focus-visible:rounded-[inherit] data-[state=open]:border-b-0',
        soft: 'rounded-[inherit] border border-transparent bg-clip-padding px-3.5 focus-visible:rounded-[inherit] data-[state=open]:border-b-0 hover:bg-neutral-hover',
        outline: 'rounded-[inherit] border border-transparent bg-clip-padding px-3.5 focus-visible:rounded-[inherit] data-[state=open]:border-b-0 hover:bg-neutral-hover',
        ghost: 'rounded-[inherit] border border-transparent bg-clip-padding px-3.5 focus-visible:rounded-[inherit] data-[state=open]:border-b-0 hover:bg-neutral-hover',
      },
    },
    defaultVariants: { size: 'md', variant: 'flush' },
  },
);

/** Leading icon and trailing chevron: tertiary by default; a tone colours them with its graphic step. */
export const accordionGlyphVariants = cva('shrink-0 group-disabled:text-disabled-text', {
  variants: {
    tone: {
      neutral: 'text-text-tertiary', accent: 'text-accent-graphic', success: 'text-success-graphic', warning: 'text-warning-graphic',
      danger: 'text-danger-graphic', info: 'text-info-graphic', agent: 'text-agent-graphic',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

/** h3 header around the trigger: on a card it passes the item's corners down to the trigger, square at the bottom while
 *  the item is open (the content continues below). */
export const accordionHeaderVariants = cva('m-0', {
  variants: {
    variant: {
      flush: '', separated: 'rounded-[inherit] data-[state=open]:rounded-b-none', solid: 'rounded-[inherit] data-[state=open]:rounded-b-none',
      soft: 'rounded-[inherit] data-[state=open]:rounded-b-none', outline: 'rounded-[inherit] data-[state=open]:rounded-b-none',
      ghost: 'rounded-[inherit] data-[state=open]:rounded-b-none',
    },
  },
  defaultVariants: { variant: 'flush' },
});

/** Content (the Radix panel): it opens and closes with animate-collapse-open/close (height from the Radix measured
 *  variable, padding and opacity with it); Radix unmounts it when the close ends. On a card it carries the card's inline
 *  inset (moved off the item with the trigger's). */
export const accordionContentVariants = cva(['max-w-[64ch] px-0.5 pb-3.5 text-ui-relaxed text-text-secondary',
  'overflow-hidden data-[state=open]:animate-collapse-open data-[state=closed]:animate-collapse-close'], {
  variants: {
    variant: {
      flush: '', separated: 'px-inset-regular-x', solid: 'px-inset-regular-x', soft: 'px-inset-regular-x', outline: 'px-inset-regular-x',
      ghost: 'px-inset-regular-x',
    },
  },
  defaultVariants: { variant: 'flush' },
});

export type AccordionVariantProps = VariantProps<typeof accordionVariants>;
