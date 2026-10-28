import { defineFixture } from '../../lib/fixture.ts';
import { GradientEditor, type GradientEditorLabels, type GradientEditorProps } from './gradient-editor.tsx';

const labels: GradientEditorLabels = {
  handleStart: 'Gradient start, drag to move',
  handleEnd: 'Gradient end, drag to set angle and length',
  handleValueText: (x, y) => `${x} %, ${y} %`,
  typesGroup: 'Gradient type',
  types: { linear: 'Linear', radial: 'Radial', angular: 'Angular' },
  dial: 'Angle',
  dialValueText: degrees => `${degrees} degrees`,
  angle: 'Angle',
  rotate: 'Rotate 90°',
  flip: 'Flip',
  stops: 'Stops',
  add: 'Add stop',
  stop: n => `Stop ${n}`,
  position: 'Position',
  color: 'Color',
  remove: 'Remove stop',
  details: 'Start & end',
  startX: 'Start X',
  startY: 'Start Y',
  endX: 'End X',
  endY: 'End Y',
  startXShort: 'X1',
  startYShort: 'Y1',
  endXShort: 'X2',
  endYShort: 'Y2',
  radiusReadout: px => `r ${px}px`,
  mixed: 'Mixed',
};

export default defineFixture({
  id: 'gradient-editor',
  render: props => <GradientEditor defaultSelected={1} labels={labels} {...(props as Partial<GradientEditorProps>)} />,
  examples: {
    'gradient-editor': () => <GradientEditor defaultSelected={1} labels={labels} />,
    // The removed GradientStrip, now a part used on its own (its old fixture render).
    'gradient-strip-part': () => (
      <div className="w-98">
        <GradientEditor.Strip
          stopLabel={labels.stop}
          stops={[{ position: 0, color: '#E2763F' }, { position: 52, color: '#F4C26B' }, { position: 100, color: '#5F4994' }]}
          selected={1}
        />
      </div>
    ),
  },
  frame: children => <div className="w-200">{children}</div>,
});
