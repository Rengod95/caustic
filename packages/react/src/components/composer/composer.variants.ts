import { cva } from 'class-variance-authority';

// The box owns the one focus edge (P9): focus-within adds the focus-field hairline, the native textarea draws nothing.
// Focus is a fill change, as in Input (owner 2026-10-28, field/input proposal 2): a white or bare box (solid, outline, ghost)
// turns neutral.well, the grey soft box turns surface.base. The hairline alone is the resting edge of outline.
// Common props (lib/common-props.ts): variant = the box surface (solid, the default, is the regular floating material),
// shadow = its elevation (--composer-elev, kept under the focus ring and the disabled edge), size = padding, gap and the
// text size (input variants below), tone = the usage ring arc (usage variants below); radius is applied by Composer with
// radiusClass after these classes.
export const composerVariants = cva([
  'grid cursor-text rounded-2xl',
  'transition-[box-shadow,background-color] duration-quick',
  // Disabled is a colour, not opacity: the box takes the disabled fill and edge (the elevation is kept) and the context
  // chips drop to the disabled text and edge (they are inert, not disabled); the tone drops out.
  'data-[disabled]:pointer-events-none',
  'data-[disabled]:[&_[data-slot=chip]]:text-disabled-text data-[disabled]:[&_[data-slot=chip]]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  'data-[disabled]:[&_[data-slot=chip-icon]]:text-disabled-text data-[disabled]:[&_[data-slot=chip-remove]]:text-disabled-text',
], {
  variants: {
    variant: {
      solid: [
        'glass [--cs-shadow:var(--composer-elev)]',
        'focus-within:bg-neutral-well focus-within:[--cs-shadow:var(--cs-focus-field),var(--composer-elev)]',
        'data-[disabled]:[--cs-material:var(--cs-color-disabled-fill)] data-[disabled]:[--cs-shadow:inset_0_0_0_1px_var(--cs-color-disabled-border),var(--composer-elev)]',
      ],
      outline: [
        'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-default),var(--composer-elev)]',
        'focus-within:bg-neutral-well focus-within:shadow-[var(--cs-focus-field),var(--composer-elev)]',
        'data-[disabled]:bg-disabled-fill data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border),var(--composer-elev)]',
      ],
      soft: [
        'bg-neutral-track shadow-[var(--composer-elev)] focus-within:bg-surface-base focus-within:shadow-[var(--cs-focus-field),var(--composer-elev)]',
        'data-[disabled]:bg-disabled-fill data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border),var(--composer-elev)]',
      ],
      ghost: [
        'bg-transparent shadow-[var(--composer-elev)] focus-within:bg-neutral-well focus-within:shadow-[var(--cs-focus-field),var(--composer-elev)]',
        'data-[disabled]:bg-disabled-fill data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border),var(--composer-elev)]',
      ],
    },
    shadow: {
      none: '[--composer-elev:0_0_0_0_transparent]',
      '1': '[--composer-elev:var(--cs-elevation-1)]',
      '2': '[--composer-elev:var(--cs-elevation-2)]',
      '3': '[--composer-elev:var(--cs-elevation-3)]',
      '4': '[--composer-elev:var(--cs-elevation-4)]',
      '5': '[--composer-elev:var(--cs-elevation-5)]',
    },
    size: { xs: 'gap-1 p-1', sm: 'gap-1.5 p-1.5', md: 'gap-1.5 p-2', lg: 'gap-2 p-2.5' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
  },
  defaultVariants: { variant: 'solid', shadow: '3', size: 'md', tone: 'accent', radius: '2xl' },
});

export const composerInputVariants = cva(
  'block w-full resize-none border-0 bg-transparent px-1.5 py-1 text-text-primary outline-none placeholder:text-text-placeholder disabled:text-disabled-text disabled:placeholder:text-disabled-text',
  {
    variants: { inputSize: { xs: 'text-ui-sm', sm: 'text-ui', md: 'text-ui-md-relaxed', lg: 'text-body' } },
    defaultVariants: { inputSize: 'md' },
  },
);

/** Type hierarchy (owner, 2026-10-27): the prompt is the one primary text; the context chips are supporting information
 *  (secondary label, tertiary glyph from the chip itself); the model trigger is metadata (tertiary). The disabled rules on
 *  the box are more specific and still win. */
export const composerContextVariants = cva('flex flex-wrap gap-1.5 [&_[data-slot=chip]]:text-text-secondary');

export const composerBarVariants = cva('flex items-center gap-1');

export const composerModelVariants = cva(
  'inline-flex h-control-inline cursor-pointer items-center gap-1 rounded-md pl-2 pr-1.5 text-ui-sm text-text-tertiary outline-none transition-colors duration-quick hover:bg-neutral-hover hover:text-text-primary disabled:text-disabled-text focus-visible:shadow-focus [&_svg]:size-icon-sm',
);

/** The usage ring: track in neutral.track, the arc in the tone's solid (the svg colour); disabled.text when disabled.
 *  Composer picks the tone from the usage: above 80% warning, above 95% danger, otherwise the tone prop. */
export const composerUsageVariants = cva('size-usage-ring shrink-0 fill-none stroke-3 in-data-[disabled]:text-disabled-text', {
  variants: {
    usageTone: {
      neutral: 'text-ink-solid', accent: 'text-accent-solid', success: 'text-success-solid', warning: 'text-warning-solid',
      danger: 'text-danger-solid', info: 'text-info-solid', agent: 'text-agent-solid',
    },
  },
  defaultVariants: { usageTone: 'accent' },
});

/** The stop form keeps the ink solid of the send control (hover and pressed stay inside solid). */
export const composerStopVariants = cva('hover:scale-100');
