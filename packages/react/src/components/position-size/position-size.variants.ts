import { cva } from 'class-variance-authority';

export const positionSizeVariants = cva('grid gap-2 font-ui');

export const positionSizeRow = cva('grid items-center gap-1.5', {
  variants: { row: { position: 'grid-cols-2', size: 'grid-cols-[1fr_1fr_auto]' } },
  defaultVariants: { row: 'position' },
});

// The sizing-mode pill sits in the field's unit slot; the negative end margin lands it 4px from the field edge.
// Every mode is the neutral subtle emphasis (PROPOSAL E6): tint 2 at rest, the opaque neutral hover / pressed fills
// under the pointer (no translucent wash, owner 2026-10-26), border 6 -> 6 -> 7, glyph and chevron at graphic 8. A mode glyph and the label name the mode; no hue
// encodes it. The edge is one custom property so pressed steps it to 7 without dropping the focus ring.
export const positionSizeMode = cva(
  [
    '-mr-1 inline-flex h-control-compact-2xs cursor-pointer items-center gap-0.5 rounded-xs px-1.25 text-ui-xs font-semibold outline-none',
    'bg-neutral-tint hover:bg-neutral-hover active:bg-neutral-pressed',
    '[--mode-edge:var(--cs-color-neutral-border)] active:[--mode-edge:var(--cs-color-neutral-border-strong)] shadow-[inset_0_0_0_1px_var(--mode-edge)]',
    'focus-visible:shadow-[inset_0_0_0_1px_var(--mode-edge),var(--cs-focus)]',
    '[&_svg]:text-neutral-graphic disabled:[&_svg]:text-disabled-text',
    'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
    'data-[reserved]:cursor-default',
  ],
  {
    variants: {
      mode: {
        fill: 'text-neutral-text',
        hug: 'text-neutral-text',
        mixed: 'text-text-secondary',
      },
    },
  },
);
