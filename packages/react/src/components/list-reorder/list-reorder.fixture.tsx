import { defineFixture } from '../../lib/fixture.ts';
import { Badge } from '../badge/badge.tsx';
import { ListReorder, ListReorderItem, type ListReorderAnnouncement, type ListReorderProps } from './list-reorder.tsx';

const announce = (e: ListReorderAnnouncement) => {
  const at = `position ${e.position} of ${e.size}`;
  switch (e.type) {
    case 'picked': return `Picked up ${e.title}, ${at}`;
    case 'moved': return `Moved to ${at}`;
    case 'dropped': return `Dropped at ${at}`;
    case 'cancelled': return `Cancelled, back at ${at}`;
  }
};
const labels = {
  handleLabel: (t: string) => `Reorder ${t}`,
  instructions: 'Press Space to pick up, arrow keys to move, Space to drop, Escape to cancel.',
  announce,
};

export default defineFixture({
  id: 'list-reorder',
  render: props => {
    const { dragging, ...rest } = props as Partial<ListReorderProps> & { dragging?: boolean };
    return (
      <ListReorder {...labels} heading="Theme priority" numbered {...rest}>
        <ListReorderItem itemId="lagoon" title="Lagoon" description="Default" dragging={dragging} />
        <ListReorderItem itemId="lagoon-dark" title="Lagoon Dark" description="Inherits Lagoon" />
        <ListReorderItem itemId="orbit-brand" title="Orbit Brand" description="Imported" />
        <ListReorderItem itemId="high-contrast" title="High contrast" description="Draft" end={<Badge tone="warning">Draft</Badge>} />
      </ListReorder>
    );
  },
  frame: children => <div className="w-110">{children}</div>,
  examples: {
    'reorderable-list': () => (
      <ListReorder {...labels} heading="Theme priority" numbered className="mx-auto max-w-120">
        <ListReorderItem
          itemId="lagoon" title="Lagoon" description="Default"
          end={<span aria-hidden className="size-3 rounded-full bg-accent-solid" />}
        />
        <ListReorderItem itemId="lagoon-dark" title="Lagoon Dark" description="Inherits Lagoon" />
        <ListReorderItem itemId="orbit-brand" title="Orbit Brand" description="Imported" />
        <ListReorderItem itemId="high-contrast" title="High contrast" description="Draft" end={<Badge tone="warning">Draft</Badge>} />
      </ListReorder>
    ),
  },
});
