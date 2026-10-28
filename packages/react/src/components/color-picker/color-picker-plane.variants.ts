import { cva } from 'class-variance-authority';

// ColorPicker.Plane. Common props of the part (lib/common-props.ts): variant = the frame around the paint (axis frame:
// outline, the default, is the 1px inset edge; solid a 2px edge; soft a 3px mat; ghost none), tone = the frame colour
// (axis frameTone: neutral = swatch.edge / neutral slots), size = the thumb (thumbSize below; the plane height stays
// size-color-plane-h); radius / shadow are applied by ColorPickerPlane with radiusClass / shadowClass after these classes.
// The axes have their own names so they do not shadow the ColorPicker root axes. The paint itself never changes.
export const colorPickerPlaneVariants = cva(
  [
    'group/plane relative h-color-plane-h w-full cursor-crosshair touch-none select-none overflow-hidden rounded-xl',
    'bg-[linear-gradient(0deg,var(--cs-color-media-shade),transparent),linear-gradient(90deg,var(--cs-color-media-on),var(--plane-color))]',
    'data-[disabled]:pointer-events-none data-[disabled]:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  ],
  {
    variants: {
      frame: { outline: '', solid: '', soft: '', ghost: '' },
      frameTone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    },
    compoundVariants: [
      { frame: 'outline', frameTone: 'neutral', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]' },
      { frame: 'outline', frameTone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { frame: 'outline', frameTone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { frame: 'outline', frameTone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { frame: 'outline', frameTone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { frame: 'outline', frameTone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { frame: 'outline', frameTone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
      { frame: 'solid', frameTone: 'neutral', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-neutral-graphic)]' },
      { frame: 'solid', frameTone: 'accent', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-accent-graphic)]' },
      { frame: 'solid', frameTone: 'success', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-success-graphic)]' },
      { frame: 'solid', frameTone: 'warning', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-warning-graphic)]' },
      { frame: 'solid', frameTone: 'danger', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-danger-graphic)]' },
      { frame: 'solid', frameTone: 'info', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-info-graphic)]' },
      { frame: 'solid', frameTone: 'agent', className: 'shadow-[inset_0_0_0_2px_var(--cs-color-agent-graphic)]' },
      { frame: 'soft', frameTone: 'neutral', className: 'shadow-[inset_0_0_0_calc(var(--spacing)*0.75)_var(--cs-color-neutral-track)]' },
      { frame: 'soft', frameTone: 'accent', className: 'shadow-[inset_0_0_0_calc(var(--spacing)*0.75)_var(--cs-color-accent-soft)]' },
      { frame: 'soft', frameTone: 'success', className: 'shadow-[inset_0_0_0_calc(var(--spacing)*0.75)_var(--cs-color-success-soft)]' },
      { frame: 'soft', frameTone: 'warning', className: 'shadow-[inset_0_0_0_calc(var(--spacing)*0.75)_var(--cs-color-warning-soft)]' },
      { frame: 'soft', frameTone: 'danger', className: 'shadow-[inset_0_0_0_calc(var(--spacing)*0.75)_var(--cs-color-danger-soft)]' },
      { frame: 'soft', frameTone: 'info', className: 'shadow-[inset_0_0_0_calc(var(--spacing)*0.75)_var(--cs-color-info-soft)]' },
      { frame: 'soft', frameTone: 'agent', className: 'shadow-[inset_0_0_0_calc(var(--spacing)*0.75)_var(--cs-color-agent-soft)]' },
    ],
    defaultVariants: { frame: 'outline', frameTone: 'neutral' },
  },
);

export const colorPickerPlaneThumbVariants = cva(
  [
    'pointer-events-none absolute top-(--plane-y) left-(--plane-x) -translate-1/2 rounded-full',
    // A 1.5px media.on ring (owner 2026-10-27: thinner than the 2.5px specimen ring) and the stronger thumb shadow
    // (thumb + thumb-sm), so the thumb still separates from any picked colour.
    'border-[calc(var(--spacing)*0.375)] border-media-on bg-(--plane-picked) shadow-[var(--cs-elevation-thumb),var(--cs-elevation-thumb-sm)] outline-none',
    'focus-visible:shadow-focus in-data-[disabled]:border-disabled-border',
  ],
  {
    // The thumb steps with the size (ColorPickerPlane passes it): 12 · 14 · 16 · 20. While the plane is pressed (a drag) it
    // grows one step (16 · 18 · 20 · 24) so the picked colour shows around the pointer.
    variants: {
      thumbSize: {
        xs: 'size-icon-xs group-active/plane:size-icon-md',
        sm: 'size-icon-sm group-active/plane:size-4.5',
        md: 'size-icon-md group-active/plane:size-icon-lg',
        lg: 'size-icon-lg group-active/plane:size-icon-xl',
      },
    },
    defaultVariants: { thumbSize: 'md' },
  },
);
