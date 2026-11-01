import { cva } from 'class-variance-authority';

// The five common props are set on ThemeGallery and reach every card. tone sets --tone-solid / --tone-on, the check mark
// of the checked card (accent by default); the selection ring stays the ink ring. size steps the grid gap.
export const themeGalleryVariants = cva('grid grid-cols-[repeat(auto-fill,minmax(var(--cs-size-theme-card-min),1fr))] gap-3', {
  variants: {
    tone: {
      neutral: '[--tone-solid:var(--cs-color-neutral-solid)] [--tone-on:var(--cs-color-neutral-on)]',
      accent: '[--tone-solid:var(--cs-color-accent-solid)] [--tone-on:var(--cs-color-accent-on)]',
      success: '[--tone-solid:var(--cs-color-success-solid)] [--tone-on:var(--cs-color-success-on)]',
      warning: '[--tone-solid:var(--cs-color-warning-solid)] [--tone-on:var(--cs-color-warning-on)]',
      danger: '[--tone-solid:var(--cs-color-danger-solid)] [--tone-on:var(--cs-color-danger-on)]',
      info: '[--tone-solid:var(--cs-color-info-solid)] [--tone-on:var(--cs-color-info-on)]',
      agent: '[--tone-solid:var(--cs-color-agent-solid)] [--tone-on:var(--cs-color-agent-on)]',
    },
    size: { xs: 'gap-1.5', sm: 'gap-2', md: '', lg: 'gap-4' },
  },
  defaultVariants: { tone: 'accent', size: 'md' },
});

/**
 * One theme card. At rest a hairline, no elevation (one depth cue); hover lifts 2px on the spring, presses to 0.97 and
 * swaps the hairline for elevation 3. The checked card draws a 1.5px inset ring in the selection ink (selection.fill:
 * the preview is the content and cannot invert, so the ring carries the one selection colour) over elevation 3 and a check
 * in the meta row, never the focus ring.
 */
export const themeGalleryItemVariants = cva([
  'grid overflow-hidden rounded-2xl bg-surface-base text-left font-ui text-ui text-text-primary outline-none',
  'shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)]',
  // Position and size on the spring; the ring and the elevation (box-shadow) run on quick / out.
  'transition-[translate,scale,box-shadow] duration-[var(--cs-duration-spring),var(--cs-duration-spring),var(--cs-duration-quick)] ease-[var(--cs-ease-spring),var(--cs-ease-spring),var(--cs-ease-out)] lift press',
  'hover:shadow-[var(--cs-elevation-3)]',
  'aria-checked:shadow-[inset_0_0_0_1.5px_var(--cs-color-selection-fill),var(--cs-elevation-3)]',
  'aria-checked:hover:shadow-[inset_0_0_0_1.5px_var(--cs-color-selection-fill),var(--cs-elevation-3)]',
  'focus-visible:shadow-[var(--cs-focus),var(--cs-elevation-3)]',
  'aria-checked:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-selection-fill),var(--cs-focus),var(--cs-elevation-3)]',
], {
  variants: {
    // outline = surface.base + border.subtle hairline (the specimen); solid = surface.raised, no hairline; soft = neutral.well,
    // no hairline; ghost = no fill, no hairline. Hover, checked and focus are the same in every variant.
    variant: {
      outline: '',
      solid: 'bg-surface-raised shadow-none',
      soft: 'bg-neutral-well shadow-none',
      ghost: 'bg-transparent shadow-none',
    },
      // The default key keeps the component's own corner and shadow (''); every other key sets that token (the radiusClass / shadowClass names of common-props.ts, written out so Tailwind, which scans ./components only, generates them).
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': '', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { variant: 'outline', radius: '2xl', shadow: 'none' },
});

export const themeGalleryPreviewVariants = cva(
  'm-2 grid h-theme-preview-h grid-cols-[calc(var(--spacing)*8)_1fr] gap-1.5 overflow-hidden rounded-md bg-(--m-bg) p-2 shadow-[inset_0_0_0_0.5px_var(--cs-color-swatch-edge)]',
);
export const themeGallerySidebarVariants = cva('grid content-start gap-1 rounded-sm bg-(--m-surf) p-1.25');
export const themeGallerySidebarItemVariants = cva('h-1 rounded-2xs bg-(--m-muted) first:bg-(--m-acc)');
export const themeGalleryMainVariants = cva('grid content-start gap-1.25');
export const themeGalleryHeadingBarVariants = cva('h-1.75 w-3/5 rounded-xs bg-(--m-ink)');
export const themeGalleryPanelVariants = cva('grid gap-1 rounded-sm bg-(--m-surf) p-1.5');
export const themeGalleryPanelLineVariants = cva('h-1 rounded-2xs bg-(--m-muted) first:w-4/5 last:w-[55%]');
export const themeGalleryActionsVariants = cva('flex gap-1');
export const themeGalleryActionVariants = cva('h-3 rounded-(--m-r) first:w-8 first:bg-(--m-acc) last:w-6 last:bg-(--m-muted)');

export const themeGalleryMetaVariants = cva('flex items-center gap-2 px-3 pt-0.5 pb-3');
export const themeGalleryNameVariants = cva('text-ui-dense font-semibold text-text-primary');
export const themeGalleryCaptionVariants = cva('text-footnote font-normal text-text-tertiary');
/** The check of the checked card (row G): the solid check mark of CardChoice (and ChoiceGroup cards), before the dots. */
export const themeGalleryCheckVariants = cva('pointer-events-none inline-grid size-check shrink-0 place-items-center rounded-full bg-(--tone-solid) text-(--tone-on) animate-pop [&_svg]:size-icon-sm');
export const themeGallerySwatchesVariants = cva('flex');
export const themeGallerySwatchVariants = cva('size-3 rounded-full shadow-[0_0_0_1.5px_var(--cs-color-surface-base)] not-first:-ml-0.75');
