import { cva } from 'class-variance-authority';

export const expressionEditorVariants = cva('grid min-w-0 gap-3 font-ui');

export const expressionEditorHintVariants = cva('text-hint text-text-tertiary');

/** One reference: a column with a hairline under it (the last one has none). */
export const expressionEditorBindingVariants = cva('grid min-w-0 gap-2 border-b border-border-subtle pb-3 last:border-b-0 last:pb-0');

export const expressionEditorPathVariants = cva('font-mono text-mono-sm text-text-tertiary');

export const expressionEditorToggleVariants = cva([
  'inline-flex h-control-sm w-fit cursor-pointer items-center gap-1 rounded-md px-2 text-left font-ui text-ui-sm text-text-secondary outline-none',
  'transition-[background-color,box-shadow] duration-120 ease-out hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus',
  'disabled:pointer-events-none disabled:text-disabled-text',
]);

export const expressionEditorChevronVariants = cva('size-icon-sm shrink-0 transition-transform duration-120 ease-out', {
  variants: { open: { true: 'rotate-90', false: '' } },
  defaultVariants: { open: false },
});

export const expressionEditorErrorVariants = cva('inline-flex items-center gap-1.25 text-hint text-danger-text');
