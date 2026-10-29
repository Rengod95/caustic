# Caustic foundation 1.0

Caustic is the design-system foundation for an agent-first design studio. Its look comes from three sources:

- **Codex and Claude Code desktop:** calm neutral chrome, 13px interface text, ink primary buttons.
- **iOS Liquid Glass:** floating translucent layers with a specular rim, and concentric corners.
- **Caustic's own addition:** a spectrum of light reserved for the agent, mixed from three hues only: Lagoon (the live accent), Mint and Amber.

This document is the policy. `foundation/tokens.mjs` holds the values, and `dist/` holds the generated output.

## Files

| Path | Role |
|---|---|
| `foundation/tokens.mjs` | Single source of truth: primitives, semantic themes, scales and contrast rules |
| `foundation/base.css` | Hand-written base layer: reset, type roles, materials, agent signature, domain utilities |
| `foundation/build.mjs` | Validates contrast, then writes `dist/` |
| `dist/caustic.css` | Tokens plus the base layer. **The one file apps import.** |
| `dist/caustic.tokens.css` | Variables only |
| `dist/tokens.core.json`, `tokens.light.json`, `tokens.dark.json` | DTCG primitives, plus one semantic set per theme |
| `dist/tokens.mjs`, `tokens.js` | Resolved source for tooling and docs |
| `dist/contrast.json` | Contrast report: every rule × theme, with the worst accent hue |
| `preview/docs.registry.mjs` | Docs site map: pages, examples, usage notes and tokens |
| `docs/*.html` | Generated docs site (`npm run docs`); examples come from `preview/src/*.html` |

```sh
npm run build    # validate, then write dist/
npm run check    # validate only; exits 1 on any contrast failure
```

Never edit `dist/` by hand.

## Layers

1. **Primitive.** Raw OKLCH values and dimension scales: `--cs-accent-7`, `--cs-radius-3xl`. Components never read them directly.
2. **Semantic.** Role names, defined per theme: `--cs-color-accent-solid`, `--cs-color-text-tertiary`. This is the only color layer components read.
3. **Component and studio.** Composes semantic tokens and owns layout and state, never color decisions. Studio shell metrics live in `--cs-studio-*`.

Naming:
- Every variable is `--cs-<category>-<name>`. Semantic colors are `--cs-color-<group>-<role>`.
- Versions live in `meta.version`, never in names.

## Color

**Ramps**
- One neutral ramp (Graphite, 11 steps named 1 to 11, 1 = lightest, 11 = darkest). It is a true neutral gray (chroma 0), in both themes.
- Five hued ramps with 11 steps each, named 1 to 11 (1 = lightest, 11 = darkest): Lagoon (accent), Mint (success), Amber (warning), Coral (danger), Iris (info).
- All hued ramps share one lightness/chroma profile; only the hue changes. A given step therefore has nearly the same contrast in every hue.

**Gamut.** Out-of-sRGB values are mapped the CSS Color 4 way: lightness is kept and chroma is reduced. The validator uses the same mapping.

**Live accent**
- `--cs-accent-hue` re-hues the accent ramp and every semantic token built on it.
- Every contrast rule that involves the accent is verified at 24 hues (0°–345° in 15° steps).
- Set the hue on `:root` only. Semantic tokens resolve at the root, so a per-subtree override does not reach them.

**Semantic groups**
- `bg`, `surface`, `material`, `text`, `border`, `fill`, `control`, `ink`, `accent`
- `success`, `warning`, `danger`, `info`
- `diff`, `focus`, `canvas`, `agent`

**Status solids** pair with an `*.on` token for whatever sits on them. Warning uses dark text in both themes.

**Agent spectrum:** three stops, Lagoon (follows `--cs-accent-hue`), Mint 158° and Amber 80°, looping back to Lagoon. The stops are `--cs-spectrum-1..3`, combined in `--cs-spectrum-conic` and `--cs-spectrum-linear`. No other hues may enter it.

