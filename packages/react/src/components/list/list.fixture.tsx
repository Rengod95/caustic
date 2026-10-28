import { Archive, Bell, Component, Copy, Diamond, Download, Ellipsis, Flag, Frame, KeyRound, Trash2, User, WandSparkles } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import type { Tone, Variant } from '../../lib/common-props.ts';
import { Avatar } from '../avatar/avatar.tsx';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { SectionHeader, SectionHeaderLink } from '../section-header/section-header.tsx';
import { Switch } from '../switch/switch.tsx';
import { List, ListAddRow, ListGroup, ListGroupFooter, ListGroupHeading, ListRow, type ListRowProps } from './list.tsx';
import type { ListReorderAnnouncement } from './use-list-reorder.ts';
import type { ListRowAction } from './use-row-actions.ts';

const ThumbA = () => <span className="block size-full bg-linear-to-br from-identity-mint to-identity-slate" />;
const ThumbB = () => <span className="block size-full bg-linear-to-br from-identity-amber to-identity-iris" />;
const ThumbC = () => <span className="block size-full bg-linear-to-r from-identity-mint to-identity-slate" />;

// Reorder labels (the former ListReorder fixture): no built-in English, the consumer supplies them.
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

// Row actions (the former ListActions fixture). The first tray action takes actionTone / actionVariant so the tone probes land on Archive.
const tray = (tone?: Tone, variant?: Variant): ListRowAction[] => [
  { id: 'archive', label: 'Archive', icon: <Archive />, ...(tone && { tone }), ...(variant && { variant }) },
  { id: 'flag', label: 'Flag', tone: 'warning', icon: <Flag /> },
  { id: 'delete', label: 'Delete', tone: 'danger', icon: <Trash2 /> },
];
const tools: ListRowAction[] = [
  { id: 'copy', label: 'Copy', icon: <Copy /> },
  { id: 'download', label: 'Download', icon: <Download /> },
  { id: 'delete', label: 'Delete', icon: <Trash2 /> },
];

// Opaque collection rows (the former AppendList fixture).
const axes = (
  <>
    <ListRow icon={<Diamond />} title="Size" description="· sm, md, lg" end={<Badge shape="square">3</Badge>} />
    <ListRow icon={<Diamond />} title="Tone" description="· ink, accent, glass" end={<Badge shape="square">3</Badge>} />
    <ListRow icon={<Diamond />} title="State" description="· rest, hover, press, off" end={<Badge tone="warning" shape="square">1 missing</Badge>} />
  </>
);
const options = <IconButton size="xs" label="Options"><Ellipsis /></IconButton>;

type Props = Record<string, unknown> & {
  selectionMode?: 'none' | 'single' | 'multiple'; reorderable?: boolean; rowActions?: 'none' | 'hover' | 'swipe';
  tone?: Tone; status?: ListRowProps['status']; tint?: ListRowProps['tint']; dragging?: boolean; defaultValue?: string | string[] | null;
  defaultOpen?: boolean; actionTone?: Tone; actionVariant?: Variant;
  onClick?: ListRowProps['onClick']; onAction?: ListRowProps['onAction']; onOpenChange?: ListRowProps['onOpenChange']; onAdd?: () => void;
};

