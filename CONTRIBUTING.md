# Contributing to Caustic

This guide is written for agents (and people) adding or fixing components. The design is fixed by three sources, in this order:

1. **Tokens.** `packages/tokens/src/tokens.mjs` is the only place a color, size, radius, shadow, type role or duration is defined.
2. **Specs.** `packages/spec/src/specs/<id>.spec.ts` is the approved contract for a component. Each spec is locked by hash in `locks.json`.
3. **Specimens.** The HTML docs pages in `../caustic-preview` are captured into `baselines/<id>/` and serve as the visual truth.

Implementation follows these sources; it never leads them. The gateway (`pnpm gate`) is how that is enforced.

## Roles

| Role | Can change | Must not change |
|---|---|---|
| Spec author (main session) | specs, `locks.json` (via `pnpm spec:approve`), tokens, baselines, gateway | — |
| Implementer (subagent) | `packages/react/src/components/<id>/*` for the ids it was given | specs, `locks.json`, `gated.json`, tokens, `baselines/`, `packages/gateway/`, other components, generated registries |

If an implementer believes a spec, token or baseline is wrong, it stops and reports the conflict with evidence (spec rule, measured value, specimen). It does not work around the gate.

## Files per component

```
packages/react/src/components/<id>/
  <id>.tsx            component(s); 'use client' first line
  <id>.variants.ts    cva definitions (when the spec has variants or sizes)
  <id>.fixture.tsx    default-exported defineFixture({ id, render, examples, frame? })
  index.ts            public exports: component(s), Props types, *Variants if useful
```

The registries are generated; do not edit them. Run `pnpm registry` after adding a component directory or spec. This regenerates:

- `packages/react/src/index.ts`
- `packages/react/src/fixtures.ts`
- `packages/spec/src/specs/index.ts`

`<id>` is kebab-case. The component name is the PascalCase spec `name`, which must be exported from `index.ts`.

## Writing the component

- **React 19.** `ref` is a regular prop; no `forwardRef`. Extend `ComponentProps<'el'>` (omit conflicting keys) and spread `...props` last onto the root.
- **Slots.** Every spec slot is rendered with `data-slot`. The root carries `data-slot="<id>"`, and other slots carry `data-slot="<id>-<slot>"`. Expose variant state as `data-*` attributes where the spec names them, for example `data-tone` or `data-state`.
- **Styling:**
  - Use Tailwind classes in cva only, and merge them with `cn()` from `lib/cn.ts`.
  - Write class strings as static literals. G2 rejects template-built class names.
  - Use token utilities only, for example `bg-surface-base`, `h-control-md`, `rounded-xl`, `text-ui-dense`, `shadow-1`, `duration-fast`.
  - The theme resets every Tailwind namespace, so `bg-red-500` or `p-7` does not compile. G2 flags them.
  - Arbitrary values may reference `var(--cs-*)`. The only literal lengths allowed are the hairlines 0.5px, 1px, 1.5px and 2px. Never use a literal color, `!important`, inline styles or CSS files.
  - Box dimensions (padding, margin, gap, width, height, min/max) must be a scale step or a named size token. A `calc(var(--spacing)*N)` box dimension is rejected; positions (top/left/translate) may derive from it. If no token fits, report a token request instead of working around it.
  - Inline `style` may only set CSS custom properties (runtime data such as a swatch color or a drag offset), read back by a utility like `bg-(--swatch)`.
  - Theming is automatic through the semantic tokens. Never use the `dark:` variant.
  - Alpha modifiers (`/50`) are not allowed; use the alpha tokens instead.
- **Materials:** use `glass`, `glass-thin`, `glass-thick`, `frost`, `agent-rim`, `agent-glow`, `orb`, `shimmer`, `spectrum-*`, `focus-ring` and `focus-field` as utilities. Their use is constrained by the policies below.
- **Behavior:**
  - Use `useControllableState` for value, open and checked props: `value` / `defaultValue` / `onValueChange`, and the same pattern for `open` and `checked`.
  - Radix is allowed only for what the spec lists in `composition.radix`.
  - Icons come from `lucide-react`.
  - The only runtime dependencies are `@radix-ui/react-*`, `class-variance-authority`, `tailwind-merge` and `lucide-react`.
