import { cva } from 'class-variance-authority';

// The graph host. surface grid = the dot-grid canvas fill (canvas-grid); none = transparent, for a host that already is the
// canvas (an app's transparent centre). radius and shadow shape the host (none, flat by default).
export const nodeGraphVariants = cva('relative h-(--graph-h) w-(--graph-w)', {
  variants: {
    surface: { grid: 'canvas-grid', none: '' },
    radius: { none: '', '2xs': 'rounded-2xs', xs: 'rounded-xs', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', '4xl': 'rounded-4xl', full: 'rounded-full' },
    shadow: { none: '', '1': 'shadow-1', '2': 'shadow-2', '3': 'shadow-3', '4': 'shadow-4', '5': 'shadow-5' },
  },
  defaultVariants: { surface: 'none', radius: 'none', shadow: 'none' },
});

export const nodeGraphWiresVariants = cva('pointer-events-none absolute inset-0 size-full overflow-visible');

// Wire states. idle = border.strong; done = text.tertiary (the path the run already took); active = the tone solid with a
// flowing dash; draft = the wire being connected (tone solid, dashed, no flow); invalid = danger solid, dashed; muted =
// border.subtle (off the current selection). A dashed edge (an exit or optional path) keeps its state colour.
export const nodeGraphWireVariants = cva('fill-none stroke-[1.5px] transition-[stroke,stroke-width] duration-base ease-standard', {
  variants: {
    state: {
      idle: 'stroke-border-strong',
      done: 'stroke-text-tertiary',
      active: 'stroke-(--tone-solid) stroke-2 [stroke-dasharray:6_6] animate-[cs-graph-flow_0.9s_linear_infinite] motion-reduce:animate-none',
      draft: 'stroke-(--tone-solid) stroke-2 [stroke-dasharray:4_4]',
      invalid: 'stroke-danger-solid [stroke-dasharray:4_3]',
      muted: 'stroke-border-subtle',
    },
    dashed: { true: '[stroke-dasharray:3_4]', false: '' },
  },
  defaultVariants: { state: 'idle', dashed: false },
});

export const nodeGraphWireEndVariants = cva('', {
  variants: {
    state: {
      idle: 'fill-border-strong', done: 'fill-text-tertiary', active: 'fill-(--tone-solid)', draft: 'fill-(--tone-solid)',
      invalid: 'fill-danger-solid', muted: 'fill-border-subtle',
    },
  },
  defaultVariants: { state: 'idle' },
});

// Edge label: sits on the wire's midpoint over a canvas-coloured plate so the wire does not run through the text.
export const nodeGraphLabelVariants = cva(
  'pointer-events-none absolute z-[1] -translate-x-1/2 -translate-y-1/2 top-(--label-y) left-(--label-x) whitespace-nowrap rounded-xs bg-[var(--graph-plate,var(--cs-color-bg-canvas))] px-1 font-ui text-ui-xs font-normal',
  {
    variants: {
      state: {
        idle: 'text-text-tertiary', done: 'text-text-tertiary', active: 'text-text-primary', draft: 'text-text-secondary',
        invalid: 'text-danger-text', muted: 'text-disabled-text',
      },
    },
    defaultVariants: { state: 'idle' },
  },
);

export const graphNodeVariants = cva(
  [
    'group/node absolute top-(--node-y) left-(--node-x) grid w-(--node-w) min-w-0 gap-1 rounded-lg px-2.5 py-2 font-ui text-ui-xs outline-none',
    'transition-[box-shadow,background-color,opacity] duration-quick ease-standard',
    'focus-visible:shadow-focus',
  ],
  {
    variants: {
      // outline = surface.base + border.default hairline + elevation 1 (lifted off the dot grid); solid = surface.raised, no
      // hairline; soft = neutral.well; ghost = a drop place: dashed border.strong edge, no fill.
      variant: {
        outline: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-default),var(--cs-elevation-1)]',
        solid: 'bg-surface-raised shadow-1',
        soft: 'bg-neutral-well',
        ghost: 'bg-transparent outline-dashed outline-1 -outline-offset-1 outline-border-strong',
      },
      // idle; active = the run is here (tone ring 1.5px); done = ran (name steps to secondary); failed and invalid = the danger
      // container (tint fill, danger border); dimmed = off the selection or not yet reachable (64% opacity).
      state: {
        idle: '',
        active: 'shadow-[inset_0_0_0_1.5px_var(--tone-solid),var(--cs-elevation-2)]',
        done: '',
        failed: 'bg-danger-tint shadow-[inset_0_0_0_1px_var(--cs-color-danger-border)] focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border),var(--cs-focus)]',
        invalid: 'bg-danger-tint shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong)] focus-visible:shadow-[inset_0_0_0_1px_var(--cs-color-danger-border-strong),var(--cs-focus)]',
        dimmed: 'opacity-64',
      },
      selected: { true: 'shadow-[inset_0_0_0_1.5px_var(--tone-solid),var(--cs-elevation-1)]', false: '' },
    },
    defaultVariants: { variant: 'outline', state: 'idle', selected: false },
  },
);

