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
| Motion | `duration-{quick,base,gentle,slow}`, `ease-{standard,out,in,spring}` | feedback fast and eased out; movement springs |

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
