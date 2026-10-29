import { cva } from 'class-variance-authority';

/**
 * The field box (the root): neutral.well at rest, neutral.hover under the pointer, surface.base with the focus-field
 * hairline (border.default) while focused. Focus is a fill change (owner 2026-10-28, field/input proposal 2): a field
 * that rests on grey (soft, the default) turns surface.base, a white or bare one (solid, outline, ghost) turns neutral.well. Invalid draws the danger border-strong edge (kept with focus); locked and reserved are the inset
 * fill; disabled is colour. Common props (owner 2026-10-26), unset = today:
 *   variant soft (default) the well fill (a hue takes its soft 3, soft-hover 4 under the pointer) · solid surface.base with
 *   a border.default edge (a hue: its border 6) · outline no fill, the tone's border 6 edge · ghost no fill or edge (fill
 *   on hover; the tone has no effect). size steps the height: xs 22 · sm 24 · md 28 · lg 36 (compact control heights).
 * The state rules are (0,2,0) and win over the variant fills and edges (0,1,0).
 */
export const numberFieldVariants = cva([
  'relative flex min-w-0 items-center bg-neutral-well transition-control',
  // Focus wins over hover (hover:focus-within keeps the focus fill under the pointer).
  'focus-within:bg-neutral-well hover:focus-within:bg-neutral-well focus-within:shadow-focus-field',
  // The invalid edge is for an enabled field: disabled drops the tone, so no danger edge while disabled.
  'data-[invalid]:not-data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]',
  'data-[locked]:pointer-events-none data-[locked]:bg-bg-inset data-[reserved]:bg-bg-inset data-[scrubbing]:bg-neutral-pressed',
  'data-[disabled]:pointer-events-none data-[disabled]:bg-disabled-fill data-[disabled]:text-disabled-text',
], {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      // Hover stays inside each emphasis: neutral.hover on the well, solid, outline and ghost; a hue's soft steps to soft-hover 4.
      variant: { solid: 'hover:bg-neutral-hover', soft: 'focus-within:bg-surface-base hover:focus-within:bg-surface-base', outline: 'hover:bg-neutral-hover', ghost: 'hover:bg-neutral-hover' },
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'h-control-xs', sm: 'h-control-sm', md: 'h-control-md', lg: 'h-control-lg' },
  },
  compoundVariants: [
    { variant: 'soft', tone: 'neutral', className: 'hover:bg-neutral-hover' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft hover:bg-accent-soft-hover' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft hover:bg-success-soft-hover' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft hover:bg-warning-soft-hover' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft hover:bg-danger-soft-hover' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft hover:bg-info-soft-hover' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft hover:bg-agent-soft-hover' },
    { variant: 'solid', tone: 'neutral', className: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]' },
    { variant: 'solid', tone: 'accent', className: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'solid', tone: 'success', className: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'solid', tone: 'warning', className: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'solid', tone: 'danger', className: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'solid', tone: 'info', className: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'solid', tone: 'agent', className: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'outline', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'ghost', className: 'bg-transparent' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'soft', radius: 'lg', shadow: 'none', size: 'md' },
});

/** The input: footnote figures (xs hint, lg ui); the field box draws every state. */
export const numberFieldControlVariants = cva(
  'h-full w-full min-w-0 flex-1 border-0 bg-transparent px-1 tabular-nums text-text-primary outline-none placeholder:italic placeholder:text-text-secondary disabled:text-disabled-text disabled:placeholder:text-disabled-text',
  {
    variants: { size: { xs: 'text-hint', sm: 'text-footnote', md: 'text-footnote', lg: 'text-ui' } },
    defaultVariants: { size: 'md' },
  },
);

/** The unit suffix: text.tertiary in the value's own type step (same size and line height), so it sits on the value's
 *  baseline instead of reading as a smaller hint. */
export const numberFieldUnitVariants = cva(
  'shrink-0 pr-2 tabular-nums text-text-tertiary in-data-[disabled]:text-disabled-text',
  {
    variants: { size: { xs: 'text-hint', sm: 'text-footnote', md: 'text-footnote', lg: 'text-ui' } },
    defaultVariants: { size: 'md' },
  },
);

