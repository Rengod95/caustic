# Recipes: starting a screen

Load this in step 1 (Shape). A recipe is a known screen split into regions. Each region names its placement, its
purpose, the roles it is built from, and the components that usually fill it. It is a starting layout, not a
template to copy.

## Finding one

```sh
caustic recipes            # every recipe: id, title, one-line intent
caustic recipes <id>       # its regions, roles, suggested components and notes
caustic recipes <id> --json
```

`caustic recipes` is the live list. Recipes cover screens such as an agent session, a design editor, an analytics
dashboard, workspace settings, a canvas review and a theme editor.

## Reading one

```
Design editor (design-editor)
A canvas design tool: titlebar, pages and layers, the canvas with its marks and floating tools, and an inspector.
  titlebar: File name and sync state, undo and redo, the editor mode switch, collaborators and Share.
      roles: navigation.global, choice.single, display.identity, action.primary, overlay.hint · suggested: app-shell, badge, …
  start: Pages and the layer tree, with a filter field, in a tabbed side panel.
      roles: navigation.local, collection.tree, input.text · suggested: side-panel, tabs, list-navigation, …
  …
  notes:
  - AppShell owns the frame: put content in its Titlebar, Start, Stage, End and Overlay parts, not in your own grid.
```

- **reference**, when present, names a source file that implements the recipe.
- **placement** is where the region sits; see [composition.md](composition.md#the-app-shell) for the app-shell
  regions.
- **roles** are what the region needs. They matter more than the suggestions: they let you route to other
  components when the brief differs.
- **suggested** are the components that usually fill the region. Expand them together:
  `caustic show <ids> --depth api`.
- **notes** are the few decisions that make the screen read as Caustic.

## Using one

1. Pick the recipe closest to the brief. If two fit, take the one whose stage matches (canvas, transcript, page).
2. Drop the regions the brief does not need. Add regions it needs, written the same way (placement, purpose, roles).
3. For each region, check the suggestions against the brief. Keep the ones that fit; for the rest, route by role
   (`caustic find`, `caustic roles <role>`, see [routing.md](routing.md)).
4. Expand only the components you kept, then build.
5. Say which recipe you started from and what you changed.

## Without a recipe

Write the regions yourself, one line each, before you route anything:

```
stage   · the transcript of one review session · agent.conversation, display.code
end     · findings to accept or dismiss         · feedback.inline, agent.request
overlay · the approval prompt                   · agent.request
```

Then route each line as in [routing.md](routing.md). A short region list keeps the screen honest: every component
you place should answer one line of it.
