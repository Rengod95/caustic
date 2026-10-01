import { Check, FileCode, Frame } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Chip } from '../chip/chip.tsx';
import { Kbd } from '../kbd/kbd.tsx';
import { Badge } from './badge.tsx';

const noop = () => {};

export default defineFixture({
  id: 'badge',
  render: ({ dot, ...props }) => <Badge icon={<Check />} dot={dot as boolean | undefined} {...props}>Passed</Badge>,
  examples: {
    'badges-chips-keys': () => (
      <>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Draft</Badge>
          <Badge tone="accent" dot>Live</Badge>
          <Badge tone="success" icon={<Check />}>Passed</Badge>
          <Badge tone="warning">3 warnings</Badge>
          <Badge tone="danger">Failed</Badge>
          <Badge tone="info">In review</Badge>
          <Badge tone="solid">v2.4</Badge>
          <Badge tone="outline" shape="square">Instance</Badge>
          <Badge tone="agent">Agent edit</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip shape="rounded" icon={<Frame />} onRemove={noop}>Pricing / Desktop</Chip>
          <Chip shape="rounded" icon={<FileCode />} onRemove={noop}>Button.tsx</Chip>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Kbd>⌘</Kbd><Kbd>⇧</Kbd><Kbd>P</Kbd>
          <span className="text-footnote text-text-tertiary">Command palette</span>
        </div>
      </>
    ),
  },
});
