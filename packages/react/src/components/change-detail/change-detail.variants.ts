import { cva, type VariantProps } from 'class-variance-authority';

/** The list. tone, variant and size are set here and reach every item (tone: the row dividers and arrows; variant: the kind tags; size: type and row height). */
export const changeDetailVariants = cva('m-0 grid list-none p-0', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { soft: '', solid: '', outline: '', ghost: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  defaultVariants: { tone: 'neutral', variant: 'soft', size: 'md' },
});

/** Explicit radius and elevation of the list, applied after it so an explicit value wins. */
export const changeDetailShapeVariants = cva('', {
  variants: {
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { 'none': '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'none', shadow: 'none' },
});

/** One change: 1px divider above every row but the first (border.subtle, or the tone border slot). */
export const changeDetailItemVariants = cva('grid grid-cols-[auto_1fr] gap-1 border-t border-border-subtle first:border-t-0', {
  variants: {
    tone: { neutral: '', accent: 'border-accent-border', success: 'border-success-border', warning: 'border-warning-border', danger: 'border-danger-border', info: 'border-info-border', agent: 'border-agent-border' },
    size: { xs: 'py-1', sm: 'py-1.5', md: 'py-2', lg: 'py-2.5' },
  },
  defaultVariants: { tone: 'neutral', size: 'md' },
});

/** Change tag: soft status tint by kind (mod info, add success, del danger); variant changes its emphasis, never its tone.
 *  A 32px (space-8) minimum width, not a fixed one: MOD, ADD and DEL centre in the same column so every path starts on one
 *  line, and a longer label can still grow. */
export const changeDetailKindVariants = cva('mr-1 inline-grid min-w-8 place-items-center self-start rounded-xs px-1.5 text-micro', {
  variants: {
    kind: {
      mod: 'bg-info-soft text-info-text',
      add: 'bg-success-soft text-success-text',
      del: 'bg-danger-soft text-danger-text',
    },
    variant: { soft: '', solid: '', outline: '', ghost: '' },
    size: { xs: 'h-4', sm: 'h-4', md: 'h-control-compact-2xs', lg: 'h-control-compact-xs' },
  },
  compoundVariants: [
    { kind: 'mod', variant: 'solid', class: 'bg-info-solid text-info-on' },
    { kind: 'mod', variant: 'outline', class: 'bg-transparent text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { kind: 'mod', variant: 'ghost', class: 'bg-transparent text-info-text' },
    { kind: 'add', variant: 'solid', class: 'bg-success-solid text-success-on' },
    { kind: 'add', variant: 'outline', class: 'bg-transparent text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { kind: 'add', variant: 'ghost', class: 'bg-transparent text-success-text' },
    { kind: 'del', variant: 'solid', class: 'bg-danger-solid text-danger-on' },
    { kind: 'del', variant: 'outline', class: 'bg-transparent text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { kind: 'del', variant: 'ghost', class: 'bg-transparent text-danger-text' },
  ],
  defaultVariants: { kind: 'mod', variant: 'soft', size: 'md' },
});
export type ChangeDetailKindProps = VariantProps<typeof changeDetailKindVariants>;

/** Machine values are mono; size steps the mono role (xs mono-micro, sm mono-sm, md mono-md, lg mono-lg). */
export const changeDetailPathVariants = cva('font-normal text-text-primary', {
  variants: { size: { xs: 'font-mono text-mono-micro', sm: 'font-mono text-mono-sm', md: 'font-mono text-mono-md', lg: 'font-mono text-mono-lg' } },
  defaultVariants: { size: 'md' },
});
export const changeDetailValuesVariants = cva('col-start-2 flex flex-wrap items-center gap-1.5 font-normal', {
  variants: { size: { xs: 'font-mono text-mono-micro', sm: 'font-mono text-mono-sm', md: 'font-mono text-mono-md', lg: 'font-mono text-mono-lg' } },
  defaultVariants: { size: 'md' },
});
export const changeDetailFromVariants = cva('inline-flex items-center gap-1 rounded-xs bg-diff-remove-bg px-1.25 py-px text-diff-remove-text');
export const changeDetailToVariants = cva('inline-flex items-center gap-1 rounded-xs bg-diff-add-bg px-1.25 py-px text-diff-add-text no-underline');
export const changeDetailArrowVariants = cva('inline-flex size-icon-sm shrink-0 text-text-tertiary [&_svg]:size-full', {
  variants: { tone: { neutral: '', accent: 'text-accent-graphic', success: 'text-success-graphic', warning: 'text-warning-graphic', danger: 'text-danger-graphic', info: 'text-info-graphic', agent: 'text-agent-graphic' } },
  defaultVariants: { tone: 'neutral' },
});
export const changeDetailSwatchVariants = cva('size-2.5 shrink-0 rounded-xs bg-(--swatch) shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]');
