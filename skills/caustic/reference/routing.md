# Routing: from a need to a component

Load this in step 2 (Route) of the workflow, or whenever you are unsure which Caustic component fits.

Routing goes need → role → candidates → choice. A role narrows the field; you still choose.

## The role taxonomy

A role is the job a component does on a screen, not its ARIA role. Roles are broad on purpose. The live list, with
the components that serve each role, is `caustic roles` (and `caustic roles <role>` for one). The table below is a
snapshot for orientation; when it disagrees with the CLI, the CLI wins.

| Role | Job |
|---|---|
| `action.primary` | The main thing to do in a region: submit, run, create, apply. |
| `action.secondary` | Other commands next to the main one, or quiet commands in rows and toolbars. |
| `action.icon` | A command shown as an icon only, in toolbars, rows and panel headers. |
| `action.group` | A set of related commands kept together (toolbars, split and attached buttons). |
| `choice.single` | Pick exactly one of a few options. |
| `choice.multi` | Pick any number of options. |
| `choice.toggle` | Turn one setting on or off. |
| `input.text` | Enter or edit free text. |
| `input.number` | Enter or scrub a number, a dimension or an angle. |
| `input.pick` | Choose a value from a list or menu that is not all visible at once. |
| `input.date` | Choose a date or a range. |
| `input.color` | Choose or edit a colour, a gradient or a paint. |
| `input.file` | Add files or images. |
| `display.status` | Show a short state, label, count or tag. |
| `display.identity` | Show who: a person, an agent, a team. |
| `display.metric` | Show a number that matters, with its trend or context. |
| `display.data` | Show structured data: tables, token values, graphs, diffs. |
| `display.code` | Show code, a code change or a generated result. |
| `display.token` | Show a design token: its value, alias chain, swatch or dependency graph. |
| `display.change` | Show what changed: diffs, before and after, revisions and checkpoints. |
| `feedback.inline` | A message about the current context that stays on the page. |
| `feedback.transient` | A short confirmation or error that comes and goes. |
| `feedback.progress` | Show that something is loading, running or partly done. |
| `feedback.empty` | What a region shows when it has nothing yet, with the way forward. |
| `feedback.findings` | Results of a check (contrast, policy, lint) with their severity and the fix. |
| `navigation.global` | Move between the main areas of the app; the app frame and its bars. |
| `navigation.local` | Move between views, pages or sections inside one area. |
| `navigation.steps` | Show and move through the steps of a sequence. |
| `overlay.modal` | Take over the screen for a focused task or a decision. |
| `overlay.anchored` | Interactive surfaces that open next to a trigger: menus, popovers, pickers. |
| `overlay.hint` | Read-only help that appears next to a trigger: tooltips and hints. |
| `layout.container` | Group content into a surface: cards, panels, collapsible sections, scroll areas. |
| `layout.structure` | Arrange a page or a form: regions, headers, separators, resize handles. |
| `layout.form` | Label, describe and arrange form controls: fields, form layouts. |
| `collection.list` | A list of items that can be scanned, selected or reordered. |
| `collection.tree` | A nested hierarchy: layers, files, activity. |
| `property.editor` | Edit one property of a selected object (inspector controls). |
| `property.panel` | Hold and organise many property editors (inspector sections and stacks). |
| `agent.conversation` | The exchange with an agent: messages, the composer, thinking, tool calls. |
| `agent.plan` | What an agent intends or did: plans, timelines, activity, checkpoints. |
| `agent.request` | An agent asking for approval or a decision before it continues. |
| `agent.suggestion` | An agent offering next steps or prompts the person can pick. |
| `agent.presence` | Where an agent is working on the canvas or the page. |
| `canvas.surface` | The design surface and its frames. |
| `canvas.annotation` | Marks drawn over the canvas: selection, guides, rulers, comments, labels, hints. |
| `canvas.control` | Controls floating over the canvas: zoom, floating bars. |

