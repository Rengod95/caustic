import { cva } from 'class-variance-authority';

/**
 * Root: a bare grid; the items are the visible boxes. appearance sets the gap and the default columns
 * (card: auto-fit at a 180px minimum, 10px gap · tile: 6px gap, 4 columns by default · answer: one column, 6px gap).
 * columns forces equal columns in any appearance.
 */
export const choiceGroupVariants = cva('grid w-full', {
  variants: {
    appearance: {
      card: 'grid-cols-[repeat(auto-fit,minmax(min(100%,calc(var(--spacing)*45)),1fr))] gap-2.5',
      tile: 'gap-1.5',
      answer: 'gap-1.5',
    },
    columns: { auto: '', '1': 'grid-cols-1', '2': 'grid-cols-2', '3': 'grid-cols-3', '4': 'grid-cols-4', '5': 'grid-cols-5' },
  },
  defaultVariants: { appearance: 'card', columns: 'auto' },
});

// The question (was the clarification question): the voice serif, 4px more under it than between the items, so the
// items group under it (10px question to the first answer against 6px between answers). Spans every column.
export const choiceGroupQuestionVariants = cva('col-span-full mb-1 font-voice text-voice-sm text-text-primary');

// ---- appearance card (was ChoiceCards), painted on CardChoice ------------------------------------------------------
// CardChoice brings the button, role and aria-checked, data-state, the hover lift, the focus ring and the inversion of
// the selected card (selected utility: ink fill, paper text, no edge; hover selection.fill-hover). It is rendered with the
// plain skin; these classes put the ChoiceCards look on it (round 1–2): a two-column grid (content | indicator), the
// card emphasis below and the padding steps. Disabled is a colour, not opacity, and drops the inversion: a checked
// disabled card is disabled.fill with a 1.5px disabled edge. radius / shadow reach the card through CardChoice and
// shadowClass (an elevation replaces the hairline).
export const choiceGroupCardVariants = cva(
  [
    'grid grid-cols-[1fr_auto] content-start items-start',
    'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-[0_0_0_1px_var(--cs-color-disabled-border)]',
    'data-[state=checked]:disabled:shadow-[inset_0_0_0_1.5px_var(--cs-color-disabled-border)]',
    'disabled:[&_[data-slot^=choice-group-]]:text-disabled-text',
  ],
  {
    variants: {
      // outline (default) = surface.base with a border.default hairline · soft = neutral.track, no edge · solid =
      // surface.raised, no edge · ghost = no fill or edge until hover. Every variant inverts when selected.
      variant: {
        outline: 'bg-surface-base shadow-[0_0_0_1px_var(--cs-color-border-default)]',
        soft: 'bg-neutral-track hover:bg-neutral-hover',
        solid: 'bg-surface-raised hover:bg-neutral-hover',
        ghost: 'bg-transparent hover:bg-neutral-hover',
      },
      size: { xs: 'gap-0.5 p-2', sm: 'gap-1 p-2.5', md: 'gap-1 p-3.5', lg: 'gap-1.5 p-4.5' },
      // The selected card's fill (owner 2026-10-28, one step less dark than the ink). ink (default) = selection.fill-hover
      // at rest, stepping back to selection.fill (the full ink) on hover so the hover still answers. solid = neutral.solid,
      // hover neutral.solid-hover: lighter still, a light-theme choice (in dark neutral.solid is a light grey under the
      // paper text). The paper text and the inverted descendants stay the selected utility's.
      selectedFill: {
        ink: 'data-[state=checked]:not-disabled:bg-selection-fill-hover data-[state=checked]:not-disabled:hover:bg-selection-fill',
        solid: 'data-[state=checked]:not-disabled:bg-neutral-solid data-[state=checked]:not-disabled:hover:bg-neutral-solid-hover',
      },
    },
    defaultVariants: { variant: 'outline', size: 'md', selectedFill: 'ink' },
  },
);

export const choiceGroupCardTitleVariants = cva('col-start-1 row-start-1 font-semibold text-text-primary', {
  variants: { size: { xs: 'text-ui-sm', sm: 'text-ui-dense', md: 'text-ui-md', lg: 'text-title-3' } },
  defaultVariants: { size: 'md' },
});

/**
 * The CardIndicator of a card item, top-right. The checked mark takes the tone's solid with its on colour (the dot and
 * the check read currentColor). accent is the default; the selected utility re-points accent to selection.on /
 * selection.fill on the inverted card. neutral is the card text colour (it inverts with the card too). Checked or not, a
 * disabled indicator drops the tone: disabled fill and edge, the dot or check in disabled.text.
 */
