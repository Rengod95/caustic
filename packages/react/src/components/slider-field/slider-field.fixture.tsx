import { defineFixture } from '../../lib/fixture.ts';
import { Slider } from '../slider/slider.tsx';
import { SliderField } from './slider-field.tsx';

const hue = 'linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)';

export default defineFixture({
  id: 'slider-field',
  render: props => <div className="w-80"><SliderField label="Opacity" unit="%" defaultValue={72} {...props} /></div>,
  examples: {
    variants: () => (
      <div className="grid gap-3">
        <SliderField label="Opacity" defaultValue={72} unit="%" />
        <SliderField label="Hue" defaultValue={28} max={360} unit="°" appearance="gradient" gradient={hue} thumbColor="hsl(28 100% 50%)" />
        <SliderField label="Alpha" defaultValue={85} unit="%" appearance="alpha" gradient="linear-gradient(90deg,transparent,#e2763f)" />
        <SliderField label="Blur" defaultValue={24} unit="px" appearance="ruler" />
        <div className="text-micro leading-4.5 text-text-tertiary">Sizes</div>
        <div className="flex"><Slider aria-label="Small" size="sm" defaultValue={30} /></div>
        <div className="flex"><Slider aria-label="Medium" defaultValue={50} /></div>
        <div className="flex"><Slider aria-label="Large hue" size="lg" appearance="gradient" max={360} defaultValue={205} gradient={hue} thumbColor="hsl(205 100% 50%)" /></div>
      </div>
    ),
  },
});
