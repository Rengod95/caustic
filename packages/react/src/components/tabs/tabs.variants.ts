import { cva, type VariantProps } from 'class-variance-authority';

// The five common props are set on Tabs and reach the list and every trigger.
// tone sets the --tone-* slots of the selected tab (accent by default). variant:
//   underline  text tabs on a hairline, a 2px tone bar under the selected one (the specimen)
//   solid      pill tabs, the selected one filled: the selected utility (ink) when neutral, tone.solid + tone.on otherwise
//   soft       pill tabs, the selected one tone.soft with tone.text
//   outline    pill tabs, the selected one ringed in tone.border-strong
//   ghost      pill tabs, the selected one only in tone.text
export const tabsVariants = cva('flex flex-col', {
  variants: {
    tone: {
      neutral: '[--tone-solid:var(--cs-color-neutral-solid)] [--tone-on:var(--cs-color-neutral-on)] [--tone-soft:var(--cs-color-neutral-soft)] [--tone-border-strong:var(--cs-color-neutral-border-strong)] [--tone-text:var(--cs-color-neutral-text)]',
      accent: '[--tone-solid:var(--cs-color-accent-solid)] [--tone-on:var(--cs-color-accent-on)] [--tone-soft:var(--cs-color-accent-soft)] [--tone-border-strong:var(--cs-color-accent-border-strong)] [--tone-text:var(--cs-color-accent-text)]',
      success: '[--tone-solid:var(--cs-color-success-solid)] [--tone-on:var(--cs-color-success-on)] [--tone-soft:var(--cs-color-success-soft)] [--tone-border-strong:var(--cs-color-success-border-strong)] [--tone-text:var(--cs-color-success-text)]',
      warning: '[--tone-solid:var(--cs-color-warning-solid)] [--tone-on:var(--cs-color-warning-on)] [--tone-soft:var(--cs-color-warning-soft)] [--tone-border-strong:var(--cs-color-warning-border-strong)] [--tone-text:var(--cs-color-warning-text)]',
      danger: '[--tone-solid:var(--cs-color-danger-solid)] [--tone-on:var(--cs-color-danger-on)] [--tone-soft:var(--cs-color-danger-soft)] [--tone-border-strong:var(--cs-color-danger-border-strong)] [--tone-text:var(--cs-color-danger-text)]',
      info: '[--tone-solid:var(--cs-color-info-solid)] [--tone-on:var(--cs-color-info-on)] [--tone-soft:var(--cs-color-info-soft)] [--tone-border-strong:var(--cs-color-info-border-strong)] [--tone-text:var(--cs-color-info-text)]',
      agent: '[--tone-solid:var(--cs-color-agent-solid)] [--tone-on:var(--cs-color-agent-on)] [--tone-soft:var(--cs-color-agent-soft)] [--tone-border-strong:var(--cs-color-agent-border-strong)] [--tone-text:var(--cs-color-agent-text)]',
    },
  },
  defaultVariants: { tone: 'accent' },
});

