import { cva, type VariantProps } from 'class-variance-authority';

/** The width comes from --side-panel-w: the preset's token by default, an inline value once the panel is resized. */
export const sidePanelVariants = cva(
  [
    'relative flex min-h-0 flex-none flex-col self-stretch font-ui text-text-primary',
    'transition-[width,visibility] duration-base ease-standard motion-reduce:transition-none',
  ],
  {
    variants: {
      side: { start: '', end: '' },
      appearance: {
        floating: 'glass glass-thick glass-shadow-2 rounded-panel',
        docked: 'rounded-none border-border-subtle bg-surface-base',
      },
      size: {
        inspector: '[--side-panel-w:var(--cs-studio-inspector-w)]',
        pane: '[--side-panel-w:var(--cs-studio-pane-w)]',
        wide: '[--side-panel-w:var(--cs-studio-pane-max)]',
      },
    },
    compoundVariants: [
      { appearance: 'docked', side: 'start', className: 'border-r' },
      { appearance: 'docked', side: 'end', className: 'border-l' },
    ],
    defaultVariants: { side: 'start', appearance: 'floating', size: 'pane' },
  },
);

export const sidePanelHeaderVariants = cva('flex min-h-control-xl flex-none items-center gap-2 border-b px-inset-regular-x py-2', {
  variants: { dividers: { true: 'border-border-subtle', false: 'border-transparent' } },
  defaultVariants: { dividers: true },
});

export const sidePanelFooterVariants = cva('flex flex-none items-center gap-2 border-t px-inset-regular-x py-3', {
  variants: { dividers: { true: 'border-border-subtle', false: 'border-transparent' } },
  defaultVariants: { dividers: true },
});

export type SidePanelVariantProps = VariantProps<typeof sidePanelVariants>;
