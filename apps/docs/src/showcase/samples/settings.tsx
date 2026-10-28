import {
  Activity, ArrowUpRight, Bell, Building2, Copy, CreditCard, Download, Ellipsis, ExternalLink, Filter, Plug, Search, Send, ShieldCheck, Trash2, UserMinus, Users,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import {
  Alert, Avatar, Badge, Button, Card, CardHeadline, Checkbox, Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, Field, FileUpload, type FileUploadItem, FormLayout, FormLayoutFooter, FormLayoutSection, IconButton, Input,
  ListDescription, ListDescriptionRow, ListNavigation, ListNavigationGroup, ListNavigationItem, Menu, MenuItem, MenuSeparator, Progress,
  RadioGroup, RadioGroupItem, SectionHeader, Select, SelectOption, Switch, Table, TagInput, Toast, ToggleGroup, ToggleGroupItem,
  type TableColumn, type TableRow,
} from '@caustic/react';

type Role = 'owner' | 'admin' | 'editor' | 'viewer';
type MemberStatus = 'active' | 'invited' | 'suspended' | 'working';
type IdentityColor = 'coral' | 'iris' | 'mint' | 'amber' | 'slate';

type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
  lastActive: string;
  color?: IdentityColor;
  agent?: boolean;
};

const workspaceSlug = 'fieldnote-studio';

const members: Member[] = [
  { id: 'mina', name: 'Mina Kang', email: 'mina@fieldnote.io', role: 'owner', status: 'active', lastActive: '2 min ago', color: 'coral' },
  { id: 'jun', name: 'Jun Seo', email: 'jun@fieldnote.io', role: 'admin', status: 'active', lastActive: '1 hr ago', color: 'iris' },
  { id: 'tomas', name: 'Tomás Ortega', email: 'tomas@fieldnote.io', role: 'editor', status: 'active', lastActive: '14 min ago', color: 'mint' },
  { id: 'priya', name: 'Priya Raman', email: 'priya@fieldnote.io', role: 'editor', status: 'invited', lastActive: 'Invited Oct 21', color: 'amber' },
  { id: 'lena', name: 'Lena Fischer', email: 'lena@fieldnote.io', role: 'viewer', status: 'active', lastActive: 'Yesterday', color: 'slate' },
  { id: 'dahee', name: 'Dahee Han', email: 'dahee@fieldnote.io', role: 'viewer', status: 'suspended', lastActive: '12 days ago', color: 'coral' },
  { id: 'caustic', name: 'Caustic', email: 'Agent · Claude', role: 'editor', status: 'working', lastActive: 'Now', agent: true },
];

const memberById = new Map(members.map(m => [m.id, m] as const));
const memberRows: TableRow[] = members.map(m => ({ ...m, member: m.name }));

const memberColumns: TableColumn[] = [
  { key: 'member', header: 'Member' },
  { key: 'role', header: 'Role', width: 150 },
  { key: 'status', header: 'Status' },
  { key: 'lastActive', header: 'Last active' },
];

const invoiceColumns: TableColumn[] = [
  { key: 'invoice', header: 'Invoice' },
  { key: 'date', header: 'Date' },
  { key: 'amount', header: 'Amount', align: 'end' },
  { key: 'status', header: 'Status' },
];

const invoiceRows: TableRow[] = [
  { id: 'INV-2026-0109', invoice: 'INV-2026-0109', note: 'Team · 8 seats, billed yearly', date: 'Jan 9, 2026', amount: '$2,304.00', status: 'Paid' },
  { id: 'INV-2026-0412', invoice: 'INV-2026-0412', note: 'Seat add-on · 2 seats, prorated', date: 'Apr 12, 2026', amount: '$96.00', status: 'Paid' },
  { id: 'INV-2025-0109', invoice: 'INV-2025-0109', note: 'Team · 8 seats, billed yearly', date: 'Jan 9, 2025', amount: '$1,920.00', status: 'Paid' },
];