**Canvas tokens**
- One selection color has to work on both the dark canvas and white artboards. That is why dark mode uses `accent.500`, not `400`.
- Smart guides and measurements use `canvas.guide` (Coral).
- User guides use Iris.

## Contrast policy (build gate)

| Pairing | Minimum |
|---|---|
| Body text (`text.primary`) on any surface | 7 : 1 (AAA) |
| Secondary, tertiary and placeholder text | 4.5 : 1 |
| Disabled text | 3 : 1 |
| Control boundaries (checkbox, radio, switch off-track), focus ring, canvas selection, guides | 3 : 1 (WCAG 1.4.11, 2.4.11) |
| Labels on accent, status and guide fills | 4.5 : 1 |

- Alpha tokens are composited over their real background before measuring.
- Text on floating surfaces is measured on the solid fill.
- **Adding a new pairing to the UI means adding a rule to `contrastRules`.** Currently 84/84 rules pass.

## Typography

**Families**
- Geist for the interface and human input; Hangul falls to SUIT Variable (owner decision O3; self-hosted since 2026-10-29), then Apple SD Gothic Neo, Malgun Gothic.
- Newsreader (Korean fallback: Noto Serif KR) for agent prose; its italic for agent reasoning.
- Geist Mono for tool names, token names, numbers and diffs.
- Apps load the fonts once: `import "@caustic/tokens/fonts.css"` before any other stylesheet. It imports Geist, Geist Mono, Newsreader and Noto Serif KR from Google Fonts and declares the self-hosted SUIT Variable (`packages/tokens/fonts/suit`, SUIT v2.0.5, SIL OFL 1.1, 625 KB woff2, weights 100–900) with a Hangul-only unicode-range and `font-display: swap`. Bundlers resolve its relative `url()`. Without it Hangul falls to a system face; on Linux and Windows that face has only Regular and Bold, so 500 renders as 400 and 600 as 700.

**Roles**
- 15 roles: display, title-1/2/3, body, ui, ui-strong, footnote, label, caption, voice, voice-sm, thought, mono, mono-sm.
- Each role is `--cs-text-<role>` (a `font` shorthand) plus `--cs-text-<role>-tracking`. The `.cs-<role>` classes apply both.
- The default interface size is 13/18.

**Korean** (DP-11, 2026-10-29)
- `word-break: keep-all`.
- Tracking follows the language, not the class. Under `[lang|="ko"]` every ui and voice role takes the Hangul step for its size (tokens.mjs `hangul`): ≥ 30px −0.02em, ≥ 18px −0.015em, ≥ 13.5px −0.01em, ≥ 12.5px −0.005em, smaller 0 (tuned for SUIT, which is spaced tighter than Noto or Source Han). `caption` is 0 (no uppercase spread); mono roles keep their grid.
- The lang block re-points both `--cs-text-<role>-tracking` and the Tailwind `--text-<role>--letter-spacing`, so `.cs-<role>` classes and `text-<role>` utilities both follow it. Any other `[lang]` subtree (an `en` island in a Korean page) gets the Latin values back. Pages without a `lang` attribute stay Latin.
- Geist's tracking is tuned for Latin; Hangul at the Latin values (−0.003em at 13px) reads loose.
- Weight: SUIT 400 and 500 match Geist. SUIT 600 reads lighter than Geist 600 at heading sizes, so under ko the 600 ui roles of 18px and up (display, title-1, title-2, title-feature, title-overlay, stat, sample, figure) render at 700. The same lang block re-declares their `--cs-text-<role>` shorthand and `--text-<role>--font-weight`.

**Text inks**
- primary, secondary, tertiary, placeholder = neutral 11, 10, 9, 8. On surface.base: light 20 : 11.6 : 7.7 : 5.9, dark 16.7 : 8.8 : 6.5 : 5.2. Tertiary and placeholder sit on the 4.5 floor (pressed fills, wells), so the room for contrast between steps is in primary → secondary → tertiary.

