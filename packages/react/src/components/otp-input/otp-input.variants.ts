import { cva } from 'class-variance-authority';

/**
 * Each cell is its own field box (P9 per cell): the native input draws the fill, edge and focus edge.
 * Common props (owner 2026-10-26; OtpInput passes them to every cell, the root is a bare row), unset = today:
 *   variant outline (default) the opaque surface fill with a border.default edge (a hue: its border 6 and caret) · soft
 *   neutral.well without edge (a hue: its soft 3) · solid surface.base (a hue: a 1.5px border-strong 7 edge) · ghost no
 *   fill, a 1px bottom rule. Focus, invalid and disabled are (0,2,0)+ and win over every variant.
 *   size: cell 40x32 mono · 48x40 mono-md · 52x44 mono-lg (md) · 64x48 mono-lg.
 * Filled (owner 2026-10-28, data-inverted): a cell holding a character inverts in every variant and tone (selected utility: ink fill,
 * paper text, no edge), so the code's progress reads at a glance. Invalid and disabled drop the inversion: the danger or
 * disabled edge shows on every cell together. Focus keeps the inversion and draws the focus-field hairline.
 * Focus on an empty cell is a fill change (owner 2026-10-28, field/input proposal 2): neutral.well, surface.base on the grey
 * soft cell; the edge stays the border.default hairline (focus-field).
 * Current (owner 2026-10-28, not a bottom rule): the first empty cell carries a static caret mark (a 2px bar, 1em tall,
 * centred, in the tone's solid colour; accent for neutral) that says where the next character lands, also after a paste or
 * while focus is elsewhere. Focus hides it: the native caret and the focus-field ring take over.
 */
