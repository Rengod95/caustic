import { Bell, Component, Ellipsis, Frame, KeyRound, User, WandSparkles } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Avatar } from '../avatar/avatar.tsx';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { SectionHeader, SectionHeaderLink } from '../section-header/section-header.tsx';
import { Switch } from '../switch/switch.tsx';
import { List, ListGroup, ListGroupFooter, ListGroupHeading, ListRow, type ListProps, type ListRowProps } from './list.tsx';

const ThumbA = () => <span className="block size-full bg-linear-to-br from-identity-mint to-identity-slate" />;
const ThumbB = () => <span className="block size-full bg-linear-to-br from-identity-amber to-identity-iris" />;
const ThumbC = () => <span className="block size-full bg-linear-to-r from-identity-mint to-identity-slate" />;

export default defineFixture({
  id: 'list',
  render: props => {
    const { tone, status, tint, onClick, ...rest } = props as Partial<ListProps> & Pick<ListRowProps, 'tone' | 'status' | 'tint' | 'onClick'>;
    return (
      <ListGroup>
        <ListGroupHeading>Settings</ListGroupHeading>
        <List heading="Workspace" headingEnd="3" {...rest}>
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
  },
});
