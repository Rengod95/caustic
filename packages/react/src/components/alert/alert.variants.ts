import { cva, type VariantProps } from 'class-variance-authority';

// Five common props (lib/common-props.ts). Each axis' default is the alert's own look and adds no class:
//   variant  soft (default) = the subtle emphasis: tint fill (step 2), tone border (step 6) inside the edge, tone text (11);
//            solid = tone solid (9) with on text, no edge; outline = the tone border and text, no fill; ghost = tone text only.
//   tone     info (default) · success · warning · danger, plus neutral, accent and agent.
//   radius / shadow on the root (an elevation replaces the inset edge: both are box-shadow); size steps height, padding, type.
// Alert's own axes (round 3: Banner folded in as layout page; Banner's round 1 axes kept):
//   layout     inline (default) = the card / form notice: three-column grid, ui-dense, md 44;
//              page = the former Banner: full-width flex row, ui, md 48 (control-xl). Size steps differ per layout.
//   placement  inline (default) = the rounded box with the tone edge all round; page = spans the page: no radius and only
//              the bottom tone edge (soft and outline), so it reads as a strip across the region.
//   emphasis   tone (default) = the whole message in the tone text; lead = the message in text.primary and only the <b>
//              lead-in in the tone text (alertBody). solid keeps its on colour either way.
/** The page placement keeps only the bottom tone edge (literal class names, so Tailwind sees them). */
const PAGE_EDGE = {
  neutral: 'shadow-[inset_0_-1px_0_var(--cs-color-neutral-border)]',
  accent: 'shadow-[inset_0_-1px_0_var(--cs-color-accent-border)]',
  success: 'shadow-[inset_0_-1px_0_var(--cs-color-success-border)]',
  warning: 'shadow-[inset_0_-1px_0_var(--cs-color-warning-border)]',
  danger: 'shadow-[inset_0_-1px_0_var(--cs-color-danger-border)]',
  info: 'shadow-[inset_0_-1px_0_var(--cs-color-info-border)]',
  agent: 'shadow-[inset_0_-1px_0_var(--cs-color-agent-border)]',
} as const;

export const alertVariants = cva(
  'items-center rounded-xl font-ui',
  {
    variants: {
      variant: { solid: '', soft: '', outline: '', ghost: '' },
      layout: { inline: 'grid grid-cols-[auto_minmax(0,1fr)_auto]', page: 'flex w-full' },
      // Before radius, so an explicit radius still wins over page.
      placement: { inline: '', page: 'rounded-none' },
      tone: {
        neutral: 'bg-neutral-tint text-text-primary shadow-[inset_0_0_0_1px_var(--cs-color-neutral-border)]',
        accent: 'bg-accent-tint text-accent-text shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]',
        info: 'bg-info-tint text-info-text shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]',
        success: 'bg-success-tint text-success-text shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]',
        warning: 'bg-warning-tint text-warning-text shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]',
        danger: 'bg-danger-tint text-danger-text shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]',
        agent: 'bg-agent-tint text-agent-text shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]',
      },
      // A trailing xs control (action or dismiss) sits concentric with the 12px corner, so the end padding tightens
      // (inline 10, page 8) only when one is present. Classes per layout in compoundVariants.
      trailing: { true: '', false: '' },
      // Inline with both an action and a dismiss button needs a fourth grid column.
      dismissible: { true: '', false: '' },
      radius: {
        none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
        xl: '', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full',
      },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
      // Size steps per layout in compoundVariants: inline xs 32 · sm 40 · md 44 · lg 48; page xs 32 · sm 40 · md 48 · lg 48 ui-lg.
      size: { xs: '', sm: '', md: '', lg: '' },
    },
    compoundVariants: [
      { layout: 'inline', size: 'xs', className: 'min-h-control-md gap-2 py-1.5 pl-2.5 text-ui-sm' },
      { layout: 'inline', size: 'sm', className: 'min-h-control-lg gap-2 py-2 pl-3 text-ui-sm' },
      { layout: 'inline', size: 'md', className: 'min-h-field-lg gap-2.5 py-2.5 pl-3 text-ui-dense' },
      { layout: 'inline', size: 'lg', className: 'min-h-control-xl gap-3 py-3 pl-3.5 text-ui' },
      { layout: 'page', size: 'xs', className: 'min-h-control-md gap-2 py-1 pl-2.5 text-ui-sm' },
      { layout: 'page', size: 'sm', className: 'min-h-control-lg gap-2.5 py-1.5 pl-3 text-ui-sm' },
      { layout: 'page', size: 'md', className: 'min-h-control-xl gap-3 py-2 pl-3.5 text-ui' },
      { layout: 'page', size: 'lg', className: 'min-h-control-xl gap-3 py-3 pl-4 text-ui-lg' },
      { layout: 'inline', trailing: true, className: 'pr-2.5' },
      { layout: 'inline', trailing: false, className: 'pr-3' },
      { layout: 'page', trailing: true, className: 'pr-2' },
      { layout: 'page', trailing: false, className: 'pr-3.5' },
      { layout: 'inline', dismissible: true, className: 'grid-cols-[auto_minmax(0,1fr)_auto_auto]' },
      { variant: 'solid', tone: 'neutral', className: 'bg-ink-solid text-ink-on shadow-none' },
      { variant: 'solid', tone: 'accent', className: 'bg-accent-solid text-accent-on shadow-none' },
      { variant: 'solid', tone: 'success', className: 'bg-success-solid text-success-on shadow-none' },
      { variant: 'solid', tone: 'warning', className: 'bg-warning-solid text-warning-on shadow-none' },
      { variant: 'solid', tone: 'danger', className: 'bg-danger-solid text-danger-on shadow-none' },
      { variant: 'solid', tone: 'info', className: 'bg-info-solid text-info-on shadow-none' },
      { variant: 'solid', tone: 'agent', className: 'bg-agent-solid text-agent-on shadow-none' },
      { variant: 'outline', className: 'bg-transparent' },
      { variant: 'ghost', className: 'bg-transparent shadow-none' },
      ...(['neutral', 'accent', 'success', 'warning', 'danger', 'info', 'agent'] as const).map(tone => ({
        placement: 'page' as const, variant: ['soft', 'outline'] as ('soft' | 'outline')[], shadow: 'none' as const, tone, className: PAGE_EDGE[tone],
      })),
    ],
    defaultVariants: {
      variant: 'soft', tone: 'info', layout: 'inline', placement: 'inline', trailing: false, dismissible: false, radius: 'xl', shadow: 'none', size: 'md',
    },
  },
);

