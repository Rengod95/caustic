import { cva } from 'class-variance-authority';

// Disabled is a colour, not opacity: the fields draw their own disabled colours; the corner glyphs take disabled text.
// Common props (lib/common-props.ts): radius, shadow and size on the root (size steps the stack gap: the fields keep
// their own control size); tone and variant on the preview shape, the emphasis of the part.
export const cornerRadiusVariants = cva('group/corner-radius grid gap-3.5 font-ui', {
  variants: {
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'gap-2', sm: 'gap-3', md: '', lg: 'gap-4' },
  },
  defaultVariants: { radius: 'none', shadow: 'none', size: 'md' },
});

export const cornerRadiusStage = cva('flex items-center justify-center gap-3.5 rounded-xl bg-bg-inset px-3.5 py-5');

// The radius is data: --r holds the border-radius shorthand derived from the value, --shape the corner-shape derived from
// the smoothing (round at 0 %, a superellipse above; owner 2026-10-27, proposal C). It overrides the system squircle.
// outline (default) is today's sample: surface.base with a 1.5px text.primary ring; a tone draws the ring in its graphic.
// While a corner field has focus (data-editing = tl / tr / bl / br) an accent.graphic ring is drawn over that corner's
// quarter of the shape (proposal A), so the stage answers which corner is being edited.
export const cornerRadiusShape = cva(
  [
    'relative h-radius-preview-h w-radius-preview-w shrink-0 rounded-(--r) [corner-shape:var(--shape)] bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-text-primary)] transition-[border-radius] duration-gentle ease-spring',
    'after:pointer-events-none after:absolute after:inset-0 after:hidden after:rounded-[inherit] after:shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-graphic)] after:content-[""] data-editing:after:block',
    'data-[editing=tl]:after:[clip-path:inset(0_50%_50%_0)] data-[editing=tr]:after:[clip-path:inset(0_0_50%_50%)]',
    'data-[editing=bl]:after:[clip-path:inset(50%_50%_0_0)] data-[editing=br]:after:[clip-path:inset(50%_0_0_50%)]',
  ],
  {
    variants: {
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: { solid: '', soft: '', outline: '', ghost: '' },
    },
    compoundVariants: [
      { variant: 'solid', tone: 'neutral', className: 'bg-ink-solid shadow-none' },
      { variant: 'solid', tone: 'accent', className: 'bg-accent-solid shadow-none' },
      { variant: 'solid', tone: 'success', className: 'bg-success-solid shadow-none' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning-solid shadow-none' },
      { variant: 'solid', tone: 'danger', className: 'bg-danger-solid shadow-none' },
      { variant: 'solid', tone: 'info', className: 'bg-info-solid shadow-none' },
      { variant: 'solid', tone: 'agent', className: 'bg-agent-solid shadow-none' },
      { variant: 'soft', tone: 'neutral', className: 'bg-neutral-track shadow-none' },
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft shadow-none' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft shadow-none' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft shadow-none' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft shadow-none' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft shadow-none' },
      { variant: 'soft', tone: 'agent', className: 'bg-agent-soft shadow-none' },
      { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-graphic)]' },
      { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-success-graphic)]' },
      { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-warning-graphic)]' },
      { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-graphic)]' },
      { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-info-graphic)]' },
      { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1.5px_var(--cs-color-agent-graphic)]' },
      { variant: 'ghost', tone: 'neutral', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]' },
      { variant: 'ghost', tone: 'accent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { variant: 'ghost', tone: 'success', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { variant: 'ghost', tone: 'warning', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { variant: 'ghost', tone: 'danger', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { variant: 'ghost', tone: 'info', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { variant: 'ghost', tone: 'agent', className: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
    ],
    defaultVariants: { tone: 'neutral', variant: 'outline' },
  },
);

export const cornerRadiusFields = cva('grid grid-cols-[1fr_1fr_auto] items-center gap-1.5');

export const cornerRadiusCorners = cva('grid grid-cols-2 gap-1.5');

// Top and left edges only, with a 6px top-left radius. The other corners mirror it.
export const cornerRadiusGlyph = cva(
  'block size-icon-xs rounded-tl-sm border-t-[1.5px] border-l-[1.5px] border-current text-text-tertiary group-data-disabled/corner-radius:text-disabled-text',
  {
    variants: { corner: { tl: '', tr: '-scale-x-100', bl: '-scale-y-100', br: '-scale-100' } },
    defaultVariants: { corner: 'tl' },
  },
);
