import { CircleX, Copy, Eye, Lock, Mail, Search } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Field } from '../field/field.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { InputGroup } from '../input-group/input-group.tsx';
import { Kbd } from '../kbd/kbd.tsx';
import { StepperInput } from '../stepper-input/stepper-input.tsx';
import { Textarea } from '../textarea/textarea.tsx';
import { Input } from './input.tsx';

// The specimen's form column: 440px wide (dialog-md minus control-lg).
const col = 'grid w-full max-w-[calc(var(--cs-size-dialog-md)-var(--cs-size-control-lg))] gap-4';

export default defineFixture({
  id: 'input',
  render: props => <Input aria-label="Search" prefix={<Search />} suffix={<IconButton label="Clear" size="xs"><CircleX /></IconButton>} placeholder="Search tokens" {...props} />,
  examples: {
    'text-fields': () => (
      <div className="grid gap-2.5">
        <Field label="Project name"><Input defaultValue="Orbit Pay" /></Field>
        <Field label="Search"><Input prefix={<Search />} placeholder="Tokens, layers, components" suffix={<Kbd>⌘K</Kbd>} /></Field>
        <Field label="Token name" error="Use lowercase and slashes, like accent/solid."><Input defaultValue="Accent Solid" /></Field>
      </div>
    ),
    'input-variants': () => (
      <div className={col}>
        <Field label="Email"><Input type="email" defaultValue="mina@orbit.co" prefix={<Mail className="size-icon-sm" />} /></Field>
        <Field label="Custom domain"><InputGroup start="https://" end=".co" defaultValue="design.orbit" /></Field>
        <Field label="Password" success="Strong · 10 characters">
          <Input type="password" defaultValue="lagoon-205" prefix={<Lock className="size-icon-sm" />} suffix={<IconButton label="Show password" size="xs"><Eye /></IconButton>} />
        </Field>
        <Field label="Search">
          <Input defaultValue="button" prefix={<Search className="size-icon-sm" />} suffix={<><IconButton label="Clear" size="xs"><CircleX /></IconButton><Kbd>⌘K</Kbd></>} />
        </Field>
        <div className="grid grid-cols-[auto_1fr] items-end gap-4">
          <Field label="Seats"><StepperInput defaultValue={8} /></Field>
          <Field label="Budget"><Input defaultValue="2,400" prefix="$" suffix="/ month" /></Field>
        </div>
        <div className="grid gap-4">
          <Field label="Read-only"><Input readOnly defaultValue="ws_8f2a91" aria-label="Workspace ID" suffix={<IconButton label="Copy" size="xs"><Copy /></IconButton>} /></Field>
          <Field label="Disabled"><Input disabled defaultValue="Locked by admin" aria-label="Disabled field" /></Field>
        </div>
      </div>
    ),
    'inspector-fields': () => (
      <>
        <div className="grid grid-cols-2 gap-1.5">
          <Input appearance="sunken" prefix="X" defaultValue="360" aria-label="X" />
          <Input appearance="sunken" prefix="Y" defaultValue="96" aria-label="Y" />
          <Input appearance="sunken" prefix="W" defaultValue="640" aria-label="W" />
          <Input appearance="sunken" prefix="H" defaultValue="Hug" aria-label="H" />
        </div>
        <Field label="Description"><Textarea size="sm" rows={3} defaultValue="Primary call to action. Use once per view." /></Field>
      </>
    ),
  },
});