export default defineFixture({
  id: 'list',
  render: props => {
    const {
      selectionMode = 'none', reorderable = false, rowActions = 'none', tone, status, tint, dragging, defaultValue, defaultOpen, actionTone, actionVariant,
      onClick, onAction, onOpenChange, onAdd, onValueChange, onReorder, ...rest
    } = props as Props;
    // A behaviour colours its marks / grip from the list tone; unset is accent, so the default neutral case leaves it unset.
    const markTone = tone === 'neutral' ? undefined : tone;
    if (selectionMode !== 'none') {
      const multiple = selectionMode === 'multiple';
      // The checked state passes defaultValue "first"; multiple mode promotes it to a one-item array.
      const value = multiple
        ? (typeof defaultValue === 'string' ? [defaultValue] : (defaultValue ?? []))
        : (defaultValue === undefined ? 'second' : defaultValue);
      return multiple ? (
        <List heading="Notify me about" {...rest} tone={markTone} selectionMode="multiple" defaultValue={value} onValueChange={onValueChange as never}>
          <ListRow itemValue="first" title="Mentions" />
          <ListRow itemValue="second" title="Agent asks for approval" />
          <ListRow itemValue="third" title="Every publish" description="Can be noisy on large teams" />
        </List>
      ) : (
        <List heading="Appearance" {...rest} tone={markTone} selectionMode="single" defaultValue={value} onValueChange={onValueChange as never}>
          <ListRow itemValue="first" title="Light" />
          <ListRow itemValue="second" title="Dark" />
          <ListRow itemValue="third" title="Match system" description="Follows your OS setting" />
        </List>
      );
    }
    if (reorderable) {
      return (
        <List {...labels} heading="Theme priority" numbered {...rest} tone={markTone} reorderable onReorder={onReorder as never}>
          <ListRow itemValue="lagoon" title="Lagoon" description="Default" dragging={dragging} />
          <ListRow itemValue="lagoon-dark" title="Lagoon Dark" description="Inherits Lagoon" />
          <ListRow itemValue="orbit-brand" title="Orbit Brand" description="Imported" />
          <ListRow itemValue="high-contrast" title="High contrast" description="Draft" end={<Badge tone="warning">Draft</Badge>} />
        </List>
      );
    }
    if (rowActions !== 'none') {
      return (
        <List aria-label="Files" {...rest} tone={tone} rowActions={rowActions}>
          {rowActions === 'swipe' ? (
            <ListRow
              leading={<Avatar name="Mina Kang" color="coral" size="lg" />} title="Mina commented" description="Total should be bold, not the label." end="2m"
              actions={tray(actionTone, actionVariant)} defaultOpen={defaultOpen} onAction={onAction} onOpenChange={onOpenChange}
            />
          ) : (
            <ListRow title="tokens.css" description="112 lines" actions={tools} onAction={onAction} />
          )}
        </List>
      );
    }
    if (rest.variant === 'opaque') {
      return (
        <List heading="Variant axes" headingEnd={options} {...rest} tone={tone}>
          {axes}
          <ListAddRow onAdd={onAdd}>Add axis</ListAddRow>
        </List>
      );
    }
    return (
      <ListGroup>
        <ListGroupHeading>Settings</ListGroupHeading>
        <List heading="Workspace" headingEnd="3" tone={tone} {...rest}>
          <ListRow
            icon={<User />} tint={tint} tone={tone} status={status} title="Account" description="mina@orbit.co" value="Mentions only"
            end="2m" navigates onClick={onClick ?? (() => {})}
          />
          <ListRow thumb={<ThumbA />} duration="0:12" title="Checkout prototype" description="Recording · Jun · 1h ago" />
          <ListRow
            leading={<Avatar name="Mina Kang" color="coral" size="lg" />} title="Mina Kang" description="Editing Pricing"
            end={<Switch size="sm" defaultChecked aria-label="Notify Mina" />}
          />
        </List>
        <ListGroupFooter>Changes apply to the whole workspace.</ListGroupFooter>
      </ListGroup>
    );
  },
  frame: children => <div className="w-110">{children}</div>,
  examples: {
    'grouped-list': () => (
      <ListGroup className="mx-auto max-w-110">
        <ListGroupHeading>Workspace</ListGroupHeading>
        <List size="sm">
          <ListRow icon={<User />} tint="mint" title="Account" description="mina@orbit.co" navigates href="#" />
          <ListRow icon={<Bell />} tint="mint" title="Notifications" value="Mentions only" navigates href="#" />
          <ListRow
            icon={<WandSparkles />} tint="amber" title="Agent edits shared components" description="Asks before changing instances"
            end={<Switch size="sm" defaultChecked aria-label="Agent edits shared components" />}
          />
          <ListRow icon={<KeyRound />} tint="slate" title="Providers" value="2 connected" navigates href="#" />
        </List>
        <ListGroupFooter>The agent never publishes without your approval.</ListGroupFooter>
        <List size="sm" className="mt-3" aria-label="Danger zone">
          <ListRow tone="danger" title="Leave workspace" href="#" />
        </List>
      </ListGroup>
    ),
    'avatar-list': () => (
      <List heading="Members" headingEnd="4" className="mx-auto max-w-120">
        <ListRow
          leading={<Avatar name="Mina Kang" color="coral" size="lg" presence />} title="Mina Kang" description="mina@orbit.co · editing Pricing"
          end={<Badge tone="outline" shape="square">Admin</Badge>}
        />
        <ListRow
          leading={<Avatar name="Jun Seo" color="iris" size="lg" />} title="Jun Seo" description="Invited 2 days ago"
          end={<Button tone="ghost" size="xs">Resend</Button>}
        />
        <ListRow leading={<Avatar name="Caustic" kind="agent" size="lg" />} title="Caustic" description="Agent · working on Team card" status="working" />
        <ListRow
          leading={<Avatar name="Dahee Han" color="mint" size="lg" />} title="Dahee Han" description="Viewer"
          end={<IconButton size="xs" label="Member actions"><Ellipsis /></IconButton>}
        />
      </List>
    ),
    'media-list': () => (
      <List size="lg" className="mx-auto max-w-120">
        <ListRow href="#" thumb={<ThumbA />} title="Pricing / Desktop" description="4 frames · Mina · 2m ago" navigates />
        <ListRow href="#" thumb={<ThumbB />} duration="0:12" title="Checkout prototype" description="Recording · Jun · 1h ago" navigates />
        <ListRow
          href="#" thumb={<ThumbC />} title="Onboarding / iOS" description="7 frames · Caustic · yesterday"
          end={<Badge tone="info">Review</Badge>} navigates
        />
      </List>
    ),
    'section-header-in-a-list': () => (
      <div className="mx-auto grid w-full max-w-110 gap-5">
        <SectionHeader size="sm" title="Today" action={<Badge>3</Badge>} />
        <List size="sm" aria-label="Today">
          <ListRow href="#" icon={<Frame />} tint="mint" title="Pricing / Desktop" description="Caustic applied spacing" value="2:41" navigates />
          <ListRow href="#" icon={<Component />} tint="iris" title="Button / Primary" description="Mina changed radius" value="1:12" navigates />
        </List>
        <SectionHeader
          size="sm" title="Earlier this week" description="Restorable for 30 days."
          action={<SectionHeaderLink href="#" chevron={false}>Show all</SectionHeaderLink>}
        />
      </div>
    ),
    // ── Former ListSelection (selectionMode)
    'list-selection-selection-list': () => (
      <div className="grid w-full grid-cols-2 items-start gap-3.5">
        <List heading="Appearance" selectionMode="single" defaultValue="dark">
          <ListRow itemValue="light" title="Light" />
          <ListRow itemValue="dark" title="Dark" />
          <ListRow itemValue="system" title="Match system" description="Follows your OS setting" />
        </List>
        <List heading="Notify me about" selectionMode="multiple" defaultValue={['mentions', 'approval']}>
          <ListRow itemValue="mentions" title="Mentions" />
          <ListRow itemValue="approval" title="Agent asks for approval" />
          <ListRow itemValue="publish" title="Every publish" description="Can be noisy on large teams" />
        </List>
      </div>
    ),
    'list-selection-radio-indicator': () => (
      <div className="mx-auto w-full max-w-96">
        <List heading="Appearance" selectionMode="single" indicator="radio" defaultValue="dark">
          <ListRow itemValue="light" title="Light" />
          <ListRow itemValue="dark" title="Dark" />
          <ListRow itemValue="system" title="Match system" description="Follows your OS setting" />
        </List>
      </div>
    ),
    // ── Former ListReorder (reorderable)
    'list-reorder-reorderable-list': () => (
      <List {...labels} reorderable heading="Theme priority" numbered className="mx-auto max-w-120">
        <ListRow
          itemValue="lagoon" title="Lagoon" description="Default"
          end={<span aria-hidden className="size-3 rounded-full bg-accent-solid" />}
        />
        <ListRow itemValue="lagoon-dark" title="Lagoon Dark" description="Inherits Lagoon" />
        <ListRow itemValue="orbit-brand" title="Orbit Brand" description="Imported" />
        <ListRow itemValue="high-contrast" title="High contrast" description="Draft" end={<Badge tone="warning">Draft</Badge>} />
      </List>
    ),
    // ── Former ListActions (rowActions)
    'list-actions-row-actions': () => (
      <div className="grid w-full grid-cols-2 items-start gap-3.5">
        <List heading="Swipe left" rowActions="swipe">
          <ListRow
            leading={<Avatar name="Mina Kang" color="coral" size="lg" />} title="Mina commented"
            description="Total should be bold, not the label." end="2m" actions={tray()}
          />
          <ListRow
            defaultOpen leading={<Avatar name="Caustic" kind="agent" size="lg" />} title="Caustic needs approval"
            description="Edit the shared Button component?" end="5m" actions={tray()}
          />
        </List>
        <List heading="Hover" rowActions="hover">
          <ListRow title="tokens.css" description="112 lines" actions={tools} />
          <ListRow title="PricingCard.tsx" description="48 lines" actions={tools} />
        </List>
      </div>
    ),
    // ── Former AppendList (variant opaque + ListAddRow)
    'append-list': () => (
      <List variant="opaque" heading="Variant axes" headingEnd={options}>
        {axes}
        <ListAddRow>Add axis</ListAddRow>
      </List>
    ),
    'append-list-heading-band': () => (
      <List variant="opaque" headingBand heading="Variant axes" headingEnd={options}>
        {axes}
        <ListAddRow>Add axis</ListAddRow>
      </List>
    ),
  },
});
