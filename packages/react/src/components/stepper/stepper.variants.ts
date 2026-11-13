import { cva, type VariantProps } from 'class-variance-authority';

// The root. tone sets the --tone-* slots of the progress (accent by default); size sets the type of the names and
// --stepper-line, their line height, which the vertical separator groove centres on. variant checklist (the agent plan, merged from Plan
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
      xs: '[--stepper-line:18px]',
      sm: '[--stepper-line:18px]',
      md: '[--stepper-line:18px]',
      lg: '[--stepper-line:20px]',
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
  defaultVariants: { radius: 'full', shadow: 'none' },
});

/** The step list: a row of equal columns (horizontal), a column (max-width 420); the 1px-gap checklist otherwise. */
export const stepperSteps = cva('m-0 w-full list-none p-0', {
  variants: {
    layout: {
      horizontal: 'flex min-w-0 items-start',
      vertical: 'grid max-w-stepper-max',
      checklist: 'grid gap-px',
    },
  },
  defaultVariants: { layout: 'horizontal' },
});

// Horizontal: equal columns, the groove rail over the head (8px). A narrow row (data-compact) lets the current column take
// its own width and the others share the rest. Vertical: the 12px rail down the start edge, the text 24px in, 20px between steps.
export const stepperItem = cva('relative min-w-0', {
  variants: {
    orientation: {
      horizontal: 'grid flex-1 basis-0 content-start gap-2 data-[status=current]:in-data-compact:flex-none',
      vertical: 'ps-6 pb-5 last:pb-0',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});

/** The head of a step: mark and text, 6px apart, 8px clear of the next rail (horizontal). */
export const stepperHeadClass = 'flex min-w-0 items-center gap-1.5 pe-2';

// The Fresnel groove rail (owner 2026-11-13, dzV2 round 2): a lens profile unrolled. Each step is one run of fine grooves
// (1 × 6px, full radius) whose spacing tightens toward the next step (about 2:1 from first to last, like the rings of a
// Fresnel lens toward its rim), opened by a 12px major groove that is the separator. Light fills the grooves: done steps are lit, the
// current step glows dim and, while busy, a glint runs through its grooves toward the next step; a failed step's light
// stops a third of the way in (danger); skipped steps keep every other groove, 2px tall.
export const stepperRail = cva('block', {
  variants: {
    orientation: {
      horizontal: 'relative h-3 w-full',
      vertical: 'absolute start-0 top-0 h-full w-3',
    },
  },
  defaultVariants: { orientation: 'horizontal' },
});
/** The separator groove at the start of the step: 12px, full radius. Lit once the step is reached. */
export const stepperMajor = cva('absolute rounded-full transition-colors duration-slow ease-out', {
  variants: {
    orientation: {
      horizontal: 'start-0 top-0 h-3 w-px',
      vertical: 'start-0 top-[calc(var(--stepper-line)/2-0.5px)] h-px w-3',
    },
    lit: { true: 'bg-(--stepper-lit)', false: 'bg-border-strong' },
  },
  defaultVariants: { orientation: 'horizontal', lit: false },
});
/** One groove. Its place along the rail is set inline: t(1.35 − 0.35t), t = k/n. */
export const stepperGroove = cva('absolute rounded-full transition-colors duration-slow ease-out', {
  variants: {
    orientation: {
      horizontal: 'start-(--at) top-0.75 h-1.5 w-px',
      vertical: 'start-0.75 top-(--at) h-px w-1.5',
    },
    light: {
      lit: 'bg-(--stepper-lit)',
      dim: 'bg-text-tertiary',
      rest: 'bg-border-strong',
      glint: 'animate-glint bg-(--tone-solid) [animation-delay:var(--delay)]',
      danger: 'bg-danger-solid',
    },
    skipped: { true: '', false: '' },
  },
  compoundVariants: [
    { orientation: 'horizontal', skipped: true, className: 'top-1.25 h-0.5' },
    { orientation: 'vertical', skipped: true, className: 'start-1.25 w-0.5' },
  ],
  defaultVariants: { orientation: 'horizontal', light: 'rest', skipped: false },
});

// The mark before the name, on the name's 18px line (12px box, the cap height of 13px type):
//   upcoming  the two-digit index, mono-sm text.tertiary (tabular)
//   current   the live mark: the app's own (live prop) or the default particle orb; still unless busy
//   done      a 12px check stroke, text.secondary
//   failed    a 12px cross stroke, danger.text
//   skipped   a 12px dash, text.tertiary
export const stepperMark = cva('relative grid h-4.5 min-w-3 shrink-0 place-items-center [&_svg]:size-3', {
  variants: {
    status: {
      done: 'text-text-secondary',
      current: 'w-3.5',
      upcoming: 'font-mono text-mono-sm text-text-tertiary tabular-nums',
      failed: 'text-danger-text',
      skipped: 'text-text-tertiary',
    },
  },
  defaultVariants: { status: 'upcoming' },
});

/** Default live mark (no live prop): six 1.5px particles on two orbits inside 14px, breathing out of phase; still unless busy. */
export const stepperParticlesClass = 'relative block size-3.5';
export const stepperOrbitClass = 'absolute inset-0 block';
export const stepperOrbitReverseClass = '[animation-direction:reverse]';
export const stepperOrbitBusyClass = 'animate-orbit';
export const stepperParticleClass = 'absolute start-(--x) top-(--y) block size-0.5 rounded-full bg-(--tone-solid) [animation-delay:var(--delay)]';
export const stepperParticleBusyClass = 'animate-breathe';

// Done emphasis (variant) sets the light of the rail: soft (default) text.secondary grooves under a text.primary separator,
// solid tone.solid throughout, outline the separator alone, ghost no light (marks only).
export const stepperLightVariants = cva('', {
  variants: {
    variant: {
      soft: '[--stepper-lit:var(--cs-color-text-secondary)]',
      solid: '[--stepper-lit:var(--tone-solid)]',
      outline: '[--stepper-lit:var(--tone-solid)]',
      ghost: '[--stepper-lit:var(--cs-color-border-strong)]',
      checklist: '',
    },
  },
  defaultVariants: { variant: 'soft' },
});

// Names keep one size across states (no layout jump); the current step leads by weight and ink.
// Done text.secondary, upcoming text.tertiary, failed danger.text, skipped text.placeholder struck through.
export const stepperLabel = cva('block truncate font-ui', {
  variants: {
    orientation: { horizontal: '', vertical: '' },
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

/** Text beside the mark: name over description. A narrow row hides it (sr-only): first on every step but the current one, then on all. */
export const stepperTextClass = 'grid min-w-0';
export const stepperCompactHideClass = 'sr-only';

/** Description under the name: hint (11.5 / 400) text.tertiary; one line horizontal, wraps vertical (2px above). */
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

/** The now mark (owner 2026-11-13, dzV2 round 2): the live mark of the progress look (the app's own via live, else the
 *  default particles), 14px; it moves with tone agent or a busy step. No ring, no spectrum. */
export const stepperChecklistLiveClass = 'grid size-icon-sm place-items-center';

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
/** A pressable step of the progress look: the head (mark and name) as a button. */
export const stepperPressIndicatorClass = 'press cursor-pointer';
