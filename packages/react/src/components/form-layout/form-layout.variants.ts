import { cva } from 'class-variance-authority';

// Common props (lib/common-props.ts): radius, shadow and size on the form (size steps the gap between the header, the
// sections and the footer; the fields keep their own size); tone and variant on every section, read from context.
export const formLayoutVariants = cva('grid w-full gap-5', {
  variants: {
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'gap-3', sm: 'gap-4', md: '', lg: 'gap-6' },
  },
  defaultVariants: { radius: 'none', shadow: 'none', size: 'md' },
});

// Sections are separated by space and grouping, not lines (owner 2026-10-27): ghost (default) has no hairline, and a
// section that follows another section sits 12px further down (32px at md, proposal B), so the header → first section
// gap (20) stays tighter than the section → section gap. outline adds a border.subtle hairline above every section that
// follows another section (a tone takes its border). soft and solid put each section on its own panel (xl radius, 16px
// padding): soft the neutral well (the tone tint), solid surface.base with a subtle edge (the tone soft). ghost with a
// tone colours the section titles.
export const formLayoutSectionVariants = cva('flex flex-wrap gap-x-6 gap-y-3 [[data-slot=form-layout-section]+&]:mt-3', {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'rounded-xl p-4 bg-surface-base shadow-[inset_0_0_0_0.5px_var(--cs-color-border-subtle)]' },
    { variant: 'solid', tone: 'accent', className: 'rounded-xl p-4 bg-accent-soft' },
    { variant: 'solid', tone: 'success', className: 'rounded-xl p-4 bg-success-soft' },
    { variant: 'solid', tone: 'warning', className: 'rounded-xl p-4 bg-warning-soft' },
    { variant: 'solid', tone: 'danger', className: 'rounded-xl p-4 bg-danger-soft' },
    { variant: 'solid', tone: 'info', className: 'rounded-xl p-4 bg-info-soft' },
    { variant: 'solid', tone: 'agent', className: 'rounded-xl p-4 bg-agent-soft' },
    { variant: 'soft', tone: 'neutral', className: 'rounded-xl p-4 bg-neutral-well' },
    { variant: 'soft', tone: 'accent', className: 'rounded-xl p-4 bg-accent-tint' },
    { variant: 'soft', tone: 'success', className: 'rounded-xl p-4 bg-success-tint' },
    { variant: 'soft', tone: 'warning', className: 'rounded-xl p-4 bg-warning-tint' },
    { variant: 'soft', tone: 'danger', className: 'rounded-xl p-4 bg-danger-tint' },
    { variant: 'soft', tone: 'info', className: 'rounded-xl p-4 bg-info-tint' },
    { variant: 'soft', tone: 'agent', className: 'rounded-xl p-4 bg-agent-tint' },
    { variant: 'outline', tone: 'neutral', className: '[[data-slot=form-layout-section]+&]:border-t [[data-slot=form-layout-section]+&]:border-border-subtle [[data-slot=form-layout-section]+&]:pt-5' },
    { variant: 'outline', tone: 'accent', className: '[[data-slot=form-layout-section]+&]:border-t [[data-slot=form-layout-section]+&]:pt-5 border-accent-border' },
    { variant: 'outline', tone: 'success', className: '[[data-slot=form-layout-section]+&]:border-t [[data-slot=form-layout-section]+&]:pt-5 border-success-border' },
    { variant: 'outline', tone: 'warning', className: '[[data-slot=form-layout-section]+&]:border-t [[data-slot=form-layout-section]+&]:pt-5 border-warning-border' },
    { variant: 'outline', tone: 'danger', className: '[[data-slot=form-layout-section]+&]:border-t [[data-slot=form-layout-section]+&]:pt-5 border-danger-border' },
    { variant: 'outline', tone: 'info', className: '[[data-slot=form-layout-section]+&]:border-t [[data-slot=form-layout-section]+&]:pt-5 border-info-border' },
    { variant: 'outline', tone: 'agent', className: '[[data-slot=form-layout-section]+&]:border-t [[data-slot=form-layout-section]+&]:pt-5 border-agent-border' },
    { variant: 'ghost', tone: 'accent', className: '[&_[data-slot=section-header-title]]:text-accent-text' },
    { variant: 'ghost', tone: 'success', className: '[&_[data-slot=section-header-title]]:text-success-text' },
    { variant: 'ghost', tone: 'warning', className: '[&_[data-slot=section-header-title]]:text-warning-text' },
    { variant: 'ghost', tone: 'danger', className: '[&_[data-slot=section-header-title]]:text-danger-text' },
    { variant: 'ghost', tone: 'info', className: '[&_[data-slot=section-header-title]]:text-info-text' },
    { variant: 'ghost', tone: 'agent', className: '[&_[data-slot=section-header-title]]:text-agent-text' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'ghost' },
});
