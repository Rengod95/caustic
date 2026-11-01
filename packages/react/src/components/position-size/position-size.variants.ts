import { cva } from 'class-variance-authority';

/**
 * The geometry block: a bare column of rows (variant ghost, the default). Common props (owner 2026-10-26): solid, soft and
 * outline put it on an 8px-inset panel (surface.raised with a hairline, the tone's soft 3, or the tone's border 6 edge; a
 * hue on solid draws its border 6); radius and shadow shape that panel. size steps the row gap (xs 4 · sm 6 · md 8 · lg 12)
 * and every NumberField (PositionSize passes it on).
 */
export const positionSizeVariants = cva('grid font-ui', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: { solid: '', soft: '', outline: '', ghost: '' },
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'gap-1', sm: 'gap-1.5', md: 'gap-2', lg: 'gap-3' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-surface-raised p-2 shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)]' },
    { variant: 'solid', tone: 'accent', className: 'bg-surface-raised p-2 shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'solid', tone: 'success', className: 'bg-surface-raised p-2 shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'solid', tone: 'warning', className: 'bg-surface-raised p-2 shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'solid', tone: 'danger', className: 'bg-surface-raised p-2 shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'solid', tone: 'info', className: 'bg-surface-raised p-2 shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'solid', tone: 'agent', className: 'bg-surface-raised p-2 shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft p-2' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft p-2' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft p-2' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft p-2' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft p-2' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft p-2' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft p-2' },
    { variant: 'outline', tone: 'neutral', className: 'p-2 shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'p-2 shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'p-2 shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'p-2 shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'p-2 shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'p-2 shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'p-2 shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'ghost', radius: 'none', shadow: 'none', size: 'md' },
});

// Rows (owner 2026-10-28): X, Y and rotation share the first row in three equal columns (X and Y need no half width);
// W and H keep two columns and the lock; the flips and the constraints button sit below, at the two ends.
export const positionSizeRow = cva('grid items-center gap-1.5', {
  variants: { row: { position: 'grid-cols-3', size: 'grid-cols-[1fr_1fr_auto]' } },
  defaultVariants: { row: 'position' },
});

/** Row 3: the flips at the start, the constraints button at the end. */
export const positionSizeTurnRow = cva('flex items-center justify-between gap-1.5');

// The sizing-mode pill sits in the field's unit slot; the negative end margin lands it 4px from the field edge.
// Soft and quiet (owner 2026-10-28): the neutral tint 2 fill with no edge, the opaque neutral hover / pressed fills under
// the pointer, medium tertiary text and neutral.graphic glyphs, so the pill reads as a setting next to the number, not as a
// second value. A mode glyph and the label name the mode; no hue encodes it.
export const positionSizeMode = cva(
  [
    '-mr-1 inline-flex h-control-compact-2xs cursor-pointer items-center gap-0.5 rounded-xs px-1.25 text-ui-xs font-medium outline-none transition-control press',
    'bg-neutral-tint text-text-tertiary hover:bg-neutral-hover hover:text-text-primary active:bg-neutral-pressed',
    'focus-visible:shadow-focus',
    '[&_svg]:text-neutral-graphic disabled:[&_svg]:text-disabled-text',
    'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text',
    'data-[reserved]:cursor-default',
  ],
  {
    variants: {
      mode: { fill: '', hug: '', mixed: '' },
    },
  },
);

/** The flip chips: ghost chips (Chip variant ghost) made soft when off (owner 2026-10-28, option 3): a neutral.tint fill
 *  like the mode pills, tertiary text and neutral.graphic glyphs, neutral.hover and primary text under the pointer; on,
 *  they take the chip's neutral selection, which re-points both. */
export const positionSizeFlip = cva([
  'transition-control',
  'not-aria-pressed:not-disabled:bg-neutral-tint not-aria-pressed:not-disabled:hover:bg-neutral-hover not-aria-pressed:not-disabled:active:bg-neutral-pressed',
  'not-aria-pressed:not-disabled:text-text-tertiary not-aria-pressed:not-disabled:[&_svg]:text-neutral-graphic not-aria-pressed:not-disabled:hover:text-text-primary',
]);
