import { cva, type VariantProps } from 'class-variance-authority';

// The root. tone sets the --tone-* slots of the progress (accent by default); size sets --ind, the indicator diameter,
// which the connectors and the vertical column follow. variant checklist (the agent plan, merged from Plan 2026-10-28)
// makes the root the checklist card: surface.base with the border.subtle hairline, xl corner, 6px inset, 1px gap,
// clipping the progress edge. radius / shadow set the card corner and elevation there (stepperChecklistShape).
export const stepperVariants = cva('w-full', {
  variants: {
    tone: {
      neutral: '[--tone-solid:var(--cs-color-neutral-solid)] [--tone-on:var(--cs-color-neutral-on)] [--tone-soft:var(--cs-color-neutral-soft)] [--tone-text:var(--cs-color-neutral-text)]',
      accent: '[--tone-solid:var(--cs-color-accent-solid)] [--tone-on:var(--cs-color-accent-on)] [--tone-soft:var(--cs-color-accent-soft)] [--tone-text:var(--cs-color-accent-text)]',
      success: '[--tone-solid:var(--cs-color-success-solid)] [--tone-on:var(--cs-color-success-on)] [--tone-soft:var(--cs-color-success-soft)] [--tone-text:var(--cs-color-success-text)]',
      warning: '[--tone-solid:var(--cs-color-warning-solid)] [--tone-on:var(--cs-color-warning-on)] [--tone-soft:var(--cs-color-warning-soft)] [--tone-text:var(--cs-color-warning-text)]',
      danger: '[--tone-solid:var(--cs-color-danger-solid)] [--tone-on:var(--cs-color-danger-on)] [--tone-soft:var(--cs-color-danger-soft)] [--tone-text:var(--cs-color-danger-text)]',
      info: '[--tone-solid:var(--cs-color-info-solid)] [--tone-on:var(--cs-color-info-on)] [--tone-soft:var(--cs-color-info-soft)] [--tone-text:var(--cs-color-info-text)]',
      agent: '[--tone-solid:var(--cs-color-agent-solid)] [--tone-on:var(--cs-color-agent-on)] [--tone-soft:var(--cs-color-agent-soft)] [--tone-text:var(--cs-color-agent-text)]',
    },
    variant: {
      solid: '', soft: '', outline: '', ghost: '',
      checklist: 'relative grid gap-px overflow-hidden rounded-xl bg-surface-base p-1.5 [--stepper-r:var(--cs-radius-xl)] text-text-primary shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)]',
    },
    size: {
      xs: '[--ind:var(--cs-control-2xs)]',
      sm: '[--ind:var(--cs-control-xs)]',
      md: '[--ind:var(--cs-control-sm)]',
      lg: '[--ind:var(--cs-control-md)]',
    },
  },
  defaultVariants: { tone: 'accent', variant: 'solid', size: 'md' },
});

