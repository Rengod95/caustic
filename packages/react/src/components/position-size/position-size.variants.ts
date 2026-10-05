import { cva } from 'class-variance-authority';

export const positionSizeVariants = cva('grid gap-2 font-ui');

export const positionSizeRow = cva('grid items-center gap-1.5', {
  variants: { row: { position: 'grid-cols-2', size: 'grid-cols-[1fr_1fr_auto]' } },
  defaultVariants: { row: 'position' },
});

// The sizing-mode pill sits in the field's unit slot; the negative end margin lands it 4px from the field edge.
export const positionSizeMode = cva(
  '-mr-1 inline-flex h-control-compact-2xs cursor-pointer items-center gap-0.5 rounded-xs px-1.25 text-ui-xs font-semibold outline-none focus-visible:shadow-focus disabled:pointer-events-none data-[reserved]:cursor-default',
  {
    variants: {
      mode: {
        fill: 'bg-accent-soft text-accent-text',
        hug: 'bg-info-soft text-info-text',
        mixed: 'bg-fill-hover text-text-secondary',
      },
    },
  },
);
