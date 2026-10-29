import { cva, type VariantProps } from 'class-variance-authority';

// One surface, three placements and two frames (round 3: Modal folded in, Sheet became a preset over placement).
// - frame "compact": the parts-only centred dialog (padded stack, 12px gap); width steps 280 · 320 · 480 · 640.
// - frame "sectioned": header, scrolling body and footer bands. Used when the title prop is given (the former Modal,
//   width steps 320 · 380 · 480 · 640) and always for the edge placements (the former Sheet).
// The frame is not a prop; Dialog derives it (placement !== 'center' || title given).
// Common props (owner 2026-10-26), the floating surface model shared with the former Modal and Sheet: variant solid
// (default) is the thick material and a hue draws a 1px rim in its border 6; soft re-points the material to the tone
// soft 3 (opaque); outline is the material with a 1px rim in the tone border 6; ghost is the material without elevation
// (Dialog passes shadow none). A floating surface never loses its opaque fill. radius: panel (the default) keeps the
// placement radius (centre and right: panel; bottom: 28px top, panel bottom); another key rounds every corner.
// The material and the elevation are set by exactly one class each (variant axis, shadow axis), never on top of a base
// glass-thick / glass-shadow-5: tailwind-merge cannot tell two glass utilities apart and the CSS order would decide.
export const dialogVariants = cva(
  'glass text-text-primary outline-none',
  {
    variants: {
      // Motion by placement: a centred dialog fades in at gentle from the centre (scale 0.96); a side sheet slides in from
      // its edge on the drawer curve (enter gentle, exit base).
      placement: {
        center: 'w-full data-[state=open]:animate-enter-dialog data-[state=closed]:animate-exit enter-scale',
        right: 'z-60 inset-y-2.5 right-2.5 data-[state=open]:animate-enter-panel data-[state=closed]:animate-exit-panel enter-from-end',
        bottom: 'z-60 inset-x-2 bottom-2 max-h-[70dvh] data-[state=open]:animate-enter-panel data-[state=closed]:animate-exit-panel enter-from-bottom',
      },
      frame: { compact: 'grid gap-3 px-inset-regular-x py-inset-regular-y', sectioned: 'flex flex-col overflow-hidden' },
      kind: { dialog: '', alert: '' },
      size: { xs: '', sm: '', md: '', lg: '' },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: { solid: 'glass-thick', soft: '', outline: 'glass-thick', ghost: 'glass-thick' },
      radius: {
        none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
        xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full', panel: '',
      },
      shadow: { none: '[--cs-shadow:none]', '1': 'glass-shadow-1', '2': 'glass-shadow-2', '3': 'glass-shadow-3', '4': 'glass-shadow-4', '5': 'glass-shadow-5' },
    },
    compoundVariants: [
      // Placement radius (radius unset).
      { radius: 'panel', placement: ['center', 'right'], className: 'rounded-panel' },
      { radius: 'panel', placement: 'bottom', className: 'rounded-t-4xl rounded-b-panel' },
      // Centred widths: the compact frame keeps the Dialog steps (xs adds the compact inset), the sectioned frame the Modal steps.
      { placement: 'center', frame: 'compact', size: 'xs', className: 'max-w-popover-md gap-2 px-inset-compact-x py-inset-compact-y' },
      { placement: 'center', frame: 'compact', size: 'sm', className: 'max-w-dialog-sm' },
      { placement: 'center', frame: 'sectioned', size: 'xs', className: 'max-w-dialog-sm' },
      { placement: 'center', frame: 'sectioned', size: 'sm', className: 'max-w-modal-sm' },
      { placement: 'center', size: 'md', className: 'max-w-dialog-md' },
      { placement: 'center', size: 'lg', className: 'max-w-dialog-lg' },
      // Surface emphasis.
      { variant: ['solid', 'ghost'], tone: 'accent', className: 'outline outline-1 -outline-offset-1 outline-accent-border' },
      { variant: ['solid', 'ghost'], tone: 'success', className: 'outline outline-1 -outline-offset-1 outline-success-border' },
      { variant: ['solid', 'ghost'], tone: 'warning', className: 'outline outline-1 -outline-offset-1 outline-warning-border' },
      { variant: ['solid', 'ghost'], tone: 'danger', className: 'outline outline-1 -outline-offset-1 outline-danger-border' },
      { variant: ['solid', 'ghost'], tone: 'info', className: 'outline outline-1 -outline-offset-1 outline-info-border' },
      { variant: ['solid', 'ghost'], tone: 'agent', className: 'outline outline-1 -outline-offset-1 outline-agent-border' },
      { variant: 'soft', tone: 'neutral', className: '[--cs-material:var(--cs-color-neutral-soft)]' },
      { variant: 'soft', tone: 'accent', className: '[--cs-material:var(--cs-color-accent-soft)]' },
      { variant: 'soft', tone: 'success', className: '[--cs-material:var(--cs-color-success-soft)]' },
      { variant: 'soft', tone: 'warning', className: '[--cs-material:var(--cs-color-warning-soft)]' },
      { variant: 'soft', tone: 'danger', className: '[--cs-material:var(--cs-color-danger-soft)]' },
      { variant: 'soft', tone: 'info', className: '[--cs-material:var(--cs-color-info-soft)]' },
      { variant: 'soft', tone: 'agent', className: '[--cs-material:var(--cs-color-agent-soft)]' },
      { variant: 'outline', tone: 'neutral', className: 'outline outline-1 -outline-offset-1 outline-neutral-border' },
      { variant: 'outline', tone: 'accent', className: 'outline outline-1 -outline-offset-1 outline-accent-border' },
      { variant: 'outline', tone: 'success', className: 'outline outline-1 -outline-offset-1 outline-success-border' },
      { variant: 'outline', tone: 'warning', className: 'outline outline-1 -outline-offset-1 outline-warning-border' },
      { variant: 'outline', tone: 'danger', className: 'outline outline-1 -outline-offset-1 outline-danger-border' },
      { variant: 'outline', tone: 'info', className: 'outline outline-1 -outline-offset-1 outline-info-border' },
      { variant: 'outline', tone: 'agent', className: 'outline outline-1 -outline-offset-1 outline-agent-border' },
    ],
    defaultVariants: { placement: 'center', frame: 'compact', kind: 'dialog', size: 'md', tone: 'neutral', variant: 'solid', radius: 'panel', shadow: '5' },
  },
);
export type DialogVariantProps = VariantProps<typeof dialogVariants>;

