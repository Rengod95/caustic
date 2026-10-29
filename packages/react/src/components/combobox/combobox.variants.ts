import { cva } from 'class-variance-authority';

/**
 * The stack. Common props (lib/common-props.ts) style the field the user sees: the search Input in inline mode (tone,
 * variant and size are its own axes; radius and shadow its frame), the PickerTrigger in popup mode. These axes only
 * mirror the spec; the defaults are the field's own (outline, neutral, md, xl, none).
 * inline mode: the Input, 6px, then the listbox. popup mode rendered in place: the trigger, then the panel 14px below
 * (font picker; the gap steps with the size: xs 8, sm 12). Floating, the root holds only the trigger.
 */
export const comboboxVariants = cva('grid min-w-0 gap-1.5 outline-none', {
  variants: {
    mode: { inline: '', popup: 'gap-3.5' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
    radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
    shadow: { none: '', '1': '', '2': '', '3': '', '4': '', '5': '' },
  },
  compoundVariants: [
    { mode: 'popup', size: 'xs', className: 'gap-2' },
    { mode: 'popup', size: 'sm', className: 'gap-3' },
  ],
  defaultVariants: { mode: 'inline', tone: 'neutral', variant: 'outline', size: 'md', radius: 'xl', shadow: 'none' },
});

/**
 * The listbox. inline mode: it is the menu surface itself (applied in the component), follows the input width and
 * scrolls past 220px. popup mode: a plain block inside the panel. Rows are 2px apart (owner 2026-10-27 / 10-28, font
 * picker and model menu: rows never touch, so a hovered row and the inverted chosen row stay separate). Ungrouped in a
 * panel it sits 8px under the search (4px search margin + 4px here; owner 2026-10-27, font picker); grouped, the heading
 * margin gives the space (model menu).
 */
export const comboboxListboxVariants = cva('grid min-w-0', {
  variants: {
    mode: { inline: 'max-h-listbox-max overflow-y-auto', popup: '' },
    grouped: { true: '', false: 'gap-0.5' },
  },
  compoundVariants: [{ mode: 'popup', grouped: false, className: 'mt-1' }],
  defaultVariants: { mode: 'inline', grouped: false },
});

/** One group: heading, then its options 2px apart. */
export const comboboxGroupVariants = cva('grid gap-0.5');

/**
 * Option state on top of the menu item anatomy: the chosen option inverts (selected utility: ink fill, paper text, no edge;
 * its leading icon, match, description, meta and trailing check invert with it), never accent soft and never the focus
 * ring. Hover or highlight is the grey fill only (owner 2026-10-27: no outline); on the chosen option it is
 * selection.fill-hover. A disabled chosen option drops the inversion. The row is at least the menu item height and grows
 * with two-line content (renderOption). Applied after the menu item classes.
 */
export const comboboxOptionVariants = cva([
  'h-auto min-h-menu-item',
  'data-[selected]:not-data-[disabled]:selected',
  'data-[selected]:hover:bg-selection-fill-hover data-[selected]:data-[highlighted]:bg-selection-fill-hover',
  'data-[disabled]:data-[selected]:bg-disabled-fill',
]);

/** Leading swatch, icon or tile: 16px icons, tertiary (selection.on-tertiary on the chosen option). Direct icons only, so a tile keeps its own glyph size. */
export const comboboxLeadingVariants = cva('inline-flex shrink-0 items-center text-text-tertiary group-data-[disabled]:text-disabled-text [&>svg]:size-icon-md');

/** Label and description on one baseline (owner 2026-10-28, model menu): the label keeps its width, the description truncates first. */
export const comboboxTextVariants = cva('flex min-w-0 flex-1 items-baseline gap-2');

export const comboboxLabelVariants = cva('max-w-full shrink-0 truncate');

/** One-line summary after the label. Tertiary; on the chosen option selection.on-tertiary; disabled colour. */
export const comboboxDescriptionVariants = cva('min-w-0 truncate text-ui-xs text-text-tertiary group-data-[disabled]:text-disabled-text');

/** Trailing check of the chosen option (secondary, which reads selection.on-secondary on the inverted option); it takes the end position when there is no meta. */
export const comboboxCheckVariants = cva('inline-flex shrink-0 items-center text-text-secondary group-data-[disabled]:text-disabled-text [&_svg]:size-icon-sm', {
  variants: { end: { true: 'ml-auto', false: '' } },
  defaultVariants: { end: true },
});

/** Right-aligned type or hint (color, dimension). Tertiary; on the chosen option it reads selection.on-tertiary (the selected utility re-points text.tertiary). */
export const comboboxMetaVariants = cva('ml-auto shrink-0 text-hint text-text-tertiary');

/** Trailing badge (Project, Missing) of an option that is not chosen; the check takes its place on the chosen one. */
export const comboboxBadgeVariants = cva('inline-flex shrink-0 items-center');

export const comboboxEmptyVariants = cva('flex h-menu-item items-center px-2 text-ui text-text-tertiary');

/**
 * popup mode: the panel is the Menu surface (thick glass, 2xl, 6px padding, elevation 4) holding the search, the listbox
 * and the footer. A column flex, so the search and listbox margins add up. width md = 280 (font picker), lg = 300 (model
 * menu), trigger = the trigger width. In place it centres in its column and shrinks with it; floating it scrolls within
 * the available height.
 */
export const comboboxPanelVariants = cva('flex min-w-0 flex-col', {
  variants: {
    width: { trigger: 'w-[var(--radix-popover-trigger-width)]', md: 'w-popover-md', lg: 'w-model-menu-w' },
    // In place the panel enters once it mounts (it is conditionally mounted, so it has no exit).
    inline: { true: 'max-w-full justify-self-center animate-enter enter-scale origin-top', false: 'z-60 max-h-(--radix-popover-content-available-height) overflow-y-auto' },
  },
  defaultVariants: { width: 'md', inline: false },
});

/** The search Input wrapper, 4px above the list. */
export const comboboxSearchVariants = cva('mb-1 text-ui');

/** In place and closed: an invisible zero-height box as wide as the panel in the trigger's cell, so the trigger has one width open or closed (owner 2026-10-27, font picker). */
export const comboboxSizerVariants = cva('invisible col-start-1 row-start-1 h-0 max-w-full', {
  variants: { width: { trigger: 'w-0', md: 'w-popover-md', lg: 'w-model-menu-w' } },
  defaultVariants: { width: 'md' },
});

/** The trigger shares its grid cell with the sizer. */
export const comboboxTriggerVariants = cva('col-start-1 row-start-1');

/** Footer rows after the listbox, 2px apart and 2px under it. */
export const comboboxFooterVariants = cva('mt-0.5 grid gap-0.5');

/**
 * A footer action row (model menu "Connect provider…"): the option box in tertiary text. It is a Tab stop, so focus
 * draws the ring.
 */
export const comboboxRowVariants = cva([
  'flex min-h-menu-item w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg px-2 text-left text-ui text-text-tertiary outline-none',
  'hover:bg-neutral-hover focus-visible:bg-neutral-hover focus-visible:shadow-focus transition-control press',
]);

/**
 * The row label. shimmer (owner 2026-10-28, model menu): the agent shimmer sweeps the tertiary label, so the row reads as
 * an action waiting to happen rather than a disabled option (flags.agent shimmer=true, P2). Reduced motion stops the sweep.
 */
export const comboboxRowLabelVariants = cva('min-w-0 truncate', {
  variants: { shimmer: { true: 'shimmer', false: '' } },
  defaultVariants: { shimmer: false },
});

/**
 * 18px tile with one centred capital or a 12px glyph. An identity tint (owner 2026-10-28, model menu): the identity fill
 * with its own on colour, kept on the chosen (inverted) option. neutral: the muted track with a secondary glyph (the + of
 * a connect row). Disabled fill and text on a disabled option.
 */
export const comboboxTileVariants = cva('inline-grid size-check shrink-0 place-items-center rounded-sm text-micro group-data-[disabled]:bg-disabled-fill group-data-[disabled]:text-disabled-text [&_svg]:size-icon-xs', {
  variants: {
    tint: {
      neutral: 'bg-neutral-track text-text-secondary',
      coral: 'bg-identity-coral text-identity-on-coral', iris: 'bg-identity-iris text-identity-on-iris', mint: 'bg-identity-mint text-identity-on-mint',
      amber: 'bg-identity-amber text-identity-on-amber', slate: 'bg-identity-slate text-identity-on-slate',
    },
  },
  defaultVariants: { tint: 'iris' },
});
