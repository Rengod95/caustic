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
  },
  frame: children => <div className="w-200">{children}</div>,
});
