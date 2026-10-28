import { defineFixture } from '../../lib/fixture.ts';
import { Progress } from './progress.tsx';

export default defineFixture({
  id: 'progress',
  render: props => <div className="w-60"><Progress aria-label="Upload" value={64} {...props} /></div>,
  examples: {
    // The former Spinner (round 3): indeterminate by default; a value makes it determinate.
    'progress-ring': () => (
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Progress shape="ring" size="xs" /><Progress shape="ring" size="sm" /><Progress shape="ring" />
          <Progress shape="ring" size="lg" /><Progress shape="ring" tone="accent" /><Progress shape="ring" tone="agent" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Progress shape="ring" variant="soft" tone="accent" /><Progress shape="ring" variant="outline" tone="success" />
          <Progress shape="ring" variant="ghost" tone="danger" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Progress shape="ring" label="Upload" value={25} /><Progress shape="ring" label="Upload" value={64} tone="accent" />
          <Progress shape="ring" label="Upload" value={90} size="lg" tone="success" />
        </div>
      </div>
    ),
  },
});
