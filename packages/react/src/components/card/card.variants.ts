import { cva, type VariantProps } from 'class-variance-authority';
import type { Size } from '../../lib/common-props.ts';

/** Card size: the common scale, plus the deprecated names regular (= md) and compact (= sm). */
export type CardSize = Size | 'regular' | 'compact';

/** Maps the deprecated regular / compact names onto the common size scale. */
export const cardSize = (size?: CardSize | null): Size | undefined => (size === 'regular' ? 'md' : size === 'compact' ? 'sm' : (size ?? undefined));

/** The skins of the one card root (Card, CardLink and CardChoice take the same set). */
export type CardVariant = 'surface' | 'plain' | 'glass' | 'outline' | 'dashed' | 'well' | 'agent' | 'spotlight' | 'feature' | 'solid' | 'soft' | 'ghost';

/**
 * Card root: the one inset and the one gap, stepped by size (xs 8 / 6, sm 12 / 8, md 15 x 14 / 10, lg 20 / 12), and the
 * skin (variant). Each skin keeps the look its former component had (round 1–3 owner decisions):
 * - surface (default): opaque surface.base with the 1px inset border.subtle hairline; a non-neutral tone tints the hairline.
 *   With a CardCover the hairline is an outer ring (the picture would cover an inset one) and the card clips its media.
 * - plain / ghost: the transparent base, no fill or edge.
 * - glass: the regular material (solid fill, no blur) at elevation 2, not the overlay step 3; glass is not toned.
 * - outline: border.default edge that strengthens to border.strong on hover; the text steps down to the hairline
 *   (title ui-lg, description tertiary; owner 2026-10-27). A tone colours the edge.
 * - dashed: the add card: 1px dashed border.strong outline inside the edge, content centred, secondary text.
 * - well: double bezel: a neutral.well shell with a 4px bezel (size steps it 2 / 3 / 4 / 6) and no gap; holds a CardPanel.
 * - agent: unapplied agent output: spectrum rim, agent glow and an agent.tint header wash (owner 2026-10-27); not toned.
 *   It also lights the CardOrb (the orb is part of the agent skin, P2).
 * - spotlight: surface lit by a pointer-following glow (tone soft) and rim (tone border-strong); accent when tone is unset.
 * - feature: surface with a quiet corner glow (tone soft); accent when tone is unset.
 * - solid / soft: the tone solid / soft fill (solid turns the card text parts to the tone on colour).
 */
