import { cva, type VariantProps } from 'class-variance-authority';

// The root. tone sets the --tone-* slots of the progress (accent by default); size sets --ind, the lens diameter, which
// the glyphs, the connectors and the vertical column follow. variant checklist (the agent plan, merged from Plan
// 2026-10-28) makes the root the checklist card: surface.base with the border.subtle hairline, xl corner, 6px inset, 1px
// gap, clipping the progress edge. radius / shadow set the card corner and elevation there (stepperChecklistShape).
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
      checklist: 'relative grid gap-px overflow-hidden rounded-xl bg-surface-base p-1.5 [--stepper-r:var(--cs-radius-xl)] text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
    },
    size: {
      xs: '[--ind:var(--cs-icon-md)]',
      sm: '[--ind:var(--cs-control-2xs)]',
      md: '[--ind:var(--cs-control-xs)]',
      lg: '[--ind:var(--cs-control-sm)]',
    },
  },
  defaultVariants: { tone: 'accent', variant: 'soft', size: 'md' },
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

/** The step list: one inline row (lens, label, then a connector that takes the free width), or a column (max-width 420); the 1px-gap checklist otherwise. */
export const stepperSteps = cva('m-0 w-full list-none p-0', {
  variants: {
    layout: {
      horizontal: 'flex min-w-0 items-center gap-2 data-compact:gap-1',
      vertical: 'grid max-w-stepper-max',
      checklist: 'grid gap-px',
    },
  },
  defaultVariants: { layout: 'horizontal' },
});