**Floor:** functional text is never below 11px. Canvas ruler numerals are the only exception, by design-tool convention.

## Space, radius, size

**Space:** a 4pt grid with half steps (2, 6, 10) for chips and insets. `--cs-space-<n>`, where n × 4 = px.

**Radius:** xs 4, sm 6, md 8, lg 10, xl 12, 2xl 16, 3xl 22, 4xl 28, 5xl 32, full.

**Concentric rule:** inner radius = outer radius − padding, snapped to the scale. The studio chain:

| Layer | Radius | Inset to the next layer |
|---|---|---|
| Window | 32 | 10 |
| Panel | 22 | 6 |
| Composer, menu | 16 | 6 |
| Item | 10 | — |

**Container inset:** two sizes, `--cs-inset-*` (also `-y` and `-x`).

| Size | Block / inline | Use |
|---|---|---|
| compact | 12 / 12 | Nested lists, plan, tool, approval and binding cards, inline cards inside a card |
| regular | 14 / 15 | Cards, dialogs, panels, popover bodies (the default) |

14 / 15 is off the 4pt grid on purpose: the block inset reads optically even with the inline inset around 13/18 text.

**Controls:** 2xs 20, xs 24, sm 28, md 32 (default), lg 40, xl 48.
- `data-density="compact"` lowers only the control heights, by one step. Space is unchanged.
- Pointer targets are ≥ 24 × 24.

**Fields:** `--cs-field-sm` 36, `--cs-field-md` 40 (default), `--cs-field-lg` 44. Compact density lowers each by 4.

**Component metrics**

| Part | Value |
|---|---|
| Inspector controls (number, hex, select, segmented units, wells) | 32 (`--cs-control-md`) |
| Form fields | 36 · 40 · 44 (`--cs-field-*`) |
| Segmented container | 4px padding; container radius 12, segment radius 8 |
| Toolbars (capsule, zoom, context bar) | radius 14, items 10 (`--cs-studio-toolbar-radius`, `-item-radius`); never a full pill |
| Toast | min height 60, radius 22 (`--cs-studio-toast-radius`), solid `material.regular`, one elevation shadow |
| Tool call header | 40 |
| Switch | iOS proportions: 46 × 28, thumb 24; stretches while pressed. Small 38 × 23 |
| Checkbox, radio | 18 |
| List row, accordion header, table row | 48 (table header 38) |

**Solid controls:** buttons, tooltips, list containers and rows, fields and chips use opaque fills (`control.raised`, `ink.solid`, `surface.translucent` are now solid; the names are kept). No backdrop blur.

**Field radius:** one step above the control scale. Fields 12 (sm 10, lg 16), inspector fields 10.

**Card spacing:** a card section carries only inline padding. The first and last section take the outer inset (14), each following section adds one 10px gap, and a divided footer has 12 above and below. Header, body and footer never double a gap.

**Icons:** Lucide at 12, 14, 16 (default), 20 and 24px, stroke 1.75.

## Depth and materials

**Elevation:** levels 1–5. Each pairs a short contact shadow with a long diffuse one, defined per theme. Dark mode uses deeper shadows; its floating surfaces are one step lighter than the base surface. A surface carries a hairline or a shadow, never both.

**Floating recipe (`.cs-glass`, alias kept):**
- solid `material.*` fill;
- one elevation shadow;
- no backdrop blur, no specular highlight, no rim, no edge, no sheen.

**Materials:**
- ultrathin, thin, regular, thick: all solid and equal (`neutral.1` light, `neutral.8` dark); kept as names for spec compatibility
- rim, edge, specular, sheen: zero alpha

**Fallbacks:** none needed; nothing is translucent.
## Motion

**Durations:** quick 120, base 200, gentle 320, slow 480, shimmer 2200, agent 4800 (ms).

**Easings:** standard, out, in, spring (`linear()`), linear.

