import { defineFixture } from '../../lib/fixture.ts';
import { StrokeEditor } from './stroke-editor.tsx';

export default defineFixture({
  id: 'stroke-editor',
  render: props => <StrokeEditor {...props} />,
  examples: {
    stroke: () => <StrokeEditor />,
  },
});
