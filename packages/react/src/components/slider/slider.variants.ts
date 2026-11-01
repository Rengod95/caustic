import { cva, type VariantProps } from 'class-variance-authority';

// Common props (owner 2026-10-26). variant is the track (the deprecated appearance maps onto it: default = solid):
//   solid   neutral.track bar with the tone solid range (today's default)
//   soft    the tone soft 3 bar with the tone solid range
//   outline a 1px tone border edge, no bar fill, the tone solid range
//   ghost   no bar, the range alone
//   gradient / alpha / ruler  the slider's own tracks (user paint, checkerboard, ticks), unchanged
// tone colours the range, and the ruler line and knob (accent by default). The thumb stays the control thumb.
// radius: xs (the default) keeps the track's own corner (xs bar, sm gradient / alpha, lg at lg, none ruler); another
// value sets it. shadow is the track's elevation (flat by default). size steps the root, bar (2 · 4 · 4 · 6 px) and thumb (xs is new).
// Round 3 (owner 2026-10-28, A): slider-field and step-slider folded in. label + field make the inspector row (label
// column, the slider as `control`, a synced NumberField); levels make the discrete track (header, marks, end captions);
// dots and bars are the two compact discrete forms. Those forms reuse the track and range below; the classes for their
// own parts follow at the end of this file.
export const sliderVariants = cva(
  'group relative flex min-w-0 flex-1 touch-none select-none items-center data-[disabled]:pointer-events-none',
  {
    variants: {
      variant: { solid: '', soft: '', outline: '', ghost: '', gradient: '', alpha: '', ruler: 'h-slider-ruler-h', dots: '', bars: '' },
      size: { xs: 'h-3', sm: 'h-4', md: 'h-5', lg: 'h-control-inline' },
    },
    // The ruler is the same height at every size.
    compoundVariants: [{ variant: 'ruler', size: ['xs', 'sm', 'md', 'lg'], className: 'h-slider-ruler-h' }],
    defaultVariants: { variant: 'solid', size: 'md' },
  },
);

