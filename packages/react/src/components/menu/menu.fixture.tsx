import { Check, Moon, Palette, Trash2, WandSparkles } from '../../icons/index.ts';
import type { Tone } from '../../lib/common-props.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { Badge } from '../badge/badge.tsx';
import { Kbd } from '../kbd/kbd.tsx';
import { PickerTrigger } from '../picker-trigger/picker-trigger.tsx';
import { Menu, MenuGroup, MenuHeading, MenuItem, MenuSeparator } from './menu.tsx';

export default defineFixture({
  id: 'menu',
  // Item-level props (selected, tone, disabled, onSelect) apply to the first MenuItem; tone also goes to the Menu surface.
  render: ({ selected, tone, disabled, onSelect, icon: _i, end: _e, ...menu }) => (
    <Menu aria-label="Themes" tone={tone as Tone | undefined} {...menu} inline defaultOpen>
      <MenuGroup>
        <MenuHeading>Themes</MenuHeading>
        <MenuItem selected={selected as boolean} tone={tone as Tone | undefined} disabled={disabled as boolean} onSelect={onSelect as (e: Event) => void} icon={<Check />} end="default">Lagoon</MenuItem>
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
        <PickerTrigger open aria-haspopup="menu" leading={<Badge mono size="sm" swatch="var(--cs-accent-6)">lagoon</Badge>}>Theme</PickerTrigger>
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
