import { cva, type VariantProps } from 'class-variance-authority';

// Common props (owner 2026-10-26): size steps the hit strip (xs 4, sm 6, md 8 = today, lg 12) and the line thickness
// (1px, 1.5px, 2px = today, 3px); the rest go to the line below.
export const resizeHandleVariants = cva(
  [
    'group/resize-handle flex touch-none select-none items-center justify-center outline-none',
    'focus-visible:shadow-focus',
    'aria-disabled:cursor-default',
  ],
  {
    variants: {
      orientation: {
        vertical: 'cursor-col-resize',
        horizontal: 'cursor-row-resize',
      },
      size: { xs: '', sm: '', md: '', lg: '' },
    },
    compoundVariants: [
      { orientation: 'vertical', size: 'xs', className: 'w-1' },
      { orientation: 'vertical', size: 'sm', className: 'w-1.5' },
      { orientation: 'vertical', size: 'md', className: 'w-2' },
      { orientation: 'vertical', size: 'lg', className: 'w-3' },
      { orientation: 'horizontal', size: 'xs', className: 'h-1' },
      { orientation: 'horizontal', size: 'sm', className: 'h-1.5' },
      { orientation: 'horizontal', size: 'md', className: 'h-2' },
      { orientation: 'horizontal', size: 'lg', className: 'h-3' },
    ],
    defaultVariants: { orientation: 'vertical', size: 'md' },
  },
);

