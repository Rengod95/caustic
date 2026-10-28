# Composition: parts, the app shell, common props and state

Load this in step 3 (Expand) and while you build. `caustic show <id> --depth api` is the source for any one
component; this file explains the patterns that hold across all of them.

## Imports and setup

- Everything comes from one entry: `import { Button, Card, CardHeader } from '@caustic/react'`.
- The app imports the stylesheet once: `import '@caustic/react/styles.css'`. It brings Tailwind, the tokens and the
  theme; you do not add a Tailwind config of your own for Caustic.
- Light and dark follow the system. Set `data-theme="light"` or `data-theme="dark"` on `<html>` to force one.
- Icons are `lucide-react`. Pass them as elements (`icon={<Plus />}`); components size them.

## Compound components and parts

Many components are compounds: a root plus named parts exported next to it, always prefixed with the root name
(`Card` → `CardHeader`, `CardTitle`, `CardBody`, `CardFooter`; `Tabs` → `TabsList`, `TabsTrigger`, `TabsContent`).
`show --depth api` lists each part with its `parent`.

- Render a part only inside its parent (directly or through your own wrappers). A `TabsTrigger` outside `TabsList`, or
  a `DialogFooter` outside `Dialog`, is an error (`compose-outside-parent`).
- Props of a part go on the part: `<CardTitle titleSize="sm">`, not `<Card titleSize="sm">`.
- Required parts are marked; optional parts can be left out. Order follows the examples (`--depth full`).
- Some components take data instead of parts (`Table` takes `columns`, `rows`, `renderCell`; `Plan` takes `steps`).
  Use whichever the API offers; do not rebuild a data component from parts it does not export.
- Built-from (`uses`, shown at `--depth full`): `HexInput` is a `NumberField`, `Sheet` is a `Dialog` at an edge, `ColorPicker` composes
  sliders and inputs. Configure the composite rather than rebuilding it from its pieces.

## The app shell

`AppShell` is the frame of a tool-style app. It fills its parent (give the parent a bounded height, normally
`h-dvh`), and has five regions, each a part:

| Part | Placement | Holds |
|---|---|---|
| `AppShellTitlebar` | `titlebar` | file or project name, undo and redo, status, a mode switch, collaborators, the one main action |
| `AppShellStart` | `start` | a `SidePanel` with navigation, pages, layers or files |
| `AppShellStage` | `stage` | the work surface: a canvas, a transcript, a page. It is the `main` landmark; pass `stageLabel` |
| `AppShellOverlay` | `overlay` | inside the stage: floating bars, zoom, hints. Children position themselves; the canvas under it stays interactive |
| `AppShellEnd` | `end` | a `SidePanel` with the inspector or the agent conversation |

- The shell handles responsiveness: at medium width the end region becomes a sheet over the stage; at compact width
  the start region does too, and one region shows at a time. Do not add your own breakpoints for that.
- Pass `skipLabel` to render a skip link to the stage.
- A page that is not a tool (a dashboard, settings) does not need `AppShell`; use a centred page column with
  `SectionHeader`s.
- Canvas marks (`CanvasSelection`, `CanvasGuide`, `FrameLabel`, `CanvasComment`, `AgentCursor`) are positioned in
  canvas coordinates with a `rect` prop and live inside the stage. Floating controls go in `AppShellOverlay`.

## The five common props

Every component accepts the same five styling props with the same meaning, so you rarely need classes for emphasis:

| Prop | Values | Meaning |
|---|---|---|
| `tone` | `neutral` `accent` `success` `warning` `danger` `info` `agent` | which semantic colour family the emphasis takes |
| `variant` | `solid` `soft` `outline` `ghost` (some components add their own named variants) | emphasis: solid fill, soft tint, outline edge, or no fill until hover |
| `radius` | `none` `2xs` `xs` `sm` `md` `lg` `xl` `2xl` `3xl` `4xl` `full` | corner radius of the root, by token |
| `shadow` | `none` `1`–`5` | elevation of the root, by token |
| `size` | `xs` `sm` `md` `lg` | control scale: height, padding, type and icon step together |

- Unset means the component's own default; `show --depth api` states the default and what each value changes.
- Prefer these props to classes. `<Button tone="danger">` keeps contrast and states; a class does not.
- `tone="agent"` is for agent things only (see [tokens.md](tokens.md#materials-and-their-policy)).
- `status` colours (`success`, `warning`, `danger`, `info`) mean status, never decoration.
- `radius` should stay concentric: never a larger radius inside a smaller container.

## Controlled and uncontrolled state

Stateful components follow one pattern:

| State | Controlled | Uncontrolled | Change event |
|---|---|---|---|
| value | `value` | `defaultValue` | `onValueChange(value)` |
| open | `open` | `defaultOpen` | `onOpenChange(open)` |
| checked | `checked` | `defaultChecked` | `onCheckedChange(checked)` |

- Use `default*` for a mockup or when nothing else reads the state.
- Use the controlled pair when other UI depends on it (filters that drive a table, a dialog opened from elsewhere).
  Always pass the change handler with the controlled prop.
- Do not mix both on one instance.
- Events are listed under `events` in `show --depth api` with their payload and when they fire.

## Labels and accessibility

- `show --depth api` says when a component needs a label (`a11y.labelRequired`). Give it `aria-label`,
  `aria-labelledby` or its `label` prop; `caustic check` reports a missing one (`prop-missing-label`).
- Icon-only controls always need a label: `<IconButton label="Undo"><Undo2 /></IconButton>`.
- Text props such as `skipLabel`, `closeLabel`, `sendLabel` exist so the app can translate them; pass real words.
- Keyboard behaviour is built in and listed under `keyboard` (`--depth full`). Do not add your own key handlers for it.
