import { defineFixture } from '../../lib/fixture.ts';
import { StrokeEditor, type StrokeEditorLabels } from './stroke-editor.tsx';

const labels: StrokeEditorLabels = {
  color: { well: 'Stroke color', hex: 'Stroke hex', alpha: 'Opacity', detach: 'Detach', mixed: 'Mixed' },
  weight: 'Weight',
  positionGroup: 'Stroke position',
  position: { inside: 'In', center: 'Center', outside: 'Out' },
  details: 'Stroke details',
  dash: 'Dash',
  gap: 'Gap',
  capsGroup: 'Line cap',
  caps: { butt: 'Butt cap', round: 'Round cap', arrow: 'Arrow cap' },
  independent: 'Independent stroke widths',
  independentSwitch: 'Independent widths',
  sidesGroup: 'Side widths',
  sides: { top: 'Top', right: 'Right', bottom: 'Bottom', left: 'Left' },
  sidesShort: { top: 'T', right: 'R', bottom: 'B', left: 'L' },
  mixed: 'Mixed',
};

export default defineFixture({
  id: 'stroke-editor',
  render: props => <StrokeEditor labels={labels} {...props} />,
  examples: {
    stroke: () => <StrokeEditor labels={labels} />,
  },
});
