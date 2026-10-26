import { cva } from 'class-variance-authority';

// Same box as Input; the whole box is the button. Focus swaps the hairline edge for focus-field (P9).
export const pickerTriggerVariants = cva([
  'flex h-field-md w-full min-w-0 cursor-pointer items-center gap-2 rounded-xl bg-surface-translucent px-3 text-left text-ui text-text-primary outline-none',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] transition-[box-shadow,background-color] duration-120 ease-out',
  'hover:shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
  'focus-visible:shadow-[var(--cs-focus-field)] hover:focus-visible:shadow-[var(--cs-focus-field)]',
  // Invalid is the danger border-strong edge; invalid + focus keeps it and adds the outer focus ring.
  // It is for an enabled trigger: the invalid danger edge drops while disabled (the tone drops out).
  'data-[invalid]:not-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] data-[invalid]:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]',
  // Disabled is a colour, not opacity: fill, text and edge from the disabled axis; the glyphs follow.
  'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  'disabled:[&_[data-slot^=picker-trigger-]]:text-disabled-text',
]);
