import { cva, type VariantProps } from 'class-variance-authority';

/**
 * The width comes from --side-panel-w: the preset's token by default, an inline value once the panel is resized.
 * Common props (owner 2026-10-26). variant is the surface (the deprecated appearance maps onto it: floating = solid,
 * docked = outline):
 *   solid   floating: an inset thick-material card, panel radius, elevation 2 (today's default)
 *   soft    floating, with the tone soft 3 as the material (opaque)
 *   outline docked: a flat surface.base column, no radius, one hairline on the edge facing the stage
 *   ghost   docked without the hairline
 * tone is the hue of the edge: a 1px rim on solid (none for neutral), the soft material, the docked hairline (neutral =
 * border.subtle). radius: 3xl (the default) keeps the variant's own corner (panel when floating, none when docked);
 * shadow: 2 (the default) keeps the variant's own elevation (2 floating, none docked); other values set them.
 * The material and the elevation are single classes (glass-thick, glass-shadow-*), as in the menu surface.
 */
export const sidePanelVariants = cva(
  [
    'relative flex min-h-0 flex-none flex-col self-stretch font-ui text-text-primary',
    'transition-[width,visibility] duration-base ease-standard motion-reduce:transition-none',
  ],
  {
    variants: {
      side: { start: '', end: '' },
      variant: {
        solid: 'glass glass-thick glass-shadow-2 rounded-panel',
        soft: 'glass glass-shadow-2 rounded-panel',
        outline: 'rounded-none bg-surface-base',
        ghost: 'rounded-none bg-surface-base',
      },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      preset: {
        inspector: '[--side-panel-w:var(--cs-studio-inspector-w)]',
        pane: '[--side-panel-w:var(--cs-studio-pane-w)]',
        wide: '[--side-panel-w:var(--cs-studio-pane-max)]',
      },
      radius: {
        none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
        xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': '', '4xl': 'rounded-4xl', full: 'rounded-full',
      },
      shadow: {
        none: '[--cs-shadow:none] shadow-none', '1': 'glass-shadow-1 shadow-1', '2': '', '3': 'glass-shadow-3 shadow-3',
        '4': 'glass-shadow-4 shadow-4', '5': 'glass-shadow-5 shadow-5',
      },
      size: { xs: '', sm: '', md: '', lg: '' },
    },
    compoundVariants: [
      { variant: 'outline', side: 'start', className: 'border-r' },
      { variant: 'outline', side: 'end', className: 'border-l' },
      { variant: 'outline', tone: 'neutral', className: 'border-border-subtle' },
    { variant: 'outline', tone: 'accent', className: 'border-accent-border' },
    { variant: 'outline', tone: 'success', className: 'border-success-border' },
    { variant: 'outline', tone: 'warning', className: 'border-warning-border' },
    { variant: 'outline', tone: 'danger', className: 'border-danger-border' },
    { variant: 'outline', tone: 'info', className: 'border-info-border' },
    { variant: 'outline', tone: 'agent', className: 'border-agent-border' },
    { variant: 'solid', tone: 'accent', className: 'outline outline-1 -outline-offset-1 outline-accent-border' },
    { variant: 'solid', tone: 'success', className: 'outline outline-1 -outline-offset-1 outline-success-border' },
    { variant: 'solid', tone: 'warning', className: 'outline outline-1 -outline-offset-1 outline-warning-border' },
    { variant: 'solid', tone: 'danger', className: 'outline outline-1 -outline-offset-1 outline-danger-border' },
    { variant: 'solid', tone: 'info', className: 'outline outline-1 -outline-offset-1 outline-info-border' },
    { variant: 'solid', tone: 'agent', className: 'outline outline-1 -outline-offset-1 outline-agent-border' },
    { variant: 'soft', tone: 'neutral', className: '[--cs-material:var(--cs-color-neutral-soft)]' },
    { variant: 'soft', tone: 'accent', className: '[--cs-material:var(--cs-color-accent-soft)]' },
    { variant: 'soft', tone: 'success', className: '[--cs-material:var(--cs-color-success-soft)]' },
    { variant: 'soft', tone: 'warning', className: '[--cs-material:var(--cs-color-warning-soft)]' },
    { variant: 'soft', tone: 'danger', className: '[--cs-material:var(--cs-color-danger-soft)]' },
    { variant: 'soft', tone: 'info', className: '[--cs-material:var(--cs-color-info-soft)]' },
    { variant: 'soft', tone: 'agent', className: '[--cs-material:var(--cs-color-agent-soft)]' },
    ],
    defaultVariants: { side: 'start', variant: 'solid', tone: 'neutral', preset: 'pane', radius: '3xl', shadow: '2', size: 'md' },
  },
);

/**
 * Header row. size steps its height and the title (md = control-xl 48 / title-4, today). The component passes
 * dividers only once the body has scrolled, so the hairline never doubles a first row's own line at rest.
 */
export const sidePanelHeaderVariants = cva('group/side-panel-header flex flex-none items-center gap-2 border-b px-inset-regular-x', {
  variants: {
    dividers: { true: 'border-border-subtle', false: 'border-transparent' },
    size: { xs: 'min-h-control-md py-1', sm: 'min-h-control-lg py-1.5', md: 'min-h-control-xl py-2', lg: 'min-h-control-xl py-2.5' },
  },
  defaultVariants: { dividers: true, size: 'md' },
});

/**
 * The collapse button shows on header hover or when focus is in the header; it stays visible on touch (no hover) and
 * keeps its hit area and focus ring while hidden.
 */
export const sidePanelCollapseClass = 'opacity-0 group-hover/side-panel-header:opacity-100 group-focus-within/side-panel-header:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100';

export const sidePanelTitleVariants = cva('min-w-0 flex-1 truncate font-ui text-text-primary', {
  variants: { size: { xs: 'text-ui-strong', sm: 'text-ui-md', md: 'text-title-4', lg: 'text-title-3' } },
  defaultVariants: { size: 'md' },
});

export const sidePanelFooterVariants = cva('flex flex-none items-center gap-2 border-t px-inset-regular-x', {
  variants: {
    dividers: { true: 'border-border-subtle', false: 'border-transparent' },
    size: { xs: 'py-1.5', sm: 'py-2', md: 'py-3', lg: 'py-3.5' },
  },
  defaultVariants: { dividers: true, size: 'md' },
});

export type SidePanelVariantProps = VariantProps<typeof sidePanelVariants>;
