import { cva } from 'class-variance-authority';

export const themeGalleryVariants = cva('grid grid-cols-[repeat(auto-fill,minmax(var(--cs-size-theme-card-min),1fr))] gap-3');

/**
 * One theme card. At rest a hairline, no elevation (one depth cue); hover lifts 2px over the base duration with the spring easing and
 * swaps the hairline for elevation 3. The checked card draws a 1.5px inset ring in the selection ink (selection.fill:
 * the preview is the content and cannot invert, so the ring carries the one selection colour) over elevation 3 and a check
 * in the meta row, never the focus ring.
 */
export const themeGalleryItemVariants = cva([
  'grid overflow-hidden rounded-2xl bg-surface-base text-left font-ui text-ui text-text-primary outline-none',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
  'transition-[transform,box-shadow] duration-base ease-spring motion-reduce:transition-none',
  'hover:-translate-y-0.5 hover:shadow-[var(--cs-elevation-3)] motion-reduce:hover:translate-y-0',
  'aria-checked:shadow-[inset_0_0_0_1.5px_var(--cs-color-selection-fill),var(--cs-elevation-3)]',
  'aria-checked:hover:shadow-[inset_0_0_0_1.5px_var(--cs-color-selection-fill),var(--cs-elevation-3)]',
  'focus-visible:shadow-[var(--cs-focus),var(--cs-elevation-3)]',
  'aria-checked:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-selection-fill),var(--cs-focus),var(--cs-elevation-3)]',
]);

export const themeGalleryPreviewVariants = cva(
  'm-2 grid h-theme-preview-h grid-cols-[calc(var(--spacing)*8)_1fr] gap-1.5 overflow-hidden rounded-md bg-(--m-bg) p-2 shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]',
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
/** The check of the checked card (row G): the solid check mark of choice-cards and card-action, before the dots. */
export const themeGalleryCheckVariants = cva('pointer-events-none inline-grid size-check shrink-0 place-items-center rounded-full bg-accent-solid text-accent-on [&_svg]:size-icon-sm [&_svg]:stroke-3');
export const themeGallerySwatchesVariants = cva('flex');
export const themeGallerySwatchVariants = cva('size-3 rounded-full shadow-[0_0_0_1.5px_var(--cs-color-surface-base)] not-first:-ml-0.75');
