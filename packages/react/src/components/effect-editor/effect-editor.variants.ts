import { cva, type VariantProps } from 'class-variance-authority';

// Common props (lib/common-props.ts): radius, shadow and size on the root (size steps the stack gap; the fields keep
// their own control size); tone and variant on the preview stage.
export const effectEditorVariants = cva('flex min-w-0 flex-col gap-3.5 font-ui', {
  variants: {
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'gap-2', sm: 'gap-3', md: '', lg: 'gap-4' },
  },
  defaultVariants: { radius: 'none', shadow: 'none', size: 'md' },
});

// soft (default) is today's bg.inset stage; a tone tints it (tint), solid takes the soft step, outline is an edge only.
export const effectEditorStageVariants = cva('relative grid h-effect-stage-h place-items-center rounded-xl bg-bg-inset', {
  variants: {
    clip: { true: 'overflow-hidden', false: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'bg-neutral-track' },
    { variant: 'solid', tone: 'accent', className: 'bg-accent-soft' },
    { variant: 'solid', tone: 'success', className: 'bg-success-soft' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-soft' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-soft' },
    { variant: 'solid', tone: 'info', className: 'bg-info-soft' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-soft' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-tint' },
    { variant: 'soft', tone: 'success', className: 'bg-success-tint' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-tint' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-tint' },
    { variant: 'soft', tone: 'info', className: 'bg-info-tint' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-tint' },
    { variant: 'outline', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
    { variant: 'outline', tone: 'accent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
    { variant: 'outline', tone: 'success', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
    { variant: 'outline', tone: 'warning', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
    { variant: 'outline', tone: 'danger', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
    { variant: 'outline', tone: 'info', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
    { variant: 'outline', tone: 'agent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    { variant: 'ghost', tone: 'neutral', className: 'bg-transparent' },
    { variant: 'ghost', tone: 'accent', className: 'bg-transparent' },
    { variant: 'ghost', tone: 'success', className: 'bg-transparent' },
    { variant: 'ghost', tone: 'warning', className: 'bg-transparent' },
    { variant: 'ghost', tone: 'danger', className: 'bg-transparent' },
    { variant: 'ghost', tone: 'info', className: 'bg-transparent' },
    { variant: 'ghost', tone: 'agent', className: 'bg-transparent' },
  ],
  defaultVariants: { clip: false, tone: 'neutral', variant: 'soft' },
});

/** The sample object. The edited effect is runtime data (--fx, --blur); the hairline ring is a token. */
export const effectEditorCardVariants = cva(
  'relative h-16 w-pad-box rounded-toolbar shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--fx)]',
  {
    variants: {
      kind: {
        shadow: 'bg-surface-base',
        layer: 'bg-surface-base blur-(--blur)',
        backdrop: 'bg-surface-translucent backdrop-blur-(--blur)',
      },
    },
    defaultVariants: { kind: 'shadow' },
  },
);

/** The two-tone backdrop that a background blur is seen against: the checker pattern pair, not status hues. */
export const effectEditorBackdropVariants = cva('absolute inset-0 bg-canvas-checker-a');

export const effectEditorBackdropHalfVariants = cva('absolute inset-y-0 right-0 w-1/2 bg-canvas-checker-b');

export const effectEditorFieldsVariants = cva('grid grid-cols-2 gap-1.5');

export const effectEditorBehindVariants = cva('flex items-center justify-between gap-2 text-footnote text-text-primary');

export type EffectEditorVariantProps = VariantProps<typeof effectEditorVariants>;
