import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { Spinner } from '../spinner/spinner.tsx';
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
          <Spinner size="sm" /><Spinner /><Spinner size="lg" /><Spinner tone="accent" />
          <Button tone="secondary" size="sm" loading>Saving</Button>
        </div>
      </div>
    ),
  },
});
