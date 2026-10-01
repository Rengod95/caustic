import { defineFixture } from '../../lib/fixture.ts';
import { StepperInput } from './stepper-input.tsx';

export default defineFixture({
  id: 'stepper-input',
  render: props => <StepperInput aria-label="Seats" defaultValue={8} {...props} />,
  examples: {},
});
