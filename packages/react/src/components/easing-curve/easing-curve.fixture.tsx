import { defineFixture } from '../../lib/fixture.ts';
import { EasingCurve, type EasingCurveLabels, type EasingCurveProps, type EasingPreset } from './easing-curve.tsx';

const presets: EasingPreset[] = [
  { id: 'out', label: 'out', bezier: [0.2, 0.8, 0.2, 1] },
  { id: 'standard', label: 'standard', bezier: [0.2, 0, 0, 1] },
  { id: 'in', label: 'in', bezier: [0.4, 0, 1, 1] },
  { id: 'back', label: 'back', bezier: [0.34, 1.56, 0.64, 1] },
];

const labels: EasingCurveLabels = {
  graph: 'Easing curve',
  handle1: 'Easing handle 1',
  handle2: 'Easing handle 2',
  handleValueText: (x, y) => `x ${x}, y ${y}`,
  presetsGroup: 'Presets',
  duration: 'Duration',
  mixed: 'Mixed',
};

export default defineFixture({
  id: 'easing-curve',
  render: props => <EasingCurve progress={0} presets={presets} labels={labels} {...(props as Partial<EasingCurveProps>)} />,
  examples: {
    'easing-curve': () => <EasingCurve defaultBezier={[0.2, 0.8, 0.2, 1]} progress={1} presets={presets} labels={labels} />,
  },
});
