import { cva } from 'class-variance-authority';

// Common props (lib/common-props.ts): variant = the surface (solid, the default dialog, is the thick floating material;
// embedded pickers default to ghost: no surface), shadow = the material elevation (glass-shadow; ColorPicker adds
// shadowClass for the non-glass variants), size = the body padding and gaps (body variants below; the width stays
// size-color-picker-w), tone = the paint-type glyphs at rest (type variants below); radius is applied by ColorPicker
// with radiusClass after these classes.
// The motion is the popover's (ColorPickerPopover is a Radix content that passes its state and origin to this root); a
// picker that is not a Radix content has no data-state and does not animate.
export const colorPickerVariants = cva('relative grid max-w-full text-ui text-text-primary outline-none origin-(--radix-popover-content-transform-origin) data-[state=open]:animate-enter data-[state=closed]:animate-exit enter-scale enter-from-side', {
  variants: {
    embedded: {
      false: 'z-40 w-color-picker-w overflow-hidden rounded-2xl',
      true: 'w-full',
    },
    variant: {
      solid: 'glass glass-thick',
      soft: 'bg-neutral-track',
      outline: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
      ghost: '',
    },
    shadow: { none: '[--cs-shadow:none]', '1': 'glass-shadow-1', '2': 'glass-shadow-2', '3': 'glass-shadow-3', '4': 'glass-shadow-4', '5': 'glass-shadow-5' },
    size: { xs: '', sm: '', md: '', lg: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
  },
  defaultVariants: { embedded: false, variant: 'solid', shadow: '4', size: 'md', tone: 'neutral', radius: '2xl' },
});

export const colorPickerHeaderVariants = cva('flex items-center gap-1 px-2 pt-2');

// The custom tab's parts (types, body, swatch foot) fade in when the tab changes to them. The enter offsets are reset to
// rest: they inherit from a Radix popover's enter modifiers, and this fade is opacity only.
export const colorPickerTypesVariants = cva(['flex gap-0.5 px-2 pt-2', 'animate-enter [--cs-enter-x:0] [--cs-enter-y:0] [--cs-enter-scale:1]']);

export const colorPickerTypeVariants = cva(
  [
    'grid size-control-sm shrink-0 cursor-pointer place-items-center rounded-md outline-none',
    'transition-control press-sm',
    'hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus',
    // Checked inverts (selected utility: ink fill, paper glyph, no edge); disabled drops the inversion to disabled colour.
    'aria-checked:not-disabled:selected aria-checked:not-disabled:hover:bg-selection-fill-hover',
    'disabled:cursor-default disabled:text-disabled-text disabled:hover:bg-transparent disabled:aria-checked:bg-disabled-fill',
    '[&_svg]:size-icon-sm [&_svg]:stroke-[1.75]',
  ],
  {
    // The rest glyph colour by the picker tone (neutral = tertiary); hover and checked are the same in every tone.
    variants: {
      typeTone: {
        neutral: 'text-text-tertiary', accent: 'text-accent-text', success: 'text-success-text', warning: 'text-warning-text',
        danger: 'text-danger-text', info: 'text-info-text', agent: 'text-agent-text',
      },
    },
    defaultVariants: { typeTone: 'neutral' },
  },
);

export const colorPickerGlyphVariants = cva('block size-icon-sm rounded-xs shadow-[inset_0_0_0_1.5px_currentColor]', {
  variants: {
    kind: {
      solid: 'bg-current',
      linear: 'bg-[linear-gradient(90deg,currentColor,transparent)]',
      radial: 'rounded-full bg-[radial-gradient(currentColor,transparent_70%)]',
      angular: 'rounded-full bg-[conic-gradient(currentColor,transparent)]',
      diamond: 'rotate-45 scale-[0.82] bg-[linear-gradient(currentColor,transparent)]',
    },
  },
  defaultVariants: { kind: 'solid' },
});

export const colorPickerBodyVariants = cva(['grid', 'animate-enter [--cs-enter-x:0] [--cs-enter-y:0] [--cs-enter-scale:1]'], {
  variants: {
    embedded: { false: '', true: '' },
    bodySize: { xs: 'gap-1.5', sm: 'gap-2', md: 'gap-2.5', lg: 'gap-3' },
  },
  // The dialog pads its body by the size; an embedded picker sits flush in its owner.
  compoundVariants: [
    { embedded: false, bodySize: 'xs', className: 'p-1.5' },
    { embedded: false, bodySize: 'sm', className: 'p-2' },
    { embedded: false, bodySize: 'md', className: 'p-2.5' },
    { embedded: false, bodySize: 'lg', className: 'p-3' },
  ],
  defaultVariants: { embedded: false, bodySize: 'md' },
});

export const colorPickerSlidersVariants = cva('grid items-center gap-2', {
  variants: { picker: { true: 'grid-cols-[auto_1fr_auto]', false: 'grid-cols-[1fr_auto]' } },
  defaultVariants: { picker: true },
});

export const colorPickerTracksVariants = cva('grid min-w-0 gap-2.5');

export const colorPickerPreviewVariants = cva(
  'checker relative block size-color-preview shrink-0 overflow-hidden rounded-md shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
);

export const colorPickerFieldsVariants = cva(
  'grid h-control-md grid-cols-[var(--cs-size-picker-format-w)_1fr_var(--cs-size-picker-alpha-w)] gap-1',
);

// An inline select (owner 2026-10-27, proposal C): label and chevron only, no well until hover, so it does not read as a text field.
export const colorPickerFormatVariants = cva(
  [
    'flex h-control-md w-picker-format-w cursor-pointer items-center justify-between rounded-md bg-transparent pr-1.5 pl-2 text-ui-sm font-normal text-text-primary outline-none',
    'transition-control hover:bg-neutral-hover focus-visible:shadow-focus',
    '[&_svg]:size-icon-xs [&_svg]:text-text-tertiary [&_svg]:stroke-[1.75]',
  ],
);

export const colorPickerFootVariants = cva(['grid gap-1.5 border-t border-border-subtle px-2.5 py-2', 'animate-enter [--cs-enter-x:0] [--cs-enter-y:0] [--cs-enter-scale:1]']);

/** The painted layer of the preview: the picked color, or the hatch of a mixed selection. */
export const colorPickerPreviewFillVariants = cva('absolute inset-0', {
  variants: {
    mixed: {
      true: 'bg-[repeating-linear-gradient(135deg,var(--cs-color-neutral-selected)_0_calc(var(--spacing)*0.75),transparent_calc(var(--spacing)*0.75)_calc(var(--spacing)*1.5))]',
      false: 'bg-(--picked)',
    },
  },
  defaultVariants: { mixed: false },
});
