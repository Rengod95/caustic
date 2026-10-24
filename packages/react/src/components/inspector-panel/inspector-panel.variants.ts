import { cva } from 'class-variance-authority';

export const inspectorPanelVariants = cva(
  'w-full overflow-hidden rounded-panel bg-surface-base font-ui text-text-primary shadow-[var(--cs-elevation-3)]',
);

export const inspectorSectionVariants = cva('grid content-start gap-2 border-b border-border-subtle p-3 last:border-b-0');

export const inspectorSectionHeaderVariants = cva('flex items-center justify-between text-hint font-semibold text-text-secondary');
