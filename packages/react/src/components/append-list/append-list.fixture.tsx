import { Diamond, Ellipsis } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Badge } from '../badge/badge.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { AppendList, AppendListRow, type AppendListProps } from './append-list.tsx';

const rows = (
  <>
    <AppendListRow icon={<Diamond />} title="Size" description="· sm, md, lg" end={<Badge shape="square">3</Badge>} />
    <AppendListRow icon={<Diamond />} title="Tone" description="· ink, accent, glass" end={<Badge shape="square">3</Badge>} />
    <AppendListRow icon={<Diamond />} title="State" description="· rest, hover, press, off" end={<Badge tone="warning" shape="square">1 missing</Badge>} />
  </>
);

export default defineFixture({
  id: 'append-list',
  render: props => (
    <AppendList heading="Variant axes" action={<IconButton size="xs" label="Options"><Ellipsis /></IconButton>} addLabel="Add axis" {...(props as Partial<AppendListProps>)}>
      {rows}
    </AppendList>
  ),
  frame: children => <div className="w-90">{children}</div>,
  examples: {
    'append-list': () => (
      <AppendList heading="Variant axes" action={<IconButton size="xs" label="Options"><Ellipsis /></IconButton>} addLabel="Add axis">
        {rows}
      </AppendList>
    ),
  },
});