/**
 * Header band of the sectioned frame. Centre: 18px inset, items start (icon tile, heading, close); a hairline only with
 * dividers. Edge: the former Sheet band, padding steps with size, a transparent hairline that shows with dividers
 * (owner 2026-10-28: off by default).
 */
export const dialogHeaderVariants = cva('flex shrink-0', {
  variants: {
    placement: { center: 'items-start gap-3 px-4.5 pt-4.5', right: 'items-center gap-2.5 border-b', bottom: 'items-center gap-2.5 border-b' },
    dividers: { true: 'border-border-subtle', false: 'border-transparent' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { placement: 'center', dividers: true, className: 'border-b pb-4' },
    { placement: ['right', 'bottom'], size: 'xs', className: 'px-3 py-2' },
    { placement: ['right', 'bottom'], size: 'sm', className: 'px-3.5 py-3' },
    { placement: ['right', 'bottom'], size: 'md', className: 'px-4 py-3.5' },
    { placement: ['right', 'bottom'], size: 'lg', className: 'px-5 py-4' },
  ],
  defaultVariants: { placement: 'center', dividers: false, size: 'md' },
});

/**
 * Title. Compact frame: title-3. Sectioned centre: title-2. Edge: steps with size; a bottom sheet takes one step up
 * (title-2 at md) next to its 28px top corners.
 */
export const dialogTitleVariants = cva('text-text-primary', {
  variants: {
    placement: { center: '', right: '', bottom: '' },
    frame: { compact: 'text-title-3', sectioned: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { placement: 'center', frame: 'sectioned', className: 'text-title-2' },
    { placement: 'right', size: 'xs', className: 'text-ui-strong' },
    { placement: 'right', size: 'sm', className: 'text-title-4' },
    { placement: 'right', size: 'md', className: 'text-title-3' },
    { placement: 'right', size: 'lg', className: 'text-title-2' },
    { placement: 'bottom', size: 'xs', className: 'text-title-4' },
    { placement: 'bottom', size: 'sm', className: 'text-title-3' },
    { placement: 'bottom', size: 'md', className: 'text-title-2' },
    { placement: 'bottom', size: 'lg', className: 'text-title-1' },
  ],
  defaultVariants: { placement: 'center', frame: 'compact', size: 'md' },
});

/** Description: compact and edge ui-dense; the sectioned centre ui-relaxed (13px / 19). */
export const dialogDescriptionVariants = cva('text-text-secondary', {
  variants: {
    placement: { center: '', right: 'text-ui-dense', bottom: 'text-ui-dense' },
    frame: { compact: 'text-ui-dense', sectioned: '' },
  },
  compoundVariants: [{ placement: 'center', frame: 'sectioned', className: 'text-ui-relaxed' }],
  defaultVariants: { placement: 'center', frame: 'compact' },
});

/**
 * Body: scrolls. Compact: a plain stack inside the padded surface. Sectioned centre: 24px under the heading (owner
 * 2026-10-28; 16 with dividers). Edge: fills the height; half a step under the header without dividers (md 8px).
 */
export const dialogBodyVariants = cva('grid min-h-0 overflow-y-auto', {
  variants: {
    placement: { center: '', right: 'flex-1 content-start', bottom: 'flex-1 content-start' },
    frame: { compact: 'gap-3', sectioned: '' },
    dividers: { true: '', false: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { placement: 'center', frame: 'sectioned', className: 'gap-3.5 px-4.5 pb-4' },
    { placement: 'center', frame: 'sectioned', dividers: false, className: 'pt-6' },
    { placement: 'center', frame: 'sectioned', dividers: true, className: 'pt-4' },
    { placement: ['right', 'bottom'], size: 'xs', className: 'gap-2.5 px-3 pb-3' },
    { placement: ['right', 'bottom'], size: 'sm', className: 'gap-3 px-3.5 pb-3.5' },
    { placement: ['right', 'bottom'], size: 'md', className: 'gap-3.5 px-4 pb-4' },
    { placement: ['right', 'bottom'], size: 'lg', className: 'gap-4 px-5 pb-5' },
    { placement: ['right', 'bottom'], dividers: true, size: 'xs', className: 'pt-3' },
    { placement: ['right', 'bottom'], dividers: true, size: 'sm', className: 'pt-3.5' },
    { placement: ['right', 'bottom'], dividers: true, size: 'md', className: 'pt-4' },
    { placement: ['right', 'bottom'], dividers: true, size: 'lg', className: 'pt-5' },
    { placement: ['right', 'bottom'], dividers: false, size: 'xs', className: 'pt-1' },
    { placement: ['right', 'bottom'], dividers: false, size: 'sm', className: 'pt-1.5' },
    { placement: ['right', 'bottom'], dividers: false, size: 'md', className: 'pt-2' },
    { placement: ['right', 'bottom'], dividers: false, size: 'lg', className: 'pt-2.5' },
  ],
  defaultVariants: { placement: 'center', frame: 'compact', dividers: false, size: 'md' },
});

/**
 * Footer. Compact: a 4px top margin puts the actions 16px below the body (12px stack gap + 4; owner 2026-10-27).
 * Sectioned centre: 36px from the body content (body 16 + footer 20; owner 2026-10-28); a hairline only with dividers.
 * Edge: the former Sheet band with a transparent hairline that shows with dividers.
 */
export const dialogFooterVariants = cva('flex items-center justify-end gap-2', {
  variants: {
    placement: { center: '', right: 'shrink-0 border-t', bottom: 'shrink-0 border-t' },
    frame: { compact: 'mt-1 flex-wrap', sectioned: '' },
    dividers: { true: 'border-border-subtle', false: 'border-transparent' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { placement: 'center', frame: 'sectioned', className: 'shrink-0 px-4.5 pb-4' },
    { placement: 'center', frame: 'sectioned', dividers: false, className: 'pt-5' },
    { placement: 'center', frame: 'sectioned', dividers: true, className: 'border-t pt-4' },
    { placement: ['right', 'bottom'], size: 'xs', className: 'px-3 py-2' },
    { placement: ['right', 'bottom'], size: 'sm', className: 'px-3.5 py-2.5' },
    { placement: ['right', 'bottom'], size: 'md', className: 'px-4 py-3' },
    { placement: ['right', 'bottom'], size: 'lg', className: 'px-5 py-3.5' },
  ],
  defaultVariants: { placement: 'center', frame: 'compact', dividers: false, size: 'md' },
});