// ── format="hex" (HexInput is its preset) ── the look of hex-input, unchanged.
// The variant is the field emphasis and the tone its colour family (lib/common-props). soft neutral is the sunken
// inspector field (neutral.well, no edge, like NumberField); the tone colours the fill (soft), the edge (outline 6,
// solid 7) or the hover (ghost). Focus, invalid, bound and disabled are the same in every tone and variant.
export const numberFieldHexVariants = cva(
  [
    'relative flex min-w-0 items-center gap-1.5 font-mono font-normal',
    'transition-control',
    // Focus: neutral.well on a white or bare field, surface.base on the grey soft well (owner 2026-10-28, proposal 2).
    'focus-within:bg-neutral-well focus-within:shadow-focus-field',
    // Invalid is the danger border-strong edge; invalid + focus keeps it and adds the outer focus ring.
    'data-[invalid]:not-data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]',
    // Bound to a token: accent soft with the accent border-strong edge (the bound edge, step 7).
    'data-[bound]:bg-accent-soft data-[bound]:text-accent-text data-[bound]:not-data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)]',
    // Disabled is a colour, not opacity: the bound and invalid tones drop out (no accent or danger edge, fill or text).
    'data-[disabled]:bg-disabled-fill data-[disabled]:text-disabled-text',
  ],
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: {
        solid: 'bg-control-raised shadow-[inset_0_0_0_1px_var(--cs-color-control-edge)]',
        soft: 'bg-neutral-well focus-within:bg-surface-base',
        outline: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
        ghost: 'bg-transparent hover:bg-neutral-hover hover:focus-within:bg-neutral-well',
      },
      size: {
        xs: 'h-control-xs rounded-md px-1.5 font-mono text-mono-sm',
        sm: 'h-control-sm rounded-md px-2 font-mono text-mono-md',
        md: 'h-control-md rounded-lg px-2 font-mono text-mono-md',
        lg: 'h-control-lg rounded-xl px-2.5 font-mono text-mono',
      },
    },
    compoundVariants: [
      // solid × tone
      { variant: 'solid', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)]' },
      { variant: 'solid', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong)]' },
      { variant: 'solid', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)]' },
      { variant: 'solid', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)]' },
      { variant: 'solid', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong)]' },
      { variant: 'solid', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border-strong)]' },
      // soft × tone
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
      // outline × tone
      { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
      // ghost × tone
      { variant: 'ghost', tone: 'accent', className: 'hover:bg-accent-tint' },
      { variant: 'ghost', tone: 'success', className: 'hover:bg-success-tint' },
      { variant: 'ghost', tone: 'warning', className: 'hover:bg-warning-tint' },
      { variant: 'ghost', tone: 'danger', className: 'hover:bg-danger-tint' },
      { variant: 'ghost', tone: 'info', className: 'hover:bg-info-tint' },
      { variant: 'ghost', tone: 'agent', className: 'hover:bg-agent-tint' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'soft', size: 'md' },
  },
);

/** Common radius / shadow (lib/common-props), applied after the field classes so an explicit value wins. */
export const numberFieldHexFrameVariants = cva('', {
  variants: {
    // Common radius / shadow (lib/common-props): the default key is the component's own look (no class).
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: '', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: 'lg', shadow: 'none' },
});

/** The bare uppercase mono input; its type steps with the size. */
export const numberFieldHexControlVariants = cva(
  'h-full w-full min-w-0 flex-1 border-0 bg-transparent font-mono font-normal text-text-primary uppercase outline-none placeholder:text-text-secondary disabled:text-disabled-text disabled:placeholder:text-disabled-text',
  {
    variants: { size: { xs: 'font-mono text-mono-sm', sm: 'font-mono text-mono-md', md: 'font-mono text-mono-md', lg: 'font-mono text-mono' } },
    defaultVariants: { size: 'md' },
  },
);

/** Bound only: the link glyph and the token path, in the accent text colour (disabled colour while disabled). */
export const numberFieldHexIconVariants = cva('inline-grid size-icon-sm shrink-0 place-items-center text-accent-text in-data-[disabled]:text-disabled-text [&_svg]:size-full [&_svg]:stroke-[1.75]');
export const numberFieldHexTokenVariants = cva('min-w-0 truncate text-accent-text in-data-[disabled]:text-disabled-text');

