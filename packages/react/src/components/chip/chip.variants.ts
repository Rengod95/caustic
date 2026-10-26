import { cva, type VariantProps } from 'class-variance-authority';

// Colour language: appearance is the emphasis (soft / outline / solid), tone is the hue. Every tone uses the same
// slot in the same cell, and the on (pressed) state stays inside the emphasis and the tone:
//   soft    rest soft 3            → on soft-pressed 5 + border-strong 7 edge
//   outline rest border 6 edge     → on soft 3 + graphic 8 edge (1.5px)
//   solid   rest solid 9           → on solid-hover 10
// Every on cell also draws a leading check (chip.tsx). A neutral on chip (soft, outline, dashed) and every on surface chip
// is a selection and inverts (selected utility, owner 2026-10-26 proposal B): ink fill, paper text and check, no edge;
// hover while on takes selection.fill-hover, focus keeps the ring only. Disabled drops the inversion (disabled colour).
// Hued soft / outline / dashed keep their on cell inside the tone; solid on stays solid-hover 10 (it is already ink).
// Hover and press exist only on interactive chips (buttons): see the `interactive: true` compounds below.
export const chipVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center whitespace-nowrap align-middle select-none font-ui',
    'outline-none focus-visible:shadow-focus',
    // Disabled is a colour, not opacity: the tone drops out.
    'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-none',
    'disabled:aria-pressed:bg-disabled-fill disabled:aria-pressed:text-disabled-text disabled:aria-pressed:shadow-none',
  ],
  {
    variants: {
      appearance: {
        soft: 'bg-neutral-track text-text-primary',
        outline: [
          'bg-transparent text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]',
          // Disabled keeps a disabled.border edge whether on or off; the tone drops out.
          'disabled:bg-transparent disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)] disabled:aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
        ],
        solid: 'bg-ink-solid text-ink-on aria-pressed:bg-ink-solid-hover',
        dashed: [
          'bg-transparent text-text-secondary outline outline-1 outline-dashed outline-border-control -outline-offset-1',
          'disabled:bg-transparent disabled:outline-disabled-border disabled:aria-pressed:outline-disabled-border',
        ],
        surface: [
          'bg-surface-translucent text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
          // On inverts in every tone (the tone only ever coloured the text): the selected utility re-points the text.
          'aria-pressed:not-disabled:selected aria-pressed:not-disabled:shadow-none aria-pressed:not-disabled:focus-visible:shadow-focus',
        ],
      },
      tone: { neutral: '', accent: '', info: '', success: '', warning: '', danger: '' },
      shape: { pill: 'rounded-full', rounded: '' },
      size: {
        sm: 'h-control-2xs gap-1.25 px-1.75 text-ui-xs font-medium',
        md: 'h-control-xs gap-1.25 px-2 text-ui-sm',
        lg: 'h-control-sm gap-1.25 px-2.5 text-ui-dense font-medium',
      },
      // Set by Chip, not a prop: a chip is a button (onClick, pressed or defaultPressed) or a static span.
      interactive: { true: 'cursor-pointer', false: '' },
    },
    compoundVariants: [
      { shape: 'rounded', className: 'h-chip-h gap-1.5 rounded-md pl-2 pr-1.5 text-ui-sm' },

      // neutral on = the inverted selection (soft, outline, dashed); the edge and the dashes drop.
      { appearance: 'soft', tone: 'neutral', className: 'aria-pressed:not-disabled:selected aria-pressed:not-disabled:focus-visible:shadow-focus' },
      { appearance: 'outline', tone: 'neutral', className: 'aria-pressed:not-disabled:selected aria-pressed:not-disabled:shadow-none aria-pressed:not-disabled:focus-visible:shadow-focus' },
      { appearance: 'dashed', tone: 'neutral', className: 'aria-pressed:not-disabled:selected aria-pressed:not-disabled:outline-transparent' },

      // soft × tone
      { appearance: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text aria-pressed:bg-accent-soft-pressed aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong),var(--cs-focus)]' },
      { appearance: 'soft', tone: 'info', className: 'bg-info-soft text-info-text aria-pressed:bg-info-soft-pressed aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong),var(--cs-focus)]' },
      { appearance: 'soft', tone: 'success', className: 'bg-success-soft text-success-text aria-pressed:bg-success-soft-pressed aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong),var(--cs-focus)]' },
      { appearance: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text aria-pressed:bg-warning-soft-pressed aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong),var(--cs-focus)]' },
      { appearance: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text aria-pressed:bg-danger-soft-pressed aria-pressed:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]' },

      // outline × tone
      { appearance: 'outline', tone: 'accent', className: 'text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] aria-pressed:bg-accent-soft aria-pressed:shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-graphic)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-graphic),var(--cs-focus)]' },
      { appearance: 'outline', tone: 'info', className: 'text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] aria-pressed:bg-info-soft aria-pressed:shadow-[inset_0_0_0_1.5px_var(--cs-color-info-graphic)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-info-graphic),var(--cs-focus)]' },
      { appearance: 'outline', tone: 'success', className: 'text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] aria-pressed:bg-success-soft aria-pressed:shadow-[inset_0_0_0_1.5px_var(--cs-color-success-graphic)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-success-graphic),var(--cs-focus)]' },
      { appearance: 'outline', tone: 'warning', className: 'text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] aria-pressed:bg-warning-soft aria-pressed:shadow-[inset_0_0_0_1.5px_var(--cs-color-warning-graphic)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-warning-graphic),var(--cs-focus)]' },
      { appearance: 'outline', tone: 'danger', className: 'text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] aria-pressed:bg-danger-soft aria-pressed:shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-graphic)] aria-pressed:focus-visible:shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-graphic),var(--cs-focus)]' },

      // solid × tone
      { appearance: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on aria-pressed:bg-accent-solid-hover' },
      { appearance: 'solid', tone: 'info', className: 'bg-info-solid text-info-on aria-pressed:bg-info-solid-hover' },
      { appearance: 'solid', tone: 'success', className: 'bg-success-solid text-success-on aria-pressed:bg-success-solid-hover' },
      { appearance: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on aria-pressed:bg-warning-solid-hover' },
      { appearance: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on aria-pressed:bg-danger-solid-hover' },

      // dashed × tone: border 6 dashes and the tone's text; on = the tone's soft with border-strong dashes.
      { appearance: 'dashed', tone: 'accent', className: 'text-accent-text outline-accent-border aria-pressed:bg-accent-soft aria-pressed:text-accent-text aria-pressed:outline-accent-border-strong' },
      { appearance: 'dashed', tone: 'info', className: 'text-info-text outline-info-border aria-pressed:bg-info-soft aria-pressed:text-info-text aria-pressed:outline-info-border-strong' },
      { appearance: 'dashed', tone: 'success', className: 'text-success-text outline-success-border aria-pressed:bg-success-soft aria-pressed:text-success-text aria-pressed:outline-success-border-strong' },
      { appearance: 'dashed', tone: 'warning', className: 'text-warning-text outline-warning-border aria-pressed:bg-warning-soft aria-pressed:text-warning-text aria-pressed:outline-warning-border-strong' },
      { appearance: 'dashed', tone: 'danger', className: 'text-danger-text outline-danger-border aria-pressed:bg-danger-soft aria-pressed:text-danger-text aria-pressed:outline-danger-border-strong' },

      // surface × tone: the token surface stays neutral; only the text takes the tone.
      { appearance: 'surface', tone: 'accent', className: 'text-accent-text' },
      { appearance: 'surface', tone: 'info', className: 'text-info-text' },
      { appearance: 'surface', tone: 'success', className: 'text-success-text' },
      { appearance: 'surface', tone: 'warning', className: 'text-warning-text' },
      { appearance: 'surface', tone: 'danger', className: 'text-danger-text' },

      // Hover and press (§2 matrix), interactive chips only so a static status chip never reacts to the pointer.
      // aria-pressed sorts after hover, so an on chip keeps its on fill; on + hover follows transition rule 2.
      //   soft    3 → hover 4 → press 5; on + hover keeps 5 and the edge goes to graphic 8
      //   outline none → hover tint 2 + border-strong 7 → press soft 3; on keeps soft 3 + graphic 8 (1.5px)
      //   solid   9 → hover 10 (the rest fill is repeated so each cell reads rest → hover on its own)
      //   neutral: opaque neutral.hover / neutral.pressed fills; selection.fill-hover when on (inverted)
      { interactive: true, appearance: 'soft', tone: 'neutral', className: 'hover:bg-neutral-hover active:bg-neutral-pressed aria-pressed:not-disabled:hover:bg-selection-fill-hover' },
      { interactive: true, appearance: 'outline', tone: 'neutral', className: 'hover:bg-neutral-hover hover:shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border-strong)] active:bg-neutral-pressed aria-pressed:not-disabled:hover:bg-selection-fill-hover' },
      { interactive: true, appearance: 'dashed', tone: 'neutral', className: 'aria-pressed:not-disabled:hover:bg-selection-fill-hover' },
      { interactive: true, appearance: 'solid', tone: 'neutral', className: 'bg-ink-solid hover:bg-ink-solid-hover' },
      { interactive: true, appearance: 'surface', className: 'hover:bg-neutral-hover aria-pressed:not-disabled:hover:bg-selection-fill-hover' },
      { interactive: true, appearance: 'soft', tone: 'accent', className: 'hover:bg-accent-soft-hover active:bg-accent-soft-pressed aria-pressed:hover:shadow-[inset_0_0_0_1px_var(--cs-color-accent-graphic)] aria-pressed:hover:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-accent-graphic),var(--cs-focus)]' },
      { interactive: true, appearance: 'soft', tone: 'info', className: 'hover:bg-info-soft-hover active:bg-info-soft-pressed aria-pressed:hover:shadow-[inset_0_0_0_1px_var(--cs-color-info-graphic)] aria-pressed:hover:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-info-graphic),var(--cs-focus)]' },
      { interactive: true, appearance: 'soft', tone: 'success', className: 'hover:bg-success-soft-hover active:bg-success-soft-pressed aria-pressed:hover:shadow-[inset_0_0_0_1px_var(--cs-color-success-graphic)] aria-pressed:hover:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-success-graphic),var(--cs-focus)]' },
      { interactive: true, appearance: 'soft', tone: 'warning', className: 'hover:bg-warning-soft-hover active:bg-warning-soft-pressed aria-pressed:hover:shadow-[inset_0_0_0_1px_var(--cs-color-warning-graphic)] aria-pressed:hover:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-warning-graphic),var(--cs-focus)]' },
      { interactive: true, appearance: 'soft', tone: 'danger', className: 'hover:bg-danger-soft-hover active:bg-danger-soft-pressed aria-pressed:hover:shadow-[inset_0_0_0_1px_var(--cs-color-danger-graphic)] aria-pressed:hover:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-graphic),var(--cs-focus)]' },
      { interactive: true, appearance: 'outline', tone: 'accent', className: 'hover:bg-accent-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)] active:bg-accent-soft' },
      { interactive: true, appearance: 'outline', tone: 'info', className: 'hover:bg-info-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong)] active:bg-info-soft' },
      { interactive: true, appearance: 'outline', tone: 'success', className: 'hover:bg-success-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong)] active:bg-success-soft' },
      { interactive: true, appearance: 'outline', tone: 'warning', className: 'hover:bg-warning-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)] active:bg-warning-soft' },
      { interactive: true, appearance: 'outline', tone: 'danger', className: 'hover:bg-danger-tint hover:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] active:bg-danger-soft' },
      { interactive: true, appearance: 'solid', tone: 'accent', className: 'bg-accent-solid hover:bg-accent-solid-hover' },
      { interactive: true, appearance: 'solid', tone: 'info', className: 'bg-info-solid hover:bg-info-solid-hover' },
      { interactive: true, appearance: 'solid', tone: 'success', className: 'bg-success-solid hover:bg-success-solid-hover' },
      { interactive: true, appearance: 'solid', tone: 'warning', className: 'bg-warning-solid hover:bg-warning-solid-hover' },
      { interactive: true, appearance: 'solid', tone: 'danger', className: 'bg-danger-solid hover:bg-danger-solid-hover' },
    ],
    defaultVariants: { appearance: 'soft', tone: 'neutral', shape: 'pill', size: 'md', interactive: false },
  },
);

export const chipIconVariants = cva('inline-flex shrink-0 [&_svg]:size-full [&_svg]:stroke-[1.75]', {
  variants: { shape: { pill: 'size-icon-xs', rounded: 'size-chip-icon text-text-tertiary in-disabled:text-disabled-text' } },
  defaultVariants: { shape: 'pill' },
});

/** Leading check of an on toggle chip: sized like the icon, in the chip's own text colour (currentColor). */
export const chipCheckVariants = cva('inline-flex shrink-0 [&_svg]:size-full [&_svg]:stroke-[1.75]', {
  variants: { shape: { pill: 'size-icon-xs', rounded: 'size-chip-icon' } },
  defaultVariants: { shape: 'pill' },
});

export const chipRemoveVariants = cva(
  'inline-grid size-icon-md shrink-0 place-items-center rounded-xs text-text-tertiary outline-none hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus [&_svg]:size-icon-xs',
);

export type ChipVariantProps = Omit<VariantProps<typeof chipVariants>, 'interactive'>;