export const cardVariants = cva(
  [
    'group/card relative flex min-w-0 flex-col rounded-3xl font-ui text-text-primary [--card-cover-panel:var(--cs-color-surface-base)]',
    'has-[[data-slot=card-cover]]:overflow-hidden',
    'has-[[data-slot=card-cover][data-layout=overlay]]:gap-0 has-[[data-slot=card-cover][data-layout=overlay]]:p-0 has-[[data-slot=card-cover][data-layout=overlay]]:text-media-on',
  ],
  {
    variants: {
      size: {
        xs: 'gap-1.5 p-2',
        sm: 'gap-2 px-inset-compact-x py-inset-compact-y',
        md: 'gap-2.5 px-inset-regular-x py-inset-regular-y',
        lg: 'gap-3 p-5',
      },
      tone: { neutral: '', accent: '', success: '', warning: '', danger: '', info: '', agent: '' },
      variant: {
        surface: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] has-[[data-slot=card-cover]]:shadow-[0_0_0_1px_var(--cs-color-border-subtle)]',
        plain: '',
        ghost: '',
        glass: 'glass [--cs-shadow:var(--cs-elevation-2)] [--card-cover-panel:var(--cs-color-material-regular)]',
        outline: [
          // transition-shadow, not transition-control: a CardLink adds its own list, and tailwind-merge drops this one there.
          'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-border-default)] transition-shadow hover:shadow-[inset_0_0_0_1px_var(--cs-color-border-strong)]',
          '[&_[data-slot=card-title]]:text-ui-lg [&_[data-slot=card-description]]:text-text-tertiary',
        ],
        dashed: 'min-h-card-add flex-row items-center justify-center gap-1.5 bg-transparent text-ui text-text-secondary outline-1 -outline-offset-1 outline-dashed outline-border-strong',
        well: 'gap-0 bg-neutral-well p-1 shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] [--card-cover-panel:var(--cs-color-neutral-well)]',
        agent: 'bg-surface-base agent-rim shadow-agent bg-linear-to-b from-agent-tint to-surface-base to-45% [&_[data-slot=card-orb]]:orb',
        spotlight: [
          'isolate overflow-hidden bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
          'before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-base before:content-[""]',
          'before:bg-[radial-gradient(var(--cs-size-spotlight-glow)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-accent-soft),transparent_60%)]',
          'after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:p-[1px] after:opacity-0 after:transition-opacity after:duration-base after:content-[""]',
          'after:bg-[radial-gradient(var(--cs-size-spotlight-rim)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-accent-border-strong),transparent_70%)]',
          'after:[-webkit-mask:linear-gradient(var(--cs-color-text-primary)_0_0)_content-box,linear-gradient(var(--cs-color-text-primary)_0_0)] after:[-webkit-mask-composite:xor]',
          'after:[mask:linear-gradient(var(--cs-color-text-primary)_0_0)_content-box_exclude,linear-gradient(var(--cs-color-text-primary)_0_0)]',
          'hover:before:opacity-100 hover:after:opacity-100',
        ],
        feature: [
          'isolate overflow-hidden bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
          'before:pointer-events-none before:absolute before:-top-[40%] before:-right-[30%] before:-z-10 before:aspect-square before:w-4/5 before:rounded-full before:content-[""]',
          'before:bg-[radial-gradient(closest-side,var(--cs-color-accent-soft),transparent)]',
        ],
        solid: '',
        soft: '',
      },
      fill: { hug: '', fill: 'justify-between' },
    },
    compoundVariants: [
      // surface: a non-neutral tone tints the hairline
      { variant: 'surface', tone: 'accent', class: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] has-[[data-slot=card-cover]]:shadow-[0_0_0_1px_var(--cs-color-accent-border)]' },
      { variant: 'surface', tone: 'success', class: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] has-[[data-slot=card-cover]]:shadow-[0_0_0_1px_var(--cs-color-success-border)]' },
      { variant: 'surface', tone: 'warning', class: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] has-[[data-slot=card-cover]]:shadow-[0_0_0_1px_var(--cs-color-warning-border)]' },
      { variant: 'surface', tone: 'danger', class: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] has-[[data-slot=card-cover]]:shadow-[0_0_0_1px_var(--cs-color-danger-border)]' },
      { variant: 'surface', tone: 'info', class: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] has-[[data-slot=card-cover]]:shadow-[0_0_0_1px_var(--cs-color-info-border)]' },
      { variant: 'surface', tone: 'agent', class: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] has-[[data-slot=card-cover]]:shadow-[0_0_0_1px_var(--cs-color-agent-border)]' },
      // outline: tone edge, border-strong on hover
      { variant: 'outline', tone: 'accent', class: 'shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-accent-border-strong)]' },
      { variant: 'outline', tone: 'success', class: 'shadow-[inset_0_0_0_1px_var(--cs-color-success-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-success-border-strong)]' },
      { variant: 'outline', tone: 'warning', class: 'shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-warning-border-strong)]' },
      { variant: 'outline', tone: 'danger', class: 'shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)]' },
      { variant: 'outline', tone: 'info', class: 'shadow-[inset_0_0_0_1px_var(--cs-color-info-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-info-border-strong)]' },
      { variant: 'outline', tone: 'agent', class: 'shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)] hover:shadow-[inset_0_0_0_1px_var(--cs-color-agent-border-strong)]' },
      // dashed: tone dashed edge and tone text
      { variant: 'dashed', tone: 'accent', class: 'text-accent-text outline-accent-border-strong' },
      { variant: 'dashed', tone: 'success', class: 'text-success-text outline-success-border-strong' },
      { variant: 'dashed', tone: 'warning', class: 'text-warning-text outline-warning-border-strong' },
      { variant: 'dashed', tone: 'danger', class: 'text-danger-text outline-danger-border-strong' },
      { variant: 'dashed', tone: 'info', class: 'text-info-text outline-info-border-strong' },
      { variant: 'dashed', tone: 'agent', class: 'text-agent-text outline-agent-border-strong' },
      // well: the bezel steps with the size; a non-neutral tone gives the shell the tone tint and border
      { variant: 'well', size: 'xs', class: 'p-0.5' },
      { variant: 'well', size: 'sm', class: 'p-0.75' },
      { variant: 'well', size: 'lg', class: 'p-1.5' },
      { variant: 'well', tone: 'accent', class: 'bg-accent-tint shadow-[inset_0_0_0_1px_var(--cs-color-accent-border)]' },
      { variant: 'well', tone: 'success', class: 'bg-success-tint shadow-[inset_0_0_0_1px_var(--cs-color-success-border)]' },
      { variant: 'well', tone: 'warning', class: 'bg-warning-tint shadow-[inset_0_0_0_1px_var(--cs-color-warning-border)]' },
      { variant: 'well', tone: 'danger', class: 'bg-danger-tint shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)]' },
      { variant: 'well', tone: 'info', class: 'bg-info-tint shadow-[inset_0_0_0_1px_var(--cs-color-info-border)]' },
      { variant: 'well', tone: 'agent', class: 'bg-agent-tint shadow-[inset_0_0_0_1px_var(--cs-color-agent-border)]' },
      // spotlight: the pointer light takes the tone (accent is in the base)
      { variant: 'spotlight', tone: 'neutral', class: 'before:bg-[radial-gradient(var(--cs-size-spotlight-glow)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-neutral-soft),transparent_60%)] after:bg-[radial-gradient(var(--cs-size-spotlight-rim)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-neutral-border-strong),transparent_70%)]' },
      { variant: 'spotlight', tone: 'success', class: 'before:bg-[radial-gradient(var(--cs-size-spotlight-glow)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-success-soft),transparent_60%)] after:bg-[radial-gradient(var(--cs-size-spotlight-rim)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-success-border-strong),transparent_70%)]' },
      { variant: 'spotlight', tone: 'warning', class: 'before:bg-[radial-gradient(var(--cs-size-spotlight-glow)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-warning-soft),transparent_60%)] after:bg-[radial-gradient(var(--cs-size-spotlight-rim)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-warning-border-strong),transparent_70%)]' },
      { variant: 'spotlight', tone: 'danger', class: 'before:bg-[radial-gradient(var(--cs-size-spotlight-glow)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-danger-soft),transparent_60%)] after:bg-[radial-gradient(var(--cs-size-spotlight-rim)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-danger-border-strong),transparent_70%)]' },
      { variant: 'spotlight', tone: 'info', class: 'before:bg-[radial-gradient(var(--cs-size-spotlight-glow)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-info-soft),transparent_60%)] after:bg-[radial-gradient(var(--cs-size-spotlight-rim)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-info-border-strong),transparent_70%)]' },
      { variant: 'spotlight', tone: 'agent', class: 'before:bg-[radial-gradient(var(--cs-size-spotlight-glow)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-agent-soft),transparent_60%)] after:bg-[radial-gradient(var(--cs-size-spotlight-rim)_circle_at_var(--mx,50%)_var(--my,0%),var(--cs-color-agent-border-strong),transparent_70%)]' },
      // feature: the corner glow takes the tone (accent is in the base)
      { variant: 'feature', tone: 'neutral', class: 'before:bg-[radial-gradient(closest-side,var(--cs-color-neutral-soft),transparent)]' },
      { variant: 'feature', tone: 'success', class: 'before:bg-[radial-gradient(closest-side,var(--cs-color-success-soft),transparent)]' },
      { variant: 'feature', tone: 'warning', class: 'before:bg-[radial-gradient(closest-side,var(--cs-color-warning-soft),transparent)]' },
      { variant: 'feature', tone: 'danger', class: 'before:bg-[radial-gradient(closest-side,var(--cs-color-danger-soft),transparent)]' },
      { variant: 'feature', tone: 'info', class: 'before:bg-[radial-gradient(closest-side,var(--cs-color-info-soft),transparent)]' },
      { variant: 'feature', tone: 'agent', class: 'before:bg-[radial-gradient(closest-side,var(--cs-color-agent-soft),transparent)]' },
      // solid: tone fill, the card text parts turn to the tone on colour (nested controls keep theirs)
      { variant: 'solid', tone: 'neutral', class: 'bg-neutral-solid text-neutral-on [--card-cover-panel:var(--cs-color-neutral-solid)] [&_[data-slot=card-eyebrow]]:text-neutral-on [&_[data-slot=card-title]]:text-neutral-on [&_[data-slot=card-description]]:text-neutral-on [&_[data-slot=card-body]]:text-neutral-on [&_[data-slot=card-meta]]:text-neutral-on [&_[data-slot=card-headline]]:text-neutral-on [&_[data-slot=card-arrow]]:text-neutral-on' },
      { variant: 'solid', tone: 'accent', class: 'bg-accent-solid text-accent-on [--card-cover-panel:var(--cs-color-accent-solid)] [&_[data-slot=card-eyebrow]]:text-accent-on [&_[data-slot=card-title]]:text-accent-on [&_[data-slot=card-description]]:text-accent-on [&_[data-slot=card-body]]:text-accent-on [&_[data-slot=card-meta]]:text-accent-on [&_[data-slot=card-headline]]:text-accent-on [&_[data-slot=card-arrow]]:text-accent-on' },
      { variant: 'solid', tone: 'success', class: 'bg-success-solid text-success-on [--card-cover-panel:var(--cs-color-success-solid)] [&_[data-slot=card-eyebrow]]:text-success-on [&_[data-slot=card-title]]:text-success-on [&_[data-slot=card-description]]:text-success-on [&_[data-slot=card-body]]:text-success-on [&_[data-slot=card-meta]]:text-success-on [&_[data-slot=card-headline]]:text-success-on [&_[data-slot=card-arrow]]:text-success-on' },
      { variant: 'solid', tone: 'warning', class: 'bg-warning-solid text-warning-on [--card-cover-panel:var(--cs-color-warning-solid)] [&_[data-slot=card-eyebrow]]:text-warning-on [&_[data-slot=card-title]]:text-warning-on [&_[data-slot=card-description]]:text-warning-on [&_[data-slot=card-body]]:text-warning-on [&_[data-slot=card-meta]]:text-warning-on [&_[data-slot=card-headline]]:text-warning-on [&_[data-slot=card-arrow]]:text-warning-on' },
      { variant: 'solid', tone: 'danger', class: 'bg-danger-solid text-danger-on [--card-cover-panel:var(--cs-color-danger-solid)] [&_[data-slot=card-eyebrow]]:text-danger-on [&_[data-slot=card-title]]:text-danger-on [&_[data-slot=card-description]]:text-danger-on [&_[data-slot=card-body]]:text-danger-on [&_[data-slot=card-meta]]:text-danger-on [&_[data-slot=card-headline]]:text-danger-on [&_[data-slot=card-arrow]]:text-danger-on' },
      { variant: 'solid', tone: 'info', class: 'bg-info-solid text-info-on [--card-cover-panel:var(--cs-color-info-solid)] [&_[data-slot=card-eyebrow]]:text-info-on [&_[data-slot=card-title]]:text-info-on [&_[data-slot=card-description]]:text-info-on [&_[data-slot=card-body]]:text-info-on [&_[data-slot=card-meta]]:text-info-on [&_[data-slot=card-headline]]:text-info-on [&_[data-slot=card-arrow]]:text-info-on' },
      { variant: 'solid', tone: 'agent', class: 'bg-agent-solid text-agent-on [--card-cover-panel:var(--cs-color-agent-solid)] [&_[data-slot=card-eyebrow]]:text-agent-on [&_[data-slot=card-title]]:text-agent-on [&_[data-slot=card-description]]:text-agent-on [&_[data-slot=card-body]]:text-agent-on [&_[data-slot=card-meta]]:text-agent-on [&_[data-slot=card-headline]]:text-agent-on [&_[data-slot=card-arrow]]:text-agent-on' },
      // soft: tone soft fill
      { variant: 'soft', tone: 'neutral', class: 'bg-neutral-soft [--card-cover-panel:var(--cs-color-neutral-soft)]' },
      { variant: 'soft', tone: 'accent', class: 'bg-accent-soft [--card-cover-panel:var(--cs-color-accent-soft)]' },
      { variant: 'soft', tone: 'success', class: 'bg-success-soft [--card-cover-panel:var(--cs-color-success-soft)]' },
      { variant: 'soft', tone: 'warning', class: 'bg-warning-soft [--card-cover-panel:var(--cs-color-warning-soft)]' },
      { variant: 'soft', tone: 'danger', class: 'bg-danger-soft [--card-cover-panel:var(--cs-color-danger-soft)]' },
      { variant: 'soft', tone: 'info', class: 'bg-info-soft [--card-cover-panel:var(--cs-color-info-soft)]' },
      { variant: 'soft', tone: 'agent', class: 'bg-agent-soft [--card-cover-panel:var(--cs-color-agent-soft)]' },
    ],
    defaultVariants: { size: 'md', tone: 'neutral', variant: 'surface', fill: 'hug' },
  },
);

