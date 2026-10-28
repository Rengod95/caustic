import { defineFixture } from '../../lib/fixture.ts';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { Slider } from './slider.tsx';

const hue = 'linear-gradient(90deg,oklch(0.7 0.2 0),oklch(0.7 0.2 120),oklch(0.7 0.2 240),oklch(0.7 0.2 360))';
const rgbHue = 'linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)';
const levels = ['Low', 'Medium', 'High', 'Max'];

export default defineFixture({
  id: 'slider',
  render: props => {
    // The discrete forms draw one dot or bar per level, so they get the four named levels.
    const discrete = props.variant === 'dots' || props.variant === 'bars';
    return (
      <div className="flex w-60">
        <Slider
          aria-label="Value" defaultValue={discrete ? 1 : 50} levels={discrete ? levels : undefined}
          gradient={props.variant === 'alpha' || props.appearance === 'alpha' ? 'linear-gradient(90deg,transparent,var(--cs-color-accent-solid))' : hue} thumbColor="var(--cs-color-accent-solid)"
          {...props}
        />
      </div>
    );
  },
  examples: {
    // Was SliderField's variants example: four labelled rows with a field, then the bare sizes.
    'slider-field-variants': () => (
      <div className="grid gap-3">
        <Slider label="Opacity" field defaultValue={72} unit="%" />
        <Slider label="Hue" field defaultValue={28} max={360} unit="°" variant="gradient" gradient={rgbHue} thumbColor="hsl(28 100% 50%)" />
        <Slider label="Alpha" field defaultValue={85} unit="%" variant="alpha" gradient="linear-gradient(90deg,transparent,#e2763f)" />
        <Slider label="Blur" field defaultValue={24} unit="px" variant="ruler" />
        <div className="text-micro leading-4.5 text-text-tertiary">Sizes</div>
        <div className="flex"><Slider aria-label="Small" size="sm" defaultValue={30} /></div>
        <div className="flex"><Slider aria-label="Medium" defaultValue={50} /></div>
        <div className="flex"><Slider aria-label="Large hue" size="lg" variant="gradient" max={360} defaultValue={205} gradient={rgbHue} thumbColor="hsl(205 100% 50%)" /></div>
      </div>
    ),
    // Was StepSlider's variants example: the levels track, the segmented form (now a SegmentedControl), dots and bars.
    'step-slider-variants': () => (
      <>
        <Slider label="Reasoning effort" levels={levels} endLabels={['Faster', 'Deeper']} defaultValue={2} />
        <div className="flex">
          <SegmentedControl aria-label="Quality" defaultValue="3">
            {['1', '2', '3', '4', '5'].map(q => <SegmentedControlItem key={q} value={q}>{q}</SegmentedControlItem>)}
          </SegmentedControl>
        </div>
        <div className="flex items-center justify-between">
          <Slider variant="dots" min={1} max={4} defaultValue={2} aria-label="Density" />
          <Slider variant="bars" levels={levels} defaultValue={1} aria-label="Reasoning effort" />
        </div>
      </>
    ),
  },
});
