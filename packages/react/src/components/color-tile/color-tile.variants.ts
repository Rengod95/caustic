import { cva } from 'class-variance-authority';

// Common props (lib/common-props.ts): variant = the tile emphasis. ghost (the default, owner 2026-10-27) has no tile box:
// the swatch is the card (own radius and swatch.edge hairline) and the name and audit are plain text under it. outline,
// soft and solid keep the boxed tile (surface + hairline, track, raised). tone = that hairline (outline) or the body fill
// (soft), size = swatch height and paddings; radius / shadow are applied by ColorTile with radiusClass / shadowClass
// after these classes (on the swatch when ghost). The swatch paint never changes.
export const colorTileVariants = cva('grid', {
  variants: {
    variant: {
      outline: 'overflow-hidden rounded-xl bg-surface-base',
      soft: 'overflow-hidden rounded-xl bg-neutral-track',
      solid: 'overflow-hidden rounded-xl bg-surface-raised',
      ghost: 'gap-1.5 bg-transparent',
    },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
    radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
    shadow: { none: '', '1': '', '2': '', '3': '', '4': '', '5': '' },
  },
  compoundVariants: [
    { variant: 'outline', tone: 'neutral', className: 'shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)]' },
    { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-tint' },
    { variant: 'soft', tone: 'success', className: 'bg-success-tint' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-tint' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-tint' },
    { variant: 'soft', tone: 'info', className: 'bg-info-tint' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-tint' },
  ],
  defaultVariants: { variant: 'ghost', tone: 'neutral', size: 'md', radius: 'xl', shadow: 'none' },
});
// A bare swatch (ghost tile) is the card: xl radius and the swatch.edge hairline, so a pale colour keeps its edge on the page.
export const colorTileSwatchVariants = cva('flex items-start justify-between bg-(--tile-bg) text-(--tile-fg)', {
  variants: {
    swatchSize: { xs: 'h-12 p-1.5', sm: 'h-16 p-2', md: 'h-tile-swatch-h p-2', lg: 'h-tile-swatch-h p-2.5' },
    bare: { true: 'rounded-xl shadow-[inset_0_0_0_0.5px_var(--cs-color-swatch-edge)]', false: '' },
  },
  defaultVariants: { swatchSize: 'md', bare: false },
});
export const colorTileSampleVariants = cva('', {
  variants: { sampleSize: { xs: 'text-title-4', sm: 'text-title-3', md: 'text-title-overlay', lg: 'text-title-2' } },
  defaultVariants: { sampleSize: 'md' },
});
export const colorTileValueVariants = cva('font-mono text-mono-sm');
// A bare body (ghost tile) is text only: no fill, 2px inline inset so the text lines up with the swatch curve.
export const colorTileBodyVariants = cva('grid gap-0.5', {
  variants: {
    bodySize: { xs: '', sm: '', md: '', lg: '' },
    bare: { true: 'px-0.5 py-0', false: '' },
  },
  // The boxed body padding steps with the size.
  compoundVariants: [
    { bare: false, bodySize: 'xs', className: 'px-1.5 py-1' },
    { bare: false, bodySize: 'sm', className: 'px-2 py-1.5' },
    { bare: false, bodySize: 'md', className: 'px-2.5 py-2' },
    { bare: false, bodySize: 'lg', className: 'px-3 py-2.5' },
  ],
  defaultVariants: { bodySize: 'md', bare: false },
});
export const colorTileNameVariants = cva('py-px font-mono text-mono-sm text-text-primary');
export const colorTileAuditVariants = cva('flex gap-2 text-ui-xs font-normal text-text-tertiary');
export const colorTileMarkVariants = cva('', {
  variants: { result: { pass: 'text-success-text', fail: 'text-danger-text' } },
  defaultVariants: { result: 'pass' },
});
