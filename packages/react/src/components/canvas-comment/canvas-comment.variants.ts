import { cva } from 'class-variance-authority';

/** The comment on the canvas: the pin with, when open, the bubble 6px to its right. The root carries the position. */
export const canvasCommentVariants = cva('relative inline-flex items-start gap-1.5', {
  variants: { placed: { true: 'absolute top-(--rect-t) left-(--rect-l)', false: '' } },
  defaultVariants: { placed: false },
});

/**
 * Speech-bubble pin: 14 radius on three corners, 4 at the bottom-left (the tail); a 2px ring under the elevation, both
 * read from local custom properties so the common props can set them apart (lib/common-props.ts): tone = the ring
 * (neutral = canvas.handle, a hue = its graphic 8), shadow = the elevation (default 3), variant = the fill of a human pin
 * (solid, the default, is the author's identity colour; the agent pin stays ink), size = the pin size. radius is applied
 * by CanvasComment with radiusClass (the tail corner stays xs).
 */
export const canvasCommentPinVariants = cva(
  [
    'inline-grid shrink-0 cursor-pointer place-items-center rounded-toolbar rounded-bl-xs font-ui font-semibold select-none transition-[scale] duration-quick ease-out',
    'shadow-[0_0_0_2px_var(--pin-ring),var(--pin-elev)]',
    'outline-none focus-visible:shadow-focus',
  ],
  {
    variants: {
      author: {
        human: '',
        agent: 'bg-ink-solid text-ink-on',
      },
      variant: { solid: '', soft: '', outline: '', ghost: '' },
      tone: {
        neutral: '[--pin-ring:var(--cs-color-canvas-handle)]',
        accent: '[--pin-ring:var(--cs-color-accent-graphic)]',
        success: '[--pin-ring:var(--cs-color-success-graphic)]',
        warning: '[--pin-ring:var(--cs-color-warning-graphic)]',
        danger: '[--pin-ring:var(--cs-color-danger-graphic)]',
        info: '[--pin-ring:var(--cs-color-info-graphic)]',
        agent: '[--pin-ring:var(--cs-color-agent-graphic)]',
      },
      shadow: {
        none: '[--pin-elev:0_0_0_0_transparent]',
        '1': '[--pin-elev:var(--cs-elevation-1)]',
        '2': '[--pin-elev:var(--cs-elevation-2)]',
        '3': '[--pin-elev:var(--cs-elevation-3)]',
        '4': '[--pin-elev:var(--cs-elevation-4)]',
        '5': '[--pin-elev:var(--cs-elevation-5)]',
      },
      size: {
        xs: 'size-control-2xs text-micro press-sm',
        sm: 'size-control-xs text-micro press-sm',
        md: 'size-control-sm text-micro press-sm',
        lg: 'size-control-md text-ui-sm press',
      },
      radius: { none: '', '2xs': '', xs: '', sm: '', md: '', lg: '', xl: '', '2xl': '', '3xl': '', '4xl': '', full: '' },
    },
    compoundVariants: [
      { author: 'human', variant: 'solid', className: 'bg-identity-coral text-identity-on-coral' },
      { author: 'human', variant: 'soft', className: 'bg-neutral-track text-text-primary' },
      { author: 'human', variant: 'outline', className: 'bg-surface-base text-text-primary' },
      { author: 'human', variant: 'ghost', className: 'bg-transparent text-text-primary' },
    ],
    defaultVariants: { author: 'human', variant: 'solid', tone: 'neutral', shadow: '3', size: 'md', radius: '2xl' },
  },
);

/** 10px spectrum orb of the agent pin. */
export const canvasCommentOrbVariants = cva('', {
  variants: { author: { human: '', agent: 'orb [--orb:var(--cs-size-orb-xs)]' } },
  defaultVariants: { author: 'human' },
});

/**
 * The bubble part (formerly CommentBubble): 14 radius (toolbar) on three corners, square (none) at the bottom-left where
 * it points back at the pin, its top 2px above the pin's. CanvasCommentBubble maps its common props onto the bubble
 * axes: variant = the surface (solid, the default, is the thick floating material), shadow = its elevation (glass-shadow
 * on the material; the part adds shadowClass for the other variants), size = padding and type, tone = the author name
 * colour (author variants below). radius is applied by the part with radiusClass (the tail corner stays square).
 * placed = a rect relative to the comment root replaces the place beside the pin.
 */
export const canvasCommentBubbleVariants = cva('animate-enter data-[state=closed]:animate-exit enter-scale origin-bottom-left -mt-0.5 max-w-comment-max rounded-toolbar rounded-bl-none font-ui text-text-primary', {
  variants: {
    placed: { true: 'absolute top-(--rect-t) left-(--rect-l) mt-0', false: '' },
    surface: {
      solid: 'glass glass-thick',
      soft: 'bg-neutral-track',
      outline: 'bg-surface-base shadow-[inset_0_0_0_0.5px_var(--cs-color-border-default)]',
      ghost: 'bg-transparent',
    },
    elevation: { none: '[--cs-shadow:none]', '1': 'glass-shadow-1', '2': 'glass-shadow-2', '3': 'glass-shadow-3', '4': 'glass-shadow-4', '5': 'glass-shadow-5' },
    bubbleSize: {
      xs: 'px-1.5 py-1 text-micro',
      sm: 'px-2 py-1.5 text-caption',
      md: 'px-2.5 py-2 text-footnote',
      lg: 'px-3 py-2.5 text-ui',
    },
  },
  defaultVariants: { placed: false, surface: 'solid', elevation: '3', bubbleSize: 'md' },
});

/**
 * The author name on its own line above the message (owner 2026-10-27): a small 600 line in the bubble text colour
 * (neutral, text.primary) or the tone's text, with a little more room before the message than the line gap.
 */
export const canvasCommentAuthorVariants = cva('block font-semibold', {
  variants: {
    bubbleSize: { xs: 'mb-0.5 text-micro', sm: 'mb-0.5 text-micro', md: 'mb-1 text-micro', lg: 'mb-1 text-ui-sm' },
    authorTone: {
      neutral: '', accent: 'text-accent-text', success: 'text-success-text', warning: 'text-warning-text',
      danger: 'text-danger-text', info: 'text-info-text', agent: 'text-agent-text',
    },
  },
  defaultVariants: { authorTone: 'neutral', bubbleSize: 'md' },
});