const panel = 'grid min-w-0 content-start gap-5 rounded-3xl bg-surface-base p-5 @min-[40rem]:p-6 shadow-[inset_0_0_0_1px_var(--cs-color-border-subtle)]';

const memberToolbar = (
  <>
    <div className="w-full @min-[30rem]:w-64"><Input size="sm" aria-label="Search members" prefix={<Search />} placeholder="Search members" /></div>
    <span className="flex-1" />
    <Button tone="secondary" size="sm" iconStart={<Filter />}>Role</Button>
  </>
);

function PrefRow({ title, description, defaultChecked = false }: { title: string; description: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <b className="block text-ui-strong text-text-primary">{title}</b>
        <span className="block text-ui-sm text-text-tertiary">{description}</span>
      </div>
      <Switch aria-label={title} defaultChecked={defaultChecked} />
    </div>
  );
}

function CheckRow({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex min-h-7 items-center gap-2.5">
      <Checkbox aria-label={label} defaultChecked={defaultChecked} />
      <span className="text-ui text-text-primary">{label}</span>
    </div>
  );
}

export default function Sample() {
  const [seatWarning, setSeatWarning] = useState(true);
  const [logo, setLogo] = useState<FileUploadItem[]>([
    { id: 'logo-current', name: 'fieldnote-studio.svg', status: 'done', description: '18 KB · Uploaded' },
  ]);
  const [roles, setRoles] = useState<Record<string, Role>>(() => Object.fromEntries(members.map(m => [m.id, m.role] as const)));
  const [emails, setEmails] = useState<string[]>(['sam@fieldnote.io', 'ana@fieldnote.io']);
  const [inviteRole, setInviteRole] = useState('editor');
  const [inviteSent, setInviteSent] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmName, setConfirmName] = useState('');

  const renderMemberCell = (row: TableRow, column: TableColumn): ReactNode => {
    const m = memberById.get(row.id);
    if (!m) return null;
    if (column.key === 'member') {
      return (
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={m.name} kind={m.agent ? 'agent' : 'person'} color={m.color} size="md" presence={m.status === 'active'} />
          <div className="min-w-0">
            <b className="block truncate font-medium">{m.name}</b>
            <span className="block truncate text-ui-sm font-normal text-text-tertiary">{m.email}</span>
          </div>
        </div>
      );
    }
    if (column.key === 'role') {
      const locked = m.role === 'owner' || m.agent === true;
      return (
        <Select
          aria-label={`Role for ${m.name}`}
          value={roles[m.id] ?? m.role}
          disabled={locked}
          onValueChange={v => setRoles(prev => ({ ...prev, [m.id]: v as Role }))}
          className="h-control-sm w-36"
        >
          <SelectOption value="owner" disabled>Owner</SelectOption>
          <SelectOption value="admin">Admin</SelectOption>
          <SelectOption value="editor">Editor</SelectOption>
          <SelectOption value="viewer">Viewer</SelectOption>
        </Select>
      );
    }
    if (column.key === 'status') {
      if (m.status === 'invited') return <Badge tone="info" dot>Invited</Badge>;
      if (m.status === 'suspended') return <Badge tone="neutral" dot>Suspended</Badge>;
      if (m.status === 'working') return <Badge tone="agent" dot>Working</Badge>;
      return <Badge tone="success" dot>Active</Badge>;
    }
    return <span className="whitespace-nowrap text-text-secondary">{m.lastActive}</span>;
  };

  const memberActions = (row: TableRow): ReactNode => {
    const m = memberById.get(row.id);
    if (!m) return null;
    const label = `Actions for ${m.name}`;
    return (
      <Menu aria-label={label} align="end" trigger={<IconButton label={label} size="xs"><Ellipsis /></IconButton>}>
        <MenuItem icon={<Activity />}>View activity</MenuItem>
        <MenuItem icon={<Copy />}>Copy email</MenuItem>
        <MenuSeparator />
        <MenuItem tone="danger" icon={<UserMinus />} disabled={m.role === 'owner'}>Remove from workspace</MenuItem>
      </Menu>
    );
  };

  const renderInvoiceCell = (row: TableRow, column: TableColumn): ReactNode => {
    if (column.key === 'invoice') {
      return (
        <div className="min-w-0">
          <b className="block font-mono text-ui-sm font-medium">{String(row.invoice)}</b>
          <span className="block text-ui-sm font-normal text-text-tertiary">{String(row.note)}</span>
        </div>
      );
    }
    if (column.key === 'status') return <Badge tone="success" dot>{String(row.status)}</Badge>;
    return String(row[column.key]);
  };

  const invoiceActions = (row: TableRow): ReactNode => (
    <IconButton label={`Download ${String(row.invoice)}`} size="xs"><Download /></IconButton>
  );

  const emailCount = emails.length;

  return (
    <div className="@container mx-auto w-full min-w-0 max-w-[1100px] px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-4 pb-6">
        <div className="grid min-w-0 gap-1.5">
          <h1 className="text-title-1 text-text-primary">Workspace settings</h1>
          <p className="text-ui text-text-secondary">Fieldnote Studio · who is on the team, what you pay, and who hears about it.</p>
        </div>
        <Button tone="secondary" size="sm" iconStart={<ExternalLink />}>Open workspace</Button>
      </div>

      <div className="grid gap-6 @min-[56rem]:grid-cols-[13.5rem_minmax(0,1fr)] @min-[56rem]:gap-10">
        <aside className="@min-[56rem]:sticky @min-[56rem]:top-6 @min-[56rem]:self-start">
          <ListNavigation aria-label="Settings sections">
            <ListNavigationGroup>
              <ListNavigationItem icon={<Building2 />}>General</ListNavigationItem>
              <ListNavigationItem icon={<Users />} current count={10}>Team</ListNavigationItem>
              <ListNavigationItem icon={<CreditCard />}>Billing</ListNavigationItem>
              <ListNavigationItem icon={<ShieldCheck />}>Security</ListNavigationItem>
              <ListNavigationItem icon={<Plug />} count={4}>Integrations</ListNavigationItem>
              <ListNavigationItem icon={<Bell />}>Notifications</ListNavigationItem>
            </ListNavigationGroup>
          </ListNavigation>
        </aside>

        <div className="grid min-w-0 content-start gap-8">
          {seatWarning && (
            <Alert
              layout="page"
              tone="warning"
              dismissible
              dismissLabel="Dismiss seat warning"
              onDismiss={() => setSeatWarning(false)}
              action={<Button tone="secondary" size="xs">Add seats</Button>}
            >
              <b>Seat limit reached.</b> All 10 seats on Team are in use. Remove a member or add seats before you invite more people.
            </Alert>
          )}

          <FormLayout
            title="Workspace"
            description="Logo, name and URL that everyone in Fieldnote Studio sees."
            onSubmit={e => e.preventDefault()}
          >
            <FormLayoutSection title="Logo" description="Shown in the sidebar and on shared links. Use a square mark.">
              <FileUpload
                accept="image/png,image/svg+xml"
                multiple={false}
                hint="SVG or PNG · up to 2 MB"
                uploadLabel="Upload workspace logo"
                files={logo}
                onFilesSelected={picked => {
                  const file = picked[0];
                  if (file) {
                    setLogo([{ id: `logo-${file.name}`, name: file.name, status: 'done', description: `${Math.max(1, Math.round(file.size / 1024))} KB · Uploaded` }]);
                  }
                }}
                onRemove={() => setLogo([])}
              />
            </FormLayoutSection>
            <FormLayoutSection title="Name and URL" description="Teammates open the workspace at this address.">
              <Field label="Workspace name">
                <Input defaultValue="Fieldnote Studio" />
              </Field>
              <Field label="Workspace URL" error="Use lowercase letters, numbers and dashes. Try fieldnote-studio.">
                <Input addons prefix="fieldnote.app/" defaultValue="fieldnote studio" />
              </Field>
            </FormLayoutSection>
            <FormLayoutFooter />
          </FormLayout>

          <section className={panel}>
            <SectionHeader title="Invite people" description="New people join with the role you pick. Each pending invite uses a seat." />
            {inviteSent && (
              <Toast
                title="2 invites are waiting for a seat"
                description="Sam and Ana get an email as soon as a seat is free."
                onDismiss={() => setInviteSent(false)}
              />
            )}
            <form className="grid gap-4" onSubmit={e => { e.preventDefault(); setInviteSent(true); }}>
              <div className="grid gap-4 @min-[40rem]:grid-cols-[minmax(0,1fr)_11rem] @min-[40rem]:items-start">
                <Field label="Email addresses" hint="Press Enter after each address.">
                  <TagInput placeholder="name@company.com" value={emails} onValueChange={setEmails} />
                </Field>
                <Field label="Role">
                  <Select aria-label="Invite role" value={inviteRole} onValueChange={setInviteRole}>
                    <SelectOption value="admin">Admin</SelectOption>
                    <SelectOption value="editor">Editor</SelectOption>
                    <SelectOption value="viewer">Viewer</SelectOption>
                  </Select>
                </Field>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-ui-sm text-text-tertiary">0 seats are free. Invites wait until a seat opens.</p>
                <Button type="submit" iconStart={<Send />} disabled={emailCount === 0}>
                  Send {emailCount} {emailCount === 1 ? 'invite' : 'invites'}
                </Button>
              </div>
            </form>
          </section>

          <div className="grid min-w-0 gap-4">
            <SectionHeader title="Members" description="Owners and admins manage billing, roles and invites." />
            <Table
              columns={memberColumns}
              rows={memberRows}
              renderCell={renderMemberCell}
              rowActions={memberActions}
              toolbar={memberToolbar}
              summary="Showing 7 of 10 members"
              page={1}
              pageCount={2}
              pagerLabel="Member pages"
            />
          </div>

          <div className="grid min-w-0 gap-4">
            <SectionHeader title="Plan" description="Billing is per seat. Changes apply on the next invoice." />
            <Card variant="feature">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="grid min-w-0 gap-1.5">
                  <div><Badge tone="accent">Current plan</Badge></div>
                  <CardHeadline>Team</CardHeadline>
                  <p className="text-ui text-text-secondary">$24 per seat a month, billed yearly. Renews Jan 9, 2027.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button tone="ghost" size="sm">Compare plans</Button>
                  <Button tone="accent" size="sm" iconEnd={<ArrowUpRight />}>Upgrade to Business</Button>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-baseline justify-between gap-3 text-ui">
                  <span className="text-text-secondary">Seats</span>
                  <span className="tabular-nums text-text-primary">10 of 10 used</span>
                </div>
                <Progress aria-label="Seats used" value={100} />
                <p className="text-ui-sm text-text-tertiary">Business adds seats at $18 each, with no minimum.</p>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 @min-[40rem]:grid-cols-2">
            <section className={panel}>
              <SectionHeader title="Payment method" action={<Button tone="secondary" size="sm">Update</Button>} />
              <div className="flex items-center gap-3">
                <span className="grid size-control-lg flex-none place-items-center rounded-lg bg-neutral-well text-text-primary [&_svg]:size-icon-md">
                  <CreditCard />
                </span>
                <div className="min-w-0 flex-1">
                  <b className="block font-medium">Visa ending in 4242</b>
                  <span className="block text-ui-sm text-text-tertiary">Expires 08/2028 · Used for all invoices</span>
                </div>
                <Badge tone="neutral">Default</Badge>
              </div>
            </section>
            <section className={panel}>
              <SectionHeader title="Billing details" />
              <div className="text-ui">
                <ListDescription aria-label="Billing details">
                  <ListDescriptionRow term="Legal name">Fieldnote GmbH</ListDescriptionRow>
                  <ListDescriptionRow term="Billing email" copyValue="finance@fieldnote.io">finance@fieldnote.io</ListDescriptionRow>
                  <ListDescriptionRow term="Tax ID" mono copyValue="DE 312 884 207">DE 312 884 207</ListDescriptionRow>
                  <ListDescriptionRow term="Address">Lange Str. 14, Hamburg</ListDescriptionRow>
                </ListDescription>
              </div>
            </section>
          </div>

          <div className="grid min-w-0 gap-4">
            <SectionHeader
              title="Invoices"
              description="Paid invoices stay available for seven years."
              action={<Button tone="secondary" size="sm" iconStart={<Download />}>Download all</Button>}
            />
            <Table
              columns={invoiceColumns}
              rows={invoiceRows}
              renderCell={renderInvoiceCell}
              rowActions={invoiceActions}
              summary="Next invoice: $2,880.00 on Jan 9, 2027"
            />
          </div>

          <section className={panel}>
            <SectionHeader title="Billing notifications" description="Choose who hears about seats, renewals and failed charges." />
            <div className="grid gap-6 @min-[40rem]:grid-cols-2">
              <div className="grid content-start gap-4">
                <PrefRow title="Seat limit warnings" description="Email owners at 90% and at 100% of seats." defaultChecked />
                <PrefRow title="Failed payment alerts" description="Tell owners the same day a charge fails." defaultChecked />
                <PrefRow title="Weekly usage digest" description="Seats, agent runs and invoices every Monday." />
                <Field group label="Send invoices to">
                  <div className="grid gap-2.5">
                    <CheckRow label="Owners" defaultChecked />
                    <CheckRow label="Finance" defaultChecked />
                    <CheckRow label="Admins" />
                  </div>
                </Field>
              </div>
              <div className="grid content-start gap-4">
                <Field group label="Renewal reminder" hint="Sent by email to owners.">
                  <RadioGroup aria-label="Renewal reminder" defaultValue="7d" className="gap-2.5">
                    <RadioGroupItem value="7d">7 days before</RadioGroupItem>
                    <RadioGroupItem value="1d">1 day before</RadioGroupItem>
                    <RadioGroupItem value="off">Do not remind me</RadioGroupItem>
                  </RadioGroup>
                </Field>
                <Field group label="Invoice delivery">
                  <ToggleGroup type="single" appearance="outline" aria-label="Invoice delivery" defaultValue="email">
                    <ToggleGroupItem value="email" className="w-auto px-3">Email</ToggleGroupItem>
                    <ToggleGroupItem value="slack" className="w-auto px-3">Slack</ToggleGroupItem>
                    <ToggleGroupItem value="both" className="w-auto px-3">Both</ToggleGroupItem>
                  </ToggleGroup>
                </Field>
              </div>
            </div>
          </section>

          <section className="grid min-w-0 gap-4 rounded-3xl bg-surface-base p-5 @min-[40rem]:p-6 shadow-[inset_0_0_0_1px_var(--cs-color-danger-soft)]">
            <SectionHeader title={<span className="text-danger-text">Danger zone</span>} description="Actions in this section cannot be undone." />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <b className="block text-ui-strong text-text-primary">Delete Fieldnote Studio</b>
                <span className="block text-ui-sm text-text-tertiary">Removes 14 projects, 3 libraries and every comment for all 10 members.</span>
              </div>
              <Dialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                showClose
                closeLabel="Close"
                trigger={<Button tone="danger" iconStart={<Trash2 />}>Delete workspace</Button>}
              >
                <DialogHeader>
                  <DialogTitle>Delete Fieldnote Studio?</DialogTitle>
                  <DialogDescription>Projects, libraries and comments are deleted for all 10 members. This cannot be undone.</DialogDescription>
                </DialogHeader>
                <Field label={`Type ${workspaceSlug} to confirm`}>
                  <Input value={confirmName} onChange={e => setConfirmName(e.target.value)} placeholder={workspaceSlug} autoComplete="off" />
                </Field>
                <DialogFooter>
                  <DialogClose asChild><Button tone="ghost" size="sm">Cancel</Button></DialogClose>
                  <Button tone="destructive" size="sm" iconStart={<Trash2 />} disabled={confirmName !== workspaceSlug} onClick={() => setDeleteOpen(false)}>
                    Delete workspace
                  </Button>
                </DialogFooter>
              </Dialog>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
