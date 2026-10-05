import { Ruler } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Field } from '../field/field.tsx';
import { Select, SelectOption } from '../select/select.tsx';
import { TokenChip } from '../token-chip/token-chip.tsx';
import { Combobox } from './combobox.tsx';

const swatch = (color: string) => <TokenChip size="sm" className="rounded-full" swatch={`var(--cs-color-${color})`} />;
const resultsLabel = (n: number) => `${n} results`;
const tokens = [
  { value: 'color/accent/solid', label: 'color/accent/solid', meta: 'color', leading: swatch('accent-solid') },
  { value: 'color/accent/soft', label: 'color/accent/soft', meta: 'color', leading: swatch('accent-soft') },
  { value: 'color/accent/text', label: 'color/accent/text', meta: 'color', leading: swatch('accent-text') },
  { value: 'space/accent-gap', label: 'space/accent-gap', meta: 'dimension', leading: <Ruler /> },
];

export default defineFixture({
  id: 'combobox',
  // The list is always inline. Cases (inline = false) show the specimen text “acc”; scenario instances start empty unless they set defaultInputValue.
  // Item-level props apply to the first option.
  render: ({ inline, defaultInputValue, ...props }) => (
    <div className="w-80">
      <Combobox aria-label="Search tokens" resultsLabel={resultsLabel} options={tokens} {...props} defaultInputValue={(defaultInputValue as string | undefined) ?? (inline ? '' : 'acc')} inline />
    </div>
  ),
  examples: {
    'select-and-combobox': () => (
      <div className="grid w-full max-w-110 gap-4">
        <Field label="Role">
          <Select aria-label="Role" defaultValue="editor">
            <SelectOption value="editor">Editor</SelectOption>
            <SelectOption value="viewer">Viewer</SelectOption>
            <SelectOption value="admin">Admin</SelectOption>
          </Select>
        </Field>
        <Field label="Country">
          <Select aria-label="Country" placeholder="Select a country">
            <SelectOption value="kr">South Korea</SelectOption>
            <SelectOption value="us">United States</SelectOption>
          </Select>
        </Field>
        <Field label="Bind to token" className="max-w-80">
          <Combobox aria-label="Search tokens" resultsLabel={resultsLabel} inline defaultInputValue="acc" selected options={tokens} />
        </Field>
      </div>
    ),
  },
});
