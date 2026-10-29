# Tokens: styling Caustic code

Load this in step 4 (Build) whenever you write a `className`. The live list of every utility is
`caustic tokens` (and `caustic tokens <group>` for one group: colour, text, space, size, radius, shadow, motion,
material). When this file and the CLI disagree, the CLI wins.

## The rules

1. **Component props first.** `tone`, `variant`, `size`, `radius`, `shadow` (see
   [composition.md](composition.md#the-five-common-props)) cover most emphasis. Reach for classes for layout and for
   your own elements.
2. **Token utilities only.** The Caustic theme replaces Tailwind's default palette and scales. `bg-red-500`, `p-7`,
   `text-gray-600` do not exist and are reported (`token-unknown-class`).
3. **No literals.** No hex, `rgb()`, `oklch()` or px values in classes or `style`. The only literal lengths allowed in
   arbitrary values are the hairlines `0.5px`, `1px`, `1.5px`, `2px`. Arbitrary values may reference a token:
   `w-(--cs-size-color-picker-w)`, `shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]` (`token-literal`).
4. **No `dark:`.** Every colour token already has a light and a dark value; theming is automatic
   (`token-dark-variant`).
5. **No alpha modifiers.** `bg-accent-solid/20` is not a token. Use the tint steps that exist for this: `*-tint`,
   `*-soft`, `*-soft-hover`, `*-border` (for example `bg-accent-soft`, `border-danger-border`).
6. **`style` only for data.** Inline `style` may set CSS custom properties for runtime values (a picked colour, a
   drag offset) that a utility reads: `style={{ '--swatch': color }}` with `bg-(--swatch)`.

## The groups you will use

| Group | Utilities (examples) | Notes |
|---|---|---|
| Ground and surface | `bg-bg-app`, `bg-bg-inset`, `bg-surface-base`, `bg-surface-raised` | the app ground, sunken wells, resting surfaces |
| Text | `text-text-primary`, `text-text-secondary`, `text-text-tertiary`, `text-text-placeholder` | primary for content, secondary for support, tertiary for meta |
| Border | `border-border-subtle`, `border-border-default`, `border-border-strong` | 1px hairlines; one depth cue per surface |
| Semantic | `{bg,text,border}-{accent,neutral,success,warning,danger,info,agent}-{tint,soft,border,solid,text,on}` | `*-on` is the text on a `*-solid` fill |
| Charts | `bg-chart-1` … `bg-chart-6` (also `fill-` / `stroke-`) | series colours for charts you draw yourself |
| Type | `font-ui`, `font-voice`, `font-mono`; `text-ui`, `text-ui-sm`, `text-ui-strong`, `text-body`, `text-title-1`…`4`, `text-display`, `text-mono`, `text-voice` | `text-*` sets size, line height and tracking together |
| Space | `p-*`, `gap-*`, `m-*` on the 4px scale (`1` = 4px; half steps such as `1.5`, `2.5`) | container insets: `px-inset-regular-x` `py-inset-regular-y`, `px-inset-compact-x` `py-inset-compact-y` |
| Size | `h-control-{2xs…xl}`, `h-field-{sm,md,lg}`, `size-icon-{xs…xl}` | match the control scale rather than fixed heights |
| Radius | `rounded-{xs,sm,md,lg,xl,2xl,3xl,4xl,5xl,full}` | inner radius = outer radius − inset; never larger inside smaller |
| Elevation | `shadow-1` … `shadow-5` | floating things only (below) |
| Motion | `duration-{quick,swift,base,gentle,slow}`, `ease-{standard,out,in-out,drawer}`, springs `ease-{snappy,spring,bounce} duration-{snappy,spring,bounce}` | see Motion below |

Three voices: `font-ui` for interface and people, `font-voice` (a serif) for agent prose, `font-mono` for machine
values (token names, numbers in tables, code). Use `tabular-nums` for numbers that line up.

## Materials and their policy

The materials are utilities with a job. Use them where the job is, nowhere else.

- **Floating material** (`glass`, `glass-thin`, `glass-thick`): only on things that float over other content:
  toolbars and floating bars, popovers, menus, toasts, sheets, floating side panels. It is a solid fill plus one
  elevation shadow. A card, list or input that rests on the page is not floating: it gets `bg-surface-base` and a
  1px hairline, no shadow.
- **One depth cue per surface.** A surface has either a hairline or a shadow, never both. Nothing is translucent and
  nothing uses `backdrop-blur`.
- **Agent light** (`agent-rim`, `agent-glow`, `orb`, `shimmer`, `spectrum-fill`, `spectrum-line`, `tone="agent"`,
  `*-agent-*` colours): only where the agent is present, working, or left provenance: its messages, cursor, work
  area, requests and the actions it takes. Never as decoration, a brand gradient, or a "make it pop" accent.
- **One accent action per region.** Primary buttons are ink (the default `Button`, neutral solid). The accent fill
  (`tone="accent"`) is for selection, focus, links, toggles and at most one confirming action in a region. Secondary
  actions use `variant="outline"`, quiet ones `variant="ghost"`. A destructive confirm is `tone="danger"`.
- **Status colours mean status.** Success, warning, danger and info are for state, never to colour-code categories
  for looks. For categories, use `chart-*` or identity colours on data.
- **Focus is built in.** Components draw their own focus. For a custom focusable element use `focus-ring` (buttons
  and controls) or `focus-field` (a text field box), never both.

## Motion

Durations are named. A number (`duration-200`, `delay-150`) hard-codes a time and is a warning (`token-literal`).

| Token | ms | For |
|---|---|---|
| `duration-instant` | 0 | a state that must change at once, inside the same transition list |
| `duration-quick` | 100 | press, hover, colour and fill changes |
| `duration-swift` | 150 | popover and tooltip enter, small moves, the default transition |
| `duration-base` | 200 | collapse, indicators, exits of panels |
| `duration-gentle` | 250 | dialog, sheet and toast enter |
| `duration-slow` | 400 | large distances, page-level moves |

- **Curves.** `ease-standard` for colour and size changes that follow state (selection, validation, theme); `ease-out`
  for enter and exit (the default) and for direct pointer feedback (hover, press — what `transition-control` uses); `ease-in-out` for moves on screen; `ease-drawer` for sheets and side panels. No ease-in for UI.
- **Springs move, they do not fade.** Position, size and scale only, never colour or opacity. A spring is a pair that
  always goes together: `ease-snappy duration-snappy` (indicators, thumbs, checks), `ease-spring duration-spring`
  (pop-ins, lifts), `ease-bounce duration-bounce` (agent and celebratory moments).
- **Presets.**
  - `transition-control`: the one transition list for interactive controls (colour, fill, border, shadow, opacity,
    scale, translate at `quick` and `out`). Use it instead of `transition-all` or a hand-written list.
  - `press` (scale 0.97 on `:active`), `press-sm` (0.94, small icon targets), `lift` (2px up on hover).
  - `animate-enter` and `animate-exit`, with `enter-scale` (from 0.96) and `enter-from-side` (reads `data-side`),
    `enter-up`, `enter-from-end`, `enter-from-start`, `enter-from-bottom`. Sheets and side panels:
    `animate-enter-dialog` (dialogs, gentle), `animate-enter-panel` and `animate-exit-panel`.
  - `animate-collapse-open` and `animate-collapse-close` take the height from the Radix variable. `reveal` collapses
    content that stays mounted.
  - `animate-rise` for list and message items, with `stagger` and `--cs-stagger-index` (40 ms per item, at most 8).
  - `animate-pop` for a check or dot: 0.6 to 1 on `snappy`.
- **Do not animate.** Keyboard-only paths, typing, streaming text, drag and canvas direct manipulation, the command
  palette. Reduced motion is global (every animation and transition becomes instant), so no `motion-reduce:` variant
  is needed.
- **Transition what moves.** Use `transition-control` on controls. If you write your own list, name `scale`,
  `translate` or `rotate` next to `transform` (Tailwind 4 writes them as their own properties; `motion-property`).
