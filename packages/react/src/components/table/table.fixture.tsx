import { Ellipsis, Filter, Search, UserPlus } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { Avatar } from '../avatar/avatar.tsx';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { Input } from '../input/input.tsx';
import { Table, type TableColumn, type TableRow } from './table.tsx';

const columns: TableColumn[] = [
  { key: 'member', header: 'Member', sortable: true },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
  { key: 'edits', header: 'Edits', align: 'end', sortable: true },
];

const rows: TableRow[] = [
  { id: 'mina', member: 'Mina Kang', email: 'mina@orbit.co', role: 'Admin', status: 'Active', edits: '1,284' },
  { id: 'jun', member: 'Jun Seo', email: 'jun@orbit.co', role: 'Editor', status: 'Invited', edits: '0' },
  { id: 'caustic', member: 'Caustic', email: 'Agent · Claude', role: 'Agent', status: 'Working', edits: '3,912' },
  { id: 'dahee', member: 'Dahee Han', email: 'dahee@orbit.co', role: 'Viewer', status: 'Suspended', edits: '56' },
];

// A longer roster for the sticky-header example: the four members repeated so the body scrolls under the heading.
const longRows: TableRow[] = Array.from({ length: 3 }, (_, i) => rows.map(r => ({ ...r, id: `${r.id}-${i}` }))).flat();

const avatarOf = (id: string): ReactNode => {
  id = id.replace(/-\d+$/, '');
  const name = String(rows.find(r => r.id === id)?.member);
  if (id === 'caustic') return <Avatar name={name} kind="agent" />;
  return <Avatar name={name} color={id === 'mina' ? 'coral' : id === 'jun' ? 'iris' : 'mint'} />;
};

const status = (value: string): ReactNode => {
  if (value === 'Active') return <Badge tone="success" dot>Active</Badge>;
  if (value === 'Invited') return <Badge tone="info" dot>Invited</Badge>;
  if (value === 'Working') return <Badge tone="agent" dot>Working</Badge>;
  return <Badge tone="neutral" dot>Suspended</Badge>;
};

const renderCell = (row: TableRow, column: TableColumn): ReactNode => {
  if (column.key === 'member') {
    return (
      <div className="flex items-center gap-2.5">
        {avatarOf(row.id)}
        <div>
          <b className="block font-medium">{String(row.member)}</b>
          <span className="text-ui-sm font-normal text-text-tertiary [[aria-selected=true]_&]:text-text-secondary">{String(row.email)}</span>
        </div>
      </div>
    );
  }
  if (column.key === 'status') return status(String(row.status));
  return String(row[column.key]);
};

const rowActions = () => <IconButton label="Row actions" size="xs"><Ellipsis /></IconButton>;

const toolbar = (
  <>
    <div className="w-[var(--cs-size-menu-min)]"><Input size="sm" aria-label="Search members" prefix={<Search />} placeholder="Search members" /></div>
    <span className="flex-1" />
    <Button tone="secondary" size="sm" iconStart={<Filter />}>Role</Button>
    <Button size="sm" iconStart={<UserPlus />}>Invite</Button>
  </>
);

// Cases share one page; each pager gets its own name so the landmarks stay unique.
function Case(props: Record<string, unknown>) {
  const id = useId();
  return <Table columns={columns} rows={rows} renderCell={renderCell} rowActions={rowActions} toolbar={toolbar} page={2} pageCount={2} pagerLabel={`Pagination ${id}`} {...props} />;
}

export default defineFixture({
  id: 'table',
  // No selection and no sort by default. The current page is 2 so the first page button is a
  // plain one; the "selected" state (page 1) shows the current-page style.
  render: props => <Case {...props} />,
  examples: {
    table: () => (
      <Table
        columns={columns} rows={rows} renderCell={renderCell} rowActions={rowActions} toolbar={toolbar}
        selectable defaultSelectedKeys={['mina']} sort={{ key: 'member', direction: 'descending' }} page={1} pageCount={2}
        rowLabel={row => String(row.member).split(' ')[0]!}
      />
    ),
    // maxHeight caps the scroll area: the body scrolls and the heading stays at the top with its raised fill.
    'sticky-header': () => (
      <Table
        columns={columns} rows={longRows} renderCell={renderCell} rowActions={rowActions} maxHeight={280}
        summary={`${longRows.length} members`}
      />
    ),
  },
});