/** Explicit radius and elevation of the root, applied after the skin so an explicit value wins (an elevation replaces a hairline: one depth cue). */
export const cardShapeVariants = cva('', {
  variants: {
    radius: { none: 'rounded-none', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': '', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { 'none': '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { radius: '3xl', shadow: 'none' },
});

/** The glass skin takes its elevation through the material shadow variable; unset (none) and 2 keep its own elevation 2. */
export const cardGlassShadowVariants = cva('', {
  variants: {
    shadow: {
      'none': '',
      '1': '[--cs-shadow:var(--cs-elevation-1)]',
      '2': '',
      '3': '[--cs-shadow:var(--cs-elevation-3)]',
      '4': '[--cs-shadow:var(--cs-elevation-4)]',
      '5': '[--cs-shadow:var(--cs-elevation-5)]',
    },
  },
  defaultVariants: { shadow: 'none' },
});

/** The static surface card is for reading: its body reads in text.primary. Link and choice cards and the other skins keep text.secondary. */
export const cardReadingVariants = cva('[&_[data-slot=card-body]]:text-text-primary');

/**
 * CardLink and CardChoice: the whole card is one target. It lifts on hover (the lift elevation replaces the hairline,
 * 2px up on the spring) and presses to 0.97; both respect reduced motion. It draws the focus ring; a card with a cover
 * adds elevation 2 to the ring.
 */
export const cardTargetVariants = cva([
  'cursor-pointer text-left no-underline outline-none',
  // Position and size move on the spring; colour, shadow and the selected text colour run on quick / out (springs only move).
  'transition-[translate,scale,box-shadow,background-color,color] duration-[var(--cs-duration-spring),var(--cs-duration-spring),var(--cs-duration-quick),var(--cs-duration-quick),var(--cs-duration-quick)] ease-[var(--cs-ease-spring),var(--cs-ease-spring),var(--cs-ease-out),var(--cs-ease-out),var(--cs-ease-out)]',
  'lift press',
  'hover:shadow-[var(--cs-elevation-lift)]',
  'focus-visible:shadow-focus',
  'has-[[data-slot=card-cover]]:hover:shadow-[var(--cs-elevation-lift)] has-[[data-slot=card-cover]]:focus-visible:shadow-[var(--cs-focus),var(--cs-elevation-2)]',
]);

/** The dashed add card answers with the neutral hover fill instead of the lift; a neutral one also lifts its label to primary text. */
export const cardAddTargetVariants = cva('cursor-pointer transition-control press hover:bg-neutral-hover focus-visible:shadow-focus', {
  variants: { neutral: { true: 'hover:text-text-primary', false: '' } },
});

/**
 * CardChoice selected: the card inverts (selected utility, owner 2026-10-26): ink fill, paper text, no edge; the
 * indicator, tile text and description invert with it. Hover while selected: selection.fill-hover plus the lift.
 * Focus keeps the ring only. A disabled selected card drops the inversion.
 */
export const cardChoiceVariants = cva([
  'data-[state=checked]:not-disabled:selected data-[state=checked]:not-disabled:shadow-none',
  'data-[state=checked]:not-disabled:hover:bg-selection-fill-hover data-[state=checked]:not-disabled:hover:shadow-[var(--cs-elevation-lift)]',
  'data-[state=checked]:not-disabled:focus-visible:shadow-focus',
]);

export const cardHeaderVariants = cva('flex gap-3', {
  variants: {
    headerAlign: { start: 'items-start', center: 'items-center' },
    // shell: the header of a well card sits on the shell with its own padding; its title is one step lighter (text.secondary, owner 2026-10-27).
    density: { default: '', shell: 'px-3 pb-3 pt-2.5 [&_[data-slot=card-title]]:min-w-0 [&_[data-slot=card-title]]:flex-1 [&_[data-slot=card-title]]:text-text-secondary' },
  },
  defaultVariants: { headerAlign: 'start', density: 'default' },
});

export const cardIconVariants = cva('grid size-card-tile flex-none place-items-center rounded-lg [&_svg]:size-card-glyph', {
  variants: {
    iconTone: {
      neutral: 'bg-neutral-well text-text-primary',
      accent: 'bg-accent-soft text-accent-text',
    },
  },
  defaultVariants: { iconTone: 'neutral' },
});

export const cardTitleVariants = cva('block font-ui text-text-primary', {
  variants: {
    titleSize: { md: 'text-title-3', sm: 'text-title-4' },
  },
  defaultVariants: { titleSize: 'md' },
});

/** Divided footers bleed to the card edge with a negative margin equal to the inset of the card size. */
export const cardFooterVariants = cva('flex flex-wrap items-center gap-2', {
  variants: {
    footer: {
      start: '',
      end: 'justify-end',
      divided: [
        '-mx-inset-regular-x -mb-inset-regular-y mt-1 border-t border-border-subtle px-inset-regular-x py-3',
        'group-data-[size=xs]/card:-mx-2 group-data-[size=xs]/card:-mb-2 group-data-[size=xs]/card:px-2',
        'group-data-[size=sm]/card:-mx-inset-compact-x group-data-[size=sm]/card:-mb-inset-compact-y group-data-[size=sm]/card:px-inset-compact-x',
        'group-data-[size=lg]/card:-mx-5 group-data-[size=lg]/card:-mb-5 group-data-[size=lg]/card:px-5',
      ],
      block: '[&>*]:flex-1',
    },
    // shell: the footer of a well card sits on the shell with its own padding.
    density: { default: '', shell: 'px-3 pb-2 pt-2.5' },
  },
  defaultVariants: { footer: 'start', density: 'default' },
});

/** Parts after a cover paint above its frosted panel. */
export const cardAboveCoverVariants = cva('group-has-[[data-slot=card-cover][data-layout=cover]]/card:relative');

/** Inset surface panel of the well card: concentric with the shell (well-inner = 3xl − the 4px bezel). */
export const cardPanelVariants = cva([
  'grid min-w-0 gap-2.5 rounded-well-inner bg-surface-base px-inset-regular-x py-inset-regular-y font-ui text-ui-relaxed text-text-secondary',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)] [&_p]:m-0',
]);

