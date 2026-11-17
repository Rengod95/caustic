import { cva } from 'class-variance-authority';

/**
 * The floating thick-glass surface. Select, Combobox and DatePicker import it: edit the anatomy here only.
 * Common props (owner 2026-10-26), unset = this surface: variant solid (default) is the thick material; soft re-points the
 * material to the tone's soft 3 (opaque); outline draws a 1px rim in the tone's border 6 (an outline, so the elevation
 * stays); ghost is the material without elevation (Menu passes shadow none; a floating surface is never see-through).
 * On solid and ghost a hue draws the rim. radius replaces the 2xl corner (items keep lg); shadow picks the elevation.
 * The material and the elevation are single classes on purpose: two classes that set --cs-material or --cs-shadow tie
 * and sort by name, so glass-thick and glass-shadow-4 live in the axes, not in the base.
 */
export const menuSurfaceVariants = cva(
  // The motion is the overlay's: a Radix content (Menu, Select, Combobox, Date picker) enters and exits with its state.
  // The transform origin is set by each primitive's own className (the variable names differ).
  'glass min-w-menu-min rounded-2xl p-1 text-ui text-text-primary outline-none data-[state=open]:animate-enter data-[state=closed]:animate-exit enter-scale enter-from-side',
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: { solid: 'glass-thick', soft: '', outline: 'glass-thick', ghost: 'glass-thick' },
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': '', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { none: '[--cs-shadow:none]', '1': 'glass-shadow-1', '2': 'glass-shadow-2', '3': 'glass-shadow-3', '4': 'glass-shadow-4', '5': 'glass-shadow-5' },
    },
    compoundVariants: [
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
      { variant: 'outline', tone: 'neutral', className: 'outline outline-1 -outline-offset-1 outline-neutral-border' },
      { variant: 'outline', tone: 'accent', className: 'outline outline-1 -outline-offset-1 outline-accent-border' },
      { variant: 'outline', tone: 'success', className: 'outline outline-1 -outline-offset-1 outline-success-border' },
      { variant: 'outline', tone: 'warning', className: 'outline outline-1 -outline-offset-1 outline-warning-border' },
      { variant: 'outline', tone: 'danger', className: 'outline outline-1 -outline-offset-1 outline-danger-border' },
      { variant: 'outline', tone: 'info', className: 'outline outline-1 -outline-offset-1 outline-info-border' },
      { variant: 'outline', tone: 'agent', className: 'outline outline-1 -outline-offset-1 outline-agent-border' },
      { variant: 'ghost', tone: 'accent', className: 'outline outline-1 -outline-offset-1 outline-accent-border' },
      { variant: 'ghost', tone: 'success', className: 'outline outline-1 -outline-offset-1 outline-success-border' },
      { variant: 'ghost', tone: 'warning', className: 'outline outline-1 -outline-offset-1 outline-warning-border' },
      { variant: 'ghost', tone: 'danger', className: 'outline outline-1 -outline-offset-1 outline-danger-border' },
      { variant: 'ghost', tone: 'info', className: 'outline outline-1 -outline-offset-1 outline-info-border' },
      { variant: 'ghost', tone: 'agent', className: 'outline outline-1 -outline-offset-1 outline-agent-border' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'solid', radius: '2xl', shadow: '4' },
  },
);

/**
 * Group heading: non-interactive label. The 3px / 1px margins bring the block to the specimen height (28px) while the
 * padding stays 5px. caps (owner 2026-10-28; Menu and the Combobox groups) is the uppercase tracked caption, as the List
 * heading, so the groups read at a glance; caps false is the earlier sentence-case label role, kept as the default for the
 * importers that have not moved yet (Select).
 */
export const menuHeadingVariants = cva('mb-0.25 mt-0.75 px-2 py-1.25 text-text-tertiary', {
  variants: { caps: { false: 'text-label', true: 'text-caption uppercase' } },
  defaultVariants: { caps: false },
});

