import { cva, type VariantProps } from 'class-variance-authority';

export const effectEditorVariants = cva('flex min-w-0 flex-col gap-3.5 font-ui');

export const effectEditorStageVariants = cva('grid h-effect-stage-h place-items-center rounded-xl bg-bg-inset');

/** The sample object. The edited shadow is runtime data (--fx); the hairline ring is a token. */
export const effectEditorCardVariants = cva(
  'h-16 w-pad-box rounded-toolbar bg-surface-base shadow-[0_0_0_1px_var(--cs-color-border-subtle),var(--fx)] transition-[box-shadow] duration-base ease-out motion-reduce:transition-none',
);

export const effectEditorFieldsVariants = cva('grid grid-cols-2 gap-1.5');

export type EffectEditorVariantProps = VariantProps<typeof effectEditorVariants>;
