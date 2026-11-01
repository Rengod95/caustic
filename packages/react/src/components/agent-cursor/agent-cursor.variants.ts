import { cva } from 'class-variance-authority';

/** The overlay box: positioned by the rect custom properties, never a pointer target. The agent drives the rect, so the box
 *  glides to each new position with the spring (top, right, bottom, left) and rises in once on mount. */
export const agentCursorVariants = cva('animate-enter enter-scale pointer-events-none absolute top-(--rect-t) right-(--rect-r) bottom-(--rect-b) left-(--rect-l) z-20 flex items-start gap-0.5 transition-[top,right,bottom,left] duration-spring ease-spring');

// Five common props (lib/common-props.ts) land on the name tag, the visible box. Each axis' default is the tag's own
// look (the agent spectrum fill, agent.on text, full radius with the 2xs pointer corner, elevation 3, 22px). The own
// tag carries no rim (owner 2026-10-28, option 2): its fill is the same stop 1→2→3 gradient as the arrow, so the two
// read as one piece. Every other variant but ghost keeps the rim: the cursor is always the agent (P2, P7).
export const agentCursorTagVariants = cva(
  'agent-rim mt-3 inline-flex items-center gap-1.5 rounded-full whitespace-nowrap text-text-primary',
  {
    variants: {
      variant: { solid: '', soft: '', outline: '', ghost: 'after:hidden' },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      radius: {
        none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
        xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: '',
      },
      shadow: { none: 'shadow-none [--cs-shadow:none]', '1': 'glass-shadow-1 shadow-1', '2': 'glass-shadow-2 shadow-2', '3': 'glass-shadow-3 shadow-3', '4': 'glass-shadow-4 shadow-4', '5': 'glass-shadow-5 shadow-5' },
      size: {
        xs: 'h-control-compact-2xs px-1.5 text-micro',
        sm: 'h-control-2xs px-1.75 text-ui-xs',
        md: 'h-control-compact-xs px-2 text-label',
        lg: 'h-control-sm px-2.5 text-ui-sm',
      },
    },
    compoundVariants: [
      // The own look is the thick glass; every other variant and tone is a plain opaque fill (no glass, so no ordering
      // fight between the glass utility and the fill or edge utilities).
      { variant: 'solid', tone: 'neutral', className: 'bg-ink-solid text-ink-on' },
      { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on' },
      { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on' },
      { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on' },
      { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on' },
      { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on' },
      { variant: 'soft', tone: 'neutral', className: 'bg-neutral-soft text-text-primary' },
      { variant: 'soft', tone: 'accent', className: 'bg-accent-soft text-accent-text' },
      { variant: 'soft', tone: 'success', className: 'bg-success-soft text-success-text' },
      { variant: 'soft', tone: 'warning', className: 'bg-warning-soft text-warning-text' },
      { variant: 'soft', tone: 'danger', className: 'bg-danger-soft text-danger-text' },
      { variant: 'soft', tone: 'info', className: 'bg-info-soft text-info-text' },
      // The own tag: the spectrum fill is the pointer's own SVG gradient, painted by the fill slot under the label.
      { variant: 'soft', tone: 'agent', className: 'isolate overflow-hidden bg-transparent text-agent-on after:hidden' },
      // The own tag is not glass, so its default elevation is set here; another shadow value sets its own.
      { variant: 'soft', tone: 'agent', shadow: '3', className: 'shadow-3' },
      { variant: 'outline', tone: 'neutral', className: 'bg-transparent text-text-primary shadow-[inset_0_0_0_0.5px_var(--cs-color-neutral-border)]' },
      { variant: 'outline', tone: 'accent', className: 'bg-transparent text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { variant: 'outline', tone: 'success', className: 'bg-transparent text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { variant: 'outline', tone: 'warning', className: 'bg-transparent text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { variant: 'outline', tone: 'danger', className: 'bg-transparent text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { variant: 'outline', tone: 'info', className: 'bg-transparent text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { variant: 'outline', tone: 'agent', className: 'bg-transparent text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
      { variant: 'ghost', tone: 'neutral', className: 'bg-transparent text-text-primary shadow-none' },
      { variant: 'ghost', tone: 'accent', className: 'bg-transparent text-accent-text shadow-none' },
      { variant: 'ghost', tone: 'success', className: 'bg-transparent text-success-text shadow-none' },
      { variant: 'ghost', tone: 'warning', className: 'bg-transparent text-warning-text shadow-none' },
      { variant: 'ghost', tone: 'danger', className: 'bg-transparent text-danger-text shadow-none' },
      { variant: 'ghost', tone: 'info', className: 'bg-transparent text-info-text shadow-none' },
      { variant: 'ghost', tone: 'agent', className: 'bg-transparent text-agent-text shadow-none' },
    ],
    defaultVariants: { variant: 'soft', tone: 'agent', radius: 'full', shadow: '3', size: 'md' },
  },
);
