import { cva } from 'class-variance-authority';

// ColorPicker.Swatches. The part's common props map onto axes with their own names (swatchTone, swatchVariant, swatchGap,
// swatchShadow, swatchRadius) so they do not shadow the ColorPicker root axes.
// tone sets --tone-solid, the token dot (accent by default). variant: outline = swatches with the swatch.edge hairline (the
// specimen); solid = bare colour, no hairline; soft = hairline swatches on a neutral.well tray (6px padding); ghost = bare
// colour, the hairline only under the pointer. Selection is the check alone in every variant, no ring (owner 2026-10-28).
// size steps the gap; radius sets the swatch corner, shadow the strip (tray) elevation.
export const colorPickerSwatchesVariants = cva('grid grid-cols-(--swatch-cols) gap-1.5', {
  variants: {
    swatchTone: {
      neutral: '[--tone-solid:var(--cs-color-neutral-solid)]',
      accent: '[--tone-solid:var(--cs-color-accent-solid)]',
      success: '[--tone-solid:var(--cs-color-success-solid)]',
      warning: '[--tone-solid:var(--cs-color-warning-solid)]',
      danger: '[--tone-solid:var(--cs-color-danger-solid)]',
      info: '[--tone-solid:var(--cs-color-info-solid)]',
      agent: '[--tone-solid:var(--cs-color-agent-solid)]',
    },
    swatchVariant: { outline: '', solid: '', soft: 'rounded-md bg-neutral-well p-1.5', ghost: '' },
    swatchGap: { xs: 'gap-1', sm: 'gap-1', md: '', lg: 'gap-2' },
    swatchShadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { swatchTone: 'accent', swatchVariant: 'outline', swatchGap: 'md', swatchShadow: 'none' },
});

export const colorPickerSwatchVariants = cva(
  [
    'relative aspect-square min-w-0 cursor-pointer rounded-sm bg-(--swatch) outline-none',
    'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
    'transition-control',
    // Checked draws no ring or border of its own: the check alone overlays the swatch (owner 2026-10-28). Keyboard focus
    // keeps the focus ring, checked or not.
    'focus-visible:shadow-focus',
  ],
  {
    variants: {
      swatchVariant: {
        outline: '',
        solid: 'shadow-none',
        soft: '',
        ghost: 'shadow-none hover:shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
      },
      // The default key keeps the own swatch corner (sm); every other key sets that radius token.
      swatchRadius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: '', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    },
    defaultVariants: { swatchVariant: 'outline', swatchRadius: 'sm' },
  },
);

/** The selection check: a bare 14px check (stroke 3) centred on the checked swatch, media.on with a scrim drop shadow so it reads on any user colour (owner 2026-10-27). It pops when it mounts (the swatch was just picked). */
export const colorPickerSwatchCheckVariants = cva(
  'pointer-events-none absolute inset-0 m-auto grid size-icon-sm animate-pop place-items-center text-media-on [&_svg]:size-full [&_svg]:[filter:drop-shadow(0_0_1px_var(--cs-color-media-scrim))]',
);

export const colorPickerSwatchDotVariants = cva(
  'pointer-events-none absolute -right-0.5 -bottom-0.5 size-1.75 rounded-full bg-(--tone-solid) shadow-[0_0_0_1.5px_var(--cs-color-surface-base)]',
);