// ── appearance="stepper" (was stepper-input) ── the form quantity field.
// The field family (stepper, tag-input, textarea): tone sets the --tone-* slots, variant picks the rest look.
//   outline  surface.translucent fill + 1px tone edge (border.default when neutral): the specimen
//   soft     tone soft fill (neutral.track when neutral), no edge
//   solid    raised fill + edge: control.raised + control.edge when neutral, tone tint + tone border otherwise
//   ghost    no fill, no edge until focus
// Focus, invalid and disabled are drawn on top of every variant and never change with it.
export const numberFieldStepperVariants = cva(
  [
    'inline-flex items-stretch overflow-hidden rounded-xl text-ui transition-control',
    // Focus: neutral.well, surface.base on the grey soft fill (owner 2026-10-28, field/input proposal 2).
    'focus-within:bg-neutral-well focus-within:shadow-[var(--cs-focus-field)]',
    // The invalid edge is for an enabled field: disabled drops the tone, so a disabled invalid field shows the disabled edge.
    'data-[invalid]:not-data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]',
    'data-[disabled]:pointer-events-none data-[disabled]:bg-disabled-fill data-[disabled]:text-disabled-text data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  ],
  {
    variants: {
      tone: {
      neutral: '[--tone-edge:var(--cs-color-border-default)] [--tone-fill:var(--cs-color-neutral-track)] [--tone-raised:var(--cs-color-control-raised)] [--tone-raised-edge:var(--cs-color-control-edge)]',
      accent: '[--tone-edge:var(--cs-color-accent-border)] [--tone-fill:var(--cs-color-accent-soft)] [--tone-raised:var(--cs-color-accent-tint)] [--tone-raised-edge:var(--cs-color-accent-border)]',
      success: '[--tone-edge:var(--cs-color-success-border)] [--tone-fill:var(--cs-color-success-soft)] [--tone-raised:var(--cs-color-success-tint)] [--tone-raised-edge:var(--cs-color-success-border)]',
      warning: '[--tone-edge:var(--cs-color-warning-border)] [--tone-fill:var(--cs-color-warning-soft)] [--tone-raised:var(--cs-color-warning-tint)] [--tone-raised-edge:var(--cs-color-warning-border)]',
      danger: '[--tone-edge:var(--cs-color-danger-border)] [--tone-fill:var(--cs-color-danger-soft)] [--tone-raised:var(--cs-color-danger-tint)] [--tone-raised-edge:var(--cs-color-danger-border)]',
      info: '[--tone-edge:var(--cs-color-info-border)] [--tone-fill:var(--cs-color-info-soft)] [--tone-raised:var(--cs-color-info-tint)] [--tone-raised-edge:var(--cs-color-info-border)]',
      agent: '[--tone-edge:var(--cs-color-agent-border)] [--tone-fill:var(--cs-color-agent-soft)] [--tone-raised:var(--cs-color-agent-tint)] [--tone-raised-edge:var(--cs-color-agent-border)]',
      },
      variant: {
        outline: 'bg-surface-translucent shadow-[inset_0_0_0_1px_var(--tone-edge)]',
        soft: 'bg-(--tone-fill) focus-within:bg-surface-base',
        solid: 'bg-(--tone-raised) shadow-[inset_0_0_0_1px_var(--tone-raised-edge)]',
        ghost: 'bg-transparent',
      },
      size: { xs: 'h-control-md text-ui-sm', sm: 'h-field-sm', md: 'h-field-md', lg: 'h-field-lg text-ui-lg' },
      // The default key keeps the component's own corner and shadow (''); every other key sets that token (the radiusClass / shadowClass names of common-props.ts, written out so Tailwind, which scans ./components only, generates them).
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    },
    // No variant / radius default here: unset is outline and the own xl corner, resolved in number-field.tsx (the cva defaults
    // of this folder are the scrub field's).
    defaultVariants: { tone: 'neutral', size: 'md', shadow: 'none' },
  },
);

/** − and +: full height, about as wide as the field is tall (40 at md). */
export const numberFieldStepButtonVariants = cva(
  'grid h-full shrink-0 place-items-center text-text-secondary transition-control hover:bg-neutral-hover hover:text-text-primary disabled:pointer-events-none disabled:text-disabled-text [&_svg]:size-icon-sm [&_svg]:stroke-[1.75]',
  {
    // Press: the icon targets at xs to md (28px tall at md) press to 0.94, lg to 0.97.
    variants: { size: { xs: 'w-7 press-sm', sm: 'w-8 press-sm', md: 'w-10 press-sm', lg: 'w-12 press' } },
    defaultVariants: { size: 'md' },
  },
);

/** The bare numeric input between the buttons, with a quiet divider.line hairline on each side, so the field reads as one
 *  control with the number in the middle rather than three boxes (owner 2026-10-28, B). */
export const numberFieldStepperControlVariants = cva(
  'h-full min-w-0 border-0 border-x border-divider-line bg-transparent text-center tabular-nums text-text-primary outline-none disabled:text-disabled-text in-data-[disabled]:border-disabled-border',
  {
    variants: { size: { xs: 'w-12', sm: 'w-16', md: 'w-16', lg: 'w-18' } },
    defaultVariants: { size: 'md' },
  },
);
