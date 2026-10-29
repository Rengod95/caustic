// Gateway fixture: how the harness renders cases and the documented examples.
import { ChevronDown, Plus, Share, Trash2, WandSparkles } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { Button } from './button.tsx';

export default defineFixture({
  id: 'button',
  render: props => <Button iconStart={<Plus />} {...props}>Publish</Button>,
  examples: {
    variants: () => (
      <div className="flex flex-wrap items-center gap-2">
        <Button>Publish</Button>
        <Button tone="accent">Apply theme</Button>
        <Button tone="secondary">Duplicate</Button>
        <Button tone="ghost">Cancel</Button>
        <Button tone="danger" iconStart={<Trash2 />}>Delete</Button>
        <Button tone="agent" iconStart={<WandSparkles />}>Generate variants</Button>
      </div>
    ),
    sizes: () => (
      <>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="xs">Run</Button>
          <Button size="sm">Run</Button>
          <Button>Run</Button>
          <Button size="lg">Run agent</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button loading>Exporting</Button>
          <Button tone="secondary" disabled>Disabled</Button>
          <Button shape="pill" iconStart={<Share />}>Share</Button>
          <Button tone="secondary" shape="pill" iconEnd={<ChevronDown />}>Pill secondary</Button>
        </div>
      </>
    ),
  },
});
