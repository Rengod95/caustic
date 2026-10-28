---
name: caustic
description: "Use when building or editing UI with the Caustic design system (@caustic/react): app screens, agent sessions, design editors, dashboards, settings, forms, or design mockups. Finds the right Caustic components for each region with the `caustic` CLI, expands their API only as needed, styles with Caustic tokens, and checks the result with `caustic check`. Not for UI that does not use Caustic."
---

Caustic is a React component library and token set for agent-first design tools: calm neutral chrome, one accent,
solid floating layers, and a spectrum of light that only ever means "the agent". This skill gets you from a brief to a
screen built from the right Caustic components, without reading the whole library.

You never need the Caustic source. Everything you need comes from the `caustic` CLI (package `@caustic/cli`; run it as
`npx caustic` when it is not on PATH) and the references next to this file.

## When to use it

- The project depends on `@caustic/react`, or the user asks for a Caustic screen, component or mockup.
- You are about to write JSX that imports from `@caustic/react`, or to review code that does.
- You need to know which Caustic component fits a need ("a mode switch in a toolbar", "an approval from the agent").

## Setup

Run `caustic` once per session. It prints the catalog version, the component count, the roles and the next commands
to run. It never changes anything. If it exits with 2, the catalog could not be read: report that, do not guess the API.

Read a reference only when the step below sends you to it.

## Workflow

1. **Shape.** Decide what the screen is for and split it into regions (titlebar, start panel, stage, end panel,
   overlay, page sections). If the brief is close to a known screen, start from a recipe: `caustic recipes`, then
   `caustic recipes <id>`. Otherwise write the regions yourself, one line each: placement, purpose, roles.
   → [reference/recipes.md](reference/recipes.md)
2. **Route.** For each region, find what fits: `caustic find "<need>"` ranks components for a need in plain words;
   `caustic list --tree` shows the whole set by category and role, one line each, so nothing stays invisible.
   Narrow with `--role`, `--category`, `--placement`. → [reference/routing.md](reference/routing.md)
3. **Expand.** `caustic show <id…> --depth api` for the components you picked: props, variants, parts, events, a11y.
   Use `--depth full` (examples with code, longer notes) only for the ones you will actually build with.
   → [reference/composition.md](reference/composition.md)
4. **Build.** Compose parts inside their parents, pass labels, style with token utilities only.
   → [reference/tokens.md](reference/tokens.md)
5. **Check.** `caustic check <files…>`. Fix every error; read each warning and fix it or say why it stays. Each
   finding names its rule and a fix. → [reference/check.md](reference/check.md)
6. **Critique.** One short pass against the Caustic principles: hierarchy, density, one accent, depth, agent light,
   focus. Fix what it finds, then run `caustic check` again. → [reference/critique.md](reference/critique.md)

Keep the loop small: route and expand only what the current region needs, and check before you critique.

## Commands

| Command | What it gives | Read |
|---|---|---|
| `caustic` | Status: catalog version, component count, roles, next steps | this file |
| `caustic list [--tree] [--role r] [--category c] [--placement p]` | Every component, one line each (id, roles, intent) | [routing](reference/routing.md) |
| `caustic find "<need>"` | Ranked fits for a need, plus "also consider" siblings | [routing](reference/routing.md) |
| `caustic show <id…> [--depth brief\|api\|full]` | Progressive detail: intent → API and parts → examples with code | [composition](reference/composition.md) |
| `caustic roles [role]` | The role taxonomy, or the components that serve one role | [routing](reference/routing.md) |
| `caustic recipes [id]` | Screen recipes: regions, roles and suggested components | [recipes](reference/recipes.md) |
| `caustic tokens [group]` | The token utilities you may use, by group | [tokens](reference/tokens.md) |
| `caustic check <files…> [--json] [--rules a,b]` | Static check of your code against tokens and component APIs | [check](reference/check.md) |

Every command takes `--json` when you want to parse the output. The catalog is also shipped as plain text in
`@caustic/catalog/llms.txt` and as data in `@caustic/catalog/catalog.json`.

## Routing rules

Roles describe fit, not permission.

- **Roles guide.** A role is the job a component does on a screen (`choice.single`, `agent.request`,
  `property.editor`). Route a need to a role first, then pick among that role's components.
- **`consider` is a suggestion.** "Also consider Tabs when the choice swaps a whole panel" means look at Tabs too, not
  that the first component is wrong. Read the `when` and decide.
- **`alsoFits` is real.** A component may serve a role beyond its primary one; a segmented control can be local
  navigation. Applied design may stretch a component into an `alsoFits` role, or past it, when the brief asks for it.
  When you do, say why in one line (in your reply or a code comment).
- **Use the whole tree.** Before you hand-build something, check `caustic list --tree` for a component that already
  does it. Before you settle on the obvious component, check the role's other members. Do not force a component into
  a place just to use more of the library.
- **Composition first.** If a component lists parts, use them; if it is built from other Caustic components, do not
  rebuild those by hand.

## Defaults, not bans

Some layouts are where every generator lands. They are defaults to question, not errors:

- A page made only of `Card` and `Button`. Ask which regions want a `Table`, a `List`, a `SectionHeader` with plain
  content, an `InspectorPanel`, or no container at all.
- A grid of same-size cards with an icon, a heading and a line of text as the page structure.
- A big number with a small label as the hero of every section (`CardStat` belongs where a number really matters).
- A modal for a task that needs neither interruption nor protected focus; prefer inline or a side panel.
- An accent fill on several buttons in one region.

If the brief asks for one of these, build it and keep it. If it does not, pick deliberately.

## Output

When you finish, say which recipe or regions you used, any component you stretched past its role and why, and the
last `caustic check` summary.
