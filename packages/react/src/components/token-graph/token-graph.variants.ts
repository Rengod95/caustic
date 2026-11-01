import { cva } from 'class-variance-authority';

// tone sets --tone-solid, the trace (traced wires, node rings and ports); accent by default. radius and shadow shape the
// canvas (xl, flat). variant and size reach the nodes through the graph context (see tokenGraphNodeVariants).
export const tokenGraphVariants = cva('relative h-graph-h w-full overflow-hidden rounded-xl bg-bg-canvas canvas-grid', {
  variants: {
    tone: {
      neutral: '[--tone-solid:var(--cs-color-neutral-solid)]',
      accent: '[--tone-solid:var(--cs-color-accent-solid)]',
      success: '[--tone-solid:var(--cs-color-success-solid)]',
      warning: '[--tone-solid:var(--cs-color-warning-solid)]',
      danger: '[--tone-solid:var(--cs-color-danger-solid)]',
      info: '[--tone-solid:var(--cs-color-info-solid)]',
      agent: '[--tone-solid:var(--cs-color-agent-solid)]',
    },
    // The default key keeps the component's own corner and shadow (''); every other key sets that token (the radiusClass / shadowClass names of common-props.ts, written out so Tailwind, which scans ./components only, generates them).
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { tone: 'accent', radius: 'xl', shadow: 'none' },
});

export const tokenGraphWiresVariants = cva('pointer-events-none absolute inset-0 size-full');

// While a node is traced, every wire off the trace steps back to border.subtle (data-dimmed) so the traced path stands out.
export const tokenGraphWireVariants = cva('fill-none stroke-border-strong stroke-[1.5px] transition-[stroke,stroke-width] duration-base ease-standard data-[dimmed]:stroke-border-subtle data-[traced]:stroke-(--tone-solid) data-[traced]:stroke-2');

export const tokenGraphTierVariants = cva('absolute top-2.5 text-caption text-text-tertiary uppercase', {
  variants: { at: { start: 'left-4', center: 'left-[38%]', end: 'right-4' } },
  defaultVariants: { at: 'start' },
});

export const tokenGraphNodeVariants = cva(
  [
    'group absolute top-(--y) left-(--x) grid w-graph-node-w cursor-pointer gap-0.5 rounded-lg px-2.5 py-1.75 font-ui text-ui-xs outline-none',
    'transition-control press',
    'bg-surface-base shadow-[inset_0_0_0_0.5px_var(--cs-color-border-default)]',
    'focus-visible:shadow-focus',
  ],
  {
    variants: {
      // outline = surface.base + border.default hairline (the specimen); solid = surface.raised, no hairline; soft =
      // neutral.well, no hairline; ghost = no fill, no hairline. Traced and missing draw over every variant.
      variant: {
        outline: '',
        solid: 'bg-surface-raised shadow-none',
        soft: 'bg-neutral-well shadow-none',
        ghost: 'bg-transparent shadow-none',
      },
      size: { xs: 'px-1.5 py-1', sm: 'px-2 py-1.5', md: '', lg: 'px-3 py-2.5 text-ui-sm' },
      // Traced keeps its tone ring inside the outer focus ring, so a focused traced node shows both.
      traced: { true: 'shadow-[inset_0_0_0_1.5px_var(--tone-solid)] data-[traced]:focus-visible:shadow-[inset_0_0_0_1.5px_var(--tone-solid),var(--cs-focus)]', false: '' },
      // Missing is the danger subtle error container (D5, same as tool-call failed): tint 2 fill, danger border 6 edge, kept inside the focus ring.
      missing: { true: 'bg-danger-tint shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] data-[missing]:focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border),var(--cs-focus)]', false: '' },
      // Dimmed = off the trace while some node is traced (owner 2026-10-28): the name steps down to text.tertiary (see
      // tokenGraphNameVariants) and the outline hairline to border.subtle. A missing node keeps its danger look.
      dimmed: { true: '', false: '' },
    },
    compoundVariants: [{ variant: 'outline', dimmed: true, className: 'shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)]' }],
    defaultVariants: { variant: 'outline', size: 'md', traced: false, missing: false, dimmed: false },
  },
);

export const tokenGraphNameVariants = cva('truncate py-px font-mono text-mono-sm text-text-primary transition-colors duration-quick ease-standard group-data-[dimmed]:text-text-tertiary group-data-[missing]:text-danger-text');

export const tokenGraphMetaVariants = cva('flex items-center gap-1.25 text-ui-xs font-normal text-text-tertiary');

export const tokenGraphSwatchVariants = cva('size-2.5 shrink-0 rounded-xs bg-(--swatch) shadow-[inset_0_0_0_0.5px_var(--cs-color-swatch-edge)]');

export const tokenGraphPortVariants = cva(
  [
    'pointer-events-none absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-surface-base transition-control',
    'shadow-[inset_0_0_0_1px_var(--cs-color-border-control)]',
    'group-data-[traced]:bg-(--tone-solid) group-data-[traced]:shadow-[inset_0_0_0_1.5px_var(--tone-solid)]',
  ],
  { variants: { side: { in: '-left-1', out: '-right-1' } }, defaultVariants: { side: 'in' } },
);
