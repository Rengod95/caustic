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