Placements say where a component usually sits: `titlebar`, `start`, `stage`, `end`, `overlay` (the app-shell
regions, see [composition.md](composition.md)), and `canvas`, `toolbar`, `inspector`, `transcript`, `form`, `card`,
`page`, `inline`. Filter by them with `caustic list --placement <p>`.

## Reading `find`

`caustic find "<need>"` takes the need in plain words ("switch between design and code mode in the titlebar") and
searches intent, roles, `alsoFits`, keywords and names. It returns:

- The **roles** the need matched, on the first line.
- **Fits**, ranked: id, name, roles (a `~` marks a component that matched through `alsoFits`), and the one-line
  intent. `--limit n` changes how many (default 8); `--role` and `--placement` narrow the search.
- **Also consider**: siblings that the fits point to, each with its `when` and the fit it came from ("tabs: the
  choice swaps a whole panel of content under it (from segmented-control)").

Phrase the need as the job, not the widget: "pick one of three views" routes better than "pill buttons". If the top
fit is weak, try the role directly: `caustic roles choice.single`.

## Reading `show`

`caustic show <id…>` expands one or more components in three depths. Ask for the least you need.

| Depth | Contains | Use it to |
|---|---|---|
| `brief` (default) | intent, roles, `alsoFits`, placement, the import line, parts (with their parent) | confirm the choice |
| `api` | brief plus variants, props with types and defaults, events, whether a label is required, flags | write the JSX |
| `full` | api plus prop descriptions, keyboard, a11y notes, anatomy, `uses` / `usedBy`, `pairs`, `consider`, guidance, examples with their JSX source | copy a known-good arrangement, or settle a close call |

Field meanings:

- `roles`: primary jobs, strongest first. `alsoFits`: jobs it can also serve in applied design.
- `placement`: where it usually sits; not a limit.
- `pairs`: components it is often placed with. A good next `show`.
- `consider`: `{ id, when }`, a sibling that may fit a nearby need better. A pointer, never a prohibition.
- `guidance`: up to three notes the props do not tell you. Read them; they are short for a reason.
- `uses` / `usedBy`: composition. If X `uses` Y, do not build Y by hand next to X.
- `flags.agent`: the component may carry agent light (spectrum, agent tone). `flags.floating`: it floats and may use
  a floating material.

## Choosing among candidates

1. **Match the job, then the place.** Two components can share a role and differ in placement: a select in a form, a
   segmented control in a toolbar. Prefer the one whose placement matches your region.
2. **Count the options.** Few short options visible at once → `choice.*`; many or long → `input.pick`.
3. **Read every `consider.when`** (the also-consider list of `find`, or `show --depth full`). If one describes your case, switch. If none does, keep your first fit.
4. **Prefer the specific over the generic.** A `PolicyFindings` list beats a `List` of hand-made rows for findings;
   a `CardStat` beats a `Card` with a big number. A generic container is the fallback, not the start.
5. **Prefer composition over assembly.** If a component already composes the pieces (a `Composer` with chips and a
   mode switch, an `InspectorPanel` with sections), use it rather than arranging the pieces yourself.
6. **Agent things get agent components.** Anything the agent says, plans, asks or touches has its own role family
   (`agent.*`). Use those instead of restyling a generic component in agent colours.

## Using the whole tree without forcing

- Run `caustic list --tree` once per screen. Scan each category for a component that already does what you were about
  to hand-build: a key hint, a description list, an empty state, a reading-order list.
- Coverage is not a goal. A screen that uses twelve components well beats one that uses forty to show range. Do not
  add a component the region does not need.
- Stretching is allowed. You may put a component into an `alsoFits` role, or beyond it, when the brief asks for it
  (a `Timeline` as an activity feed, a `SegmentedControl` as local navigation). Keep its accessibility contract, and
  say why in one line.
- If nothing fits, build the smallest thing from tokens and layout primitives, and say what you looked for. Do not
  bend a component against its intent to avoid that.
