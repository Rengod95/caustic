import { cva } from 'class-variance-authority';

export const suggestionsVariants = cva('grid grid-cols-[repeat(auto-fit,minmax(var(--cs-size-suggestion-min),1fr))] gap-2');

export const suggestionVariants = cva([
  'glass glass-thin glass-shadow-1 grid cursor-pointer gap-1 rounded-toolbar px-3 py-2.5 text-left text-ui-dense text-text-primary',
  'outline-none transition-transform duration-base ease-spring hover:-translate-y-0.5 focus-visible:shadow-focus',
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
]);
