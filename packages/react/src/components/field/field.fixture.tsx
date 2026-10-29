import { Globe, Search } from '../../icons/index.ts';
import { CircleCheck } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { Input } from '../input/input.tsx';
import { Field } from './field.tsx';

// The specimen's form column: 440px wide (dialog-md minus control-lg).
const col = 'grid w-full max-w-[calc(var(--cs-size-dialog-md)-var(--cs-size-control-lg))] gap-4';

export default defineFixture({
  id: 'field',
  render: props => <Field label="Project name" hint="Shown in the share link and the browser tab." {...props}><Input defaultValue="Orbit Pay" /></Field>,
  examples: {
    anatomy: () => (
      <div className={col}>
        <Field label="Project name" required count="9 / 40" hint="Shown in the share link and the browser tab.">
          <Input defaultValue="Orbit Pay" maxLength={40} />
        </Field>
        <Field label="Website" optional optionalLabel="Optional">
          <Input prefix={<Globe className="size-icon-sm" />} placeholder="https://" />
        </Field>
        <Field label="Workspace URL" error="Use lowercase letters, numbers and dashes.">
          <Input defaultValue="orbit pay" />
        </Field>
        <Field label="Workspace URL" warning="Uppercase letters are lowered in the link.">
          <Input defaultValue="Orbit-Pay" />
        </Field>
        <Field label="Workspace URL" success="orbit-pay is available.">
          <Input defaultValue="orbit-pay" suffix={<CircleCheck className="size-icon-sm text-success-text" />} />
        </Field>
      </div>
    ),
    sizes: () => (
      <div className={col}>
        <Field label="Small · 36"><Input size="sm" prefix={<Search className="size-icon-sm" />} placeholder="Search" aria-label="Small field" /></Field>
        <Field label="Medium · 40 (default)"><Input prefix={<Search className="size-icon-sm" />} placeholder="Search" aria-label="Medium field" /></Field>
        <Field label="Large · 44"><Input size="lg" prefix={<Search />} placeholder="Search" aria-label="Large field" /></Field>
        <div className="flex flex-wrap items-center gap-2">
          <Button tone="secondary" size="sm" className="h-field-sm">36</Button>
          <Button tone="secondary" className="h-field-md px-3.5">40</Button>
          <Button tone="ink" className="h-field-lg rounded-xl px-4">44</Button>
        </div>
      </div>
    ),
  },
});