export const graphNodeHeadVariants = cva('flex min-w-0 items-center gap-1.5');
export const graphNodeTitleVariants = cva(
  'min-w-0 flex-1 truncate text-ui-sm text-text-primary group-data-[state=done]/node:text-text-secondary group-data-[state=invalid]/node:text-danger-text group-data-[state=failed]/node:text-danger-text',
);
export const graphNodeMetaVariants = cva('flex-none truncate text-ui-xs font-normal text-text-tertiary');

// Icon face (DP-29 in the Xeon app): the tone goes on the small surface around the icon, never on the whole node.
export const graphNodeIconVariants = cva('inline-grid size-5 flex-none place-items-center rounded-sm [&_svg]:size-icon-xs', {
  variants: {
    tone: {
      neutral: 'bg-neutral-track text-text-tertiary',
      accent: 'bg-accent-soft text-accent-text',
      success: 'bg-success-soft text-success-text',
      warning: 'bg-warning-soft text-warning-text',
      danger: 'bg-danger-soft text-danger-text',
      info: 'bg-info-soft text-info-text',
      agent: 'bg-agent-soft text-agent-text',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export const graphPortVariants = cva('relative flex min-h-4.5 min-w-0 items-center gap-1 text-ui-xs font-normal text-text-secondary', {
  variants: {
    // top and bottom ports sit on the node's top or bottom edge (centred) and carry no visible label: give children an
    // sr-only name. The row takes no space in the node.
    side: { start: '', end: 'flex-row-reverse text-end', top: 'absolute inset-x-0 top-0 h-0 min-h-0 overflow-visible', bottom: 'absolute inset-x-0 bottom-0 h-0 min-h-0 overflow-visible' },
    state: { idle: '', connected: '', target: 'text-text-primary', invalid: 'text-danger-text', active: 'text-text-primary', off: 'text-text-tertiary' },
  },
  defaultVariants: { side: 'start', state: 'idle' },
});

// The port dot sits on the node edge: 10px node inset + 4px half dot. Connected = filled border.strong; target = the drop
// target while a wire is drafted (tone ring, grown); invalid = danger; active = tone fill; off = hollow subtle (nothing
// can connect: the provider is missing or the port is optional and unused).
export const graphPortDotVariants = cva('absolute size-2 rounded-full transition-[scale,background-color,box-shadow] duration-quick ease-standard', {
  variants: {
    side: { start: 'top-1/2 -left-3.5 -translate-y-1/2', end: 'top-1/2 -right-3.5 -translate-y-1/2', top: '-top-1 left-1/2 -translate-x-1/2', bottom: '-bottom-1 left-1/2 -translate-x-1/2' },
    state: {
      idle: 'bg-surface-base shadow-[inset_0_0_0_1px_var(--cs-color-border-control)]',
      connected: 'bg-border-strong',
      target: 'scale-150 bg-surface-base shadow-[inset_0_0_0_1.5px_var(--tone-solid),0_0_0_3px_color-mix(in_oklab,var(--tone-solid)_22%,transparent)]',
      invalid: 'bg-danger-solid',
      active: 'bg-(--tone-solid)',
      off: 'bg-transparent shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]',
    },
  },
  defaultVariants: { side: 'start', state: 'idle' },
});

export const nodeGraphToneVariants = cva('', {
  variants: {
    tone: {
      neutral: '[--tone-solid:var(--cs-color-neutral-solid)]',
      accent: '[--tone-solid:var(--cs-color-accent-solid)]',
      success: '[--tone-solid:var(--cs-color-success-solid)]',
      warning: '[--tone-solid:var(--cs-color-warning-solid)]',
      danger: '[--tone-solid:var(--cs-color-danger-solid)]',
      info: '[--tone-solid:var(--cs-color-info-solid)]',
      agent: '[--tone-solid:var(--cs-color-agent-solid)]',
    },
  },
  defaultVariants: { tone: 'accent' },
});
