import { cva, type VariantProps } from 'class-variance-authority';

// The field family (stepper-input, tag-input, textarea): tone sets the --tone-* slots, variant picks the rest look.
//   outline  surface.translucent fill + 1px tone edge (border.default when neutral): the specimen
//   soft     tone soft fill (neutral.track when neutral), no edge
//   solid    raised fill + edge: control.raised + control.edge when neutral, tone tint + tone border otherwise
//   ghost    no fill, no edge until focus
// Focus, invalid and disabled are drawn on top of every variant and never change with it.
export const tagInputVariants = cva(
  [
    'flex min-w-0 cursor-text flex-wrap items-center gap-1 rounded-xl px-2 py-1.5 text-ui transition-[box-shadow,background-color] duration-120 ease-out',
    // Focus is a fill change (owner 2026-10-28, field/input proposal 2): neutral.well, surface.base on the grey soft fill;
    // focus-field is the resting border.default hairline.
    'focus-within:bg-neutral-well focus-within:shadow-[var(--cs-focus-field)]',
    // The invalid edge is for an enabled field: disabled drops the tone, so a disabled invalid field shows the disabled edge.
    'data-[invalid]:not-data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] data-[invalid]:focus-within:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]',
    'data-[disabled]:pointer-events-none data-[disabled]:bg-disabled-fill data-[disabled]:text-disabled-text data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
    // Tags in a disabled field drop their colour with it (the chips are inert, not disabled), the remove glyph included.
    'data-[disabled]:[&_[data-slot=chip]]:text-disabled-text data-[disabled]:[&_[data-slot=chip]]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
    'data-[disabled]:[&_[data-slot=chip-remove]]:text-disabled-text',
  ],
  {
    variants: {
      tone: {
      neutral: '[--tone-edge:var(--cs-color-border-default)] [--tone-fill:var(--cs-color-neutral-track)] [--tone-raised:var(--cs-color-control-raised)] [--tone-raised-edge:var(--cs-color-control-edge)]',
      accent: '[--tone-edge:var(--cs-color-accent-border)] [--tone-fill:var(--cs-color-accent-soft)] [--tone-raised:var(--cs-color-accent-tint)] [--tone-raised-edge:var(--cs-color-accent-border)]',
      success: '[--tone-edge:var(--cs-color-success-border)] [--tone-fill:var(--cs-color-success-soft)] [--tone-raised:var(--cs-color-success-tint)] [--tone-raised-edge:var(--cs-color-success-border)]',
      warning: '[--tone-edge:var(--cs-color-warning-border)] [--tone-fill:var(--cs-color-warning-soft)] [--tone-raised:var(--cs-color-warning-tint)] [--tone-raised-edge:var(--cs-color-warning-border)]',
      danger: '[--tone-edge:var(--cs-color-danger-border)] [--tone-fill:var(--cs-color-danger-soft)] [--tone-raised:var(--cs-color-danger-tint)] [--tone-raised-edge:var(--cs-color-danger-border)]',
      info: '[--tone-edge:var(--cs-color-info-border)] [--tone-fill:var(--cs-color-info-soft)] [--tone-raised:var(--cs-color-info-tint)] [--tone-raised-edge:var(--cs-color-info-border)]',
      agent: '[--tone-edge:var(--cs-color-agent-border)] [--tone-fill:var(--cs-color-agent-soft)] [--tone-raised:var(--cs-color-agent-tint)] [--tone-raised-edge:var(--cs-color-agent-border)]',
      },
      variant: {
        outline: 'bg-surface-translucent shadow-[inset_0_0_0_1px_var(--tone-edge)]',
        soft: 'bg-(--tone-fill) focus-within:bg-surface-base',
        solid: 'bg-(--tone-raised) shadow-[inset_0_0_0_1px_var(--tone-raised-edge)]',
        ghost: 'bg-transparent',
      },
      size: { xs: 'min-h-control-md px-1.5 py-1 text-ui-sm', sm: 'min-h-field-sm py-1', md: 'min-h-field-md', lg: 'min-h-field-lg px-2.5 py-2 text-ui-lg' },
      // The default key keeps the component's own corner and shadow (''); every other key sets that token (the radiusClass / shadowClass names of common-props.ts, written out so Tailwind, which scans ./components only, generates them).
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    },
    defaultVariants: { tone: 'neutral', variant: 'outline', size: 'md', radius: 'xl', shadow: 'none' },
  },
);

export type TagInputVariantProps = VariantProps<typeof tagInputVariants>;
