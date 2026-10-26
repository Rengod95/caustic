import { cva } from 'class-variance-authority';

// Disabled is a colour, not opacity: the selects and pins draw their own disabled colours, the box takes the disabled fill
// and the drawn child frame's edge takes disabled-border.
export const constraintsControlVariants = cva('group/constraints grid grid-cols-[var(--cs-size-pad-box)_1fr] items-center gap-3 font-ui');

export const constraintsBoxVariants = cva('relative size-pad-box rounded-lg bg-neutral-well shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] group-aria-disabled/constraints:bg-disabled-fill');

export const constraintsFrameVariants = cva(
  'absolute top-1/2 left-1/2 size-card-tile -translate-x-1/2 -translate-y-1/2 rounded-xs bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-control)] group-aria-disabled/constraints:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
);

// Pins are 2 to 4px wide: the ::before extends the pointer target to 24px without moving the drawn bar.
// On is accent soft selected (PROPOSAL B5): soft-pressed fill with a 1px border-strong edge; hover keeps the fill and
// steps the edge to graphic, focus keeps the edge beside the ring. Disabled drops the tone (no accent edge).
export const constraintsPinVariants = cva(
  [
    'absolute cursor-pointer rounded-2xs bg-border-strong outline-none transition-colors duration-120 ease-out before:absolute hover:bg-text-secondary focus-visible:shadow-focus',
    'aria-pressed:bg-accent-soft-pressed aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)]',
    'aria-pressed:hover:bg-accent-soft-pressed aria-pressed:hover:shadow-[inset_0_0_0_1px_var(--cs-color-accent-graphic)]',
    'aria-pressed:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong),var(--cs-focus)]',
    'disabled:pointer-events-none disabled:bg-disabled-border disabled:aria-pressed:bg-disabled-text disabled:aria-pressed:shadow-none',
  ],
  {
    variants: {
      pin: {
        top: 'top-2 left-1/2 h-4 w-1 -translate-x-1/2 before:-inset-x-2.5 before:-inset-y-1',
        bottom: 'bottom-2 left-1/2 h-4 w-1 -translate-x-1/2 before:-inset-x-2.5 before:-inset-y-1',
        left: 'top-1/2 left-2 h-1 w-4 -translate-y-1/2 before:-inset-x-1 before:-inset-y-2.5',
        right: 'top-1/2 right-2 h-1 w-4 -translate-y-1/2 before:-inset-x-1 before:-inset-y-2.5',
        'center-x': 'top-1/2 left-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 before:-inset-x-0.5 before:-inset-y-2.5',
        'center-y': 'top-1/2 left-1/2 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 before:-inset-x-2.5 before:-inset-y-0.5',
      },
    },
  },
);
