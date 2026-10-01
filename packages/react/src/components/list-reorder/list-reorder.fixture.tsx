import { defineFixture } from '../../lib/fixture.ts';
import { Badge } from '../badge/badge.tsx';
import { ListReorder, ListReorderItem, type ListReorderProps } from './list-reorder.tsx';

export default defineFixture({
  id: 'list-reorder',
  render: props => {
    const { dragging, ...rest } = props as Partial<ListReorderProps>;
    return (
      <ListReorder heading="Theme priority" numbered {...rest}>
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
      <ListReorder heading="Theme priority" numbered className="mx-auto max-w-120">
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
