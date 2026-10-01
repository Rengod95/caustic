import { defineFixture } from '../../lib/fixture.ts';
import { AutoLayout, type AutoLayoutProps } from './auto-layout.tsx';

export default defineFixture({
  id: 'auto-layout',
  render: props => <AutoLayout preview {...(props as Partial<AutoLayoutProps>)} />,
  examples: {
    'auto-layout': () => <AutoLayout preview />,
  },
});