/** Large title of a hero tile (feature); small tiles use CardTitle titleSize="sm". */
export const cardHeadlineVariants = cva('block font-ui text-title-feature text-balance text-text-primary');

/** Inset visual well pushed to the bottom; fills the remaining height. */
export const cardVisualVariants = cva('mt-auto grid min-h-feature-visual-min flex-1 place-items-center rounded-xl bg-bg-inset');

/** Link card: arrow-up-right at the trailing end of the header; nudges on card hover. */
export const cardArrowVariants = cva([
  'inline-flex size-icon-sm flex-none text-text-tertiary hover:text-text-primary [&_svg]:size-full',
  'transition-[translate,color] duration-[var(--cs-duration-spring),var(--cs-duration-quick)] ease-[var(--cs-ease-spring),var(--cs-ease-out)]',
  'group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-text-primary',
]);

/** Choice card: the decorative radio (or checkbox) mark; it fills with the accent solid slot when the card is checked. */
export const cardIndicatorVariants = cva([
  'pointer-events-none inline-grid size-check flex-none place-items-center rounded-full bg-surface-base text-accent-on transition-control [&_svg]:size-3',
  'shadow-[inset_0_0_0_1px_var(--cs-color-border-control)]',
  'group-data-[type=checkbox]/card:rounded-sm',
  'group-data-[state=checked]/card:bg-accent-solid group-data-[state=checked]/card:shadow-none',
]);

