import { Component, Folder, House, Image, MessageSquare, Plus, SwatchBook } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import {
  ListNavigation, ListNavigationGroup, ListNavigationItem, ListNavigationSubItem, type ListNavigationItemProps, type ListNavigationProps,
} from './list-navigation.tsx';

const frame = (children: ReactNode) => <div className="w-full max-w-[calc(var(--spacing)*65)]">{children}</div>;

const projectsSub = (
  <>
    <ListNavigationSubItem href="#orbit-pay">Orbit Pay</ListNavigationSubItem>
    <ListNavigationSubItem href="#field-notes">Field Notes</ListNavigationSubItem>
  </>
);

/** One landmark per case; the harness shows many cases on one page, so each gets a unique name. */
function Cases(raw: Partial<ListNavigationProps> & Partial<Pick<ListNavigationItemProps, 'current' | 'hot' | 'expanded' | 'defaultExpanded' | 'onExpandedChange'>> & { onClick?: ListNavigationItemProps['onClick'] }) {
  const label = `Workspace ${useId()}`;
  {
    const { current, hot, expanded, defaultExpanded, onClick, onExpandedChange, ...rest } = raw;
    return (
      <ListNavigation aria-label={label} {...rest}>
        <ListNavigationGroup>
          <ListNavigationItem
            icon={<Folder />} href="#projects" current={current} hot={hot} count={hot ? 3 : undefined}
            expanded={expanded} defaultExpanded={defaultExpanded ?? true}
            onClick={onClick} onExpandedChange={onExpandedChange} sub={projectsSub}
          >Projects</ListNavigationItem>
          <ListNavigationItem icon={<House />} href="#home">Home</ListNavigationItem>
          <ListNavigationItem icon={<SwatchBook />} count={128}>Themes</ListNavigationItem>
        </ListNavigationGroup>
        <ListNavigationGroup heading="Library" headingAction={<IconButton size="xs" label="Add"><Plus /></IconButton>}>
          <ListNavigationItem icon={<Image />} count={310}>Assets</ListNavigationItem>
        </ListNavigationGroup>
      </ListNavigation>
    );
  }
}

export default defineFixture({
  id: 'list-navigation',
  frame,
  render: raw => <Cases {...(raw as Parameters<typeof Cases>[0])} />,
  examples: {
    'navigation-list': () => (
      <div className="mx-auto w-full max-w-[calc(var(--spacing)*65)]">
        <ListNavigation aria-label="Workspace">
          <ListNavigationGroup>
            <ListNavigationItem icon={<House />} current>Home</ListNavigationItem>
            <ListNavigationItem icon={<MessageSquare />} count={3} hot>Sessions</ListNavigationItem>
            <ListNavigationItem icon={<Folder />} defaultExpanded sub={projectsSub}>Projects</ListNavigationItem>
            <ListNavigationItem icon={<SwatchBook />} count={128}>Themes</ListNavigationItem>
          </ListNavigationGroup>
          <ListNavigationGroup heading="Library" headingAction={<IconButton size="xs" label="Add"><Plus /></IconButton>}>
            <ListNavigationItem icon={<Component />} count={42}>Components</ListNavigationItem>
            <ListNavigationItem icon={<Image />} count={310}>Assets</ListNavigationItem>
          </ListNavigationGroup>
        </ListNavigation>
      </div>
    ),
  },
});
