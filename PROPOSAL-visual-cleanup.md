# Proposal: visual cleanup (branch design/visual-cleanup)

Status: proposal, nothing merged, specs and baselines untouched. Preview: http://100.115.27.61:5183/ (current docs: http://server.tail7ad0b4.ts.net:5180/).

## Rules this applies
1. One depth cue per surface: resting things get a 1px hairline, floating things get one elevation shadow. Never both.
2. One emphasis per element: accent fill or accent border, not both; no glow on top of a rim.
3. Borders: lighter alphas, 1px for decoration. Focus rings and canvas selection (1.5px) are unchanged.
4. No translucency or backdrop blur anywhere. Names `glass*`, `frost` tokens and utilities: `glass*` kept as aliases, `frost` removed.
5. Dark neutrals about two tones darker.

## Token remaps (packages/tokens/src/tokens.mjs)
| Token | Old | New |
|---|---|---|
| Graphite 800 / 850 / 900 / 950 / 1000 (L) | .32 / .265 / .225 / .18 / .14 | .28 / .195 / .16 / .13 / .10 |
| material.ultrathin..thick (light) | neutral.0 at .3/.48/.66/.84 | neutral.0 |
| material.ultrathin..thick (dark) | neutral.850/900 at .28-.84 | neutral.850 |
| material.rim / edge / specular / sheen | white .62 / n950 .11 / white .95 / white .5 (dark: .09/.55/.17/.1) | zero alpha |
| surface.translucent, raised-translucent | alpha .78 / .7 (dark .72 / .7) | opaque: neutral.0, neutral.25 (dark 900, 850) |
| control.raised / hover | neutral.0 at .8 / .94 (dark 850 .76, 800 .82) | neutral.0 / neutral.25 (dark 850 / 800) |
| ink.solid / ink.hover | alpha .9 (dark .86) | opaque |
| accent.fill / fill-hover | alpha .9 / .9 (dark .9 / .92) | opaque |
| border.subtle / default / strong (light) | n950 .07 / .12 / .20 | .05 / .08 / .13 |
| border.subtle / default / strong (dark) | white .06 / .10 / .17 | .05 / .07 / .12 |
| control.edge | light .10, dark .08 | .07, .06 |
| bg.inset (dark) | black .22 | black .30 |
| accent.glow | .35 (dark .30) | .20 |
| elevation thumb, thumb-sm, thumb-swatch, artboard | hairline ring + shadow | shadow only |
| elevation card | inset highlight + 2 shadows | 2 shadows, lighter |

Dark semantic mapping by name is unchanged (app 950, canvas 1000, base 900, raised 850); the darkening comes from the revalued ramp. Dark L now: canvas .10, app .13, base .16, raised .195.
Not changed: border.control (neutral.400 / 500), because the 3:1 rule (WCAG 1.4.11) needs it.

## Other token-layer changes
- build.mjs: `glass` utility is now fill + one shadow (no blur, no inset specular/rim/edge, no ::before sheen). `frost` utility deleted.
- base.css: `.cs-glass` same; `.cs-solid` uses an inset hairline only.
- policies.ts P1 and FOUNDATION.md policy 1, "Depth and materials", "Frosted controls" reworded. P1 is now "Solid surfaces, one depth cue". [inference] G5 check P1 still exists and passes unchanged; it should be rewritten to forbid backdrop utilities everywhere.

## Component changes (55 files, packages/react)
- Hairline + elevation-1/2 collapsed to hairline: ~75 sites (inputs, fields, buttons secondary/ink, list rows, chips, cards, card-surface, card-well, choice-cards, accordion, token-graph, theme-gallery, file-upload, ...).
- Hairline + elevation-3+ on floating things collapsed to the shadow (popover-like, hover lift on card-action).
- Focus-field + elevation-1 on 13 fields: focus edge only.
- accent-soft fill + accent-border inset ring: border dropped (token-chip, font-options, hex-input, inspector-bindings, motion-timeline).
- stepper current: ring + halo -> ring. Button agent: hover glow removed (spectrum rim stays).
- `frost` class removed from 19 files.
- 1.5px control and danger inset borders -> 1px (about 19); plan todo dashed ring -> 1px.
- Switch thumb: hairline + shadow -> shadow.
- Docs shell: header and mobile drawer lose backdrop-blur; Materials, Introduction pages reworded.
Left alone on purpose: focus rings, canvas selection and handles (1.5px, functional), spinner stroke, agent-rim spectrum ring, dashed outlines (still border-strong, now lighter).

