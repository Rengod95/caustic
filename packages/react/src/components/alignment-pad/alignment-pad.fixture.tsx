import { defineFixture } from '../../lib/fixture.ts';
import { AlignmentPad, type AlignmentPadProps } from './alignment-pad.tsx';

const cellLabels: AlignmentPadProps['cellLabels'] = {
  'top-left': 'Top left', 'top-center': 'Top center', 'top-right': 'Top right',
  'middle-left': 'Middle left', 'middle-center': 'Middle center', 'middle-right': 'Middle right',
  'bottom-left': 'Bottom left', 'bottom-center': 'Bottom center', 'bottom-right': 'Bottom right',
};

export default defineFixture({
  id: 'alignment-pad',
  render: props => <AlignmentPad label="Alignment" cellLabels={cellLabels} {...(props as Partial<AlignmentPadProps>)} />,
  examples: {},
});
