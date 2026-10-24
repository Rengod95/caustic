import { cva } from 'class-variance-authority';

/**
 * Opaque surface lit by a soft accent glow (behind the content) and a hairline rim (above it) that follow the pointer.
 * --mx / --my are set by the component on pointermove; before any movement the light sits centered at the top.
 */
export const cardSpotlightVariants = cva([
  'isolate overflow-hidden bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
  'before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-base before:content-[""]',
  'before:bg-[radial-gradient(var(--cs-size-spotlight-glow)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-accent-soft),transparent_60%)]',
  'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:p-[1px] after:opacity-0 after:transition-opacity after:duration-base after:content-[""]',
  'after:bg-[radial-gradient(var(--cs-size-spotlight-rim)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-accent-border),transparent_70%)]',
  'after:[-webkit-mask:linear-gradient(var(--cs-color-text-primary)_0_0)_content-box,linear-gradient(var(--cs-color-text-primary)_0_0)] after:[-webkit-mask-composite:xor]',
  'after:[mask:linear-gradient(var(--cs-color-text-primary)_0_0)_content-box_exclude,linear-gradient(var(--cs-color-text-primary)_0_0)]',
  'hover:before:opacity-100 hover:after:opacity-100',
]);
