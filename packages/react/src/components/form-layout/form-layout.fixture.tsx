import { defineFixture } from '../../lib/fixture.ts';
import { Field } from '../field/field.tsx';
import { Input } from '../input/input.tsx';
import { InputGroup } from '../input-group/input-group.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { Switch } from '../switch/switch.tsx';
import { FormLayout, FormLayoutFooter, FormLayoutSection, type FormLayoutProps } from './form-layout.tsx';

const Option = ({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) => (
  <div className="flex min-h-7 items-center gap-2.5">
    <span className="min-w-0 flex-1 text-ui text-text-primary">{label}</span>
    <Switch aria-label={label} defaultChecked={defaultChecked} />
  </div>
);

const Settings = (props: Partial<FormLayoutProps>) => (
  <FormLayout title="Workspace" description="Visible to everyone in Orbit." onSubmit={e => e.preventDefault()} {...props}>
    <FormLayoutSection title="Profile" description="Name and URL people see when you share.">
      <Field label="Name"><Input defaultValue="Orbit" /></Field>
      <Field label="URL"><InputGroup start="caustic.app/" defaultValue="orbit" /></Field>
    </FormLayoutSection>
    <FormLayoutSection title="Agent" description="What Caustic may do without asking.">
      <Option label="Edit shared components" />
      <Option label="Create tokens" defaultChecked />
      <Field group label="Default reasoning">
        <SegmentedControl aria-label="Default reasoning" defaultValue="balanced">
          <SegmentedControlItem value="fast">Fast</SegmentedControlItem>
          <SegmentedControlItem value="balanced">Balanced</SegmentedControlItem>
          <SegmentedControlItem value="deep">Deep</SegmentedControlItem>
        </SegmentedControl>
      </Field>
    </FormLayoutSection>
    <FormLayoutFooter />
  </FormLayout>
);

export default defineFixture({
  id: 'form-layout',
  render: props => <Settings {...(props as Partial<FormLayoutProps>)} />,
  examples: { 'form-layout': () => <Settings /> },
});
