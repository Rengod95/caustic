import { cva, type VariantProps } from 'class-variance-authority';

// Common props (owner 2026-10-26): tone colours the fill; variant is the track's emphasis (solid = today's neutral
// track with a 1px inset border.subtle hairline so the full length reads on raised surfaces and canvas tints (owner
// 2026-10-28, proposal C); soft = the tone's soft track; outline = a tone border edge and no track fill; ghost = no track at all);
// radius / shadow set the track (the component passes null when unset, so the shape's own radius and no shadow stay); size steps the bar height (md = size-progress-h, today's height).
// Shape (round 3, 2026-10-28, proposal A): 'ring' is the former Spinner. The ring box carries size, radius and shadow;
// its track and arc are two stacked children (progressRingTrack, progressRingIndicator) so a determinate ring can mask
// the arc to the value. Ring sizes step the ring and the stroke (xs 12, sm 14, md 20, lg 28); unset tone is neutral and
// unset radius full on a ring (the component resolves tone; the ring base class keeps rounded-full). The solid track
// hairline is a bar decision only.
export const progressVariants = cva('relative overflow-hidden', {
  variants: {
    shape: { bar: 'block w-full rounded-sm', ring: 'inline-block shrink-0 rounded-full' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    radius: {
      none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
      xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
    },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: '', sm: '', md: '', lg: '' },
  },
  compoundVariants: [
    { shape: 'bar', size: 'xs', className: 'h-0.5' },
    { shape: 'bar', size: 'sm', className: 'h-1' },
    { shape: 'bar', size: 'md', className: 'h-progress-h' },
    { shape: 'bar', size: 'lg', className: 'h-2' },
    { shape: 'ring', size: 'xs', className: 'size-icon-xs' },
    { shape: 'ring', size: 'sm', className: 'size-icon-sm' },
    { shape: 'ring', size: 'md', className: 'size-icon-lg' },
    { shape: 'ring', size: 'lg', className: 'size-spinner-lg' },
    // The hairline is the solid track's own shadow; an explicit elevation replaces it (as before the merge).
    { shape: 'bar', variant: 'solid', className: 'bg-neutral-track' },
    { shape: 'bar', variant: 'solid', shadow: 'none', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]' },
    { shape: 'bar', variant: ['outline', 'ghost'], className: 'bg-transparent' },
    { shape: 'bar', variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft' },
    { shape: 'bar', variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
    { shape: 'bar', variant: 'soft', tone: 'success', className: 'bg-success-soft' },
    { shape: 'bar', variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
    { shape: 'bar', variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
    { shape: 'bar', variant: 'soft', tone: 'info', className: 'bg-info-soft' },
    { shape: 'bar', variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
    { shape: 'bar', variant: 'outline', tone: 'neutral', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
    { shape: 'bar', variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { shape: 'bar', variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { shape: 'bar', variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { shape: 'bar', variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { shape: 'bar', variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { shape: 'bar', variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
  ],
  defaultVariants: { shape: 'bar', tone: 'accent', variant: 'solid', radius: 'sm', shadow: 'none', size: 'md' },
});

// --cs-progress is the value (a registered <percentage>, so the ring can transition it; see progressRingIndicator).
export const progressIndicator = cva('block h-full w-(--cs-progress) rounded-[inherit] transition-[width] duration-base ease-standard', {
  variants: {
    tone: {
      neutral: 'bg-neutral-solid', accent: 'bg-accent-solid', success: 'bg-success-solid', warning: 'bg-warning-solid',
      danger: 'bg-danger-solid', info: 'bg-info-solid', agent: 'spectrum-line animate-slide',
    },
    indeterminate: { true: 'w-[35%] animate-indeterminate', false: '' },
  },
});

// Ring track: solid = neutral.track; soft = the tone soft 3; outline = the tone border 6; ghost = no track (the arc alone).
// Stroke: xs / sm 1.5px, md / lg 2px (the former Spinner's hairlines).
export const progressRingTrack = cva('absolute inset-0 rounded-[inherit] border-solid', {
  variants: {
    size: { xs: 'border-[1.5px]', sm: 'border-[1.5px]', md: 'border-2', lg: 'border-2' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: 'border-neutral-track', soft: '', outline: '', ghost: 'border-transparent' },
  },
  compoundVariants: [
    { variant: 'soft', tone: 'neutral', className: 'border-neutral-soft' },
    { variant: 'soft', tone: 'accent', className: 'border-accent-soft' },
    { variant: 'soft', tone: 'success', className: 'border-success-soft' },
    { variant: 'soft', tone: 'warning', className: 'border-warning-soft' },
    { variant: 'soft', tone: 'danger', className: 'border-danger-soft' },
    { variant: 'soft', tone: 'info', className: 'border-info-soft' },
    { variant: 'soft', tone: 'agent', className: 'border-agent-soft' },
    { variant: 'outline', tone: 'neutral', className: 'border-neutral-border' },
    { variant: 'outline', tone: 'accent', className: 'border-accent-border' },
    { variant: 'outline', tone: 'success', className: 'border-success-border' },
    { variant: 'outline', tone: 'warning', className: 'border-warning-border' },
    { variant: 'outline', tone: 'danger', className: 'border-danger-border' },
    { variant: 'outline', tone: 'info', className: 'border-info-border' },
    { variant: 'outline', tone: 'agent', className: 'border-agent-border' },
  ],
});

// Ring arc: neutral = neutral.graphic (a graphic, 3:1, not a text colour), a hue = its solid 9. Indeterminate is one
// quarter arc turning (animate-spinner, stopped by reduced motion); determinate is the whole ring masked clockwise from
// 12 o'clock to the value (the mask only reads alpha; the colour var is any opaque token). The value is the registered
// --cs-progress, so a change sweeps the arc (duration-base) instead of jumping.
export const progressRingIndicator = cva('absolute inset-0 rounded-[inherit] border-solid', {
  variants: {
    size: { xs: 'border-[1.5px]', sm: 'border-[1.5px]', md: 'border-2', lg: 'border-2' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    indeterminate: {
      true: 'border-transparent animate-spinner',
      false: '[mask-image:conic-gradient(var(--cs-color-neutral-graphic)_var(--cs-progress),transparent_0)] transition-[--cs-progress] duration-base ease-standard',
    },
  },
  compoundVariants: [
    { indeterminate: true, tone: 'neutral', className: 'border-t-neutral-graphic' },
    { indeterminate: true, tone: 'accent', className: 'border-t-accent-solid' },
    { indeterminate: true, tone: 'success', className: 'border-t-success-solid' },
    { indeterminate: true, tone: 'warning', className: 'border-t-warning-solid' },
    { indeterminate: true, tone: 'danger', className: 'border-t-danger-solid' },
    { indeterminate: true, tone: 'info', className: 'border-t-info-solid' },
    { indeterminate: true, tone: 'agent', className: 'border-t-agent-solid' },
    { indeterminate: false, tone: 'neutral', className: 'border-neutral-graphic' },
    { indeterminate: false, tone: 'accent', className: 'border-accent-solid' },
    { indeterminate: false, tone: 'success', className: 'border-success-solid' },
    { indeterminate: false, tone: 'warning', className: 'border-warning-solid' },
    { indeterminate: false, tone: 'danger', className: 'border-danger-solid' },
    { indeterminate: false, tone: 'info', className: 'border-info-solid' },
    { indeterminate: false, tone: 'agent', className: 'border-agent-solid' },
  ],
});

export type ProgressVariantProps = VariantProps<typeof progressVariants>;
