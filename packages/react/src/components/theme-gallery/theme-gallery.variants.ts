import { cva } from 'class-variance-authority';

export const themeGalleryVariants = cva('grid grid-cols-[repeat(auto-fill,minmax(var(--cs-size-theme-card-min),1fr))] gap-3');

/**
 * One theme card. The checked card draws the focus ring (outer) over elevation 2 and 3; hover lifts 2px over the base
 * duration with the spring easing and swaps the hairline for the default edge and elevation 3.
 */
export const themeGalleryItemVariants = cva([
  'grid overflow-hidden rounded-2xl bg-surface-base text-left font-ui text-ui text-text-primary outline-none',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
  'transition-[transform,box-shadow] duration-base ease-spring motion-reduce:transition-none',
  'hover:-translate-y-0.5 hover:shadow-[var(--cs-elevation-3)] motion-reduce:hover:translate-y-0',
  'aria-checked:shadow-[var(--cs-focus),var(--cs-elevation-3)]',
  'aria-checked:hover:shadow-[var(--cs-focus),var(--cs-elevation-3)]',
  'focus-visible:shadow-[var(--cs-focus),var(--cs-elevation-3)]',
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
export const themeGallerySwatchesVariants = cva('flex');
export const themeGallerySwatchVariants = cva('size-3 rounded-full shadow-[0_0_0_1.5px_var(--cs-color-surface-base)] not-first:-ml-0.75');
