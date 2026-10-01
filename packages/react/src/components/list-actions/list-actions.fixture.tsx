import { Archive, Copy, Download, Flag, Trash2 } from 'lucide-react';
import type { ListActionsTone } from './list-actions.variants.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { Avatar } from '../avatar/avatar.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { List } from '../list/list.tsx';
import { ListActions, ListActionsAction, type ListActionsProps } from './list-actions.tsx';

const Tray = ({ tone }: { tone?: ListActionsTone }) => (
  <>
    <ListActionsAction label="Archive" tone={tone} icon={<Archive />} />
    <ListActionsAction label="Flag" tone="warning" icon={<Flag />} />
    <ListActionsAction label="Delete" tone="danger" icon={<Trash2 />} />
  </>
);

const Tools = () => (
  <>
    <IconButton size="xs" label="Copy"><Copy /></IconButton>
    <IconButton size="xs" label="Download"><Download /></IconButton>
    <IconButton size="xs" label="Delete"><Trash2 /></IconButton>
  </>
);

export default defineFixture({
  id: 'list-actions',
  render: props => {
    const { tone, ...p } = props as Partial<ListActionsProps> & { tone?: ListActionsTone };
    return (
      <List aria-label="Files">
        {p.reveal === 'swipe' ? (
          <ListActions
            {...p} reveal="swipe" leading={<Avatar name="Mina Kang" color="coral" size="lg" />} title="Mina commented"
            description="Total should be bold, not the label." end="2m" actions={<Tray tone={tone} />}
          />
        ) : (
          <ListActions {...p} reveal="hover" title="tokens.css" description="112 lines" actions={<Tools />} />
        )}
      </List>
    );
  },
  frame: children => <div className="w-110">{children}</div>,
  examples: {
    'row-actions': () => (
      <div className="grid w-full grid-cols-2 items-start gap-3.5">
        <List heading="Swipe left">
          <ListActions
            reveal="swipe" leading={<Avatar name="Mina Kang" color="coral" size="lg" />} title="Mina commented"
            description="Total should be bold, not the label." end="2m" actions={<Tray />}
          />
          <ListActions
            reveal="swipe" defaultOpen leading={<Avatar name="Caustic" kind="agent" size="lg" />} title="Caustic needs approval"
            description="Edit the shared Button component?" end="5m" actions={<Tray />}
          />
        </List>
        <List heading="Hover">
          <ListActions title="tokens.css" description="112 lines" actions={<Tools />} />
          <ListActions title="PricingCard.tsx" description="48 lines" actions={<Tools />} />
        </List>
      </div>
    ),
  },
});
