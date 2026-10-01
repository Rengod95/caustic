import { defineFixture } from '../../lib/fixture.ts';
import { AlignmentPad, type AlignmentPadProps } from './alignment-pad.tsx';

export default defineFixture({
  id: 'alignment-pad',
  render: props => <AlignmentPad {...(props as Partial<AlignmentPadProps>)} />,
  examples: {},
});
