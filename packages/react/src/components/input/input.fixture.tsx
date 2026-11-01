import { CircleX, Copy, Eye, Lock, Mail, Search } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { Field } from '../field/field.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { Kbd } from '../kbd/kbd.tsx';
import { NumberField } from '../number-field/number-field.tsx';
import { Textarea } from '../textarea/textarea.tsx';
import { Input } from './input.tsx';

// The specimen's form column: 440px wide (dialog-md minus control-lg).
const col = 'grid w-full max-w-[calc(var(--cs-size-dialog-md)-var(--cs-size-control-lg))] gap-4';

export default defineFixture({
  id: 'input',
  render: props => props.addons
    ? <Input aria-label="Custom domain" prefix="https://" suffix=".co" placeholder="design.orbit" {...props} />
    : <Input aria-label="Search" prefix={<Search />} suffix={<IconButton label="Clear" size="xs"><CircleX /></IconButton>} placeholder="Search tokens" {...props} />,
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
        <Field label="Custom domain"><Input addons prefix="https://" suffix=".co" defaultValue="design.orbit" /></Field>
        <Field label="Password" success="Strong · 10 characters">
          <Input type="password" defaultValue="lagoon-205" prefix={<Lock className="size-icon-sm" />} suffix={<IconButton label="Show password" size="xs"><Eye /></IconButton>} />
        </Field>
        <Field label="Search">
          <Input defaultValue="button" prefix={<Search className="size-icon-sm" />} suffix={<><IconButton label="Clear" size="xs"><CircleX /></IconButton><Kbd>⌘K</Kbd></>} />
        </Field>
        <div className="grid grid-cols-[auto_1fr] items-end gap-4">
          <Field label="Seats"><NumberField appearance="stepper" defaultValue={8} /></Field>
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
          <Input variant="sunken" prefix="X" defaultValue="360" aria-label="X" />
          <Input variant="sunken" prefix="Y" defaultValue="96" aria-label="Y" />
          <Input variant="sunken" prefix="W" defaultValue="640" aria-label="W" />
          <Input variant="sunken" prefix="H" defaultValue="Hug" aria-label="H" />
        </div>
        <Field label="Description"><Textarea size="sm" rows={3} defaultValue="Primary call to action. Use once per view." /></Field>
      </>
    ),
    // Was InputGroup: add-on segments in each size, an add-on that holds a button, and the invalid and disabled edges.
    'input-group-addons': () => (
      <div className={col}>
        <Field label="Custom domain"><Input addons prefix="https://" suffix=".co" defaultValue="design.orbit" /></Field>
        <Field label="URL"><Input addons prefix="caustic.app/" defaultValue="orbit" /></Field>
        <Field label="Link">
          <Input addons aria-label="Link" prefix="caustic.app/" defaultValue="orbit/pricing" suffix={<button type="button" className="inline-flex items-center gap-1.5 text-ui-strong text-text-primary [&_svg]:size-icon-sm"><Copy />Copy</button>} />
        </Field>
        <Field label="Version" required error="0.4.0 is already published."><Input addons prefix="v" defaultValue="0.4.0" /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Small"><Input addons size="sm" prefix="https://" defaultValue="orbit.co" /></Field>
          <Field label="Disabled"><Input addons disabled prefix="https://" suffix=".co" defaultValue="orbit" /></Field>
        </div>
      </div>
    ),
  },
});
