import { cva } from 'class-variance-authority';

/** The card: opaque surface, xl radius, subtle inset edge, clipped. Mono voice (P4). */
export const codeDiffVariants = cva(
  'm-0 max-w-full min-w-0 overflow-hidden rounded-xl bg-surface-base font-mono text-mono-relaxed text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
);

export const codeDiffHeader = cva('flex min-h-tab-h flex-wrap items-center gap-x-2 gap-y-1 border-b border-border-subtle py-1 pl-3 pr-2 font-ui text-footnote text-text-primary');

export const codeDiffIcon = cva('inline-flex size-icon-sm shrink-0 text-text-secondary [&_svg]:size-full');

export const codeDiffFilename = cva('min-w-0 break-all font-mono text-footnote text-text-primary');

export const codeDiffStatAdd = cva('font-mono text-mono-md font-normal text-diff-add-text');

export const codeDiffStatDel = cva('font-mono text-mono-md font-normal text-diff-remove-text');

export const codeDiffActions = cva('ms-auto flex shrink-0 items-center gap-0.5');

export const codeDiffBody = cva('m-0 overflow-x-auto py-1.5 outline-none focus-visible:shadow-focus');

/** One line: grid 34 / 16 / 1fr plus a 12px end track, 20px high, no wrap. */
export const codeDiffLine = cva(
  'grid h-5 grid-cols-[calc(var(--spacing)*8.5)_calc(var(--spacing)*4)_1fr_calc(var(--spacing)*3)] whitespace-pre font-mono text-mono-relaxed text-text-primary',
  {
    variants: { kind: { context: '', add: 'bg-diff-add-bg', remove: 'bg-diff-remove-bg' } },
    defaultVariants: { kind: 'context' },
  },
);

export const codeDiffNumber = cva('select-none pr-2 text-right text-text-tertiary before:content-[attr(data-line)]');

export const codeDiffSign = cva('select-none text-center', {
  variants: { kind: { context: '', add: 'text-diff-add-text', remove: 'text-diff-remove-text' } },
  defaultVariants: { kind: 'context' },
});

export const codeDiffContent = cva('');

export const codeDiffToken = cva('', {
  variants: {
    syntax: { keyword: 'text-syntax-keyword', string: 'text-syntax-string', property: 'text-syntax-property', comment: 'text-syntax-comment' },
  },
  defaultVariants: { syntax: 'keyword' },
});
