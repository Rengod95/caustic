# @caustic/cli

`caustic` answers the questions an agent (or a person) has while building UI with Caustic (`@caustic/react`): which
component fits a need, what its API is, which token utilities exist, and whether the code it wrote follows the specs.
It reads the catalog shipped in `@caustic/catalog` (`catalog.json`), so it works offline and never guesses.

## Install

```sh
npm i -D @caustic/cli        # or: pnpm add -D @caustic/cli
npx caustic                   # status and the next commands to run
npx caustic init              # install the agent skill into .claude/skills/caustic
```

Node 20 or newer. `caustic check` reads the theme from your installed `@caustic/react` (an optional peer
dependency); the query commands need only the catalog.

## Commands

Every command takes `--json` (structured output on stdout). Text output is compact: one line per component.

| Command | What it does |
|---|---|
| `caustic` | Catalog status and the next commands to run. |
| `caustic list [--tree] [--role r] [--category c] [--placement p]` | The whole registry, one line each. `--tree` groups by category, then role. `--role` also takes a family (`--role choice`); components that only *also fit* the role are marked `~`. |
| `caustic find "<need>" [--role r] [--placement p] [--limit n]` | Routes a need in plain words to ranked components, each with its roles, plus an "also consider" list. Role words are understood ("pick one" → `choice.single`). `--role` and `--placement` raise matching components; nothing is hidden because its role differs. |
| `caustic show <id…> [--depth brief\|api\|full]` | Progressive detail. `brief`: intent, roles, placement, import line, parts. `api`: + props, variants, sizes, events, label requirement. `full`: + keyboard, anatomy, example code, uses / used by, pairs, alternatives, guidance. Takes ids (`segmented-control`) or export names (`SegmentedControlItem`). |
| `caustic roles [role]` | The role taxonomy (the job a component does on screen), or one role with its members and the components that also fit it. |
| `caustic recipes [id]` | Screen layouts by region (titlebar, start, stage, end …) with the roles and components that usually fill each region. |
| `caustic tokens [group]` | Token utilities by group: color, size, spacing, radius, shadow, text, font, motion, material. The theme resets every Tailwind namespace, so only these names compile. |
| `caustic check <files…> [--rules a,b] [--github] [--advisory] [--list-rules]` | Static check of the code against the tokens and the component specs. |
| `caustic init [--dir path] [--force]` | Copies the `caustic` skill into the project (default `.claude/skills/caustic`; pass `--dir` for another agent's skill folder). |

Exit codes: `0` ok · `1` bad usage or an unknown id (the closest ids are printed; fix the call or the code) · `2` the
catalog or an input could not be read (an environment problem). `check` exits `1` when it finds errors.

## Example session

```text
$ npx caustic find "a settings form with on/off options" --limit 3
find "a settings form with on/off options" · roles: choice.toggle
 1. checkbox     Checkbox · choice.multi, choice.toggle (+collection.list, property.editor)
      Mark options on or off in a form that is saved, with a mixed state for a partly checked set.
 2. switch       Switch · choice.toggle (+property.editor)
      Turn a setting on or off with an effect that applies at once, with no save step.
 3. form-layout  FormLayout · layout.form, layout.structure (+property.panel)
      Lay out a settings page: a header, titled sections with fields beside them and a save footer.
also consider:
  - choice-group: each option needs a description, a price or a larger target (from checkbox)
  - icon-button: the toggle lives in a toolbar or row as an icon (from switch)
  - dialog: the form is short and part of one focused decision (from form-layout)
  - inspector-panel: the fields edit a selected object beside a canvas (from form-layout)
next: caustic show checkbox switch --depth api

$ npx caustic show switch --depth api
Switch (switch) · form · ready
Turn a setting on or off with an effect that applies at once, with no save step.
roles: choice.toggle · also fits: property.editor
placement: form, inspector, card, overlay, end
import { Switch } from '@caustic/react';
variants (* = default):
  tone: neutral | accent* | success | warning | danger | info | agent
  variant: solid* | soft | outline | ghost
  radius: none | 2xs | xs | sm | md | lg | xl | 2xl | 3xl | 4xl | full*
  shadow: none* | 1 | 2 | 3 | 4 | 5
  size: xs | sm | md* | lg
props:
  checked?: boolean
  defaultChecked?: boolean = false
  disabled?: boolean
events:
  onCheckedChange(boolean): the user toggles it
a11y: needs an accessible name (aria-label, aria-labelledby or label)

$ npx caustic show form-layout --depth full     # example code, guidance and alternatives
$ npx caustic check src/settings.tsx            # after writing the code
```

## For agents

`@caustic/catalog/llms.txt` is a one-screen index (every component, one line, grouped by role) that fits in a prompt.
The `caustic` skill (installed by `caustic init`, shipped in the package under `skills/caustic/`) describes the workflow: route with `find`, expand with `show`, write with the
`tokens`, then `check`.

Set `CAUSTIC_CATALOG=/path/to/catalog.json` to read another catalog build.
