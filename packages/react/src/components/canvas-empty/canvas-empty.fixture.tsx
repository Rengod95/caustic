import { SwatchBook, WandSparkles } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { CanvasEmpty, type CanvasEmptyProps } from './canvas-empty.tsx';

const content = {
  title: 'What are we designing today?',
  description: 'Describe a screen, paste a reference, or pick a theme to start from.',
  actions: (
    <>
      <Button tone="agent" size="sm" iconStart={<WandSparkles />}>Describe a screen</Button>
      <Button tone="secondary" size="sm" iconStart={<SwatchBook />}>Browse themes</Button>
    </>
  ),
};

export default defineFixture({
  id: 'canvas-empty',
  render: props => <CanvasEmpty {...content} {...(props as Partial<CanvasEmptyProps>)} />,
  examples: {
    'empty-canvas': () => <CanvasEmpty {...content} />,
  },
});
