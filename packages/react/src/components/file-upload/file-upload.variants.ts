import { cva, type VariantProps } from 'class-variance-authority';

// Common props (lib/common-props.ts): radius, shadow and size on the root (size steps the gap between the dropzone and
// the list; the rows and actions keep their size); tone and variant on the dropzone, the part's call to action.
export const fileUploadVariants = cva('grid min-w-0 gap-4', {
  variants: {
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: { xs: 'gap-2', sm: 'gap-3', md: '', lg: 'gap-5' },
  },
  defaultVariants: { radius: 'none', shadow: 'none', size: 'md' },
});

// The dashed edge is an outline (inside the box, no layout shift), never a border.
// Neutral outline emphasis: hover and drag-over add the neutral hover fill and step the edge to border-strong (6 → 7).
// Disabled is a colour (disabled fill, edge and text), not opacity.
// Drag-over on the neutral zone is the accent drop target (owner 2026-10-27, proposal B): accent.tint fill and
// accent.border-strong dashes, a stronger signal than the neutral hover.
export const dropzoneVariants = cva([
  'group grid cursor-pointer justify-items-center gap-2 rounded-2xl px-4 py-6.5 text-center text-ui text-text-primary',
  'outline-[1.5px] outline-dashed outline-border-control -outline-offset-[1.5px]',
  'transition-control',
  'focus-visible:shadow-focus',
  'data-[disabled]:pointer-events-none data-[disabled]:bg-disabled-fill data-[disabled]:text-disabled-text data-[disabled]:outline-disabled-border',
  'data-[disabled]:[&_[data-slot^=file-upload-dropzone-]]:text-disabled-text',
], {
  // outline (default) is today's dashed neutral target. A tone colours the dashes, the hover / drag tint and the browse
  // word; soft fills the zone (no dashes until a drag), ghost drops the dashes, solid inverts it (neutral: the selected
  // utility; a tone: its solid fill with every text role re-pointed to the on colour). Disabled stays a colour.
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    // The neutral hover and drag fill live on the non-solid variants, so a solid zone never hovers out of its emphasis.
    variant: {
      solid: '',
      soft: 'hover:bg-neutral-hover data-[dragging]:bg-neutral-hover',
      outline: 'hover:bg-neutral-hover hover:outline-neutral-border-strong data-[dragging]:bg-neutral-hover data-[dragging]:outline-neutral-border-strong',
      ghost: 'hover:bg-neutral-hover data-[dragging]:bg-neutral-hover',
    },
  },
  compoundVariants: [
    { variant: 'solid', tone: 'neutral', className: 'selected bg-selection-fill outline-transparent hover:bg-selection-fill-hover hover:outline-transparent data-[dragging]:bg-selection-fill-hover data-[dragging]:outline-transparent' },
    { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on outline-transparent hover:bg-accent-solid-hover hover:outline-transparent data-[dragging]:bg-accent-solid-hover data-[dragging]:outline-transparent [--color-text-primary:var(--cs-color-accent-on)] [--color-text-secondary:var(--cs-color-accent-on)] [--color-text-tertiary:var(--cs-color-accent-on)] [--color-accent-text:var(--cs-color-accent-on)]' },
    { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on outline-transparent hover:bg-success-solid-hover hover:outline-transparent data-[dragging]:bg-success-solid-hover data-[dragging]:outline-transparent [--color-text-primary:var(--cs-color-success-on)] [--color-text-secondary:var(--cs-color-success-on)] [--color-text-tertiary:var(--cs-color-success-on)] [--color-accent-text:var(--cs-color-success-on)]' },
    { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on outline-transparent hover:bg-warning-solid-hover hover:outline-transparent data-[dragging]:bg-warning-solid-hover data-[dragging]:outline-transparent [--color-text-primary:var(--cs-color-warning-on)] [--color-text-secondary:var(--cs-color-warning-on)] [--color-text-tertiary:var(--cs-color-warning-on)] [--color-accent-text:var(--cs-color-warning-on)]' },
    { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on outline-transparent hover:bg-danger-solid-hover hover:outline-transparent data-[dragging]:bg-danger-solid-hover data-[dragging]:outline-transparent [--color-text-primary:var(--cs-color-danger-on)] [--color-text-secondary:var(--cs-color-danger-on)] [--color-text-tertiary:var(--cs-color-danger-on)] [--color-accent-text:var(--cs-color-danger-on)]' },
    { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on outline-transparent hover:bg-info-solid-hover hover:outline-transparent data-[dragging]:bg-info-solid-hover data-[dragging]:outline-transparent [--color-text-primary:var(--cs-color-info-on)] [--color-text-secondary:var(--cs-color-info-on)] [--color-text-tertiary:var(--cs-color-info-on)] [--color-accent-text:var(--cs-color-info-on)]' },
    { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on outline-transparent hover:bg-agent-solid-hover hover:outline-transparent data-[dragging]:bg-agent-solid-hover data-[dragging]:outline-transparent [--color-text-primary:var(--cs-color-agent-on)] [--color-text-secondary:var(--cs-color-agent-on)] [--color-text-tertiary:var(--cs-color-agent-on)] [--color-accent-text:var(--cs-color-agent-on)]' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-well outline-transparent hover:outline-transparent data-[dragging]:bg-accent-tint data-[dragging]:outline-accent-border-strong' },
    { variant: 'outline', tone: 'neutral', className: 'data-[dragging]:bg-accent-tint data-[dragging]:outline-accent-border-strong' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft outline-transparent hover:bg-accent-soft-hover hover:outline-transparent data-[dragging]:bg-accent-soft-hover data-[dragging]:outline-accent-border-strong [--color-accent-text:var(--cs-color-accent-text)]' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft outline-transparent hover:bg-success-soft-hover hover:outline-transparent data-[dragging]:bg-success-soft-hover data-[dragging]:outline-success-border-strong [--color-accent-text:var(--cs-color-success-text)]' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft outline-transparent hover:bg-warning-soft-hover hover:outline-transparent data-[dragging]:bg-warning-soft-hover data-[dragging]:outline-warning-border-strong [--color-accent-text:var(--cs-color-warning-text)]' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft outline-transparent hover:bg-danger-soft-hover hover:outline-transparent data-[dragging]:bg-danger-soft-hover data-[dragging]:outline-danger-border-strong [--color-accent-text:var(--cs-color-danger-text)]' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft outline-transparent hover:bg-info-soft-hover hover:outline-transparent data-[dragging]:bg-info-soft-hover data-[dragging]:outline-info-border-strong [--color-accent-text:var(--cs-color-info-text)]' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft outline-transparent hover:bg-agent-soft-hover hover:outline-transparent data-[dragging]:bg-agent-soft-hover data-[dragging]:outline-agent-border-strong [--color-accent-text:var(--cs-color-agent-text)]' },
    { variant: 'outline', tone: 'accent', className: 'outline-accent-border hover:bg-accent-tint hover:outline-accent-border-strong data-[dragging]:bg-accent-tint data-[dragging]:outline-accent-border-strong [--color-accent-text:var(--cs-color-accent-text)]' },
    { variant: 'outline', tone: 'success', className: 'outline-success-border hover:bg-success-tint hover:outline-success-border-strong data-[dragging]:bg-success-tint data-[dragging]:outline-success-border-strong [--color-accent-text:var(--cs-color-success-text)]' },
    { variant: 'outline', tone: 'warning', className: 'outline-warning-border hover:bg-warning-tint hover:outline-warning-border-strong data-[dragging]:bg-warning-tint data-[dragging]:outline-warning-border-strong [--color-accent-text:var(--cs-color-warning-text)]' },
    { variant: 'outline', tone: 'danger', className: 'outline-danger-border hover:bg-danger-tint hover:outline-danger-border-strong data-[dragging]:bg-danger-tint data-[dragging]:outline-danger-border-strong [--color-accent-text:var(--cs-color-danger-text)]' },
    { variant: 'outline', tone: 'info', className: 'outline-info-border hover:bg-info-tint hover:outline-info-border-strong data-[dragging]:bg-info-tint data-[dragging]:outline-info-border-strong [--color-accent-text:var(--cs-color-info-text)]' },
    { variant: 'outline', tone: 'agent', className: 'outline-agent-border hover:bg-agent-tint hover:outline-agent-border-strong data-[dragging]:bg-agent-tint data-[dragging]:outline-agent-border-strong [--color-accent-text:var(--cs-color-agent-text)]' },
    { variant: 'ghost', tone: 'neutral', className: 'outline-transparent hover:outline-transparent data-[dragging]:bg-accent-tint data-[dragging]:outline-accent-border-strong' },
    { variant: 'ghost', tone: 'accent', className: 'outline-transparent hover:bg-accent-tint hover:outline-transparent data-[dragging]:bg-accent-tint data-[dragging]:outline-accent-border-strong [--color-accent-text:var(--cs-color-accent-text)]' },
    { variant: 'ghost', tone: 'success', className: 'outline-transparent hover:bg-success-tint hover:outline-transparent data-[dragging]:bg-success-tint data-[dragging]:outline-success-border-strong [--color-accent-text:var(--cs-color-success-text)]' },
    { variant: 'ghost', tone: 'warning', className: 'outline-transparent hover:bg-warning-tint hover:outline-transparent data-[dragging]:bg-warning-tint data-[dragging]:outline-warning-border-strong [--color-accent-text:var(--cs-color-warning-text)]' },
    { variant: 'ghost', tone: 'danger', className: 'outline-transparent hover:bg-danger-tint hover:outline-transparent data-[dragging]:bg-danger-tint data-[dragging]:outline-danger-border-strong [--color-accent-text:var(--cs-color-danger-text)]' },
    { variant: 'ghost', tone: 'info', className: 'outline-transparent hover:bg-info-tint hover:outline-transparent data-[dragging]:bg-info-tint data-[dragging]:outline-info-border-strong [--color-accent-text:var(--cs-color-info-text)]' },
    { variant: 'ghost', tone: 'agent', className: 'outline-transparent hover:bg-agent-tint hover:outline-transparent data-[dragging]:bg-agent-tint data-[dragging]:outline-agent-border-strong [--color-accent-text:var(--cs-color-agent-text)]' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'outline' },
});

/** The upload glyph alone, no tile (owner 2026-10-27): 20px, secondary; disabled.text when disabled. */
export const dropzoneIconVariants = cva('inline-flex text-text-secondary group-data-[disabled]:text-disabled-text [&_svg]:size-icon-lg');

/** File rows are opaque surface.base (owner 2026-10-27, proposal A: no translucent fills) with the same hairline. */
export const fileItemVariants = cva(
  // A row that is leaving (data-state closed) plays the exit and takes no input.
  'grid grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-xl bg-surface-base py-2.5 pl-3 pr-2.5 data-[state=closed]:pointer-events-none data-[state=closed]:animate-exit',
  {
    variants: {
      status: {
        done: 'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
        uploading: 'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
        warning: 'shadow-[0_0_0_1px_var(--cs-color-warning-border-strong)]',
        error: 'shadow-[0_0_0_1px_var(--cs-color-danger-border-strong)]',
      },
      // enter: the file was added after the list mounted; the files of the first paint do not rise.
      enter: { true: 'animate-rise', false: '' },
    },
    defaultVariants: { status: 'done', enter: false },
  },
);
export type FileItemVariantProps = VariantProps<typeof fileItemVariants>;

/** The 32px file-type tile: neutral.track / secondary; a failed file danger.soft / danger.text, a warning warning.soft / warning.text (owner 2026-10-27, proposal C). */
export const fileItemIconVariants = cva('grid size-control-md place-items-center rounded-md [&_svg]:size-icon-sm', {
  variants: {
    status: {
      done: 'bg-neutral-track text-text-secondary', uploading: 'bg-neutral-track text-text-secondary',
      warning: 'bg-warning-soft text-warning-text', error: 'bg-danger-soft text-danger-text',
    },
  },
  defaultVariants: { status: 'done' },
});