## Contrast (node packages/tokens/src/build.mjs)
150/150 rules pass, 2 themes, accent swept over 24 hues. Dark ratios rose (text.primary on surface.base 16.4 -> 18.6; text.tertiary on surface.raised 4.73 -> 5.66). Tightest rules are unchanged hue-sweep cases (ink.on-muted 4.53 vs 4.5, canvas.selection 3.03 vs 3).

## Needs owner approval
- `pnpm spec:approve` (not run): [fact] 21 specs assert `frost: true`; [inference] most of the 146 specs that mention shadow/edge/material/raised need new expected values, since shadows, edges and fills changed. Baselines (112 dirs) would all change for dark and many for light. Not re-recorded.
- Policy P1 rename and the G5 rule rewrite.
- Light theme side effect: ramp 800-1000 revalue also darkens light `text.primary` (950: .18 -> .13), `ink.solid` (900) and `*.on` colours on warning/accent. Contrast only goes up.

## Open questions
1. Revalue ramp vs add steps below 1000? Recommend revalue (done here) until the step-count evaluation reports; revisit if light text looks too black.
2. Keep `glass*` class names as aliases or rename (e.g. `floating`)? Recommend rename in a follow-up once specs are approved.
3. Zero-alpha rim/edge/specular/sheen and the blur scale: delete or keep? Recommend delete after approval.
4. Dark floating surface = neutral.850 with a near-invisible shadow. Is lightness-only enough for popovers over dark content? Recommend yes; check the Dialog/Popover screenshots.
5. border.control stays dark-ish for 1.4.11; owner may waive to lighten checkbox/radio edges.

---

# Round 2: eleven-step ramps, true-neutral Graphite, wider dark ladder, squircle corners

Status: implemented on this branch, specs and baselines untouched. Screenshots in the session scratchpad (tokens-v2).

## 1. Every ramp has 11 steps named 1 to 11 (1 lightest, 11 darkest)
Hued ramps (Lagoon, Mint, Amber, Coral, Iris) dropped step 25 (L .985, unused anywhere; 50 at .965 already covers "near white"). Everything else renumbered.

| Old hued step | 25 | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| New | dropped | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 |

Hued L / C is unchanged per old step: 1 .965/.024, 2 .93/.045, 3 .88/.075, 4 .815/.105, 5 .735/.13, 6 .635/.142, 7 .525/.135, 8 .465/.118, 9 .385/.095, 10 .30/.07, 11 .23/.05.

Graphite went from 16 steps to 11 and is re-derived, so there is no single old-to-new map. Semantic tokens moved by role:

| New | L (C = 0) | Light theme uses | Dark theme uses |
|---|---|---|---|
| 1 | .995 | surface.base, surface.raised, control.raised, thumb, accent.on, ink.on (was 0, 25) | ink.on, canvas.checker artboard, handle (was 0, 25) |
| 2 | .975 | bg.app, control.raised-hover (was 50, 25) | text.primary (was 25) |
| 3 | .93 | bg.canvas, canvas.checker-b (was 100, 200) | - |
| 4 | .78 | - | text.secondary (was 300) |
| 5 | .66 | text.disabled, border.control, control.off (was 400) | text.tertiary, placeholder, canvas.label (was 400) |
| 6 | .53 | - | text.disabled, border.control, control.off, ink.hover (was 500, 600) |
| 7 | .41 | text.tertiary, placeholder, canvas.label, identity.slate (was 600) | ink.solid, control.raised-hover, checker-b (was 700, 800) |
| 8 | .285 | text.secondary, ink.hover (was 700, 800) | surface.raised, materials, control.raised, checker-a (was 850, 800) |
| 9 | .23 | - | surface.base (was 900) |
| 10 | .175 | ink.solid (was 900) | bg.app, text.inverse (was 950) |
| 11 | .105 | text.primary, borders and fills (alpha), *.on on warning (was 950, 1000) | bg.canvas, *.on on bright fills (was 1000) |