**Usage:**
- Feedback (hover, press) uses quick with ease-out.
- Position changes (toggles, sheets, toasts) use the spring.
- Only agent signatures loop continuously.
- `prefers-reduced-motion` stops every loop and transition.

## Layering, breakpoints, shell

**z-index:** canvas 0, canvas-overlay 10, chrome 20, sticky 30, popover 40, dialog 60, toast 80, tooltip 90, palette 100.

**Breakpoints:**
- compact 720: the agent pane becomes a full-screen sheet.
- medium 1100: the inspector becomes a sheet.
- wide 1440.

**Shell:** titlebar 44, rail 48, agent pane 352 (320–480), inspector 272 (240–360), toolbar 42.

## Policies

1. **Solid surfaces, one depth cue.** (replaces "Glass only for what floats")
   - Floating (rail, panels, toolbars, popovers, toasts, cursor tags): solid fill plus one elevation shadow.
   - Resting (lists, inputs, cards): solid fill plus a 1px hairline, no shadow.
   - No `backdrop-filter`, no translucent fills, no border plus shadow, no accent fill plus accent border.
2. **Light means agent.**
   - The spectrum (`.cs-agent` rim, `.cs-orb`, `.cs-shimmer`, agent cursor) appears only where the agent is present, working, or left provenance.
   - It is never decoration.
3. **Ink first, accent once.**
   - Primary actions use ink.
   - Buttons are flat, the iOS way: a solid fill and a 1px `control.edge` hairline, no shadow. No sheen, no specular top edge, no bevel.
   - Ink is near-black in light mode and a lifted graphite (`neutral.7`) in dark mode, never white.
   - Secondary buttons, segmented thumbs and the current nav item use `control.raised`, one step lighter than the surface (white in light mode, `neutral.8` in dark).
   - Selected indicators that are not buttons (step dots, slider fills, pucks) use `text.primary`, not ink.
   - The accent is for selection, focus, links, toggles and at most one confirming action per view.
   - Status colors only mean status.
4. **Two voices.** Sans for the interface and people, serif for the agent, mono for machine values.
5. **Concentric corners.** Never put a larger radius inside a smaller one.
6. **Contrast is a build gate.** No component ships with a literal color. Content colors (picked paints, artboards, user identity colors) are data, not UI.
7. **Human vs agent on canvas.**
   - Human: accent outline, square handles, size label.
   - Agent: spectrum rim with a scan band, plus an agent cursor with a task tag.
8. **Motion has a job.** Feedback is fast, movement springs, and loops belong to the agent.
9. **A field owns its focus.**
   - A focused text field (input, textarea, number, hex, search, composer) shows `--cs-focus-field` on its box: its resting 1px `border.default` hairline (owner 2026-10-28: no black 1.5px edge). The cue is the fill: a white field turns `neutral.well`, a field that rests on a grey fill turns `surface.base`. Design over contrast: the fill step is about 1.1:1, a waived 2.4.11 warning.
   - The inner control draws nothing, and no outer ring or halo is added. One edge, never three.
   - Invalid fields keep a danger border while focused.
   - Buttons and other non-field controls keep the 2px outer `--cs-focus` ring, shown on keyboard focus only.

## Accepted exceptions

These are deliberate. Do not "fix" them.

- **`.cs-shimmer` uses gradient-clipped text.** It is the in-progress signature of the agent. It falls back to solid tertiary text and stops under reduced motion.
- **The agent voice is set in a serif italic.** This includes the italic accent in the overview heading.
- **Specimen pages nest cards inside cards.** This is for presentation only and is not a product pattern.

## Browser baseline

The baseline is OKLCH, `@property`, `color-mix()`, `linear()` easing and `backdrop-filter`: Chrome/Edge 113+, Safari 17+, Firefox 128+.

## Not in scope for 1.0

- **Component APIs:** the preview's component CSS is visual reference, not a packaged component library.
- **A token for user identity colors:** presence avatars and cursors.
- **A high-contrast theme.** The validator already supports adding a third theme to `themes`.
