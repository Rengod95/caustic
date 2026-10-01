import { Search } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Field } from '../field/field.tsx';
import { Kbd } from '../kbd/kbd.tsx';
import { Input } from './input.tsx';

export default defineFixture({
  id: 'input',
  render: props => <Input aria-label="Search" prefix={<Search />} placeholder="Search tokens" {...props} />,
  examples: {
    'text-fields': () => (
      <div className="grid gap-2.5">
        <Field label="Project name"><Input defaultValue="Orbit Pay" /></Field>
        <Field label="Search"><Input prefix={<Search />} placeholder="Tokens, layers, components" suffix={<Kbd>⌘K</Kbd>} /></Field>
        <Field label="Token name" error="Use lowercase and slashes, like accent/solid."><Input defaultValue="Accent Solid" /></Field>
      </div>
    ),
  },
});
