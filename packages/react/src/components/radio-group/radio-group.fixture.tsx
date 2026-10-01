import { defineFixture } from '../../lib/fixture.ts';
import { RadioGroup, RadioGroupItem } from './radio-group.tsx';

export default defineFixture({
  id: 'radio-group',
  render: props => (
    <RadioGroup aria-label="Sizing" defaultValue="fixed" {...props}>
      <RadioGroupItem value="hug">Hug</RadioGroupItem>
      <RadioGroupItem value="fill">Fill</RadioGroupItem>
      <RadioGroupItem value="fixed">Fixed</RadioGroupItem>
    </RadioGroup>
  ),
  examples: {},
});
