import { defineFixture } from '../../lib/fixture.ts';
import { CornerRadius, type CornerRadiusLabels, type CornerRadiusProps } from './corner-radius.tsx';

const labels: CornerRadiusLabels = {
  radius: 'Corner radius',
  smoothing: 'Corner smoothing',
  independent: 'Independent corners',
  topLeft: 'Top left',
  topRight: 'Top right',
  bottomLeft: 'Bottom left',
  bottomRight: 'Bottom right',
  mixed: 'Mixed',
};

export default defineFixture({
  id: 'corner-radius',
  render: props => (
    <div className="w-68">
      <CornerRadius defaultIndependent labels={labels} {...(props as Partial<CornerRadiusProps>)} />
    </div>
  ),
  examples: {
    'corner-radius': () => <CornerRadius preview defaultIndependent labels={labels} />,
  },
});