// The line carries the emphasis. tone is its colour (default accent); variant is how much of it shows at rest:
//   ghost (default) no line at rest, the tone border line on hover, the tone solid on keyboard focus and drag
//   soft            the tone soft line at rest, the tone border on hover, the tone solid on focus and drag
// Hover is the soft step and focus / drag the solid one, so aiming and dragging read apart (owner 2026-10-28, B).
//   outline         the tone border-strong line at rest, the tone solid on hover, focus and drag
//   solid           the tone solid line at all times
// A disabled handle draws no line: disabled is the absence of the affordance, not a faded one.
// radius / shadow apply to the line (null when unset keeps rounded-full and no shadow).
export const resizeHandleLineVariants = cva(
  [
    'flex-none rounded-full transition-colors duration-quick ease-standard',
  ],
  {
    variants: {
      disabled: { false: '', true: 'bg-transparent' },
      orientation: { vertical: 'h-full', horizontal: 'w-full' },
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
      { orientation: 'vertical', size: 'xs', className: 'w-[1px]' },
      { orientation: 'vertical', size: 'sm', className: 'w-[1.5px]' },
      { orientation: 'vertical', size: 'md', className: 'w-0.5' },
      { orientation: 'vertical', size: 'lg', className: 'w-0.75' },
      { orientation: 'horizontal', size: 'xs', className: 'h-[1px]' },
      { orientation: 'horizontal', size: 'sm', className: 'h-[1.5px]' },
      { orientation: 'horizontal', size: 'md', className: 'h-0.5' },
      { orientation: 'horizontal', size: 'lg', className: 'h-0.75' },
{ disabled: false, tone: 'neutral', className: 'group-focus-visible/resize-handle:bg-neutral-solid group-active/resize-handle:bg-neutral-solid' },
      { disabled: false, tone: 'accent', className: 'group-focus-visible/resize-handle:bg-accent-solid group-active/resize-handle:bg-accent-solid' },
      { disabled: false, tone: 'success', className: 'group-focus-visible/resize-handle:bg-success-solid group-active/resize-handle:bg-success-solid' },
      { disabled: false, tone: 'warning', className: 'group-focus-visible/resize-handle:bg-warning-solid group-active/resize-handle:bg-warning-solid' },
      { disabled: false, tone: 'danger', className: 'group-focus-visible/resize-handle:bg-danger-solid group-active/resize-handle:bg-danger-solid' },
      { disabled: false, tone: 'info', className: 'group-focus-visible/resize-handle:bg-info-solid group-active/resize-handle:bg-info-solid' },
      { disabled: false, tone: 'agent', className: 'group-focus-visible/resize-handle:bg-agent-solid group-active/resize-handle:bg-agent-solid' },
      { disabled: false, variant: ['ghost', 'soft'], tone: 'neutral', className: 'group-hover/resize-handle:bg-neutral-border' },
      { disabled: false, variant: ['ghost', 'soft'], tone: 'accent', className: 'group-hover/resize-handle:bg-accent-border' },
      { disabled: false, variant: ['ghost', 'soft'], tone: 'success', className: 'group-hover/resize-handle:bg-success-border' },
      { disabled: false, variant: ['ghost', 'soft'], tone: 'warning', className: 'group-hover/resize-handle:bg-warning-border' },
      { disabled: false, variant: ['ghost', 'soft'], tone: 'danger', className: 'group-hover/resize-handle:bg-danger-border' },
      { disabled: false, variant: ['ghost', 'soft'], tone: 'info', className: 'group-hover/resize-handle:bg-info-border' },
      { disabled: false, variant: ['ghost', 'soft'], tone: 'agent', className: 'group-hover/resize-handle:bg-agent-border' },
      { disabled: false, variant: ['outline', 'solid'], tone: 'neutral', className: 'group-hover/resize-handle:bg-neutral-solid' },
      { disabled: false, variant: ['outline', 'solid'], tone: 'accent', className: 'group-hover/resize-handle:bg-accent-solid' },
      { disabled: false, variant: ['outline', 'solid'], tone: 'success', className: 'group-hover/resize-handle:bg-success-solid' },
      { disabled: false, variant: ['outline', 'solid'], tone: 'warning', className: 'group-hover/resize-handle:bg-warning-solid' },
      { disabled: false, variant: ['outline', 'solid'], tone: 'danger', className: 'group-hover/resize-handle:bg-danger-solid' },
      { disabled: false, variant: ['outline', 'solid'], tone: 'info', className: 'group-hover/resize-handle:bg-info-solid' },
      { disabled: false, variant: ['outline', 'solid'], tone: 'agent', className: 'group-hover/resize-handle:bg-agent-solid' },
      { disabled: false, variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft' },
      { disabled: false, variant: 'soft', tone: 'accent', className: 'bg-accent-soft' },
      { disabled: false, variant: 'soft', tone: 'success', className: 'bg-success-soft' },
      { disabled: false, variant: 'soft', tone: 'warning', className: 'bg-warning-soft' },
      { disabled: false, variant: 'soft', tone: 'danger', className: 'bg-danger-soft' },
      { disabled: false, variant: 'soft', tone: 'info', className: 'bg-info-soft' },
      { disabled: false, variant: 'soft', tone: 'agent', className: 'bg-agent-soft' },
      { disabled: false, variant: 'outline', tone: 'neutral', className: 'bg-neutral-border-strong' },
      { disabled: false, variant: 'outline', tone: 'accent', className: 'bg-accent-border-strong' },
      { disabled: false, variant: 'outline', tone: 'success', className: 'bg-success-border-strong' },
      { disabled: false, variant: 'outline', tone: 'warning', className: 'bg-warning-border-strong' },
      { disabled: false, variant: 'outline', tone: 'danger', className: 'bg-danger-border-strong' },
      { disabled: false, variant: 'outline', tone: 'info', className: 'bg-info-border-strong' },
      { disabled: false, variant: 'outline', tone: 'agent', className: 'bg-agent-border-strong' },
      { disabled: false, variant: 'solid', tone: 'neutral', className: 'bg-neutral-solid' },
      { disabled: false, variant: 'solid', tone: 'accent', className: 'bg-accent-solid' },
      { disabled: false, variant: 'solid', tone: 'success', className: 'bg-success-solid' },
      { disabled: false, variant: 'solid', tone: 'warning', className: 'bg-warning-solid' },
      { disabled: false, variant: 'solid', tone: 'danger', className: 'bg-danger-solid' },
      { disabled: false, variant: 'solid', tone: 'info', className: 'bg-info-solid' },
      { disabled: false, variant: 'solid', tone: 'agent', className: 'bg-agent-solid' },
    ],
    defaultVariants: { orientation: 'vertical', disabled: false, tone: 'accent', variant: 'ghost', radius: 'full', shadow: 'none', size: 'md' },
  },
);

export type ResizeHandleVariantProps = VariantProps<typeof resizeHandleVariants>;
