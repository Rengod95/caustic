import { cva } from 'class-variance-authority';

// The box owns the one focus edge (P9): focus-within swaps the shadow stack, the native textarea draws nothing.
export const composerVariants = cva([
  'glass glass-shadow-3 grid cursor-text gap-1.5 rounded-2xl p-2',
  'transition-[box-shadow] duration-quick',
  'focus-within:[--cs-shadow:var(--cs-focus-field),var(--cs-elevation-3)]',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-42',
]);

export const composerInputVariants = cva(
  'block w-full resize-none border-0 bg-transparent px-1.5 py-1 text-ui-md-relaxed text-text-primary outline-none placeholder:text-text-placeholder',
);

export const composerModelVariants = cva(
  'inline-flex h-control-inline cursor-pointer items-center gap-1 rounded-md pl-2 pr-1.5 text-ui-sm text-text-secondary outline-none transition-colors duration-quick hover:bg-fill-pressed hover:text-text-primary focus-visible:shadow-focus [&_svg]:size-icon-sm',
);

export const composerStopVariants = cva('bg-fill-selected text-text-primary hover:scale-100');
