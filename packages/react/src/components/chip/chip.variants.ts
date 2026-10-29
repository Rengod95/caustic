import { cva, type VariantProps } from 'class-variance-authority';

// Colour language: variant is the emphasis (soft / outline / solid / ghost; dashed and surface are the chip's own), tone
// is the hue. Every tone uses the same
// slot in the same cell, and the on (pressed) state stays inside the emphasis and the tone:
//   soft    rest soft 3            → on soft-pressed 5 + border-strong 7 edge
//   outline rest border 6 edge     → on soft 3 + graphic 8 edge (1.5px)
//   solid   rest solid 9           → on solid-hover 10
//   ghost   rest no fill, tone text → on soft 3 (hover tint 2 on interactive chips)
// Every on cell also draws a leading check (chip.tsx). A neutral on chip (soft, outline, dashed) and every on surface chip
// is a selection and inverts (selected utility, owner 2026-10-26 proposal B): ink fill, paper text and check, no edge;
// hover while on takes selection.fill-hover, focus keeps the ring only. Disabled drops the inversion (disabled colour).
// Hued soft / outline / dashed keep their on cell inside the tone; solid on stays solid-hover 10 (it is already ink).
// Hover and press exist only on interactive chips (buttons): see the `interactive: true` compounds below.
export const chipVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center whitespace-nowrap align-middle select-none font-ui transition-control',
    'outline-none focus-visible:shadow-focus',
    // Disabled is a colour, not opacity: the tone drops out.
    'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-none',
    'disabled:aria-pressed:bg-disabled-fill disabled:aria-pressed:text-disabled-text disabled:aria-pressed:shadow-none',
  ],
  {
    variants: {
      variant: {
        soft: 'bg-neutral-track text-text-primary',
        outline: [
          'bg-transparent text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]',
          // Disabled keeps a disabled.border edge whether on or off; the tone drops out.
          'disabled:bg-transparent disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)] disabled:aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
        ],
        // The count reads the tertiary slot elsewhere; on a solid fill it keeps the on colour.
        solid: 'bg-ink-solid text-ink-on aria-pressed:bg-ink-solid-hover [&_[data-slot=chip-count]]:text-inherit',
        ghost: 'bg-transparent text-text-primary disabled:bg-transparent',
        dashed: [
          // A quiet add affordance (owner 2026-10-27, C): tertiary at rest, primary on hover (interactive compound below).
          'bg-transparent text-text-tertiary outline outline-1 outline-dashed outline-border-control -outline-offset-1',
          'disabled:bg-transparent disabled:outline-disabled-border disabled:aria-pressed:outline-disabled-border',
        ],
        surface: [
          'bg-surface-translucent text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
          // On inverts in every tone (the tone only ever coloured the text): the selected utility re-points the text.
          'aria-pressed:not-disabled:selected aria-pressed:not-disabled:shadow-none aria-pressed:not-disabled:focus-visible:shadow-focus',
        ],
      },
      tone: { neutral: '', accent: '', info: '', success: '', warning: '', danger: '', agent: '' },
      shape: { pill: 'rounded-full', rounded: '' },
      size: {
        xs: 'h-control-compact-2xs gap-1 px-1.5 text-ui-xs font-medium',
        sm: 'h-control-2xs gap-1.25 px-1.75 text-ui-xs font-medium',
        md: 'h-control-xs gap-1.25 px-2 text-ui-sm',
        lg: 'h-control-sm gap-1.25 px-2.5 text-ui-dense font-medium',
      },
      // Common props (lib/common-props.ts): the axes mirror the spec; Chip applies radiusClass / shadowClass after its own
      // classes, so unset keeps the pill (or rounded-form md) radius and no elevation.
      radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
      shadow: { none: '', '1': '', '2': '', '3': '', '4': '', '5': '' },
      // Set by Chip, not a prop: a chip is a button (onClick, pressed or defaultPressed) or a static span.
      interactive: { true: 'cursor-pointer press', false: '' },
    },
    compoundVariants: [
      { shape: 'rounded', className: 'h-chip-h gap-1.5 rounded-md pl-2 pr-1.5 text-ui-sm' },

      // neutral on = the inverted selection (soft, outline, dashed); the edge and the dashes drop.
      { variant: 'soft', tone: 'neutral', className: 'aria-pressed:not-disabled:selected aria-pressed:not-disabled:focus-visible:shadow-focus' },
      { variant: 'outline', tone: 'neutral', className: 'aria-pressed:not-disabled:selected aria-pressed:not-disabled:shadow-none aria-pressed:not-disabled:focus-visible:shadow-focus' },
      { variant: 'dashed', tone: 'neutral', className: 'aria-pressed:not-disabled:selected aria-pressed:not-disabled:outline-transparent' },

      // soft × tone
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text aria-pressed:bg-accent-soft-pressed aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong),var(--cs-focus)]' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft text-info-text aria-pressed:bg-info-soft-pressed aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong),var(--cs-focus)]' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft text-success-text aria-pressed:bg-success-soft-pressed aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong),var(--cs-focus)]' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text aria-pressed:bg-warning-soft-pressed aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong),var(--cs-focus)]' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft text-agent-text aria-pressed:bg-agent-soft-pressed aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-agent-border-strong)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-agent-border-strong),var(--cs-focus)]' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text aria-pressed:bg-danger-soft-pressed aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]' },

      // outline × tone
      { variant: 'outline', tone: 'accent', className: 'text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] aria-pressed:bg-accent-soft aria-pressed:shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-graphic)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-graphic),var(--cs-focus)]' },
      { variant: 'outline', tone: 'info', className: 'text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] aria-pressed:bg-info-soft aria-pressed:shadow-[inset_0_0_0_1.5px_var(--cs-color-info-graphic)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-info-graphic),var(--cs-focus)]' },
      { variant: 'outline', tone: 'success', className: 'text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] aria-pressed:bg-success-soft aria-pressed:shadow-[inset_0_0_0_1.5px_var(--cs-color-success-graphic)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-success-graphic),var(--cs-focus)]' },
      { variant: 'outline', tone: 'warning', className: 'text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] aria-pressed:bg-warning-soft aria-pressed:shadow-[inset_0_0_0_1.5px_var(--cs-color-warning-graphic)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-warning-graphic),var(--cs-focus)]' },
      { variant: 'outline', tone: 'agent', className: 'text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] aria-pressed:bg-agent-soft aria-pressed:shadow-[inset_0_0_0_1.5px_var(--cs-color-agent-graphic)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-agent-graphic),var(--cs-focus)]' },
      { variant: 'outline', tone: 'danger', className: 'text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] aria-pressed:bg-danger-soft aria-pressed:shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-graphic)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-graphic),var(--cs-focus)]' },

      // solid × tone
      { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on aria-pressed:bg-accent-solid-hover' },
      { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on aria-pressed:bg-info-solid-hover' },
      { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on aria-pressed:bg-success-solid-hover' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on aria-pressed:bg-warning-solid-hover' },
      { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on aria-pressed:bg-danger-solid-hover' },
      { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on aria-pressed:bg-agent-solid-hover' },

      // ghost × tone: no fill or edge, the tone's text; on = the tone's soft 3 (neutral on inverts, like soft).
      { variant: 'ghost', tone: 'neutral', className: 'aria-pressed:not-disabled:selected aria-pressed:not-disabled:focus-visible:shadow-focus' },
      { variant: 'ghost', tone: 'accent', className: 'text-accent-text aria-pressed:bg-accent-soft' },
      { variant: 'ghost', tone: 'info', className: 'text-info-text aria-pressed:bg-info-soft' },
      { variant: 'ghost', tone: 'success', className: 'text-success-text aria-pressed:bg-success-soft' },
      { variant: 'ghost', tone: 'warning', className: 'text-warning-text aria-pressed:bg-warning-soft' },
      { variant: 'ghost', tone: 'danger', className: 'text-danger-text aria-pressed:bg-danger-soft' },
      { variant: 'ghost', tone: 'agent', className: 'text-agent-text aria-pressed:bg-agent-soft' },

      // dashed × tone: border 6 dashes and the tone's text; on = the tone's soft with border-strong dashes.
      { variant: 'dashed', tone: 'accent', className: 'text-accent-text outline-accent-border aria-pressed:bg-accent-soft aria-pressed:text-accent-text aria-pressed:outline-accent-border-strong' },
      { variant: 'dashed', tone: 'info', className: 'text-info-text outline-info-border aria-pressed:bg-info-soft aria-pressed:text-info-text aria-pressed:outline-info-border-strong' },
      { variant: 'dashed', tone: 'success', className: 'text-success-text outline-success-border aria-pressed:bg-success-soft aria-pressed:text-success-text aria-pressed:outline-success-border-strong' },
      { variant: 'dashed', tone: 'warning', className: 'text-warning-text outline-warning-border aria-pressed:bg-warning-soft aria-pressed:text-warning-text aria-pressed:outline-warning-border-strong' },
      { variant: 'dashed', tone: 'danger', className: 'text-danger-text outline-danger-border aria-pressed:bg-danger-soft aria-pressed:text-danger-text aria-pressed:outline-danger-border-strong' },
      { variant: 'dashed', tone: 'agent', className: 'text-agent-text outline-agent-border aria-pressed:bg-agent-soft aria-pressed:text-agent-text aria-pressed:outline-agent-border-strong' },

      // surface × tone: the token surface stays neutral; only the text takes the tone.
      { variant: 'surface', tone: 'accent', className: 'text-accent-text' },
      { variant: 'surface', tone: 'info', className: 'text-info-text' },
      { variant: 'surface', tone: 'success', className: 'text-success-text' },
      { variant: 'surface', tone: 'warning', className: 'text-warning-text' },
      { variant: 'surface', tone: 'danger', className: 'text-danger-text' },
      { variant: 'surface', tone: 'agent', className: 'text-agent-text' },

      // Hover and press (§2 matrix), interactive chips only so a static status chip never reacts to the pointer.
      // aria-pressed sorts after hover, so an on chip keeps its on fill; on + hover follows transition rule 2.
      //   soft    3 → hover 4 → press 5; on + hover keeps 5 and the edge goes to graphic 8
      //   outline none → hover tint 2 + border-strong 7 → press soft 3; on keeps soft 3 + graphic 8 (1.5px)
      //   solid   9 → hover 10 (the rest fill is repeated so each cell reads rest → hover on its own)
      //   neutral: opaque neutral.hover / neutral.pressed fills; selection.fill-hover when on (inverted)
      { interactive: true, variant: 'soft', tone: 'neutral', className: 'hover:bg-neutral-hover active:bg-neutral-pressed aria-pressed:not-disabled:hover:bg-selection-fill-hover' },
      { interactive: true, variant: 'outline', tone: 'neutral', className: 'hover:bg-neutral-hover hover:shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border-strong)] active:bg-neutral-pressed aria-pressed:not-disabled:hover:bg-selection-fill-hover' },
      { interactive: true, variant: 'dashed', tone: 'neutral', className: 'hover:text-text-primary aria-pressed:not-disabled:hover:bg-selection-fill-hover' },
      { interactive: true, variant: 'solid', tone: 'neutral', className: 'bg-ink-solid hover:bg-ink-solid-hover' },
      { interactive: true, variant: 'surface', className: 'hover:bg-neutral-hover aria-pressed:not-disabled:hover:bg-selection-fill-hover' },
      { interactive: true, variant: 'soft', tone: 'accent', className: 'hover:bg-accent-soft-hover active:bg-accent-soft-pressed aria-pressed:hover:shadow-[inset_0_0_0_1px_var(--cs-color-accent-graphic)] aria-pressed:hover:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-accent-graphic),var(--cs-focus)]' },
      { interactive: true, variant: 'soft', tone: 'info', className: 'hover:bg-info-soft-hover active:bg-info-soft-pressed aria-pressed:hover:shadow-[inset_0_0_0_1px_var(--cs-color-info-graphic)] aria-pressed:hover:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-info-graphic),var(--cs-focus)]' },
      { interactive: true, variant: 'soft', tone: 'success', className: 'hover:bg-success-soft-hover active:bg-success-soft-pressed aria-pressed:hover:shadow-[inset_0_0_0_1px_var(--cs-color-success-graphic)] aria-pressed:hover:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-success-graphic),var(--cs-focus)]' },
      { interactive: true, variant: 'soft', tone: 'warning', className: 'hover:bg-warning-soft-hover active:bg-warning-soft-pressed aria-pressed:hover:shadow-[inset_0_0_0_1px_var(--cs-color-warning-graphic)] aria-pressed:hover:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-warning-graphic),var(--cs-focus)]' },
      { interactive: true, variant: 'soft', tone: 'danger', className: 'hover:bg-danger-soft-hover active:bg-danger-soft-pressed aria-pressed:hover:shadow-[inset_0_0_0_1px_var(--cs-color-danger-graphic)] aria-pressed:hover:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-graphic),var(--cs-focus)]' },
      { interactive: true, variant: 'soft', tone: 'agent', className: 'hover:bg-agent-soft-hover active:bg-agent-soft-pressed aria-pressed:hover:shadow-[inset_0_0_0_1px_var(--cs-color-agent-graphic)] aria-pressed:hover:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-agent-graphic),var(--cs-focus)]' },
      { interactive: true, variant: 'outline', tone: 'accent', className: 'hover:bg-accent-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)] active:bg-accent-soft' },
      { interactive: true, variant: 'outline', tone: 'info', className: 'hover:bg-info-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong)] active:bg-info-soft' },
      { interactive: true, variant: 'outline', tone: 'success', className: 'hover:bg-success-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong)] active:bg-success-soft' },
      { interactive: true, variant: 'outline', tone: 'warning', className: 'hover:bg-warning-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)] active:bg-warning-soft' },
      { interactive: true, variant: 'outline', tone: 'danger', className: 'hover:bg-danger-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] active:bg-danger-soft' },
      { interactive: true, variant: 'outline', tone: 'agent', className: 'hover:bg-agent-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-agent-border-strong)] active:bg-agent-soft' },
      { interactive: true, variant: 'solid', tone: 'accent', className: 'bg-accent-solid hover:bg-accent-solid-hover' },
      { interactive: true, variant: 'solid', tone: 'info', className: 'bg-info-solid hover:bg-info-solid-hover' },
      { interactive: true, variant: 'solid', tone: 'success', className: 'bg-success-solid hover:bg-success-solid-hover' },
      { interactive: true, variant: 'solid', tone: 'warning', className: 'bg-warning-solid hover:bg-warning-solid-hover' },
      { interactive: true, variant: 'solid', tone: 'danger', className: 'bg-danger-solid hover:bg-danger-solid-hover' },
      { interactive: true, variant: 'solid', tone: 'agent', className: 'bg-agent-solid hover:bg-agent-solid-hover' },
      //   ghost   none → hover neutral.hover (neutral) or tint 2 (hued) → press soft 3; on keeps soft 3
      { interactive: true, variant: 'ghost', tone: 'neutral', className: 'hover:bg-neutral-hover active:bg-neutral-pressed aria-pressed:not-disabled:hover:bg-selection-fill-hover' },
      { interactive: true, variant: 'ghost', tone: 'accent', className: 'hover:bg-accent-tint active:bg-accent-soft' },
      { interactive: true, variant: 'ghost', tone: 'info', className: 'hover:bg-info-tint active:bg-info-soft' },
      { interactive: true, variant: 'ghost', tone: 'success', className: 'hover:bg-success-tint active:bg-success-soft' },
      { interactive: true, variant: 'ghost', tone: 'warning', className: 'hover:bg-warning-tint active:bg-warning-soft' },
      { interactive: true, variant: 'ghost', tone: 'danger', className: 'hover:bg-danger-tint active:bg-danger-soft' },
      { interactive: true, variant: 'ghost', tone: 'agent', className: 'hover:bg-agent-tint active:bg-agent-soft' },
    ],
    defaultVariants: { variant: 'soft', tone: 'neutral', shape: 'pill', size: 'md', radius: 'full', shadow: 'none', interactive: false },
  },
);

export const chipIconVariants = cva('inline-flex shrink-0 [&_svg]:size-full', {
  // The pill icon (a ✓ status, a +) sits 2px further from its label (owner 2026-10-27), as the check below.
  variants: { shape: { pill: 'me-0.5 size-icon-xs', rounded: 'size-chip-icon text-text-tertiary in-disabled:text-disabled-text' } },
  defaultVariants: { shape: 'pill' },
});

/** Leading check of an on toggle chip: sized like the icon, in the chip's own text colour (currentColor), 2px more room before the label (owner 2026-10-27). */
export const chipCheckVariants = cva('me-0.5 inline-flex shrink-0 animate-pop [&_svg]:size-full', {
  variants: { shape: { pill: 'size-icon-xs', rounded: 'size-chip-icon' } },
  defaultVariants: { shape: 'pill' },
});

/** The × target: fully round on the pill, concentric with its end (owner 2026-10-27, B); xs on the rounded form. */
export const chipRemoveVariants = cva(
  'inline-grid size-icon-md shrink-0 place-items-center text-text-tertiary outline-none transition-control press-sm hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus [&_svg]:size-icon-xs',
  {
    variants: { shape: { pill: 'rounded-full', rounded: 'rounded-xs' } },
    defaultVariants: { shape: 'pill' },
  },
);

/**
 * Trailing count: the text.tertiary slot at full opacity (owner 2026-10-27, A; the selected inversion re-points it to
 * selection.on-tertiary, a solid chip keeps its on colour), 2px more room after the label (owner memo).
 */
export const chipCountVariants = cva('ms-0.5 tabular-nums text-text-tertiary in-disabled:text-disabled-text');

export type ChipVariantProps = Omit<VariantProps<typeof chipVariants>, 'interactive' | 'tone' | 'variant' | 'radius' | 'shadow' | 'size'>;
