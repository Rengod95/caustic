import { cva, type VariantProps } from 'class-variance-authority';

export const colorTileVariants = cva('grid overflow-hidden rounded-xl bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]');
export const colorTileSwatchVariants = cva('flex h-tile-swatch-h items-start justify-between bg-(--tile-bg) p-2 text-(--tile-fg)');
export const colorTileSampleVariants = cva('text-title-overlay');
export const colorTileValueVariants = cva('font-mono text-mono-sm');
export const colorTileBodyVariants = cva('grid gap-0.5 px-2.5 py-2');
export const colorTileNameVariants = cva('py-px font-mono text-mono-sm text-text-primary');
export const colorTileAuditVariants = cva('flex gap-2 text-ui-xs font-normal text-text-tertiary');
export const colorTileMarkVariants = cva('', {
  variants: { result: { pass: 'text-success-text', fail: 'text-danger-text' } },
  defaultVariants: { result: 'pass' },
});
export type ColorTileMarkVariantProps = VariantProps<typeof colorTileMarkVariants>;