/**
 * One action or choice. Radius xl is concentric with the surface (2xl 16 − 4px padding); rows are 4px apart, the same as
 * the surface padding (owner 2026-11-12, Fresnel dzI: the gap between rows equals the row-to-container padding).
 * Hover and the keyboard highlight share neutral-hover (danger.tint on a danger item). The selected item takes the light
 * neutral.selected fill and keeps its text colours (owner 2026-11-12: the ink inversion was too heavy); the trailing check
 * marks the choice. Highlighted while selected it takes neutral.selected-hover.
 * Disabled is colour: a disabled selected item is disabled.fill with disabled text.
 */
export const menuItemVariants = cva([
  'flex w-full min-w-0 cursor-pointer items-center gap-2 rounded-xl px-2 text-left text-ui text-text-primary outline-none transition-control',
  'hover:bg-neutral-hover data-[highlighted]:bg-neutral-hover',
  // No focus ring on items (owner 2026-10-28): Radix and the roving focus move real focus to the item under the pointer, and
  // the global :focus-visible ring drew a dark outline on hover. The highlight fill already marks the active item for
  // keyboard users (focus and data-highlighted move together), so the ring is suppressed; Select options inherit this.
  'focus-visible:bg-neutral-hover focus-visible:shadow-none',
  // A destructive item (owner 2026-10-28, A): hover and the keyboard highlight fill it with danger.tint instead of the
  // neutral hover, so the risk reads on the fill as well as on the red label.
  'data-[tone=danger]:hover:bg-danger-tint data-[tone=danger]:data-[highlighted]:bg-danger-tint data-[tone=danger]:focus-visible:bg-danger-tint',
  'data-[selected]:not-data-[disabled]:bg-neutral-selected data-[selected]:not-data-[disabled]:hover:bg-neutral-selected-hover data-[selected]:not-data-[disabled]:data-[highlighted]:bg-neutral-selected-hover',
  'data-[disabled]:pointer-events-none data-[disabled]:text-disabled-text data-[disabled]:data-[selected]:bg-disabled-fill',
], {
  variants: {
    // The item tone colours its label (and its icon, menuIconVariants); 'default' is the deprecated alias of neutral.
    tone: {
      neutral: '', accent: 'text-accent-text', success: 'text-success-text', warning: 'text-warning-text', danger: 'text-danger-text',
      info: 'text-info-text', agent: 'text-agent-text',
    },
    /** Item height and type: xs 24 · sm 28 · md 30 (menu-item) · lg 36 (compact density steps). */
    size: { xs: 'h-control-sm text-ui-sm', sm: 'h-control-md', md: 'h-menu-item', lg: 'h-control-lg text-ui-md' },
  },
  defaultVariants: { tone: 'neutral', size: 'md' },
});

/**
 * Leading icon / swatch: 16px, tertiary; the item tone's text colour on a toned item (danger for destructive items); primary
 * on the selected item (it reads at full strength on the light selected fill). Disabled is colour and the tone drops: the group-data rules
 * (0,2,0) beat the tone class, and the stacked disabled + selected rule (0,3,0) beats the selected one whatever their CSS order.
 */
export const menuIconVariants = cva(
  'inline-flex shrink-0 items-center [&_svg]:size-icon-md group-data-[selected]:text-text-primary group-data-[disabled]:text-disabled-text group-data-[disabled]:group-data-[selected]:text-disabled-text',
  {
    variants: {
      tone: {
        neutral: 'text-text-tertiary', accent: 'text-accent-text', success: 'text-success-text', warning: 'text-warning-text',
        danger: 'text-danger-text', info: 'text-info-text', agent: 'text-agent-text',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

/** Trailing meta text, shortcut chord or check, pushed to the end. Tertiary (the selected item keeps it); disabled colour. */
export const menuEndVariants = cva('ml-auto flex shrink-0 items-center gap-1 text-text-tertiary group-data-[disabled]:text-disabled-text');

/** A 1px rule. The list gap (4px) spaces it from the rows, so it has no vertical margin of its own. */
export const menuSeparatorVariants = cva('mx-2 h-px shrink-0 bg-border-subtle');
