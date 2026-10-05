import { defineFixture } from '../../lib/fixture.ts';
import { AutoLayout, type AutoLayoutLabels, type AutoLayoutProps } from './auto-layout.tsx';

const labels: AutoLayoutLabels = {
  flowGroup: 'Flow',
  flow: { free: 'Free', row: 'Horizontal', column: 'Vertical', grid: 'Grid' },
  pad: 'Alignment',
  padCells: {
    'top-left': 'Top left', 'top-center': 'Top center', 'top-right': 'Top right',
    'middle-left': 'Middle left', 'middle-center': 'Middle center', 'middle-right': 'Middle right',
    'bottom-left': 'Bottom left', 'bottom-center': 'Bottom center', 'bottom-right': 'Bottom right',
  },
  gap: 'Gap',
  distribution: 'Distribution',
  distributionOptions: { packed: 'Packed', 'space-between': 'Space between' },
  wrap: 'Wrap',
  paddingTitle: 'Padding',
  paddingModeGroup: 'Padding mode',
  paddingMode: { all: 'All', axes: 'Axes', sides: 'Sides' },
  paddingAll: 'Padding',
  paddingHorizontal: 'Horizontal padding',
  paddingVertical: 'Vertical padding',
  paddingTop: 'Top padding',
  paddingRight: 'Right padding',
  paddingBottom: 'Bottom padding',
  paddingLeft: 'Left padding',
  clip: 'Clip content',
  tracksHeading: 'Grid tracks',
  addTrack: 'Add column',
  track: n => `Track ${n}`,
  trackUnit: n => `Track ${n} unit`,
  trackRemove: n => `Remove track ${n}`,
  trackAuto: 'Auto',
  mixed: 'Mixed',
};

export default defineFixture({
  id: 'auto-layout',
  render: props => <AutoLayout preview labels={labels} {...(props as Partial<AutoLayoutProps>)} />,
  examples: {
    'auto-layout': () => <AutoLayout preview labels={labels} />,
  },
});
