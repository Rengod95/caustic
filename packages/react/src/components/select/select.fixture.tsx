import { defineFixture } from '../../lib/fixture.ts';
import { Select, SelectGroup, SelectHeading, SelectOption, SelectSeparator } from './select.tsx';

const options = (selected: boolean) => (
  <>
    <SelectGroup>
      <SelectHeading>Roles</SelectHeading>
      <SelectOption value="editor" selected={selected}>Editor</SelectOption>
      <SelectOption value="viewer">Viewer</SelectOption>
    </SelectGroup>
    <SelectSeparator />
    <SelectOption value="admin">Admin</SelectOption>
  </>
);

export default defineFixture({
  id: 'select',
  // Item-level props apply to the first option. The closed (portal) select is followed by an open inline
  // listbox so every slot is present; in inline cases the single inline select carries the props.
  render: ({ selected, inline, ...props }) => inline
    ? <Select aria-label="Role" placeholder="Select a role" {...props} inline>{options(Boolean(selected))}</Select>
    : (
      <div className="grid w-60 gap-2">
        <Select aria-label="Role" placeholder="Select a role" {...props}>{options(Boolean(selected))}</Select>
        <Select aria-label="Role (open)" placeholder="Select a role" inline defaultOpen>{options(Boolean(selected))}</Select>
      </div>
    ),
  examples: {},
});
