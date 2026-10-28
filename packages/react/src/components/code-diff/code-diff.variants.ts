import { cva } from 'class-variance-authority';

/**
 * The card: clipped, xl radius, mono voice (P4). Common props (lib/common-props.ts): variant is the card emphasis
 * (outline, the default, is the opaque surface with the subtle inset edge), tone colours that edge (outline) or the
 * fill (soft), size steps the line height and the code type (lines read it from context); radius / shadow are applied by
 * CodeDiff with radiusClass / shadowClass after these classes.
 */
export const codeDiffVariants = cva('m-0 max-w-full min-w-0 overflow-hidden rounded-xl font-mono text-text-primary', {
  variants: {
    variant: {
      outline: 'bg-surface-base',
      soft: 'bg-neutral-track',
      solid: 'bg-surface-raised',
      ghost: 'bg-transparent',
    },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    size: { xs: 'font-mono text-mono-sm', sm: 'font-mono text-mono-md', md: 'font-mono text-mono-relaxed', lg: 'font-mono text-mono' },
    radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
    shadow: { none: '', '1': '', '2': '', '3': '', '4': '', '5': '' },
  },
  compoundVariants: [
    { variant: 'outline', tone: 'neutral', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] [--code-diff-edge:var(--cs-color-border-subtle)]' },
    { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] [--code-diff-edge:var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] [--code-diff-edge:var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] [--code-diff-edge:var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] [--code-diff-edge:var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] [--code-diff-edge:var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] [--code-diff-edge:var(--cs-color-agent-border)]' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-tint' },
    { variant: 'soft', tone: 'success', className: 'bg-success-tint' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-tint' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-tint' },
    { variant: 'soft', tone: 'info', className: 'bg-info-tint' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-tint' },
  ],
  defaultVariants: { variant: 'outline', tone: 'neutral', size: 'md', radius: 'xl', shadow: 'none' },
});

/** The header: a raised control band (surface.raised over the hairline) so the file name and review actions read apart from
 *  the code. Its fill would cover the card's inset edge, so it redraws that edge on its top and sides (--code-diff-edge, set
 *  by the outline card) and inherits the card's top corners. */
export const codeDiffHeader = cva([
  'flex min-h-tab-h flex-wrap items-center gap-x-2 gap-y-1 rounded-t-[inherit] border-b border-border-subtle bg-surface-raised py-1 pl-3 pr-2 font-ui text-footnote text-text-primary',
  'shadow-[inset_0_1px_0_var(--code-diff-edge,transparent),inset_1px_0_0_var(--code-diff-edge,transparent),inset_-1px_0_0_var(--code-diff-edge,transparent)]',
]);

export const codeDiffIcon = cva('inline-flex size-icon-sm shrink-0 text-text-secondary [&_svg]:size-full');

export const codeDiffFilename = cva('min-w-0 break-all font-mono text-footnote text-text-primary');

export const codeDiffStatAdd = cva('font-mono text-mono-md font-normal text-diff-add-text');

export const codeDiffStatDel = cva('font-mono text-mono-md font-normal text-diff-remove-text');

export const codeDiffActions = cva('ms-auto flex shrink-0 items-center gap-0.5');

export const codeDiffBody = cva('m-0 overflow-x-auto py-1.5 outline-none focus-visible:shadow-focus');

/** One line: grid 34 / 16 / 1fr plus a 12px end track, no wrap; 20px high at md, stepping with the CodeDiff size. */
export const codeDiffLine = cva(
  'grid grid-cols-[calc(var(--spacing)*8.5)_calc(var(--spacing)*4)_1fr_calc(var(--spacing)*3)] whitespace-pre font-mono text-text-primary',
  {
    variants: {
      kind: { context: '', add: 'bg-diff-add-bg', remove: 'bg-diff-remove-bg' },
      lineSize: { xs: 'h-4 font-mono text-mono-sm', sm: 'h-4.5 font-mono text-mono-md', md: 'h-5 font-mono text-mono-relaxed', lg: 'h-6 font-mono text-mono' },
    },
    defaultVariants: { kind: 'context', lineSize: 'md' },
  },
);

export const codeDiffNumber = cva('select-none pr-2 text-right text-text-tertiary before:content-[attr(data-line)]');

/** Sign column: on changed lines the + / − are semibold in the diff text colour, so a change is found at a glance. (diff.add /
 *  diff.remove are legacy aliases of the line tints, so the sign keeps the darker diff text step.) */
export const codeDiffSign = cva('select-none text-center', {
  variants: { kind: { context: '', add: 'font-semibold text-diff-add-text', remove: 'font-semibold text-diff-remove-text' } },
  defaultVariants: { kind: 'context' },
});

export const codeDiffContent = cva('');

export const codeDiffToken = cva('', {
  variants: {
    syntax: { keyword: 'text-syntax-keyword', string: 'text-syntax-string', property: 'text-syntax-property', comment: 'text-syntax-comment' },
  },
  defaultVariants: { syntax: 'keyword' },
});
