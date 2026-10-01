import { Check, Moon, Palette, Trash2, WandSparkles } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Kbd } from '../kbd/kbd.tsx';
import { PickerTrigger } from '../picker-trigger/picker-trigger.tsx';
import { TokenChip } from '../token-chip/token-chip.tsx';
import { Menu, MenuGroup, MenuHeading, MenuItem, MenuSeparator } from './menu.tsx';

export default defineFixture({
  id: 'menu',
  // Item-level props (selected, tone, disabled, onSelect) apply to the first MenuItem.
  render: ({ selected, tone, disabled, onSelect, icon: _i, end: _e, ...menu }) => (
    <Menu aria-label="Themes" {...menu} inline defaultOpen>
      <MenuGroup>
        <MenuHeading>Themes</MenuHeading>
        <MenuItem selected={selected as boolean} tone={tone as 'default' | 'danger'} disabled={disabled as boolean} onSelect={onSelect as (e: Event) => void} icon={<Check />} end="default">Lagoon</MenuItem>
        <MenuItem icon={<Moon />}>Lagoon Dark</MenuItem>
        <MenuItem icon={<Palette />} end={<><Kbd>⌘</Kbd><Kbd>3</Kbd></>}>Orbit Brand</MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuItem icon={<WandSparkles />}>Generate from prompt…</MenuItem>
      <MenuItem tone="danger" icon={<Trash2 />}>Delete theme</MenuItem>
    </Menu>
  ),
  examples: {
    'select-and-menu': () => (
      <>
        <PickerTrigger open aria-haspopup="menu" leading={<TokenChip size="sm" swatch="var(--cs-accent-500)">lagoon</TokenChip>}>Theme</PickerTrigger>
        <Menu aria-label="Themes" inline defaultOpen>
          <MenuGroup>
            <MenuHeading>Themes</MenuHeading>
            <MenuItem selected icon={<Check />} end="default">Lagoon</MenuItem>
            <MenuItem icon={<Moon />}>Lagoon Dark</MenuItem>
            <MenuItem data-highlighted="" icon={<Palette />} end={<><Kbd>⌘</Kbd><Kbd>3</Kbd></>}>Orbit Brand</MenuItem>
          </MenuGroup>
          <MenuSeparator />
          <MenuItem icon={<WandSparkles />}>Generate from prompt…</MenuItem>
          <MenuItem tone="danger" icon={<Trash2 />}>Delete theme</MenuItem>
        </Menu>
      </>
    ),
  },
});
