import { defineSpec } from '../schema.ts';

export default defineSpec({
  id: 'command-palette',
  name: 'CommandPalette',
  category: 'overlay',
  status: 'ready',
  purpose: 'A command palette: a modal Dialog holding an inline Combobox. A global shortcut opens it, the person types to filter commands that sit in groups, each row can show its own shortcut, and Enter runs the highlighted one and closes the palette.',
  description: 'Composes Dialog (size md, thick material, focus trapped) and Combobox mode="inline" kept open in place, so the list is part of the dialog rather than a second floating layer. The surface sits on the palette z-index token (z-palette, 100), above dialogs, toasts and tooltips. The listbox keeps the Combobox cap (listbox-max, 220px) and scrolls past it. Groups come from the groups prop; each command takes an optional icon, description and shortcut (a Kbd at the end of the row, display only).',
  role: 'dialog',
  slots: [
    { name: 'root', el: 'div', role: 'dialog', description: 'The Dialog surface (thick material, centred, size md) on z-index palette. Named by the label prop.' },
    { name: 'title', el: 'h2', parent: 'root', description: 'The label as a visually hidden dialog title, so the dialog has an accessible name.' },
    { name: 'search', el: 'input', parent: 'root', role: 'combobox', description: 'The Combobox search field, focused when the palette opens. ArrowUp and ArrowDown move through the commands, Enter runs one.' },
  ],
  variants: {},
  states: {},
  props: {
    groups: { type: 'CommandPaletteGroup[]', required: true, description: '{ label, items } sections; an item is { value, label, description?, icon?, shortcut?, disabled? }. shortcut is shown in a Kbd and does not bind the key.' },
    label: { type: 'string', required: true, description: 'Accessible name of the dialog, the search field and the list. Supplied by the app so it can be translated.' },
    shortcut: { type: 'string', description: 'Global chord that toggles the palette, such as "mod+k" (mod is Command on Mac, Control elsewhere; shift and alt are modifiers). Unset binds nothing.' },
    open: { type: 'boolean', description: 'Controlled open state.' },
    defaultOpen: { type: 'boolean', description: 'Initial open state when uncontrolled.' },
    onOpenChange: { type: '(open: boolean) => void', description: 'Called when the palette opens or closes.' },
    onSelect: { type: '(value: string) => void', description: 'Called with the value of the chosen command; the palette then closes.' },
    placeholder: { type: 'string', description: 'Hint in the empty search field.' },
    emptyMessage: { type: 'ReactNode', description: 'Shown when nothing matches.' },
    resultsLabel: { type: '(count: number) => string', description: 'Polite announcement of the result count.' },
    trigger: { type: 'ReactNode', description: 'Element that opens the palette (rendered with asChild).' },
    inline: { type: 'boolean', default: false, description: 'Render in place, open, without portal and overlay (docs, previews, tests).' },
  },
  events: {
    onSelect: { payload: 'string', when: 'A command is chosen with Enter or a click.' },
    onOpenChange: { payload: 'boolean', when: 'The palette opens or closes: the shortcut, Escape, the outside press or a choice.' },
  },
  styles: [
    { slot: 'root', expect: { material: 'thick', radius: 'panel' } },
  ],
  behavior: {
    keyboard: {
      ArrowDown: 'highlights the next command, wrapping at the end',
      ArrowUp: 'highlights the previous command',
      Enter: 'runs the highlighted command and closes the palette',
      Escape: 'closes the palette',
    },
    pointer: ['pressing a command runs it and closes the palette', 'pressing outside closes the palette'],
    scenarios: [
      { name: 'Enter runs the highlighted command', steps: [{ do: 'focus', slot: 'search' }, { do: 'press', key: 'ArrowDown' }, { do: 'press', key: 'Enter' }], expect: [{ event: 'onSelect', args: ['new-frame'] }] },
      { name: 'Escape closes', steps: [{ do: 'focus', slot: 'search' }, { do: 'press', key: 'Escape' }], expect: [{ event: 'onOpenChange', args: [false] }] },
    ],
  },
  a11y: {
    labelRequired: true,
    notes: [
      'The dialog is modal: focus is trapped and returns to the trigger on close. The search field is role=combobox with an aria-activedescendant on the listbox.',
      'A shortcut shown on a row is also text in a Kbd, never an icon only.',
    ],
  },
  policies: ['P1', 'P6'],
  flags: { floating: true },
  composition: { uses: ['dialog', 'combobox', 'kbd'] },
  examples: [],
  usage: [
    'Pass shortcut="mod+k" once, near the app root; the per-command shortcut is display only, so bind those keys where the commands live.',
    'Group commands under short headings; the search filters across the groups and hides a group left empty.',
    'Use Combobox for choosing a value in a form; use the palette to run commands or go places.',
  ],
});