// Horizontal: the first step keeps its own width; every later step grows, its connector taking the space before its lens.
// Vertical: two columns (lens, text), 16px between steps.
export const stepperItem = cva('relative min-w-0', {
  variants: {
    orientation: {
      horizontal: 'flex items-center gap-2 not-first:flex-1 in-data-compact:gap-1',
      vertical: 'grid grid-cols-[var(--ind)_1fr] gap-x-3 pb-4 last:pb-0',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

/** The lens and its label side by side (horizontal). */
export const stepperHeadClass = 'flex min-w-0 shrink-0 items-center gap-1.5 in-data-compact:shrink';

// The 1px track between two steps, neutral.track, with the tone line that fills it (scaleX / scaleY 0 → 1, slow, out) once
// the step before it is done or skipped. Horizontal: grows with the row (16px minimum) before the lens. Vertical: centred
// under the lens, from 4px below it to 4px above the next one.
export const stepperConnector = cva('overflow-hidden rounded-full bg-neutral-track', {
  variants: {
    orientation: {
      horizontal: 'relative h-px min-w-4 flex-1 in-data-compact:min-w-3',
      vertical: 'absolute start-[calc(var(--ind)/2-0.5px)] top-[calc(var(--ind)+var(--spacing))] bottom-1 w-px',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});
export const stepperConnectorFill = cva('absolute inset-0 bg-(--tone-solid) transition-transform duration-slow ease-out', {
  variants: {
    orientation: { horizontal: 'origin-left rtl:origin-right', vertical: 'origin-top' },
    active: { true: '', false: '' },
  },
  compoundVariants: [
    { orientation: 'horizontal', active: false, className: 'scale-x-0' },
    { orientation: 'vertical', active: false, className: 'scale-y-0' },
  ],
  defaultVariants: { orientation: 'horizontal', active: false },
});
/** The light that runs along the connector into a busy step (horizontal): a tone band a quarter of the line, fading in and out at the ends (flat, no gradient). */
export const stepperFlowClass = 'absolute inset-y-0 start-0 w-1/4 animate-flow rounded-full bg-(--tone-solid)';

// The lens (owner 2026-11-13, dzV2: Fresnel lens, drawn in vector lines). A --ind circle; its glyph is 60% of it.
//   upcoming  surface.base, 1px border.strong rim, the step number (text.tertiary)
//   current   surface.base, 1.5px tone rim, a 1px groove ring (tone, 40%) at 60% and the tone core at 30%. Busy: the core
//             breathes and a ring spreads out of the lens.
//   done      by variant: soft tone.soft disc + tone.text check (default), solid tone.solid + tone.on, outline 1.5px tone
//             rim + tone.text check, ghost the check alone
//   failed    danger.soft disc, danger.text cross
//   skipped   1px dashed border.strong rim, text.tertiary dash
export const stepperIndicator = cva('relative grid size-(--ind) shrink-0 place-items-center rounded-full font-ui font-semibold tabular-nums transition-control [&_svg]:size-[calc(var(--ind)*0.6)]', {
  variants: {
    status: {
      done: '',
      current: 'bg-surface-base text-(--tone-text) shadow-[inset_0_0_0_1.5px_var(--tone-solid)]',
      upcoming: 'bg-surface-base text-text-tertiary shadow-[inset_0_0_0_1px_var(--cs-color-border-strong)]',
      failed: 'bg-danger-soft text-danger-text',
      skipped: 'border border-dashed border-border-strong text-text-tertiary',
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
    { status: 'done', variant: 'solid', className: 'bg-(--tone-solid) text-(--tone-on)' },
    { status: 'done', variant: 'soft', className: 'bg-(--tone-soft) text-(--tone-text)' },
    { status: 'done', variant: 'outline', className: 'bg-surface-base text-(--tone-text) shadow-[inset_0_0_0_1.5px_var(--tone-solid)]' },
    { status: 'done', variant: 'ghost', className: 'bg-transparent text-(--tone-text)' },
  ],
  defaultVariants: { status: 'upcoming', variant: 'soft', size: 'md', radius: 'full', shadow: 'none' },
});
/** Current lens: the groove ring (60%, 1px, tone at 40%), the core (30%, tone) and, while busy, the spreading ring. */
export const stepperGrooveClass = 'pointer-events-none absolute inset-[20%] rounded-full opacity-40 shadow-[inset_0_0_0_1px_var(--tone-solid)]';
export const stepperCoreClass = 'size-[30%] rounded-full bg-(--tone-solid)';
export const stepperCoreBusyClass = 'animate-breathe';
export const stepperRippleClass = 'pointer-events-none absolute inset-0 animate-ripple rounded-full shadow-[inset_0_0_0_1px_var(--tone-solid)]';

// Labels keep one size across states (no layout jump); the current step leads by weight and ink: semibold text.primary.
// Done text.secondary, upcoming text.tertiary, failed danger.text, skipped text.placeholder struck through. size steps the
// type with the lens: xs ui-sm, sm / md ui-strong (13 / 500), lg ui-lg (all medium).
export const stepperLabel = cva('block truncate font-ui', {
  variants: {
    orientation: {
      horizontal: '',
      vertical: 'flex min-h-(--ind) items-center',
    },
    status: {
      done: 'text-text-secondary',
      current: 'font-semibold text-text-primary',
      upcoming: 'text-text-tertiary',
      failed: 'text-danger-text',
      skipped: 'text-text-placeholder line-through decoration-border-strong',
    },
    size: { xs: 'text-ui-sm', sm: 'text-ui-strong', md: 'text-ui-strong', lg: 'text-ui-lg' },
  },
  defaultVariants: { orientation: 'horizontal', status: 'done', size: 'md' },
});

/** Text beside the lens (horizontal): label over description. In a narrow row only the current step keeps it (stepperCompactHideClass). */
export const stepperTextClass = 'grid min-w-0';
export const stepperCompactHideClass = 'sr-only';

export const stepperDescription = cva('font-ui text-hint text-text-tertiary', {
  variants: {
    orientation: {
      horizontal: 'block truncate',
      vertical: 'mt-0.5',
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
      skipped: 'text-text-placeholder',
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
      skipped: 'text-text-tertiary [&_svg]:size-icon-sm',
    },
  },
  defaultVariants: { status: 'upcoming' },
});

/** The now mark (owner 2026-11-13, dzV2): the 12px lens of the progress look, a 1.5px tone rim around a 4px tone core; with
 *  tone agent (the agent is working) the core breathes. No spectrum ring. */
export const stepperChecklistMark = cva('relative grid size-icon-sm place-items-center rounded-full shadow-[inset_0_0_0_1.5px_var(--tone-solid)]', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
  },
  defaultVariants: { tone: 'accent' },
});
export const stepperChecklistCoreClass = 'size-1 rounded-full bg-(--tone-solid)';

export const stepperTodoRingClass = 'size-icon-sm rounded-full border border-dashed border-border-strong';

/** Done labels are struck through in border.subtle. */
export const stepperChecklistLabel = cva('', {
  variants: { status: { done: 'line-through decoration-border-subtle', current: '', upcoming: '', failed: '', skipped: 'line-through decoration-border-subtle' } },
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
