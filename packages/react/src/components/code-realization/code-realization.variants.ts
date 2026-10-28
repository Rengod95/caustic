import { cva } from 'class-variance-authority';

export const codeRealizationVariants = cva('grid gap-3.5');

/** The phase strip as a stepper: steps joined by connectors that stretch to fill the row (no wrap). */
export const codeRealizationPhasesVariants = cva('m-0 flex list-none items-center gap-2 p-0');

/**
 * One step: a marker and its label, no pill. done = success check marker, secondary label; now = the agent orb and the
 * primary label on a raised plate (md radius); todo = a hollow marker, tertiary label. Common props (lib/common-props.ts,
 * set on CodeRealization): variant = emphasis of the done and todo markers (soft, the default); tone = the text of the
 * current step (neutral = text.primary); size = step height, plate padding and type; radius / shadow shape the current
 * plate with radiusClass (default md) / shadowClass (default 1) after these classes.
 */
export const codeRealizationPhaseVariants = cva('inline-flex flex-none items-center gap-1.5 rounded-md font-medium', {
  variants: {
    phase: { done: 'text-text-secondary', now: 'bg-surface-base text-text-primary shadow-1', todo: 'text-text-tertiary' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    size: {
      xs: 'h-control-compact-2xs px-1.5 text-micro',
      sm: 'h-control-2xs px-1.75 text-label',
      md: 'h-control-xs px-2 text-label',
      lg: 'h-control-sm px-2.5 text-ui-sm',
    },
    radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
    shadow: { none: '', '1': '', '2': '', '3': '', '4': '', '5': '' },
  },
  compoundVariants: [
    { phase: ['done', 'todo'], className: 'px-0' },
    { phase: 'now', tone: 'accent', className: 'text-accent-text' },
    { phase: 'now', tone: 'success', className: 'text-success-text' },
    { phase: 'now', tone: 'warning', className: 'text-warning-text' },
    { phase: 'now', tone: 'danger', className: 'text-danger-text' },
    { phase: 'now', tone: 'info', className: 'text-info-text' },
    { phase: 'now', tone: 'agent', className: 'text-agent-text' },
  ],
  defaultVariants: { phase: 'todo', variant: 'soft', tone: 'neutral', size: 'md', radius: 'md', shadow: '1' },
});

/** The step marker of a done or todo step (the current step shows the orb instead). 14px circle; variant sets its emphasis. */
export const codeRealizationMarkerVariants = cva('grid size-3.5 shrink-0 place-items-center rounded-full', {
  variants: {
    phase: { done: '', todo: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
  },
  compoundVariants: [
    { phase: 'done', variant: 'soft', className: 'bg-success-soft text-success-text' },
    { phase: 'done', variant: 'solid', className: 'bg-success-solid text-success-on' },
    { phase: 'done', variant: 'outline', className: 'text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { phase: 'done', variant: 'ghost', className: 'text-success-text' },
    { phase: 'todo', variant: 'soft', className: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-border-strong)]' },
    { phase: 'todo', variant: 'solid', className: 'bg-neutral-track' },
    { phase: 'todo', variant: 'outline', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { phase: 'todo', variant: 'ghost', className: 'after:size-1.5 after:rounded-full after:bg-neutral-graphic after:content-[""]' },
  ],
  defaultVariants: { phase: 'todo', variant: 'soft' },
});

/** The agent orb: only on the current phase. */
export const codeRealizationOrbVariants = cva('', {
  variants: {
    phase: {
      done: '',
      now: 'orb orb-sm',
      todo: '',
    },
  },
  defaultVariants: { phase: 'todo' },
});

/** The check inside a done marker. */
export const codeRealizationPhaseIconVariants = cva('size-2.5 shrink-0 stroke-3');

/** Connector between two steps; it stretches (16px at least). reached (the step after it is done or current) = a solid
 *  2px success graphic line, the progress drawn; ahead = a 2px dash of border.strong (4px dash, 4px gap) still to go. */
export const codeRealizationSeparatorVariants = cva('h-0.5 min-w-4 flex-1 rounded-full', {
  variants: {
    reached: {
      true: 'bg-success-graphic',
      false: 'bg-[repeating-linear-gradient(90deg,var(--cs-color-border-strong)_0_var(--spacing),transparent_var(--spacing)_calc(var(--spacing)*2))]',
    },
  },
  defaultVariants: { reached: false },
});

export const codeRealizationFilesVariants = cva('m-0 grid list-none gap-px p-0');
/** One file row. A warning or danger row sits on its tone tint, so the one row that needs attention is not skimmed past;
 *  hover steps the tint to the soft fill (other rows hover with neutral.hover). */
export const codeRealizationFileVariants = cva('grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md px-2 text-ui-sm font-normal text-text-primary', {
  variants: {
    fileSize: { xs: 'h-6', sm: 'h-7', md: 'h-menu-item', lg: 'h-control-md' },
    fileTone: {
      neutral: 'hover:bg-neutral-hover', accent: 'hover:bg-neutral-hover', success: 'hover:bg-neutral-hover', info: 'hover:bg-neutral-hover', agent: 'hover:bg-neutral-hover',
      warning: 'bg-warning-tint hover:bg-warning-soft', danger: 'bg-danger-tint hover:bg-danger-soft',
    },
  },
  defaultVariants: { fileSize: 'md', fileTone: 'neutral' },
});
/** File glyph colour by the row tone (CodeRealizationFile tone; `default` is the deprecated name of neutral). */
export const codeRealizationFileIconVariants = cva('size-icon-sm shrink-0', {
  variants: {
    fileTone: {
      neutral: 'text-text-tertiary', accent: 'text-accent-text', success: 'text-success-text', warning: 'text-warning-text',
      danger: 'text-danger-text', info: 'text-info-text', agent: 'text-agent-text',
    },
  },
  defaultVariants: { fileTone: 'neutral' },
});
export const codeRealizationFileNameVariants = cva('truncate font-mono text-mono-md font-normal');
export const codeRealizationStatsVariants = cva('flex gap-1.5 font-mono text-mono-sm font-normal');
export const codeRealizationAddedVariants = cva('text-diff-add-text');
export const codeRealizationRemovedVariants = cva('text-diff-remove-text');

export const codeRealizationFooterVariants = cva('flex items-center justify-between gap-2');
export const codeRealizationTargetVariants = cva(
  [
    'flex h-control-md w-target-w items-center justify-between gap-2 rounded-md bg-neutral-well px-2.5 text-left font-ui text-ui-sm font-normal text-text-primary outline-none',
  ],
  {
    variants: {
      interactive: {
        true: [
          'cursor-pointer transition-[background-color,box-shadow] duration-120 ease-out hover:bg-neutral-hover',
          'focus-visible:bg-surface-base focus-visible:shadow-focus-field',
        ],
        false: '',
      },
    },
    defaultVariants: { interactive: true },
  },
);
export const codeRealizationTargetChevronVariants = cva('size-icon-sm shrink-0 text-text-tertiary');
