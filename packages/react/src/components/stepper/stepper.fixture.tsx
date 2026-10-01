import { defineFixture } from '../../lib/fixture.ts';
import { Stepper, type StepperProps } from './stepper.tsx';

const horizontal = [
  { label: 'Brief', description: 'Done' },
  { label: 'Theme', description: 'Lagoon' },
  { label: 'Screens', description: 'In progress' },
  { label: 'Review', description: 'Next' },
];
const vertical = [
  { label: 'Connect a provider', description: 'Anthropic connected.' },
  { label: 'Pick a starting theme', description: 'Choose from 128 themes or generate one from a prompt.' },
  { label: 'Describe your first screen', description: 'The agent drafts it; you review every change.' },
];

export default defineFixture({
  id: 'stepper',
  render: props => {
    const p = props as Partial<StepperProps>;
    return p.orientation === 'vertical'
      ? <Stepper value={2} steps={vertical} {...p} />
      : <Stepper value={3} steps={horizontal} {...p} />;
  },
  examples: {
    stepper: () => (
      <>
        <Stepper value={3} steps={horizontal} />
        <Stepper orientation="vertical" value={2} steps={vertical} />
      </>
    ),
  },
});
