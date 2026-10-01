import type { ReactNode } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { Checkbox } from '../checkbox/checkbox.tsx';
import { RadioGroup, RadioGroupItem } from '../radio-group/radio-group.tsx';
import { Switch } from './switch.tsx';

const Row = ({ children }: { children: ReactNode }) => <div className="flex min-h-7 items-center gap-2.5">{children}</div>;

export default defineFixture({
  id: 'switch',
  render: props => <Switch aria-label="Snap to pixel grid" {...props} />,
  examples: {
    toggles: () => (
      <div className="grid gap-2.5">
        <Row><span className="min-w-0 flex-1">Snap to pixel grid</span><Switch defaultChecked aria-label="Snap to pixel grid" /></Row>
        <Row><span className="min-w-0 flex-1">Let agent edit shared components</span><Switch aria-label="Let agent edit shared components" /></Row>
        <Row><Checkbox defaultChecked aria-label="Light" /><span className="min-w-0 flex-1">Light theme</span></Row>
        <Row><Checkbox defaultChecked="indeterminate" aria-label="All themes" /><span className="min-w-0 flex-1">All themes <span className="text-text-tertiary">2 of 3</span></span></Row>
        <Row><Checkbox aria-label="High contrast" /><span className="min-w-0 flex-1">High contrast</span></Row>
        <RadioGroup defaultValue="hug" orientation="horizontal" className="min-h-7 gap-[22px]">
          <RadioGroupItem value="hug" aria-label="Hug">Hug</RadioGroupItem>
          <RadioGroupItem value="fill" aria-label="Fill">Fill</RadioGroupItem>
          <RadioGroupItem value="fixed" aria-label="Fixed">Fixed</RadioGroupItem>
        </RadioGroup>
      </div>
    ),
  },
});