/** The tone icon: the tone graphic (step 8); on a solid alert it takes the on colour with the text. */
export const alertIcon = cva('inline-flex flex-none items-center justify-center', {
  variants: {
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    tone: {
      neutral: 'text-neutral-graphic', accent: 'text-accent-graphic', info: 'text-info-graphic', success: 'text-success-graphic',
      warning: 'text-warning-graphic', danger: 'text-danger-graphic', agent: 'text-agent-graphic',
    },
    size: { xs: 'size-icon-sm [&_svg]:size-icon-sm', sm: 'size-icon-md [&_svg]:size-icon-md', md: 'size-icon-md [&_svg]:size-icon-md', lg: 'size-icon-lg [&_svg]:size-icon-lg' },
  },
  compoundVariants: [{ variant: 'solid', className: 'text-current' }],
  defaultVariants: { variant: 'soft', tone: 'info', size: 'md' },
});

/** The message: in the page layout it takes the free width; emphasis lead keeps it in text.primary and puts only the <b> lead-in in the tone text. */
export const alertBody = cva('[&_b]:font-semibold', {
  variants: {
    layout: { inline: '', page: 'min-w-0 flex-1' },
    emphasis: { tone: '', lead: '' },
    variant: { solid: '', soft: '', outline: '', ghost: '' },
    tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
  },
  compoundVariants: [
    { emphasis: 'lead', variant: ['soft', 'outline', 'ghost'], className: 'text-text-primary' },
    { emphasis: 'lead', variant: ['soft', 'outline', 'ghost'], tone: 'accent', className: '[&_b]:text-accent-text' },
    { emphasis: 'lead', variant: ['soft', 'outline', 'ghost'], tone: 'success', className: '[&_b]:text-success-text' },
    { emphasis: 'lead', variant: ['soft', 'outline', 'ghost'], tone: 'warning', className: '[&_b]:text-warning-text' },
    { emphasis: 'lead', variant: ['soft', 'outline', 'ghost'], tone: 'danger', className: '[&_b]:text-danger-text' },
    { emphasis: 'lead', variant: ['soft', 'outline', 'ghost'], tone: 'info', className: '[&_b]:text-info-text' },
    { emphasis: 'lead', variant: ['soft', 'outline', 'ghost'], tone: 'agent', className: '[&_b]:text-agent-text' },
  ],
  defaultVariants: { layout: 'inline', emphasis: 'tone', variant: 'soft', tone: 'info' },
});

export type AlertVariantProps = Pick<VariantProps<typeof alertVariants>, 'tone' | 'variant' | 'size' | 'layout' | 'placement'>;
