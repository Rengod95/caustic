import { Compass, Frame, Search } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { CommandPalette, type CommandPaletteGroup } from './command-palette.tsx';

const groups: CommandPaletteGroup[] = [
  {
    label: 'Create',
    items: [
      { value: 'new-frame', label: 'New frame', icon: <Frame />, shortcut: '⌘N' },
      { value: 'new-group', label: 'New group', description: 'From the selection', shortcut: '⌘G' },
    ],
  },
  {
    label: 'Go to',
    items: [
      { value: 'helm', label: 'Open Helm', icon: <Compass /> },
      { value: 'find', label: 'Find in project', icon: <Search />, shortcut: '⌘⇧F' },
    ],
  },
];

export default defineFixture({
  id: 'command-palette',
  render: props => <CommandPalette inline label="Command palette" placeholder="Type a command" groups={groups} emptyMessage="No commands found" {...props} />,
  examples: {},
});