Old Graphite values for reference: 0 .995, 25 .985, 50 .97, 100 .945, 150 .925, 200 .90, 300 .845, 400 .65, 500 .54, 600 .48, 700 .41, 800 .28, 850 .195, 900 .16, 950 .13, 1000 .10. Old steps 150 had no users. Direct refs remapped: `--cs-accent-400/500/600` to `-5/-6/-7`, `--cs-mint-500` to `-6`, `--cs-coral-500` to `-6`, `--cs-neutral-900` to `-10` (fixtures, color-specimen.ts, and the literal names in the swatch-strip and token-graph spec prose).

Why light tertiary moved from L .48 to .41: tertiary text must reach 4.5:1 on a pressed fill over the app, and the same step 6 (.53) had to stay light enough for dark disabled/control edges (3:1). One value could not do both, so light tertiary uses step 7 and light secondary uses step 8.

## 2. Graphite is a true neutral
Chroma is 0 on every step (was .001 to .012 at hue 260). `neutral.hue` is 0 and irrelevant; the "biased toward 260" comment is replaced. Light elevation shadows used `oklch(0.2 0.02 260 / a)`; they are now `oklch(0.2 0 0 / a)`.

## 3. Dark depth ladder and text
| Level | Token | Old L | New L |
|---|---|---|---|
| canvas | bg.canvas | .10 | .105 (step 11) |
| app | bg.app | .13 | .175 (step 10) |
| base / card | surface.base | .16 | .23 (step 9) |
| raised / float | surface.raised, material.*, control.raised | .195 | .285 (step 8) |

Contrast between neighbours (WCAG ratio of the gray fills): canvas to app 1.02 -> 1.08; app to base 1.04 -> 1.12; base to raised 1.06 -> 1.18; canvas to raised 1.13 -> 1.43. Order is strictly canvas < app < base < raised, and floats are lighter than cards.
Dark text.primary is `neutral.2` (.975): 15.7:1 on surface.base (was 18.6), 17.6 on bg.app, 13.4 on surface.raised. Dark text.secondary `neutral.4` and tertiary `neutral.5`.
Dark elevation card, lift, well, artboard (they were copies of the light `oklch(0.2 0.02 260)` values that read as glow) are now `oklch(0 0 0 / a)`: card `0 1px 2px .4, 0 12px 32px -16px .6`, lift `0 14px 30px -14px .7`, well `0 1px 2px .4, 0 6px 18px -10px .55`, artboard `0 6px 20px -8px .5`.
Contrast: 150/150 rules pass, accent swept over 24 hues. Tightest: light text.disabled / border.control / control.off 3.07 (min 3), dark text.tertiary on surface.raised 4.61 (min 4.5).

## 4. Emphasis budget (non-agent parts)
- Docs Introduction principle badges (P1..P9): accent -> neutral.
- Docs Radius tiles: accent soft fill + accent ring -> neutral `fill.selected`. Space scale bars: accent fill -> `border.control`.
- Menu, Select, Combobox selected item: accent.soft band stays, the leading icon is no longer accent text.
- ListSelection checked row: single mode keeps the tick (accent) and the title is neutral; multiple mode keeps the filled checkbox and loses the row band and accent title.
- Specs that assert the old stack (menu icon `accent.text`, list-selection title `accent.text`, multiple-row `accent.soft`) now differ from the code; the specs were not touched (owner decision at `spec:approve`).

## 5. Corner smoothing
- `base.css`: inside `@supports (corner-shape: squircle)`, `[class*="rounded-"]` (excluding `rounded-full` and `rounded-none`) gets `corner-shape: squircle`; `rounded-[inherit]` overlays and the agent rim `::after` inherit the shape.
- Token file: inside the same `@supports`, `--cs-corner-scale: 1.2` and every radius token (xs to 5xl, well-inner, 2xs, plus the four studio radii) becomes `calc(Npx * var(--cs-corner-scale))`. `none` and `full` are untouched. A squircle corner bulges toward the box corner (its diagonal inset is about 46% smaller than a circular arc), so the radii are scaled 1.2x to keep corners from reading smaller.
- Support: Chromium 139+ (checked in the bundled Chromium 153: `CSS.supports('corner-shape','squircle')` and `superellipse(2)` both true). Safari and Firefox do not understand the property, skip the `@supports` block, and keep circular corners at the nominal radius. No per-component edits. Gateway computed-radius checks resolve the radius variables in-page, so they follow the scaled values.
