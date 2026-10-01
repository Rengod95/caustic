import { defineFixture } from '../../lib/fixture.ts';
import { CornerRadius, type CornerRadiusProps } from './corner-radius.tsx';

export default defineFixture({
  id: 'corner-radius',
  render: props => (
    <div className="w-68">
      <CornerRadius defaultIndependent {...(props as Partial<CornerRadiusProps>)} />
    </div>
  ),
  examples: {
    'corner-radius': () => <CornerRadius preview defaultIndependent />,
  },
});