export const choiceGroupCardIndicatorVariants = cva(
  [
    'col-start-2 row-start-1 [&_[data-slot=card-indicator-dot]]:bg-current [&_svg]:size-icon-sm [&_svg]:stroke-3',
    'group-disabled/card:bg-disabled-fill group-disabled/card:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
    'group-data-[state=checked]/card:group-disabled/card:bg-disabled-fill group-data-[state=checked]/card:group-disabled/card:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  ],
  {
    variants: {
      tone: {
        neutral: 'text-surface-base group-data-[state=checked]/card:bg-text-primary',
        accent: 'text-accent-on group-data-[state=checked]/card:bg-accent-solid',
        success: 'text-success-on group-data-[state=checked]/card:bg-success-solid',
        warning: 'text-warning-on group-data-[state=checked]/card:bg-warning-solid',
        danger: 'text-danger-on group-data-[state=checked]/card:bg-danger-solid',
        info: 'text-info-on group-data-[state=checked]/card:bg-info-solid',
        agent: 'text-agent-on group-data-[state=checked]/card:bg-agent-solid',
      },
      // accent and neutral punch the dot / check out of the paper mark in the card fill, so it follows selectedFill.
      selectedFill: { ink: '', solid: '' },
    },
    compoundVariants: [
      ...(['accent', 'neutral'] as const).map(tone => ({ tone, selectedFill: 'ink' as const, className: 'group-data-[state=checked]/card:group-enabled/card:text-selection-fill-hover group-data-[state=checked]/card:group-enabled/card:group-hover/card:text-selection-fill' })),
      ...(['accent', 'neutral'] as const).map(tone => ({ tone, selectedFill: 'solid' as const, className: 'group-data-[state=checked]/card:group-enabled/card:text-neutral-solid group-data-[state=checked]/card:group-enabled/card:group-hover/card:text-neutral-solid-hover' })),
    ],
    defaultVariants: { tone: 'accent', selectedFill: 'ink' },
  },
);

// Description one short line under the title, tertiary; price a large figure on its own row in tabular figures with its
// unit 4px after it (round 2: the digits line up from card to card and the unit stays attached to the number).
export const choiceGroupCardDescriptionVariants = cva('col-start-1 text-ui-sm font-normal text-text-tertiary group-data-[state=checked]/card:text-text-secondary');
export const choiceGroupPriceVariants = cva('col-span-full mt-1.5 text-figure tabular-nums text-text-primary');
export const choiceGroupPriceUnitVariants = cva('ms-1 text-hint text-text-tertiary group-data-[state=checked]/card:text-text-secondary');

// ---- appearance tile (was OptionTiles) ------------------------------------------------------------------------------
/**
 * One tile: flat, bordered inside. The chosen tile inverts (selected utility, owner 2026-10-26): ink fill, paper text,
 * no edge; its description inverts with it. The inversion alone marks the choice (owner 2026-10-28, proposal A): no
 * corner check by default (check brings it back), except on a chosen disabled tile, which drops the inversion and keeps
 * the check as its only mark. Hover while chosen: selection.fill-hover. Focus keeps the ring only. Disabled is a colour.
 *   variant outline (default) no fill and a border.default edge (a hue: its border 6 and text) · soft neutral.track and
 *   no edge, the borderless fill style (owner 2026-10-28, "border or fill as a variant"; a hue: its soft 3 and text) ·
 *   solid surface.raised (a hue: its solid 9 and on text) · ghost no fill or edge until hover.
 *   The chosen tile inverts in every variant and tone (the aria-checked rules are (0,3,0) and win).
 *   size steps the tile height and type with the layout (caption: 40 · 48 · 54 · 64; icon: 48 · 54 · 62 · 72).
 */
export const choiceGroupTileVariants = cva(
  [
    'group relative grid content-center place-items-center bg-transparent font-ui outline-none',
    'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
    'aria-checked:not-disabled:selected aria-checked:not-disabled:shadow-none aria-checked:not-disabled:hover:bg-selection-fill-hover',
    'focus-visible:shadow-focus aria-checked:not-disabled:focus-visible:shadow-focus',
    'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
    'disabled:[&_[data-slot^=choice-group-]]:text-disabled-text',
  ],
  {
    variants: {
      layout: {
        // Name and description sit as one pair (owner 2026-10-28): no gap, 16px / 14px line boxes.
        caption: 'gap-0 font-semibold text-text-primary [&_[data-slot=choice-group-title]]:leading-4',
        icon: 'gap-1 font-normal text-text-secondary aria-checked:text-text-primary',
      },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      // Hover stays inside each emphasis: neutral.hover on outline, ghost and the neutral fills; a hue steps its own slot.
      variant: { solid: '', soft: '', outline: 'hover:bg-neutral-hover', ghost: 'hover:bg-neutral-hover' },
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
      size: { xs: '', sm: '', md: '', lg: '' },
    },
    compoundVariants: [
      { layout: 'caption', size: 'xs', className: 'h-10 text-ui-xs' },
      { layout: 'caption', size: 'sm', className: 'h-12 text-ui-sm' },
      { layout: 'caption', size: 'md', className: 'h-option-tile-h text-ui-sm' },
      { layout: 'caption', size: 'lg', className: 'h-16 text-ui' },
      { layout: 'icon', size: 'xs', className: 'h-12 text-micro' },
      { layout: 'icon', size: 'sm', className: 'h-option-tile-h text-hint' },
      { layout: 'icon', size: 'md', className: 'h-option-tile-icon-h text-hint' },
      { layout: 'icon', size: 'lg', className: 'h-18 text-ui-sm' },
      { variant: 'solid', tone: 'neutral', className: 'bg-surface-raised shadow-none hover:bg-neutral-hover' },
      { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on shadow-none hover:bg-accent-solid-hover [&:not([aria-checked=true])_[data-slot^=choice-group-]]:text-accent-on' },
      { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on shadow-none hover:bg-success-solid-hover [&:not([aria-checked=true])_[data-slot^=choice-group-]]:text-success-on' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on shadow-none hover:bg-warning-solid-hover [&:not([aria-checked=true])_[data-slot^=choice-group-]]:text-warning-on' },
      { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on shadow-none hover:bg-danger-solid-hover [&:not([aria-checked=true])_[data-slot^=choice-group-]]:text-danger-on' },
      { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on shadow-none hover:bg-info-solid-hover [&:not([aria-checked=true])_[data-slot^=choice-group-]]:text-info-on' },
      { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on shadow-none hover:bg-agent-solid-hover [&:not([aria-checked=true])_[data-slot^=choice-group-]]:text-agent-on' },
      { variant: 'soft', tone: 'neutral', className: 'bg-neutral-track shadow-none hover:bg-neutral-hover' },
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text shadow-none hover:bg-accent-soft-hover' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft text-success-text shadow-none hover:bg-success-soft-hover' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text shadow-none hover:bg-warning-soft-hover' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text shadow-none hover:bg-danger-soft-hover' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft text-info-text shadow-none hover:bg-info-soft-hover' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft text-agent-text shadow-none hover:bg-agent-soft-hover' },
      { variant: 'outline', tone: 'accent', className: 'text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] hover:bg-accent-tint' },
      { variant: 'outline', tone: 'success', className: 'text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] hover:bg-success-tint' },
      { variant: 'outline', tone: 'warning', className: 'text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] hover:bg-warning-tint' },
      { variant: 'outline', tone: 'danger', className: 'text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] hover:bg-danger-tint' },
      { variant: 'outline', tone: 'info', className: 'text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] hover:bg-info-tint' },
      { variant: 'outline', tone: 'agent', className: 'text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] hover:bg-agent-tint' },
      { variant: 'ghost', className: 'shadow-none' },
      { variant: 'ghost', tone: 'accent', className: 'text-accent-text hover:bg-accent-tint' },
      { variant: 'ghost', tone: 'success', className: 'text-success-text hover:bg-success-tint' },
      { variant: 'ghost', tone: 'warning', className: 'text-warning-text hover:bg-warning-tint' },
      { variant: 'ghost', tone: 'danger', className: 'text-danger-text hover:bg-danger-tint' },
      { variant: 'ghost', tone: 'info', className: 'text-info-text hover:bg-info-tint' },
      { variant: 'ghost', tone: 'agent', className: 'text-agent-text hover:bg-agent-tint' },
    ],
    defaultVariants: { layout: 'caption', tone: 'accent', variant: 'outline', radius: 'lg', shadow: 'none', size: 'md' },
  },
);

export const choiceGroupTileIconVariants = cva('inline-grid size-check place-items-center text-text-primary [&_svg]:size-full');
export const choiceGroupTileDescriptionVariants = cva('text-ui-xs leading-3.5 font-normal text-text-tertiary group-aria-checked:text-text-secondary');
/** Check of the chosen tile, top-right, 14px: selection.on on the inverted tile when `check` is on; a chosen disabled tile always shows it, greyed. */
export const choiceGroupCheckVariants = cva('pointer-events-none absolute top-1 right-1 inline-grid size-icon-sm place-items-center text-text-primary [&_svg]:size-full');

// ---- appearance answer (was Clarification) --------------------------------------------------------------------------
// Rows of an indicator column and the text. variant = the row emphasis (outline, the default, is the inset hairline),
// size = padding and type; radius / shadow by token.
export const choiceGroupAnswerVariants = cva(
  [
    'group grid grid-cols-[var(--cs-icon-lg)_1fr] gap-2 text-left font-ui text-text-primary',
    'outline-none transition-[box-shadow,background-color] duration-120 ease-out',
    'hover:bg-neutral-hover focus-visible:shadow-focus',
    // Selected inverts (selected utility, owner 2026-10-26): ink fill, paper text, no edge; the indicator and description
    // invert with it. Hover while selected: selection.fill-hover. Focus keeps the ring only.
    'data-[state=checked]:not-disabled:selected data-[state=checked]:not-disabled:shadow-none',
    'data-[state=checked]:not-disabled:hover:bg-selection-fill-hover data-[state=checked]:not-disabled:focus-visible:shadow-focus',
    // Disabled is a colour: the tone drops out to the disabled text and border; a selected disabled row drops the inversion.
    'disabled:pointer-events-none disabled:text-disabled-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
    'data-[state=checked]:disabled:shadow-[inset_0_0_0_1.5px_var(--cs-color-disabled-border)]',
  ],
  {
    variants: {
      variant: {
        // Hover keeps the hairline and steps it to border.strong, so the filled row reads raised, not faded (round 2).
        outline: 'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] hover:not-data-[state=checked]:shadow-[inset_0_0_0_1px_var(--cs-color-border-strong)]',
        soft: 'bg-neutral-track',
        solid: 'bg-surface-raised',
        ghost: '',
      },
      size: { xs: 'p-1.5 text-ui-xs', sm: 'p-2 text-ui-sm', md: 'p-2.5 text-ui-dense', lg: 'p-3 text-ui-md' },
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    },
    defaultVariants: { variant: 'outline', size: 'md', radius: 'lg', shadow: 'none' },
  },
);

// The checked mark takes the tone's solid; its dot or check reads currentColor (the tone's on colour). accent is the
// default and the selected utility re-points it to selection.on with a selection.fill dot; neutral is the row text
// colour, which inverts with the row too. type multiple draws a rounded square with a check.
export const choiceGroupAnswerIndicatorVariants = cva(
  [
    'pointer-events-none inline-grid size-check shrink-0 place-items-center bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-control)] group-data-[state=checked]:shadow-none',
    'group-disabled:bg-disabled-fill group-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
    'group-data-[state=checked]:group-disabled:bg-disabled-fill group-data-[state=checked]:group-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
    'group-disabled:text-disabled-text',
  ],
  {
    variants: {
      type: { single: 'rounded-full', multiple: 'rounded-sm' },
      tone: {
        neutral: 'text-surface-base group-data-[state=checked]:bg-text-primary',
        accent: 'text-accent-on group-data-[state=checked]:bg-accent-solid',
        success: 'text-success-on group-data-[state=checked]:bg-success-solid',
        warning: 'text-warning-on group-data-[state=checked]:bg-warning-solid',
        danger: 'text-danger-on group-data-[state=checked]:bg-danger-solid',
        info: 'text-info-on group-data-[state=checked]:bg-info-solid',
        agent: 'text-agent-on group-data-[state=checked]:bg-agent-solid',
      },
    },
    defaultVariants: { type: 'single', tone: 'accent' },
  },
);

// The description sits inside the title block, 4px under the label text, so it aligns with the label (round 2).
export const choiceGroupAnswerDescriptionVariants = cva(
  'block pt-1 text-hint font-normal text-text-tertiary group-data-[state=checked]:text-text-secondary group-disabled:text-disabled-text group-data-[state=checked]:group-disabled:text-disabled-text',
);