/** Checklist card shape: a radius replaces the xl corner (full, the shared default, keeps it); an elevation replaces the hairline (one depth cue). */
export const stepperChecklistShape = cva('', {
  variants: {
    radius: {
      none: 'rounded-none [--stepper-r:0px]', '2xs': 'rounded-2xs [--stepper-r:var(--cs-radius-2xs)]', xs: 'rounded-xs [--stepper-r:var(--cs-radius-xs)]',
      sm: 'rounded-sm [--stepper-r:var(--cs-radius-sm)]', md: 'rounded-md [--stepper-r:var(--cs-radius-md)]', lg: 'rounded-lg [--stepper-r:var(--cs-radius-lg)]',
      xl: 'rounded-xl [--stepper-r:var(--cs-radius-xl)]', '2xl': 'rounded-2xl [--stepper-r:var(--cs-radius-2xl)]', '3xl': 'rounded-3xl [--stepper-r:var(--cs-radius-3xl)]',
      '4xl': 'rounded-4xl [--stepper-r:var(--cs-radius-4xl)]', full: '',
    },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
});

/** The step list: a row, or a column (max-width 420) for the progress look; the 1px-gap checklist otherwise. */
export const stepperSteps = cva('m-0 w-full list-none p-0', {
  variants: {
    layout: {
      horizontal: 'flex items-start',
      vertical: 'grid max-w-stepper-max',
      checklist: 'grid gap-px',
    },
  },
  defaultVariants: { layout: 'horizontal' },
});

export const stepperItem = cva('relative', {
  variants: {
    orientation: {
      horizontal: 'grid min-w-0 flex-1 justify-items-center gap-2 text-center',
      vertical: 'grid grid-cols-[var(--ind)_1fr] gap-3 pb-4.5',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

// Horizontal: centred on the indicator, from 4px past the previous indicator to 4px before this one.
// Vertical: 2px under the indicator to 2px above the item end, centred under it.
export const stepperConnector = cva('absolute h-auto rounded-full transition-control', {
  variants: {
    orientation: {
      horizontal: 'top-[calc(var(--ind)/2)] start-[calc(-50%+var(--ind)/2+var(--spacing))] end-[calc(50%+var(--ind)/2+var(--spacing))] h-0.5',
      vertical: 'top-[calc(var(--ind)+var(--spacing)*0.5)] bottom-0.5 start-[calc(var(--ind)/2-1px)] w-0.5',
    },
    active: { true: 'bg-(--tone-solid)', false: 'bg-border-default' },
  },
  defaultVariants: { orientation: 'horizontal', active: false },
});

// variant is the emphasis of a done step: solid tone.solid disc with a tone.on check (default), soft tone.soft disc with a
// tone.text check, outline a 1.5px tone.solid ring with a tone.text check, ghost the tone.text check alone.
// The current step is always the 2px tone ring with a larger number; upcoming steps stay neutral (tertiary number);
// a failed step is the danger glyph on danger.soft.
export const stepperIndicator = cva('relative grid size-(--ind) place-items-center rounded-full font-ui font-semibold transition-control', {
  variants: {
    status: {
      done: '',
      current: 'bg-surface-base text-(--tone-text) shadow-[inset_0_0_0_2px_var(--tone-solid)]',
      upcoming: 'bg-surface-base text-text-tertiary shadow-[inset_0_0_0_1px_var(--cs-color-border-control)]',
      failed: 'bg-danger-soft text-danger-text',
    },
    variant: { solid: '', soft: '', outline: '', ghost: '', checklist: '' },
    size: { xs: 'text-ui-xs', sm: 'text-ui-xs', md: 'text-ui-sm', lg: 'text-ui' },
      // The default key keeps the component's own corner and shadow (''); every other key sets that token (the radiusClass / shadowClass names of common-props.ts, written out so Tailwind, which scans ./components only, generates them).
      radius: {
      none: 'rounded-none [--stepper-r:0px]', '2xs': 'rounded-2xs [--stepper-r:var(--cs-radius-2xs)]', xs: 'rounded-xs [--stepper-r:var(--cs-radius-xs)]',
      sm: 'rounded-sm [--stepper-r:var(--cs-radius-sm)]', md: 'rounded-md [--stepper-r:var(--cs-radius-md)]', lg: 'rounded-lg [--stepper-r:var(--cs-radius-lg)]',
      xl: 'rounded-xl [--stepper-r:var(--cs-radius-xl)]', '2xl': 'rounded-2xl [--stepper-r:var(--cs-radius-2xl)]', '3xl': 'rounded-3xl [--stepper-r:var(--cs-radius-3xl)]',
      '4xl': 'rounded-4xl [--stepper-r:var(--cs-radius-4xl)]', full: '',
    },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  compoundVariants: [
    // The current number is a step larger than the others (owner 2026-10-28); upcoming numbers are text.tertiary.
    { status: 'current', size: ['xs', 'sm'], className: 'text-ui-sm' },
    { status: 'current', size: ['md', 'lg'], className: 'text-ui-lg' },
    { status: 'done', variant: 'solid', className: 'bg-(--tone-solid) text-(--tone-on)' },
    { status: 'done', variant: 'soft', className: 'bg-(--tone-soft) text-(--tone-text)' },
    { status: 'done', variant: 'outline', className: 'bg-surface-base text-(--tone-text) shadow-[inset_0_0_0_1.5px_var(--tone-solid)]' },
    { status: 'done', variant: 'ghost', className: 'bg-transparent text-(--tone-text)' },
  ],
  defaultVariants: { status: 'upcoming', variant: 'solid', size: 'md', radius: 'full', shadow: 'none' },
});

// The current step leads (owner 2026-10-28): its label is a step larger and semibold in text.primary; the other steps
// step back (done text.secondary, upcoming text.tertiary). Horizontal current keeps the 18px line so the descriptions
// stay on one line across the row.
export const stepperLabel = cva('font-ui', {
  variants: {
    orientation: {
      horizontal: 'text-ui-dense font-medium',
      vertical: 'block pt-1 text-ui-strong',
    },
    status: {
      done: 'text-text-secondary',
      current: 'font-semibold text-text-primary',
      upcoming: 'text-text-tertiary',
      failed: 'text-danger-text',
    },
  },
  compoundVariants: [
    { orientation: 'horizontal', status: 'current', className: 'text-ui-lg leading-4.5 font-semibold' },
    { orientation: 'vertical', status: 'current', className: 'text-ui-lg font-semibold' },
  ],
  defaultVariants: { orientation: 'horizontal', status: 'done' },
});

export const stepperDescription = cva('font-ui text-text-tertiary', {
  variants: {
    orientation: {
      horizontal: 'text-hint',
      vertical: 'mt-0.5 text-ui-dense',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

// ── Checklist (variant checklist) ──────────────────────────────────────────────────────────────────────────────────

/**
 * Progress along the card's top (owner 2026-10-28): a 2px neutral track, success fill to done / total. It reads as an inner
 * border (owner follow-up, round 4): a clip box inset 1px inside the card hairline with the concentric corner (card radius −
 * 1px, P5) holds the track at its top, so the bar sits inside the 1px edge and bends with the inner curve instead of
 * covering the edge out to the card's outline. --stepper-r is the card radius (xl unless radius sets it).
 */
export const stepperProgressClipClass = 'pointer-events-none absolute inset-px overflow-hidden rounded-[calc(var(--stepper-r,var(--cs-radius-xl))-1px)]';
export const stepperProgressClass = 'block h-0.5 bg-neutral-track';
export const stepperProgressFillClass = 'block h-full w-(--stepper-progress) bg-success-solid transition-[width] duration-base ease-standard';

/** Header parts: title row, space-between, padding 4px 6px 6px, semibold; the count is tertiary tabular numerals, one step
 *  quieter (text.placeholder) on the checklist (owner 2026-10-28, round 4: with the done rows and the end note). */
export const stepperHeaderClass = 'flex items-center justify-between px-1.5 pb-1.5 pt-1 text-ui-sm font-semibold text-text-primary';
export const stepperCountClass = 'font-normal tabular-nums text-text-tertiary in-data-[variant=checklist]:text-text-placeholder';

/**
 * One checklist row (done: text.placeholder, one step under tertiary, and one type size smaller; owner 2026-10-28).
 * size steps its height and type: xs 24 / ui-xs · sm 26 / ui-sm · md 28 / ui-dense · lg 32 / ui. A failed row keeps the
 * upcoming look in danger text.
 */
export const stepperChecklistItem = cva('flex animate-rise items-center gap-2 rounded-sm px-1.5 transition-control', {
  variants: {
    status: {
      done: 'text-text-placeholder',
      current: 'bg-neutral-well font-medium',
      upcoming: '',
      failed: 'text-danger-text',
    },
    size: { xs: 'min-h-6 text-ui-xs', sm: 'min-h-6.5 text-ui-sm', md: 'min-h-7 text-ui-dense', lg: 'min-h-8 text-ui' },
  },
  // A done step steps one type size down (and one text step dimmer, above): finished work recedes.
  compoundVariants: [
    { status: 'done', size: 'sm', className: 'text-ui-xs' },
    { status: 'done', size: 'md', className: 'text-ui-sm' },
    { status: 'done', size: 'lg', className: 'text-ui-dense' },
  ],
  defaultVariants: { status: 'upcoming', size: 'md' },
});

/** The 16px mark box: success check disc (done), the now mark, the danger glyph (failed) or a dashed circle (todo). */
export const stepperChecklistIndicator = cva('grid size-icon-md shrink-0 place-items-center transition-control', {
  variants: {
    status: {
      done: 'rounded-full bg-success-soft text-success-text [&_svg]:size-icon-xs',
      current: '',
      upcoming: '',
      failed: 'text-danger-text [&_svg]:size-icon-sm',
    },
  },
  defaultVariants: { status: 'upcoming' },
});

/** The now mark: the 12px spectrum orb when tone is agent (the agent is working); a 2px tone ring otherwise. */
export const stepperChecklistMark = cva('', {
  variants: {
    tone: {
      neutral: 'size-icon-sm rounded-full shadow-[inset_0_0_0_2px_var(--tone-solid)]',
      accent: 'size-icon-sm rounded-full shadow-[inset_0_0_0_2px_var(--tone-solid)]',
      success: 'size-icon-sm rounded-full shadow-[inset_0_0_0_2px_var(--tone-solid)]',
      warning: 'size-icon-sm rounded-full shadow-[inset_0_0_0_2px_var(--tone-solid)]',
      danger: 'size-icon-sm rounded-full shadow-[inset_0_0_0_2px_var(--tone-solid)]',
      info: 'size-icon-sm rounded-full shadow-[inset_0_0_0_2px_var(--tone-solid)]',
      agent: 'orb orb-sm',
    },
  },
  defaultVariants: { tone: 'accent' },
});

export const stepperTodoRingClass = 'size-icon-sm rounded-full border border-dashed border-border-strong';

/** Done labels are struck through in border.subtle. */
export const stepperChecklistLabel = cva('', {
  variants: { status: { done: 'line-through decoration-border-subtle', current: '', upcoming: '', failed: '' } },
  defaultVariants: { status: 'upcoming' },
});
/** End note ("Card form"): text.placeholder, one step under tertiary like the count (owner 2026-10-28, round 4). */
export const stepperDetailClass = 'ms-auto text-ui-xs font-normal text-text-placeholder';

export type StepperVariantProps = VariantProps<typeof stepperVariants>;

/** bare checklist: no card of its own (no fill, hairline, corner, inset or progress band), for use inside a well or panel that already draws one. */
export const stepperBareClass = 'rounded-none bg-transparent p-0 shadow-none';
/** A pressable step (onStepClick): the checklist row body as a button filling the row. */
export const stepperPressRowClass = 'press flex min-w-0 flex-1 cursor-pointer items-center gap-2 self-stretch rounded-sm text-left';
/** A pressable step of the progress look: the indicator as a button. */
export const stepperPressIndicatorClass = 'press cursor-pointer';
