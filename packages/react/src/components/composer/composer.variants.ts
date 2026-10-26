import { cva } from 'class-variance-authority';

// The box owns the one focus edge (P9): focus-within swaps the shadow stack, the native textarea draws nothing.
export const composerVariants = cva([
  'glass glass-shadow-3 grid cursor-text gap-1.5 rounded-2xl p-2',
  'transition-[box-shadow] duration-quick',
  'focus-within:[--cs-shadow:var(--cs-focus-field),var(--cs-elevation-3)]',
  // Disabled is a colour, not opacity: the box takes the disabled fill and edge (elevation 3 kept) and the context chips
  // drop to the disabled text and edge (they are inert, not disabled); the tone drops out.
  'data-[disabled]:pointer-events-none data-[disabled]:[--cs-material:var(--cs-color-disabled-fill)] data-[disabled]:[--cs-shadow:inset_0_0_0_1px_var(--cs-color-disabled-border),var(--cs-elevation-3)]',
  'data-[disabled]:[&_[data-slot=chip]]:text-disabled-text data-[disabled]:[&_[data-slot=chip]]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  'data-[disabled]:[&_[data-slot=chip-icon]]:text-disabled-text data-[disabled]:[&_[data-slot=chip-remove]]:text-disabled-text',
]);

export const composerInputVariants = cva(
  'block w-full resize-none border-0 bg-transparent px-1.5 py-1 text-ui-md-relaxed text-text-primary outline-none placeholder:text-text-placeholder disabled:text-disabled-text disabled:placeholder:text-disabled-text',
);

export const composerModelVariants = cva(
  'inline-flex h-control-inline cursor-pointer items-center gap-1 rounded-md pl-2 pr-1.5 text-ui-sm text-text-secondary outline-none transition-colors duration-quick hover:bg-neutral-hover hover:text-text-primary disabled:text-disabled-text focus-visible:shadow-focus [&_svg]:size-icon-sm',
);

/** The stop form keeps the ink solid of the send control (hover and pressed stay inside solid). */
export const composerStopVariants = cva('hover:scale-100');