// relative: the sliding thumb is drawn in the list, under the triggers. group/tabs-list: the moving state (data-moving).
export const tabsListVariants = cva('relative group/tabs-list flex', {
  variants: {
    variant: {
      underline: 'gap-4.5 border-b border-border-subtle',
      solid: 'gap-1',
      soft: 'gap-1',
      outline: 'gap-1',
      ghost: 'gap-1',
    },
      shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { variant: 'underline', shadow: 'none' },
});

export const tabsTriggerVariants = cva(
  [
    'group relative inline-flex items-center gap-1 whitespace-nowrap font-ui text-text-tertiary',
    'transition-control outline-none hover:text-text-primary focus-visible:shadow-focus',
    // Disabled is colour and the tone drops: the stacked disabled + active rule (0,3,0) beats the active text, and the bar greys out.
    'data-[state=active]:text-text-primary disabled:pointer-events-none disabled:text-disabled-text disabled:data-[state=active]:text-disabled-text',
  ],
  {
    variants: {
      // While the list slides its thumb (data-moving), a pill's selected fill and edge are hidden at once (the thumb
      // paints them; the (0,4,0) selectors beat the selected rules) and the pills do not transition.
      variant: {
        underline: '',
        solid: 'rounded-md px-3 hover:bg-neutral-hover group-data-[moving]/tabs-list:transition-none group-data-[moving]/tabs-list:data-[state=active]:not-disabled:bg-transparent',
        soft: 'rounded-md px-3 hover:bg-neutral-hover data-[state=active]:bg-(--tone-soft) data-[state=active]:text-(--tone-text) group-data-[moving]/tabs-list:transition-none group-data-[moving]/tabs-list:data-[state=active]:not-disabled:bg-transparent',
        outline: 'rounded-md px-3 hover:bg-neutral-hover data-[state=active]:shadow-[inset_0_0_0_1px_var(--tone-border-strong)] data-[state=active]:focus-visible:shadow-[inset_0_0_0_1px_var(--tone-border-strong),var(--cs-focus)] group-data-[moving]/tabs-list:transition-none group-data-[moving]/tabs-list:data-[state=active]:not-disabled:shadow-none',
        ghost: 'rounded-md px-3 hover:bg-neutral-hover data-[state=active]:text-(--tone-text)',
      },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      size: {
        xs: 'h-control-xs text-ui-sm',
        sm: 'h-control-sm text-ui-sm',
        md: 'h-tab-h text-ui-strong',
        lg: 'h-control-lg text-ui-lg',
      },
      // The default key keeps the own corner (md on pills, none on underline tabs); every other key sets that radius token.
      radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: '', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    },
    compoundVariants: [
      // The neutral solid tab is a selected item: it inverts (owner 2026-10-26, proposal B).
      { variant: 'solid', tone: 'neutral', className: 'data-[state=active]:not-disabled:selected' },
      { variant: 'solid', tone: ['accent', 'success', 'warning', 'danger', 'info', 'agent'], className: 'data-[state=active]:bg-(--tone-solid) data-[state=active]:text-(--tone-on)' },
      // A disabled selected pill drops its fill and edge with the tone.
      { variant: ['solid', 'soft', 'outline'], className: 'disabled:data-[state=active]:bg-disabled-fill disabled:data-[state=active]:shadow-none' },
    ],
    defaultVariants: { variant: 'underline', tone: 'accent', size: 'md', radius: 'md' },
  },
);

/** The count after the label: a small neutral.track pill (full radius, 6px inline padding, owner 2026-10-28) so it reads
 *  as a count, not part of the name. Tertiary numerals; disabled.text when the tab is disabled. */
export const tabsCountVariants = cva('inline-flex items-center rounded-full bg-neutral-track px-1.5 text-ui-xs tabular-nums text-text-secondary group-disabled:text-disabled-text');

/** The 2px bar under each underline tab, on the list hairline. The selected tab shows it; hovering an unselected tab shows
 *  it in border.strong as a hint that it is clickable (owner 2026-10-28). While the list slides its thumb, no bar of its own
 *  is shown, so the thumb is the only bar. */
export const tabsIndicatorVariants = cva(
  'absolute inset-x-0 -bottom-px h-0.5 rounded-xs bg-(--tone-solid) opacity-0 transition-[opacity,background-color] duration-base ease-out group-data-[state=active]:opacity-100 group-data-[state=inactive]:group-hover:bg-border-strong group-data-[state=inactive]:group-hover:opacity-100 group-disabled:bg-disabled-text group-data-[moving]/tabs-list:transition-none group-data-[moving]/tabs-list:group-data-[state=active]:opacity-0',
  {
    variants: { variant: { underline: '', solid: 'hidden', soft: 'hidden', outline: 'hidden', ghost: 'hidden' } },
    defaultVariants: { variant: 'underline' },
  },
);

/**
 * The sliding thumb of the list: the bar of an underline list, or the fill (ring) of a selected pill, drawn once under the
 * triggers at the selected tab's box (--thumb-* from useIndicator). Invisible at rest, where the tab draws its own look.
 * While the list has data-moving it is opaque and slides; after the move it stays opaque until the tab's own look is back
 * (the opacity delay), so nothing flickers. A disabled selected tab takes the disabled look.
 */
export const tabsThumbVariants = cva(
  [
    'pointer-events-none absolute opacity-0',
    '[transition-property:translate,width,height,opacity] ease-snappy',
    '[transition-duration:var(--cs-duration-snappy),var(--cs-duration-snappy),var(--cs-duration-snappy),var(--cs-duration-instant)]',
    '[transition-delay:var(--cs-duration-instant),var(--cs-duration-instant),var(--cs-duration-instant),var(--cs-duration-quick)]',
    'group-data-[moving]/tabs-list:opacity-100 group-data-[moving]/tabs-list:[transition-delay:var(--cs-duration-instant)]',
  ],
  {
    variants: {
      look: {
        underline: '-bottom-px left-0 h-0.5 w-(--thumb-w) translate-x-(--thumb-x) rounded-xs bg-(--tone-solid) group-has-[[role=tab][data-state=active]:disabled]/tabs-list:bg-disabled-text',
        solid: '',
        soft: '',
        outline: '',
      },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
    },
    compoundVariants: [
      { look: ['solid', 'soft', 'outline'], className: 'top-0 left-0 h-(--thumb-h) w-(--thumb-w) translate-x-(--thumb-x) translate-y-(--thumb-y) rounded-(--thumb-r) group-has-[[role=tab][data-state=active]:disabled]/tabs-list:bg-disabled-fill group-has-[[role=tab][data-state=active]:disabled]/tabs-list:shadow-none' },
      // The neutral solid tab is a selected item (ink); see the trigger's selected compound.
      { look: 'solid', tone: 'neutral', className: 'selected' },
      { look: 'solid', tone: ['accent', 'success', 'warning', 'danger', 'info', 'agent'], className: 'bg-(--tone-solid)' },
      { look: 'soft', className: 'bg-(--tone-soft)' },
      { look: 'outline', className: 'shadow-[inset_0_0_0_1px_var(--tone-border-strong)]' },
    ],
    defaultVariants: { tone: 'accent' },
  },
);

export type TabsVariant = NonNullable<VariantProps<typeof tabsTriggerVariants>['variant']>;
