import { cva, type VariantProps } from 'class-variance-authority';

// tone sets --tone-soft and --tone-text, the style-runs notice (warning by default). variant is the section container:
// ghost = none (the specimen, the inspector panel draws it); soft = neutral.well fill; outline = border.subtle hairline;
// solid = surface.raised fill; the three containers pad 12px. size steps the row gap; the composed controls stay xs.
export const textPropertiesVariants = cva('flex min-w-0 flex-col gap-2 font-ui', {
  variants: {
    tone: {
      neutral: '[--tone-soft:var(--cs-color-neutral-soft)] [--tone-text:var(--cs-color-neutral-text)]',
      accent: '[--tone-soft:var(--cs-color-accent-soft)] [--tone-text:var(--cs-color-accent-text)]',
      success: '[--tone-soft:var(--cs-color-success-soft)] [--tone-text:var(--cs-color-success-text)]',
      warning: '[--tone-soft:var(--cs-color-warning-soft)] [--tone-text:var(--cs-color-warning-text)]',
      danger: '[--tone-soft:var(--cs-color-danger-soft)] [--tone-text:var(--cs-color-danger-text)]',
      info: '[--tone-soft:var(--cs-color-info-soft)] [--tone-text:var(--cs-color-info-text)]',
      agent: '[--tone-soft:var(--cs-color-agent-soft)] [--tone-text:var(--cs-color-agent-text)]',
    },
    variant: {
      ghost: '',
      soft: 'bg-neutral-well p-3',
      outline: 'p-3 shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)]',
      solid: 'bg-surface-raised p-3',
    },
    size: { xs: 'gap-1', sm: 'gap-1.5', md: '', lg: 'gap-3' },
      // The default key keeps the component's own corner and shadow (''); every other key sets that token (the radiusClass / shadowClass names of common-props.ts, written out so Tailwind, which scans ./components only, generates them).
      radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { tone: 'warning', variant: 'ghost', size: 'md', radius: 'none', shadow: 'none' },
});

export const textPropertiesTwoColumnVariants = cva('grid grid-cols-2 gap-1.5');

export const textPropertiesRowVariants = cva('flex items-center justify-between gap-2');

export const textPropertiesNoticeVariants = cva('grid grid-cols-[auto_1fr] gap-2 rounded-lg bg-(--tone-soft) px-2.5 py-2 text-hint text-text-primary');

export const textPropertiesNoticeIconVariants = cva('mt-0.25 inline-flex size-icon-sm text-(--tone-text) [&_svg]:size-full');

export type TextPropertiesVariantProps = VariantProps<typeof textPropertiesVariants>;
