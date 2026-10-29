# Plan: motion v2 — tokens, presets and their use in every component (internal)

Internal document. Research notes live in `../color-language-work/motion/` (Fleet-UI, design-system tokens, craft
practice, per-component inventories a–l and m–z).

## What the research says (the parts we adopt)

- Productive UI stays under 300 ms; exits are faster than enters; enter/exit use a strong ease-out, on-screen movement
  an ease-in-out, colour an ease. No ease-in for UI (Emil Kowalski, M3, Carbon productive, Fluent, Primer agree on the
  numbers 100/150/200/250).
- Overlays scale in from 0.95–0.97, never from 0, with opacity, from the trigger (`--radix-*-transform-origin`);
  modals scale from the centre; sheets slide in from their edge. Press is `scale(0.97)` (0.94 for small icon targets).
- Springs are configured by stiffness and damping (Fleet-UI, M3 Expressive). M3 splits spatial springs (position,
  size) from effect springs (opacity, colour); we keep that split: springs only move things, colour uses curves.
- Do not animate keyboard-driven, high-frequency moments (command palette, tooltip-to-tooltip, typing, streaming
  tokens, canvas drag). Direct manipulation is immediate.
- Animate `transform`/`opacity` (and `scale`/`translate`, which Tailwind 4 emits as their own properties); never
  `transition: all`. Height uses the Radix measured variable.

## Bugs this fixes

1. `duration-base`, `duration-quick`, `duration-gentle` produce no CSS (23 uses): Tailwind 4 reads
   `--transition-duration-*`, which the theme never defined. G2 missed it because `unknownClasses` matched the bare
   class inside `--cs-duration-base`.
2. `transition-[…,transform,…]` with `scale-*`/`translate-*`: Tailwind 4 writes `scale:`/`translate:`, so press and
   lift jump (button, card, theme-gallery …).
3. Overlays (popover, menu, select, combobox, tooltip, dialog, sheet, pickers) appear and vanish without motion.
4. Toast JS exit (300 ms) is shorter than its CSS exit (320 ms).

## Tokens (packages/tokens/src/tokens.mjs `motion`)

| group | values |
|---|---|
| duration | instant 0 · quick 100 (press, hover, colour) · swift 150 (popover/tooltip enter, small moves) · base 200 (collapse, indicators, exits of panels) · gentle 250 (dialog, sheet, toast enter) · slow 400 (large distance, page-level) · loops unchanged (spin, indeterminate, orb, shimmer, slide, scan, agent) |
| easing (curves) | standard (0.2,0,0,1) colour/size · out (0.23,1,0.32,1) enter and exit · in-out (0.77,0,0.175,1) on-screen moves · drawer (0.32,0.72,0,1) sheets · in (0.4,0,1,1) kept for compatibility · linear |
| spring (stiffness, damping ratio; mass 1) | snappy k 700 ζ 0.9 (indicators, thumbs, checks) · spring k 380 ζ 0.8 (pop-ins, lifts) · bounce k 300 ζ 0.55 (agent and celebratory moments) |
| scale | press 0.97 · press-sm 0.94 · enter 0.96 |
| shift | enter 4 px · lift 2 px |
| stagger | 40 ms per item, capped at 8 items |

The build turns each spring into a CSS `linear()` curve and its settle time (to 0.5 %), emitted as `--cs-ease-<name>`
and `--cs-duration-<name>`, so `ease-spring duration-spring` always pair.

## CSS surface (packages/tokens/src/build.mjs → theme + utilities)

- Theme keys: `--transition-duration-<name>` for every non-loop duration and spring; `--ease-<name>` for every curve and
  spring; `--default-transition-duration: swift`, `--default-transition-timing-function: out`.
- `transition-control`: colour, background, border, outline, box-shadow, opacity, scale, translate at `quick`/`out`
  — the one transition list for interactive controls.
- `press`, `press-sm`: `scale` on `:active` when enabled. `lift`: `translate` up on hover. All three only under
  `prefers-reduced-motion: no-preference`.
- Keyframe animations (theme `--animate-*`): `enter`/`exit` (opacity + `--cs-enter-x/y/scale`), `enter-panel`/
  `exit-panel` (gentle/base, drawer curve), `collapse-open`/`collapse-close` (height from `--cs-collapse-height`),
  `rise` (list or message item: 4 px up + fade, delayed by `--cs-stagger-index`), `pop` (a check or dot: 0.6 → 1 on
  snappy).
- Modifiers that set the enter variables: `enter-scale`, `enter-from-side` (reads Radix `data-side`), `enter-up`,
  `enter-from-end`, `enter-from-start`, `enter-from-bottom`.
- Exits use `data-[state=closed]:animate-exit`; Radix Presence waits for `animationend`.
- Reduced motion: the existing global rule stays (every animation and transition instant), so none of the new
  utilities need their own `motion-reduce:` variants.

## Gate and CLI

- G2 `unknownClasses`: the bare class must match as a selector, not inside a variable name.
- G2 `motion-token`: numeric `duration-<n>`/`delay-<n>` fail; use the named tokens.
- G2 `motion-property` (new): a class list that changes `scale`/`translate`/`rotate` and lists `transform` in an
  arbitrary `transition-[…]` without the individual property fails.
- G5 P8 unchanged (reduced motion keeps nothing running).
- `caustic check` `token-literal`: numeric durations and delays warn with the named token to use.
- Skill `reference/tokens.md`: motion section (which token for which moment, the do-not-animate list).
- Docs foundation Motion page: new scale, curves, springs and presets.

## Component work (Haiku implementers, lead reviews)

Foundation first (one implementer, reviewed and committed), then five batches in parallel on disjoint folders. No
batch runs the gate; the lead runs typecheck, `tokens:check`, `catalog`, and the gate on every touched id.

| batch | components |
|---|---|
| overlays | popover, menu, select, combobox, date-picker, color-picker, picker-trigger, tooltip, dialog, sheet, toast, calendar (month picker), image-fill (crop popover), hover-card users |
| disclosure + indicators | accordion, thinking, tool-call, agent-request, expression-editor, layer-tree, list-navigation, activity-tree, segmented-control, tabs, toggle-group, radio-group, switch, stepper, progress, slider |
| controls | button, icon-button, button-group, chip, checkbox, choice-group, card, card-stat, theme-gallery, input, textarea, number-field, tag-input, otp-input, pagination, breadcrumb, composer, kbd |
| agent + canvas + lists | message, suggestions, plan, timeline, agent-cursor, agent-work-area, canvas-*, frame-label, floating-bar, zoom-control, list, reading-order, stack-row, file-upload, grid-tracks, skeleton, empty-state, alert |
| everything else | the remaining folders: replace numeric durations, fix transition lists, adopt `transition-control`/`press` where they press |

Rules for every batch: tokens only (no ms, no cubic-bezier literals); colour uses curves, movement uses springs or
`out`/`in-out`; no motion on keyboard-only paths, typing, streaming, drag, or canvas direct manipulation; never
`transition-all`; every change keeps the rest state pixel-identical (baselines must not move).