- **Imports:** a component may import from `lib/`, `hooks/`, its own directory, and the directories of components listed in `composition.uses`. Nothing else.
- **SSR:** do not touch `window` or `document` during render.

## Policies (checked by G5)

| | Rule |
|---|---|
| P1 | Glass only on things that float (spec `flags.floating`). Inline surfaces are opaque. |
| P2 | Spectrum light (`agent-rim`, `orb`, `shimmer`, `spectrum-*`) means the agent. Use it only where `flags.agent` allows. |
| P3 | Buttons are flat: no gradients, sheen or bevel. At most one accent fill per view. |
| P4 | Two voices: `font-ui` for interface, `font-mono` for machine output. |
| P5 | Concentric corners: inner radius = outer radius − inset. |
| P6 | Every text/background pair passes the contrast gate. |
| P7 | Human and agent are distinguishable on canvas. |
| P8 | Motion has a job; looping motion only with `flags.motionLoop`. |
| P9 | A field owns its focus (`focus-field` on the field box, not a ring on the inner input). |

## Compound components

A spec describes the whole component, including its parts. Props of a part (`ListNavigationItem`, `CardTitle`) belong on that part: G2 accepts a spec prop on the root or on any export named `<Root>*`. Never declare part props on the root to satisfy the gate.

## Fixtures

`render(props)` renders one instance. The gateway renders it for every combination of variant, size and state, and for the behavior scenarios. Pass `props` through. The harness injects event handlers to record calls.

`examples[exampleId]` must reproduce the matching specimen section (`examples[].doc` in the spec) with the same content, order and layout. G4 compares it pixel by pixel against `baselines/<id>/<example>-{light,dark}.png` at the recorded width. The tolerance is 2% of pixels, and any difference in rendered size is blocking.

Use `frame` only when a case needs a container, such as a fixed-width column.

## The gate loop

```sh
pnpm gate <id>            # all gates for one component
pnpm gate <id> --only=G2  # one gate while iterating (the final run must be complete)
pnpm typecheck
```

On failure the gate writes `packages/gateway/reports/<id>/REWRITE_REQUEST.md`. That file lists every blocking finding: where it is, what was expected, what was measured, and a suggested fix. G4 failures also produce actual and diff images.

The loop:

1. Read the whole request.
2. Fix the implementation.
3. Run the gate again.

The attempt counter allows **5 attempts** per spec version (a re-approved spec starts a fresh count). After that, stop and report what remains, with the request file.

`pnpm gate:status` lists every component as gated, stale (gated against an older spec), pending or unapproved.

| Gate | Checks |
|---|---|
| G0 | Foundation: the token build and the contrast sweep are current. |
| G1 | The spec is valid and approved (its hash matches `locks.json`), and its fixture, examples and baselines exist. |
| G2 | Static analysis: classes, tokens, cva against the spec's variants and sizes, props against the spec's props, `data-slot`, imports. |
| G3 | Rendered in Chromium: anatomy, computed-style token probes per slot and state (including forced `:hover` and `:focus-visible`), axe, and behavior scenarios. |
| G4 | Visual parity with the specimen in light and dark. |
| G5 | Policies P1–P9. |
| G6 | Packaging: dependencies, public export, fixture registration, server render. |

A full pass records the component in `packages/spec/gated.json`. Never edit that file by hand.

## Spec authoring (main session only)

1. Draft `<id>.spec.ts` from the specimen page, using `defineSpec`. State names are free kebab-case; a state whose pseudo-classes belong on a part needs `target`, and a rule on a slot that only some variants render needs `when` (G1 rejects a focus ring measured away from the focused slot). Cover slots, variants and sizes with defaults, states, props, events, style rules (`slot` / `when` / `expect` in token names), behavior scenarios, a11y, policies, flags, composition, examples and usage.
2. Run `pnpm baseline <id>` to capture the specimen sections that the examples point to.
3. Review, then run `pnpm spec:approve <id>`. Any later edit to the spec invalidates its lock until it is re-approved.
4. Run `pnpm registry`, then hand the id to an implementer.

After changing the gateway, run `pnpm gate:selftest`. It applies known-bad mutations to Button and fails if any one slips through.
