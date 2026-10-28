# Plan: agent catalog, `caustic` CLI and skill (internal)

Internal document. Agents that consume Caustic never read this; they read `skills/caustic/` and the CLI output.

## Goal

An agent that builds UI or design mockups with Caustic can:

1. see the whole component set at once (a tree by category and role, one line each), so nothing is invisible;
2. route a need to a few fitting components, with soft alternatives rather than hard "only when" rules, so applied
   design can still stretch a component past its first role;
3. expand context step by step (one line → API → full detail with example code) only for the components it picked;
4. check the code it wrote against the tokens and the component specs with one static command.

## Layers

| Layer | Who reads it | Where |
|---|---|---|
| Agent-facing (shipped) | consumer agents and people | `skills/caustic/` (SKILL.md + references), `caustic` CLI output, `packages/catalog/dist/` (catalog.json, llms.txt) |
| Authoring source | us | `packages/catalog/src/` (schema, roles, entries, recipes), specs |
| Internal | us | root `*.md` (this plan, CONTRIBUTING, FOUNDATION, PLAN*), spec `usage` notes, gateway, audit folders |

Rule: nothing generated for agents copies spec `usage` (it mixes internal history with guidance). Consumer guidance
lives in catalog entries.

## What is authored vs. derived

Derived from code at build time, never written by hand: name, import path, exported parts, props (type, default,
required, description), variants, sizes, slots and their parents, events, keyboard, a11y label requirement,
composition.uses, flags (agent, floating), example ids and their JSX source from fixtures, token names.

Authored per component (`packages/catalog/src/entries/<id>.ts`), short and only what code cannot say:

- `intent`: one consumer-facing sentence.
- `roles`: 1–2 primary roles from the taxonomy (`roles.ts`).
- `alsoFits`: roles it can serve in applied design (soft).
- `placement`: where it usually sits (app-shell regions, canvas, inline …).
- `consider`: `{ id, when }` pointers to a sibling that fits a nearby need better ("also consider", never "do not use").
- `pairs`: components it is commonly placed with.
- `guidance`: at most 3 short consumer notes that are not visible in the props.
- `detail`: optional longer markdown, shown only at `--depth full`.

## Deliverables

1. `@caustic/catalog`: schema, role and placement taxonomy, 116 entries, recipes, generator
   (`pnpm catalog`, `pnpm catalog:check` fails when dist is stale or an entry is missing/invalid).
2. `@caustic/cli` (`caustic`):
   - `list [--tree] [--role] [--category] [--placement]`: the whole registry, one line each.
   - `find "<need>"`: weighted search over intent, roles, alsoFits, keywords and names; ranked fits plus "also consider".
   - `show <id…> [--depth brief|api|full]`: progressive detail.
   - `roles [role]`, `recipes [id]`, `tokens [group]`.
   - `check <files…> [--rules] [--json]`: static analysis (below).
   - Every command has `--json`.
3. `skills/caustic/`: SKILL.md (workflow + command map, short) and references loaded on demand (routing, composition,
   tokens, check rules, recipes). Commands borrowed where they fit from the impeccable skill.
4. Docs site "For agents" page; README for the CLI.

## `caustic check` rules (minimal; each has an id, a severity and a fix hint)

| id | what |
|---|---|
| `token-unknown-class` | a className utility that the Caustic theme does not produce |
| `token-literal` | literal colour or length in className arbitrary values or style (hairlines allowed; custom properties allowed) |
| `token-dark-variant` | `dark:` (theming is automatic) |
| `component-unknown` | an import from `@caustic/react` that is not exported |
| `prop-unknown` | a prop the component does not accept |
| `prop-invalid-value` | a literal value outside the prop's union (variant, size, tone …) |
| `prop-missing-label` | a component whose spec requires a label has no `aria-label`, `aria-labelledby` or `label` |
| `compose-outside-parent` | a compound part rendered outside its parent component |
| `compose-reinvented` | raw HTML that a Caustic component covers (`<button>`, `<input>`, `<select>`, `<dialog>`, `role="tab"` …), with the component to use |

Output contract (after impeccable's `detect`):
- Human output on stderr: `path` header, then `  line N: [rule-id] snippet` and `    → fix`, then `N errors, M warnings`.
  `--json` prints `{ findings: [{ rule, severity, file, line, column, snippet, message, fix, docs }], summary }` on stdout.
  `--github` prints `::error file=…,line=…::[rule] message` annotations.
- Severity: `error` (fails), `warning` (reported, never fails), `advisory` (hidden unless `--advisory`).
- Exit: 0 no errors, 1 errors found (fix the code), 2 the input or catalog could not be read (environment).
- `--list-rules [--json]`; `--rules a,b` to run a subset.
- Suppression: `// caustic-disable-next-line <rule>: reason` (a reason is required) and `.caustic/config.json`
  `{ ignoreRules, ignoreFiles }`.
- Every rule links to its section in `skills/caustic/reference/check.md` (the doc carries `<!-- rule:<id> -->` markers;
  a test ties them together).

`caustic` with no command prints a short status (catalog version, component count, roles) and the next commands to
run, never doing work on its own. The skill keeps SKILL.md thin (workflow, command table, routing rules) and moves
everything else to references loaded on demand, the impeccable layering.

## Work split

- Lead: schema, taxonomy, plan, review of every part, integration.
- Parallel: entries in four batches by category; generator + query commands; `check`; skill + recipes + docs (after
  the impeccable research).
- Not now: MCP server (wraps the same functions later), `just verify` (the owner runs it).
