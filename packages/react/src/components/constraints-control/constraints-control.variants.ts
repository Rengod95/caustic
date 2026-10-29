import { cva } from 'class-variance-authority';

// Disabled is a colour, not opacity: the selects and pins draw their own disabled colours, the box takes the disabled fill
// and the drawn child frame's edge takes disabled-border.
// The box and the column share a top edge (owner 2026-10-27: the centred box sat off the selects): the first select lines
// up with the top of the box, the note runs under the selects.
export const constraintsControlVariants = cva('group/constraints grid grid-cols-[var(--cs-size-pad-box)_1fr] items-start gap-3 font-ui');

// Common props (lib/common-props.ts): variant = the box emphasis (soft, the default, is the sunken well with the subtle
// hairline), tone = the on pins (pin variants below), size = the pin stroke; radius / shadow are applied to the box by
// ConstraintsControl with radiusClass / shadowClass after these classes.
export const constraintsBoxVariants = cva('relative size-pad-box rounded-lg group-aria-disabled/constraints:bg-disabled-fill', {
  variants: {
    variant: {
      soft: 'bg-neutral-well shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
      outline: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
      solid: 'bg-surface-raised',
      ghost: 'bg-transparent',
    },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
    radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
    shadow: { none: '', '1': '', '2': '', '3': '', '4': '', '5': '' },
  },
  defaultVariants: { variant: 'soft', tone: 'accent', size: 'md', radius: 'lg', shadow: 'none' },
});

export const constraintsFrameVariants = cva(
  'absolute top-1/2 left-1/2 size-card-tile -translate-x-1/2 -translate-y-1/2 rounded-xs bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-control)] group-aria-disabled/constraints:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
);

// Pins are 2 to 4px wide (the edge pins step with the size: 2 · 3 · 4 · 5): the ::before extends the pointer target to
// 24px without moving the drawn bar. On is the tone solid with no edge (owner 2026-10-27, B; accent by default): a soft
// 4px bar did not read as on. Hover steps to solid-hover; focus adds the ring. Disabled drops the tone.
export const constraintsPinVariants = cva(
  [
    'absolute cursor-pointer rounded-2xs bg-border-strong outline-none transition-control before:absolute hover:bg-text-secondary focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:bg-disabled-border disabled:aria-pressed:bg-disabled-text',
  ],
  {
    variants: {
      pin: {
        top: 'top-2 left-1/2 h-4 -translate-x-1/2 before:-inset-x-2.5 before:-inset-y-1',
        bottom: 'bottom-2 left-1/2 h-4 -translate-x-1/2 before:-inset-x-2.5 before:-inset-y-1',
        left: 'top-1/2 left-2 w-4 -translate-y-1/2 before:-inset-x-1 before:-inset-y-2.5',
        right: 'top-1/2 right-2 w-4 -translate-y-1/2 before:-inset-x-1 before:-inset-y-2.5',
        'center-x': 'top-1/2 left-1/2 h-0.5 w-5 -translate-x-1/2 -translate-y-1/2 before:-inset-x-0.5 before:-inset-y-2.5',
        'center-y': 'top-1/2 left-1/2 h-5 w-0.5 -translate-x-1/2 -translate-y-1/2 before:-inset-x-2.5 before:-inset-y-0.5',
      },
      stroke: { xs: '', sm: '', md: '', lg: '' },
      pinTone: {
        neutral: 'aria-pressed:bg-neutral-solid aria-pressed:hover:bg-neutral-solid-hover',
        accent: 'aria-pressed:bg-accent-solid aria-pressed:hover:bg-accent-solid-hover',
        success: 'aria-pressed:bg-success-solid aria-pressed:hover:bg-success-solid-hover',
        warning: 'aria-pressed:bg-warning-solid aria-pressed:hover:bg-warning-solid-hover',
        danger: 'aria-pressed:bg-danger-solid aria-pressed:hover:bg-danger-solid-hover',
        info: 'aria-pressed:bg-info-solid aria-pressed:hover:bg-info-solid-hover',
        agent: 'aria-pressed:bg-agent-solid aria-pressed:hover:bg-agent-solid-hover',
      },
    },
    compoundVariants: [
      { pin: ['top', 'bottom'], stroke: 'xs', className: 'w-0.5' },
      { pin: ['top', 'bottom'], stroke: 'sm', className: 'w-0.75' },
      { pin: ['top', 'bottom'], stroke: 'md', className: 'w-1' },
      { pin: ['top', 'bottom'], stroke: 'lg', className: 'w-1.25' },
      { pin: ['left', 'right'], stroke: 'xs', className: 'h-0.5' },
      { pin: ['left', 'right'], stroke: 'sm', className: 'h-0.75' },
      { pin: ['left', 'right'], stroke: 'md', className: 'h-1' },
      { pin: ['left', 'right'], stroke: 'lg', className: 'h-1.25' },
    ],
    defaultVariants: { stroke: 'md', pinTone: 'accent' },
  },
);

/** The open select list, under its select: one elevation, no edge. It exits with its data-state (the component keeps it mounted while it closes). */
export const constraintsListboxVariants = cva('absolute inset-x-0 top-full z-10 mt-1 grid gap-px rounded-lg bg-surface-base p-1 text-ui-sm text-text-primary shadow-2 data-[state=open]:animate-enter data-[state=closed]:animate-exit data-[state=closed]:pointer-events-none enter-scale origin-top');

/** One option; the selected one inverts (selected utility). */
export const constraintsOptionVariants = cva(
  'flex h-control-sm cursor-pointer items-center justify-between gap-2 rounded-md bg-transparent px-2 text-left outline-none hover:bg-neutral-hover focus-visible:shadow-focus aria-selected:not-disabled:selected aria-selected:not-disabled:hover:bg-selection-fill-hover transition-control press',
);

export const constraintsColumnVariants = cva('grid gap-2');

/** The select's leading glyph: tertiary, so the icon does not outweigh the constraint name (owner 2026-10-27). */
export const constraintsGlyphVariants = cva('text-text-tertiary in-disabled:text-disabled-text');

export const constraintsNoteVariants = cva('-mb-px m-0 text-hint text-text-tertiary group-aria-disabled/constraints:text-disabled-text');
