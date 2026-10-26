import { cva, type VariantProps } from 'class-variance-authority';

export const effectEditorVariants = cva('flex min-w-0 flex-col gap-3.5 font-ui');

export const effectEditorStageVariants = cva('relative grid h-effect-stage-h place-items-center rounded-xl bg-bg-inset', {
  variants: { clip: { true: 'overflow-hidden', false: '' } },
  defaultVariants: { clip: false },
});

/** The sample object. The edited effect is runtime data (--fx, --blur); the hairline ring is a token. */
export const effectEditorCardVariants = cva(
  'relative h-16 w-pad-box rounded-toolbar shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--fx)] transition-[box-shadow,filter] duration-base ease-out motion-reduce:transition-none',
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
