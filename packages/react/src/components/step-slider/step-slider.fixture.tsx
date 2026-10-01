import { defineFixture } from '../../lib/fixture.ts';
import { StepSlider } from './step-slider.tsx';

const levels = ['Low', 'Medium', 'High', 'Max'];

export default defineFixture({
  id: 'step-slider',
  render: props => <div className="w-80"><StepSlider aria-label="Reasoning effort" label="Reasoning effort" labels={levels} endLabels={['Faster', 'Deeper']} {...props} /></div>,
  examples: {
    variants: () => (
      <>
        <StepSlider label="Reasoning effort" labels={levels} endLabels={['Faster', 'Deeper']} defaultValue={2} />
        <StepSlider appearance="segmented" steps={5} defaultValue={2} aria-label="Quality" />
        <div className="flex items-center justify-between">
          <StepSlider appearance="dots" steps={4} defaultValue={1} aria-label="Density" />
          <StepSlider appearance="bars" labels={levels} defaultValue={1} aria-label="Reasoning effort" />
        </div>
      </>
    ),
  },
});
