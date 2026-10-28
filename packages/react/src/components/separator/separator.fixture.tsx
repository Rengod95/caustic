import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { Progress } from '../progress/progress.tsx';
import { Separator } from './separator.tsx';

export default defineFixture({
  id: 'separator',
  render: props => <div className="flex h-control-sm w-60 items-center"><Separator decorative={false} {...props} /></div>,
  examples: {
    'separator-and-spinner': () => (
      <div className="grid gap-3.5">
        <Separator />
        <Separator label="or continue with" />
        <div className="flex h-control-sm flex-wrap items-center gap-3">
          <span className="text-footnote">Draft</span><Separator orientation="vertical" />
          <span className="text-footnote">3 frames</span><Separator orientation="vertical" />
          <span className="text-footnote">Edited 2m ago</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Progress shape="ring" size="sm" /><Progress shape="ring" /><Progress shape="ring" size="lg" /><Progress shape="ring" tone="accent" />
          <Button tone="secondary" size="sm" loading>Saving</Button>
        </div>
      </div>
    ),
  },
});