export const otpCellVariants = cva([
  'min-w-0 border-0 bg-surface-translucent p-0 text-center font-mono text-text-primary outline-none',
  'caret-accent-solid transition-[box-shadow,background-color,color] duration-120 ease-out',
  // The current-cell caret mark, drawn as a background image (an input has no pseudo-elements). --otp-cue is the tone colour.
  '[--otp-cue:var(--cs-color-accent-solid)] bg-center bg-no-repeat bg-[length:calc(var(--spacing)*0.5)_1em]',
  'data-[current]:not-focus:bg-[image:linear-gradient(var(--otp-cue),var(--otp-cue))]',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-default)]',
  'focus:shadow-[var(--cs-focus-field)] not-data-[inverted]:focus:bg-neutral-well',
  // Invalid is the danger border-strong edge for an enabled cell; invalid + focus keeps it and adds the outer focus ring.
  'data-[invalid]:not-disabled:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] data-[invalid]:focus:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]',
  // Disabled is a colour, not opacity; a disabled cell keeps the disabled edge (the tone drops out).
  'disabled:pointer-events-none disabled:bg-disabled-fill disabled:text-disabled-text disabled:shadow-[inset_0_0_0_1px_var(--cs-color-disabled-border)]',
  // Inverted (set on a filled cell that is neither invalid nor disabled): ink inversion, no edge; focus keeps its ring.
  'data-[inverted]:selected data-[inverted]:not-focus:shadow-none',
], {
  variants: {
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: { solid: '', soft: '', outline: '', ghost: '' },
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
    size: {
      xs: 'h-10 w-8 font-mono text-mono', sm: 'h-12 w-10 font-mono text-mono-md', md: 'h-otp-h w-otp-w font-mono text-mono-lg', lg: 'h-16 w-12 font-mono text-mono-lg',
    },
  },
  compoundVariants: [
    { variant: 'outline', tone: 'accent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] caret-accent-solid' },
    { variant: 'outline', tone: 'success', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] caret-success-solid [--otp-cue:var(--cs-color-success-solid)]' },
    { variant: 'outline', tone: 'warning', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] caret-warning-solid [--otp-cue:var(--cs-color-warning-solid)]' },
    { variant: 'outline', tone: 'danger', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] caret-danger-solid [--otp-cue:var(--cs-color-danger-solid)]' },
    { variant: 'outline', tone: 'info', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] caret-info-solid [--otp-cue:var(--cs-color-info-solid)]' },
    { variant: 'outline', tone: 'agent', className: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] caret-agent-solid [--otp-cue:var(--cs-color-agent-solid)]' },
    { variant: 'soft', tone: 'neutral', className: 'bg-neutral-well shadow-none not-data-[inverted]:focus:bg-surface-base' },
    { variant: 'soft', tone: 'accent', className: 'bg-accent-soft shadow-none not-data-[inverted]:focus:bg-surface-base caret-accent-solid' },
    { variant: 'soft', tone: 'success', className: 'bg-success-soft shadow-none not-data-[inverted]:focus:bg-surface-base caret-success-solid [--otp-cue:var(--cs-color-success-solid)]' },
    { variant: 'soft', tone: 'warning', className: 'bg-warning-soft shadow-none not-data-[inverted]:focus:bg-surface-base caret-warning-solid [--otp-cue:var(--cs-color-warning-solid)]' },
    { variant: 'soft', tone: 'danger', className: 'bg-danger-soft shadow-none not-data-[inverted]:focus:bg-surface-base caret-danger-solid [--otp-cue:var(--cs-color-danger-solid)]' },
    { variant: 'soft', tone: 'info', className: 'bg-info-soft shadow-none not-data-[inverted]:focus:bg-surface-base caret-info-solid [--otp-cue:var(--cs-color-info-solid)]' },
    { variant: 'soft', tone: 'agent', className: 'bg-agent-soft shadow-none not-data-[inverted]:focus:bg-surface-base caret-agent-solid [--otp-cue:var(--cs-color-agent-solid)]' },
    { variant: 'solid', tone: 'neutral', className: 'bg-surface-base' },
    { variant: 'solid', tone: 'accent', className: 'bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-accent-border-strong)] caret-accent-solid' },
    { variant: 'solid', tone: 'success', className: 'bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-success-border-strong)] caret-success-solid [--otp-cue:var(--cs-color-success-solid)]' },
    { variant: 'solid', tone: 'warning', className: 'bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-warning-border-strong)] caret-warning-solid [--otp-cue:var(--cs-color-warning-solid)]' },
    { variant: 'solid', tone: 'danger', className: 'bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-danger-border-strong)] caret-danger-solid [--otp-cue:var(--cs-color-danger-solid)]' },
    { variant: 'solid', tone: 'info', className: 'bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-info-border-strong)] caret-info-solid [--otp-cue:var(--cs-color-info-solid)]' },
    { variant: 'solid', tone: 'agent', className: 'bg-surface-base shadow-[inset_0_0_0_1.5px_var(--cs-color-agent-border-strong)] caret-agent-solid [--otp-cue:var(--cs-color-agent-solid)]' },
    { variant: 'ghost', className: 'bg-transparent shadow-[inset_0_-1px_0_var(--cs-color-border-default)]' },
    { variant: 'ghost', tone: 'accent', className: 'shadow-[inset_0_-1px_0_var(--cs-color-accent-border)] caret-accent-solid' },
    { variant: 'ghost', tone: 'success', className: 'shadow-[inset_0_-1px_0_var(--cs-color-success-border)] caret-success-solid [--otp-cue:var(--cs-color-success-solid)]' },
    { variant: 'ghost', tone: 'warning', className: 'shadow-[inset_0_-1px_0_var(--cs-color-warning-border)] caret-warning-solid [--otp-cue:var(--cs-color-warning-solid)]' },
    { variant: 'ghost', tone: 'danger', className: 'shadow-[inset_0_-1px_0_var(--cs-color-danger-border)] caret-danger-solid [--otp-cue:var(--cs-color-danger-solid)]' },
    { variant: 'ghost', tone: 'info', className: 'shadow-[inset_0_-1px_0_var(--cs-color-info-border)] caret-info-solid [--otp-cue:var(--cs-color-info-solid)]' },
    { variant: 'ghost', tone: 'agent', className: 'shadow-[inset_0_-1px_0_var(--cs-color-agent-border)] caret-agent-solid [--otp-cue:var(--cs-color-agent-solid)]' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'outline', radius: 'xl', shadow: 'none', size: 'md' },
});