/**
 * Full-bleed media box: pulls out to the card edge by the inset of the card size; 4px under it makes the inset before
 * the header. cover: a 16:9 window, not a positioned box: the picture is positioned against the card and fills it, and
 * the ::after (at the window's bottom edge) is the frosted content panel (the card fill at 80% with the regular backdrop
 * blur; owner 2026-10-27, flags.frost) behind the parts that follow; the card clips its overflow. overlay: 4/5, no bleed.
 */
export const cardCoverVariants = cva(
  [
    'group/cover relative -mx-inset-regular-x -mt-inset-regular-y mb-1 aspect-16/9 overflow-hidden',
    'group-data-[size=xs]/card:-mx-2 group-data-[size=xs]/card:-mt-2',
    'group-data-[size=sm]/card:-mx-inset-compact-x group-data-[size=sm]/card:-mt-inset-compact-y',
    'group-data-[size=lg]/card:-mx-5 group-data-[size=lg]/card:-mt-5',
    'data-[layout=overlay]:m-0 data-[layout=overlay]:aspect-4/5',
    'data-[layout=cover]:static data-[layout=cover]:aspect-auto data-[layout=cover]:overflow-visible',
    'data-[layout=cover]:before:block data-[layout=cover]:before:pt-[calc(100%*9/16)] data-[layout=cover]:before:content-[""]',
    'data-[layout=cover]:after:pointer-events-none data-[layout=cover]:after:absolute data-[layout=cover]:after:inset-x-0 data-[layout=cover]:after:h-screen data-[layout=cover]:after:content-[""]',
    'data-[layout=cover]:after:bg-(--card-cover-panel)/80 data-[layout=cover]:after:backdrop-blur-regular',
  ],
  {
    variants: { layout: { cover: '', overlay: '' } },
    defaultVariants: { layout: 'cover' },
  },
);

export type CardVariantProps = VariantProps<typeof cardVariants>;
export type CardHeaderVariantProps = VariantProps<typeof cardHeaderVariants>;
export type CardIconVariantProps = VariantProps<typeof cardIconVariants>;
export type CardTitleVariantProps = VariantProps<typeof cardTitleVariants>;
export type CardFooterVariantProps = VariantProps<typeof cardFooterVariants>;
