import { cva, type VariantProps } from 'class-variance-authority';

// One focus edge (P9): the container shows focus-field (its border.default hairline); the native textarea draws nothing.
// Focus is a fill change (owner 2026-10-28, field/input proposal 2): outline, solid and ghost turn neutral.well, soft
// (already grey) turns surface.base.
// The invalid and readonly looks apply only while enabled, so a disabled field drops its tone and shows the disabled axis.
export const textareaVariants = cva(
  [
    'grid min-w-0 cursor-text rounded-xl transition-[box-shadow,background-color] duration-120 ease-out',
    'focus-within:bg-neutral-well focus-within:shadow-[var(--cs-focus-field)] hover:focus-within:shadow-[var(--cs-focus-field)]',
    'data-[invalid]:not-data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]',
    'data-[readonly]:not-data-[disabled]:bg-bg-inset data-[readonly]:not-data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] data-[readonly]:focus-within:shadow-[var(--cs-focus-field)]',
    'data-[disabled]:pointer-events-none data-[disabled]:bg-disabled-fill data-[disabled]:text-disabled-text data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  ],
  {
    variants: {
      // The field family (stepper-input, tag-input, textarea): tone sets the --tone-* slots, variant the rest look:
      // outline = surface.translucent + tone edge (the specimen; hover steps it to border.strong, tone border-strong when toned), soft = tone soft fill, solid = raised
      // fill + edge, ghost = no fill or edge until focus. Focus, invalid, readonly and disabled draw on top of every variant.
      tone: {
        neutral: '[--tone-edge:var(--cs-color-border-default)] [--tone-edge-hover:var(--cs-color-border-strong)] [--tone-fill:var(--cs-color-neutral-track)] [--tone-raised:var(--cs-color-control-raised)] [--tone-raised-edge:var(--cs-color-control-edge)]',
        accent: '[--tone-edge:var(--cs-color-accent-border)] [--tone-edge-hover:var(--cs-color-accent-border-strong)] [--tone-fill:var(--cs-color-accent-soft)] [--tone-raised:var(--cs-color-accent-tint)] [--tone-raised-edge:var(--cs-color-accent-border)]',
        success: '[--tone-edge:var(--cs-color-success-border)] [--tone-edge-hover:var(--cs-color-success-border-strong)] [--tone-fill:var(--cs-color-success-soft)] [--tone-raised:var(--cs-color-success-tint)] [--tone-raised-edge:var(--cs-color-success-border)]',
        warning: '[--tone-edge:var(--cs-color-warning-border)] [--tone-edge-hover:var(--cs-color-warning-border-strong)] [--tone-fill:var(--cs-color-warning-soft)] [--tone-raised:var(--cs-color-warning-tint)] [--tone-raised-edge:var(--cs-color-warning-border)]',
        danger: '[--tone-edge:var(--cs-color-danger-border)] [--tone-edge-hover:var(--cs-color-danger-border-strong)] [--tone-fill:var(--cs-color-danger-soft)] [--tone-raised:var(--cs-color-danger-tint)] [--tone-raised-edge:var(--cs-color-danger-border)]',
        info: '[--tone-edge:var(--cs-color-info-border)] [--tone-edge-hover:var(--cs-color-info-border-strong)] [--tone-fill:var(--cs-color-info-soft)] [--tone-raised:var(--cs-color-info-tint)] [--tone-raised-edge:var(--cs-color-info-border)]',
        agent: '[--tone-edge:var(--cs-color-agent-border)] [--tone-edge-hover:var(--cs-color-agent-border-strong)] [--tone-fill:var(--cs-color-agent-soft)] [--tone-raised:var(--cs-color-agent-tint)] [--tone-raised-edge:var(--cs-color-agent-border)]',
      },
      variant: {
        outline: 'bg-surface-translucent shadow-[inset_0_0_0_1px_var(--tone-edge)] hover:shadow-[inset_0_0_0_1px_var(--tone-edge-hover)]',
        soft: 'bg-(--tone-fill) focus-within:bg-surface-base',
        solid: 'bg-(--tone-raised) shadow-[inset_0_0_0_1px_var(--tone-raised-edge)]',
        ghost: 'bg-transparent',
      },
      // sm and xs: the specimen's inspector field is a textarea with the browser's 2px default padding; the 2px frame reproduces it.
      size: { xs: 'p-0.5', sm: 'p-0.5', md: '', lg: '' },
        // The default key keeps the component's own corner and shadow (''); every other key sets that token (the radiusClass / shadowClass names of common-props.ts, written out so Tailwind, which scans ./components only, generates them).
        radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
        shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    },
    defaultVariants: { tone: 'neutral', variant: 'outline', size: 'md', radius: 'xl', shadow: 'none' },
  },
);

export const textareaControlVariants = cva(
  'block w-full min-w-0 border-0 bg-transparent text-text-primary outline-none placeholder:text-text-placeholder in-data-[readonly]:not-disabled:text-text-secondary disabled:text-disabled-text disabled:placeholder:text-disabled-text',
  {
    variants: {
      size: {
        xs: 'resize-none px-2 py-1.5 text-ui-sm',
        sm: 'resize-none px-2.5 py-2 text-ui',
        md: 'min-h-textarea-min resize-y px-3 py-2.5 text-ui-relaxed',
        lg: 'min-h-textarea-min resize-y px-4 py-3 text-ui-lg',
      },
    },
    defaultVariants: { size: 'md' },
  },
);
export type TextareaVariantProps = VariantProps<typeof textareaVariants>;