// Disabled is a colour, not opacity: the track takes disabled.fill and the amount disabled.text. Gradient and alpha
// tracks are user paint (content family) and keep their colours; only their edge and the swatch thumb ring take
// disabled.border. Ruler ticks take disabled.border (minor) and disabled.text (major).
export const sliderTrack = cva('relative grow', {
  variants: {
    variant: {
      solid: 'h-1 overflow-hidden rounded-xs bg-neutral-track data-[disabled]:bg-disabled-fill',
      soft: 'h-1 overflow-hidden rounded-xs data-[disabled]:bg-disabled-fill',
      outline: 'h-1 overflow-hidden rounded-xs bg-transparent data-[disabled]:shadow-[inset_0_0_0_0.5px_var(--cs-color-disabled-border)]',
      ghost: 'h-1 overflow-hidden rounded-xs bg-transparent',
      gradient: 'h-3 rounded-sm bg-(image:--track) shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)] data-[disabled]:shadow-[inset_0_0_0_0.5px_var(--cs-color-disabled-border)]',
      alpha: [
        'h-3 rounded-sm shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)] data-[disabled]:shadow-[inset_0_0_0_0.5px_var(--cs-color-disabled-border)]',
        'bg-[image:var(--track),conic-gradient(var(--cs-color-canvas-checker-b)_25%,var(--cs-color-canvas-checker-a)_0_50%,var(--cs-color-canvas-checker-b)_0_75%,var(--cs-color-canvas-checker-a)_0)]',
        'bg-size-[100%_100%,calc(var(--spacing)*2)_calc(var(--spacing)*2)]',
      ],
      ruler: [
        'h-slider-ruler-h rounded-none bg-no-repeat',
        'bg-[repeating-linear-gradient(90deg,var(--cs-color-border-strong)_0_1px,transparent_1px_10%),repeating-linear-gradient(90deg,var(--cs-color-text-tertiary)_0_1px,transparent_1px_50%)]',
        'data-[disabled]:bg-[repeating-linear-gradient(90deg,var(--cs-color-disabled-border)_0_1px,transparent_1px_10%),repeating-linear-gradient(90deg,var(--cs-color-disabled-text)_0_1px,transparent_1px_50%)]',
        'bg-position-[0_60%,0_100%] bg-size-[100%_30%,calc(100%_+_1px)_55%]',
      ],
      dots: '',
      bars: '',
    },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    size: { xs: '', sm: '', md: '', lg: '' },
    // After variant and size, so an explicit radius wins over the track's own corner.
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: '', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  compoundVariants: [
    { variant: ['gradient', 'alpha'], size: 'lg', className: 'h-4.5 rounded-lg' },
    { variant: ['solid', 'soft', 'outline', 'ghost'], size: 'xs', className: 'h-0.5' },
    // lg: a 6px bar so the 26px control does not look empty around a 4px line (owner 2026-10-28, B).
    { variant: ['solid', 'soft', 'outline', 'ghost'], size: 'lg', className: 'h-1.5' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
    { variant: 'outline', tone: 'neutral', className: 'shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
  ],
  defaultVariants: { variant: 'solid', tone: 'accent', size: 'md', radius: 'xs', shadow: 'none' },
});

/** The amount from the start to the thumb (solid, soft, outline, ghost): the tone solid; disabled.text when disabled. */
export const sliderRange = cva('absolute inset-y-0 data-[disabled]:bg-disabled-text', {
  variants: {
    tone: {
      neutral: 'bg-neutral-solid', accent: 'bg-accent-solid', success: 'bg-success-solid', warning: 'bg-warning-solid',
      danger: 'bg-danger-solid', info: 'bg-info-solid', agent: 'bg-agent-solid',
    },
  },
  defaultVariants: { tone: 'accent' },
});

/** Ruler only: the 12px dot above the line thumb, in the tone solid with the thumb shadow, no ring (owner 2026-10-27). */
export const sliderKnob = cva('absolute -top-1.25 left-1/2 size-3 -translate-x-1/2 rounded-full shadow-thumb group-data-[disabled]:bg-disabled-text', {
  variants: {
    tone: {
      neutral: 'bg-neutral-solid', accent: 'bg-accent-solid', success: 'bg-success-solid', warning: 'bg-warning-solid',
      danger: 'bg-danger-solid', info: 'bg-info-solid', agent: 'bg-agent-solid',
    },
  },
  defaultVariants: { tone: 'accent' },
});

export const sliderThumb = cva(
  [
    'relative block rounded-full bg-control-thumb shadow-thumb outline-none transition-control',
    'before:absolute before:-inset-1.5 before:content-[""]',
    'hover:scale-[1.08] group-active:scale-[1.18] focus-visible:shadow-focus',
  ],
  {
    variants: {
      variant: {
        solid: '', soft: '', outline: '', ghost: '',
        gradient: 'size-5 bg-(color:--swatch) shadow-thumb-swatch focus-visible:shadow-focus data-[disabled]:shadow-[inset_0_0_0_0.5px_var(--cs-color-disabled-border),var(--cs-elevation-thumb-sm)]',
        alpha: 'size-5 bg-(color:--swatch) shadow-thumb-swatch focus-visible:shadow-focus data-[disabled]:shadow-[inset_0_0_0_0.5px_var(--cs-color-disabled-border),var(--cs-elevation-thumb-sm)]',
        ruler: 'h-slider-ruler-h w-0.5 rounded-xs shadow-none hover:scale-100 group-active:scale-100 data-[disabled]:bg-disabled-text',
        dots: '',
        bars: '',
      },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      size: { xs: 'size-2.5', sm: 'size-3', md: 'size-4', lg: 'size-5' },
    },
    compoundVariants: [
      { variant: ['gradient', 'alpha'], size: ['xs', 'sm', 'md', 'lg'], className: 'size-5' },
      { variant: 'ruler', size: ['xs', 'sm', 'md', 'lg'], className: 'h-slider-ruler-h w-0.5' },
      { variant: 'ruler', tone: 'neutral', className: 'bg-neutral-solid' },
      { variant: 'ruler', tone: 'accent', className: 'bg-accent-solid' },
      { variant: 'ruler', tone: 'success', className: 'bg-success-solid' },
      { variant: 'ruler', tone: 'warning', className: 'bg-warning-solid' },
      { variant: 'ruler', tone: 'danger', className: 'bg-danger-solid' },
      { variant: 'ruler', tone: 'info', className: 'bg-info-solid' },
      { variant: 'ruler', tone: 'agent', className: 'bg-agent-solid' },
    ],
    defaultVariants: { variant: 'solid', tone: 'accent', size: 'md' },
  },
);

// ── Row: label + slider + field (was SliderField) ──────────────────────────────────────────────────────────────────

/** The row: size steps the gap (8 · 10 · 10 · 12). flex-1 so it fills a flex parent as the bare slider does. */
export const sliderRowVariants = cva('flex min-w-0 flex-1 items-center', {
  variants: { size: { xs: 'gap-2', sm: 'gap-2.5', md: 'gap-2.5', lg: 'gap-3' } },
  defaultVariants: { size: 'md' },
});

/** Row label: fixed column (size-slider-label-w), secondary text, hint type (ui-xs at xs, ui-sm at lg). */
export const sliderLabelVariants = cva('w-slider-label-w shrink-0 text-text-secondary', {
  variants: { size: { xs: 'text-ui-xs', sm: 'text-hint', md: 'text-hint', lg: 'text-ui-sm' } },
  defaultVariants: { size: 'md' },
});

/** Field column: size-slider-field-w (64px): narrow, so the slider keeps its length in a 240px inspector (owner 2026-10-28, B),
 *  and just wide enough for the italic "Mixed" placeholder next to a % unit (58px clipped it; owner 2026-10-28, round 4). */
export const sliderFieldVariants = cva('w-slider-field-w shrink-0');

// ── Discrete forms: levels track, dots and bars (was StepSlider) ──────────────────────────────────────────────────

/** Sets --tone-solid, the chosen amount of the discrete forms (filled marks, the current mark ring, the current dot, lit bars). */
export const sliderToneVars = cva('', {
  variants: {
    tone: {
      neutral: '[--tone-solid:var(--cs-color-neutral-solid)]', accent: '[--tone-solid:var(--cs-color-accent-solid)]',
      success: '[--tone-solid:var(--cs-color-success-solid)]', warning: '[--tone-solid:var(--cs-color-warning-solid)]',
      danger: '[--tone-solid:var(--cs-color-danger-solid)]', info: '[--tone-solid:var(--cs-color-info-solid)]',
      agent: '[--tone-solid:var(--cs-color-agent-solid)]',
    },
  },
  defaultVariants: { tone: 'accent' },
});

/** Levels track: header, the strip and the end captions in an 8px stack. */
export const sliderLevelsVariants = cva('grid min-w-0 flex-1 gap-2');

/** Levels header: label (tertiary) left, the current level name (primary, semibold) right. */
export const sliderHeaderLabelVariants = cva('text-ui-sm font-normal text-text-tertiary');
export const sliderValueVariants = cva('ml-auto text-ui-sm font-semibold text-text-primary');

/** Levels strip: the interactive area (role slider), as high as the continuous root at each size. */
export const sliderControlVariants = cva(
  'group relative grid cursor-pointer touch-none items-center rounded-xs outline-none focus-visible:shadow-focus aria-disabled:cursor-not-allowed',
  {
    variants: { size: { xs: 'h-3', sm: 'h-4', md: 'h-5', lg: 'h-control-inline' } },
    defaultVariants: { size: 'md' },
  },
);

/** Levels fill: the range, from the start to the current level, following with a spring. */
export const sliderLevelsRange = cva('left-0 w-(--fill) transition-[width] duration-snappy ease-snappy');

/** One level mark: 8px hollow dot; filled in the tone up to the current level; the current level is a 16px white thumb
 *  with a 2px tone ring and the small thumb shadow, so it closes the fill (owner 2026-10-28, A). */
export const sliderMarkVariants = cva([
  'size-2 rounded-full bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-control)] transition-[width,height,background-color,box-shadow] duration-swift ease-standard',
  'data-[state=on]:bg-(--tone-solid) data-[state=on]:shadow-none group-aria-disabled:data-[state=on]:bg-disabled-text data-[state=current]:size-4 data-[state=current]:bg-control-thumb',
  'data-[state=current]:shadow-[0_0_0_2px_var(--tone-solid),var(--cs-elevation-thumb-sm)] group-aria-disabled:data-[state=current]:shadow-[0_0_0_2px_var(--cs-color-disabled-text),var(--cs-elevation-thumb-sm)]',
]);

/** Levels end captions. */
export const sliderEndsVariants = cva('flex justify-between text-ui-xs text-text-tertiary');

/** Dots: a radio row, 10px gap. */
export const sliderDotsVariants = cva('flex items-center gap-2.5');

/** One dot (radio): neutral.track at rest, the current dot in the tone and scaled 1.25; hit area extended past it. */
export const sliderStepVariants = cva(
  [
    'relative rounded-full bg-neutral-track outline-none transition-control before:absolute before:-inset-1.75',
    'focus-visible:shadow-focus data-[state=checked]:scale-125 data-[state=checked]:bg-(--tone-solid)',
    'disabled:cursor-not-allowed disabled:bg-disabled-fill disabled:data-[state=checked]:bg-disabled-text',
  ],
  {
    variants: { size: { xs: 'size-1.5', sm: 'size-2', md: 'size-2.5', lg: 'size-3' } },
    defaultVariants: { size: 'md' },
  },
);

/** Bars: a compact trigger button (the caller opens its menu). radius xs keeps its own md corner; shadow is its elevation. */
export const sliderBarsVariants = cva(
  [
    'group inline-flex h-control-inline items-center gap-1.5 rounded-md px-2 text-ui-sm text-text-secondary outline-none',
    'transition-control hover:bg-neutral-hover hover:text-text-primary focus-visible:shadow-focus disabled:text-disabled-text',
  ],
  {
    variants: {
      radius: {
        none: 'rounded-none', '2xs': 'rounded-2xs', xs: '', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
        xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
      },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    },
    defaultVariants: { radius: 'xs', shadow: 'none' },
  },
);

/** Bars glyph: three ascending bars (5, 8, 12px), lit in the tone up to the level. */
export const sliderGlyphVariants = cva('inline-flex h-3 items-end gap-0.5');
export const sliderBarVariants = cva(
  'block w-0.75 rounded-xs bg-neutral-track transition-control data-[state=on]:bg-(--tone-solid) group-disabled:bg-disabled-fill group-disabled:data-[state=on]:bg-disabled-text',
  {
    variants: { level: { 0: 'h-1.25', 1: 'h-2', 2: 'h-3' } },
    defaultVariants: { level: 0 },
  },
);

/** Bars only: the level name in text.primary, so the lit glyph and the word read as one value (owner 2026-10-28, C). */
export const sliderTextVariants = cva('text-text-primary group-disabled:text-disabled-text');

/** Bars only: the trailing chevron stays quiet (text.tertiary). */
export const sliderChevronVariants = cva('size-icon-sm text-text-tertiary group-disabled:text-disabled-text');

export type SliderVariantProps = VariantProps<typeof sliderVariants>;
