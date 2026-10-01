import { defineFixture } from '../../lib/fixture.ts';
import { GradientEditor } from './gradient-editor.tsx';

export default defineFixture({
  id: 'gradient-editor',
  render: props => <GradientEditor defaultSelected={1} {...props} />,
  examples: {
    'gradient-editor': () => <GradientEditor defaultSelected={1} />,
  },
  frame: children => <div className="w-200">{children}</div>,
});
