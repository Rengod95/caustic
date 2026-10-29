import { cva, type VariantProps } from 'class-variance-authority';

// Common props (lib/common-props.ts). tone is the colour family, variant the emphasis; each axis' default is the own look:
//   soft (default)  the tone's soft fill and text (neutral = neutral.track with secondary text; agent = the spectrum rim on surface.base)
//   solid           tone solid with on text (neutral = ink: the deprecated tone="solid")
//   outline         no fill, a 1px tone border (neutral = border.default with secondary text: the deprecated tone="outline")
//   ghost           no fill, no edge: the tone text alone
// radius replaces the deprecated shape (pill = full, the default; square = xs); shadow is flat by default; size steps the height.
// lead (the folded ContrastChip, round 2): with a lead badge the root takes the contrast chip shape: 4px start / 8px end
// padding, 6px gap, hint type at md and ui-sm at lg (Badge passes radius md unless one is given). Padding sits in compounds
// so the two forms never stack px with ps/pe.
export const badgeVariants = cva(
  'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full font-ui font-medium',
  {
    variants: {
      tone: {
        neutral: 'bg-neutral-track text-text-secondary',
        accent: 'bg-accent-soft text-accent-text',
        success: 'bg-success-soft text-success-text',
        warning: 'bg-warning-soft text-warning-text',
        danger: 'bg-danger-soft text-danger-text',
        info: 'bg-info-soft text-info-text',
        agent: 'agent-rim bg-surface-base text-text-primary',
      },
      variant: { solid: '', soft: '', outline: '', ghost: '' },
      radius: {
        none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
        xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: '',
      },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
      size: {
        xs: 'h-control-compact-2xs text-micro',
        sm: 'h-control-2xs text-hint',
        md: 'h-control-xs text-ui-sm',
        lg: 'h-control-sm text-ui',
      },
      lead: { false: '', true: 'gap-1.5 ps-1 pe-2' },
    },
    compoundVariants: [
      { lead: false, size: 'xs', className: 'px-1.5' },
      { lead: false, size: 'sm', className: 'px-1.75' },
      { lead: false, size: 'md', className: 'px-2' },
      { lead: false, size: 'lg', className: 'px-2.5' },
      { lead: true, size: 'md', className: 'text-hint' },
      { lead: true, size: 'lg', className: 'text-ui-sm' },
      { variant: 'solid', tone: 'neutral', className: 'bg-ink-solid text-ink-on' },
      { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on' },
      { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on' },
      { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on' },
      { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on' },
      { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on' },
      { variant: 'outline', tone: 'neutral', className: 'bg-transparent text-text-secondary shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]' },
      { variant: 'outline', tone: 'accent', className: 'bg-transparent text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { variant: 'outline', tone: 'success', className: 'bg-transparent text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { variant: 'outline', tone: 'warning', className: 'bg-transparent text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { variant: 'outline', tone: 'danger', className: 'bg-transparent text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { variant: 'outline', tone: 'info', className: 'bg-transparent text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { variant: 'outline', tone: 'agent', className: 'bg-transparent text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
      { variant: 'ghost', tone: 'neutral', className: 'bg-transparent text-text-secondary' },
      { variant: 'ghost', tone: 'accent', className: 'bg-transparent text-accent-text shadow-none' },
      { variant: 'ghost', tone: 'success', className: 'bg-transparent text-success-text shadow-none' },
      { variant: 'ghost', tone: 'warning', className: 'bg-transparent text-warning-text shadow-none' },
      { variant: 'ghost', tone: 'danger', className: 'bg-transparent text-danger-text shadow-none' },
      { variant: 'ghost', tone: 'info', className: 'bg-transparent text-info-text shadow-none' },
      { variant: 'ghost', tone: 'agent', className: 'bg-transparent text-agent-text shadow-none' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'soft', radius: 'full', shadow: 'none', size: 'sm', lead: false },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

/**
 * The leading status dot: the tone graphic step (the mark colour used everywhere else), not the text step. On a solid
 * badge it stays the on colour (currentColor), since the graphic would sink into the solid fill.
 */
export const badgeDotVariants = cva('size-1.5 shrink-0 rounded-full', {
  variants: {
    tone: {
      neutral: 'bg-neutral-graphic', accent: 'bg-accent-graphic', success: 'bg-success-graphic', warning: 'bg-warning-graphic',
      danger: 'bg-danger-graphic', info: 'bg-info-graphic', agent: 'bg-agent-graphic',
    },
    variant: { solid: 'bg-current', soft: '', outline: '', ghost: '' },
  },
  defaultVariants: { tone: 'neutral', variant: 'soft' },
});

/** The agent spectrum orb; rendered only for tone="agent". */
export const badgeOrbVariants = cva('', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: 'orb orb-dot' },
  },
  defaultVariants: { tone: 'neutral' },
});

/** Leading icon: 12px (14px at lg). In the mono form it is the token kind icon: 12px at every size, text.tertiary. */
export const badgeIconVariants = cva('inline-flex shrink-0 [&_svg]:size-full', {
  variants: {
    size: { xs: 'size-icon-xs', sm: 'size-icon-xs', md: 'size-icon-xs', lg: 'size-icon-sm' },
    mono: { false: '', true: 'text-text-tertiary' },
  },
  compoundVariants: [{ mono: true, size: 'lg', className: 'size-icon-xs' }],
  defaultVariants: { size: 'sm', mono: false },
});

/**
 * The mono form (the folded TokenChip, round 3): names a design token. The root is the token chip: md radius (Badge passes
 * radius md unless one is given), mono type, text.primary, 4px start / 8px end padding at md. tone sets the --tone-* slots:
 * neutral is the well with the border.default edge, every other tone its soft fill and border-strong edge (accent = the
 * bound token). variant: soft = fill + edge (default); outline = edge only; solid = tone.solid with tone.on text
 * (neutral.solid when neutral); ghost = text only.
 */
export const badgeMonoVariants = cva(
  'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md font-mono text-text-primary',
  {
    variants: {
      tone: {
        neutral: '[--tone-fill:var(--cs-color-neutral-well)] [--tone-edge:var(--cs-color-border-default)] [--tone-solid:var(--cs-color-neutral-solid)] [--tone-on:var(--cs-color-neutral-on)]',
        accent: '[--tone-fill:var(--cs-color-accent-soft)] [--tone-edge:var(--cs-color-accent-border-strong)] [--tone-solid:var(--cs-color-accent-solid)] [--tone-on:var(--cs-color-accent-on)]',
        success: '[--tone-fill:var(--cs-color-success-soft)] [--tone-edge:var(--cs-color-success-border-strong)] [--tone-solid:var(--cs-color-success-solid)] [--tone-on:var(--cs-color-success-on)]',
        warning: '[--tone-fill:var(--cs-color-warning-soft)] [--tone-edge:var(--cs-color-warning-border-strong)] [--tone-solid:var(--cs-color-warning-solid)] [--tone-on:var(--cs-color-warning-on)]',
        danger: '[--tone-fill:var(--cs-color-danger-soft)] [--tone-edge:var(--cs-color-danger-border-strong)] [--tone-solid:var(--cs-color-danger-solid)] [--tone-on:var(--cs-color-danger-on)]',
        info: '[--tone-fill:var(--cs-color-info-soft)] [--tone-edge:var(--cs-color-info-border-strong)] [--tone-solid:var(--cs-color-info-solid)] [--tone-on:var(--cs-color-info-on)]',
        agent: '[--tone-fill:var(--cs-color-agent-soft)] [--tone-edge:var(--cs-color-agent-border-strong)] [--tone-solid:var(--cs-color-agent-solid)] [--tone-on:var(--cs-color-agent-on)]',
      },
      variant: {
        soft: 'bg-(--tone-fill) shadow-[inset_0_0_0_1px_var(--tone-edge)]',
        outline: 'bg-transparent shadow-[inset_0_0_0_1px_var(--tone-edge)]',
        solid: 'bg-(--tone-solid) text-(--tone-on)',
        ghost: 'bg-transparent',
      },
      size: {
        xs: 'h-4.5 gap-1 pl-0.5 pr-1 font-mono text-mono-sm',
        sm: 'h-control-2xs pl-0.75 pr-1.5 text-mono-md',
        md: 'h-control-xs pl-1 pr-2 text-mono-md',
        lg: 'h-control-sm pl-1.25 pr-2.5 text-mono-md',
      },
      // md is the form's own corner (''); every other key sets that token.
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: '', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    },
    defaultVariants: { tone: 'neutral', variant: 'soft', radius: 'full', shadow: 'none', size: 'sm' },
  },
);

/** The colour swatch (from TokenChip): 12 / 14 / 16 / 16px, xs radius. The ring is border.default (owner 2026-10-28), not
 *  swatch.edge: white and paper swatches vanished on the neutral.well fill. The fill is --swatch, set by Badge. */
export const badgeSwatchVariants = cva(
  'inline-flex shrink-0 overflow-hidden rounded-xs bg-(--swatch) shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
  {
    variants: { size: { xs: 'size-icon-xs', sm: 'size-icon-sm', md: 'size-icon-md', lg: 'size-icon-md' } },
    defaultVariants: { size: 'sm' },
  },
);

/** The mono label truncates from the front (rtl box, ellipsis at the start), capped at size-graph-node-w (150px). */
export const badgeMonoLabelClass = 'min-w-0 max-w-(--cs-size-graph-node-w) overflow-hidden text-ellipsis whitespace-nowrap [direction:rtl]';

/**
 * The lead badge (from ContrastChip, owner 2026-10-27 proposal A): the tone's solid with its on colour, no edge, so the
 * grade reads as a badge and not as part of the label. On a solid badge it turns the other way (soft fill, tone text) so
 * it still stands out. Neutral uses ink, like the neutral solid badge. 16px tall (14 at xs).
 */
export const badgeLeadVariants = cva('inline-flex items-center rounded-xs px-1 text-micro', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    on: { solid: '', soft: '', outline: '', ghost: '' },
    size: { xs: 'h-3.5', sm: 'h-icon-md', md: 'h-icon-md', lg: 'h-icon-md' },
  },
  compoundVariants: [
    { on: ['soft', 'outline', 'ghost'], tone: 'neutral', className: 'bg-ink-solid text-ink-on' },
    { on: ['soft', 'outline', 'ghost'], tone: 'accent', className: 'bg-accent-solid text-accent-on' },
    { on: ['soft', 'outline', 'ghost'], tone: 'success', className: 'bg-success-solid text-success-on' },
    { on: ['soft', 'outline', 'ghost'], tone: 'warning', className: 'bg-warning-solid text-warning-on' },
    { on: ['soft', 'outline', 'ghost'], tone: 'danger', className: 'bg-danger-solid text-danger-on' },
    { on: ['soft', 'outline', 'ghost'], tone: 'info', className: 'bg-info-solid text-info-on' },
    { on: ['soft', 'outline', 'ghost'], tone: 'agent', className: 'bg-agent-solid text-agent-on' },
    { on: 'solid', tone: 'neutral', className: 'bg-neutral-track text-text-secondary' },
    { on: 'solid', tone: 'accent', className: 'bg-accent-soft text-accent-text' },
    { on: 'solid', tone: 'success', className: 'bg-success-soft text-success-text' },
    { on: 'solid', tone: 'warning', className: 'bg-warning-soft text-warning-text' },
    { on: 'solid', tone: 'danger', className: 'bg-danger-soft text-danger-text' },
    { on: 'solid', tone: 'info', className: 'bg-info-soft text-info-text' },
    { on: 'solid', tone: 'agent', className: 'bg-agent-soft text-agent-text' },
  ],
  defaultVariants: { tone: 'neutral', on: 'soft', size: 'sm' },
});
