import { Component, File, Folder, House, Image, Maximize, MessageSquare, Plus, Scan, SquareDashed, SwatchBook, ZoomIn, ZoomOut } from '../../icons/index.ts';
import { useId, type ReactNode } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { IconButton } from '../icon-button/icon-button.tsx';
import { Kbd } from '../kbd/kbd.tsx';
import { Menu, MenuItem } from '../menu/menu.tsx';
import {
  type ListNavigationGroupProps,
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
type ItemCaseProps = Pick<ListNavigationItemProps, 'current' | 'hot' | 'expanded' | 'defaultExpanded' | 'onExpandedChange' | 'status' | 'meta' | 'onClick' | 'onSelect'>;

/** Item-level props apply to the first item (Projects; with kind pages it carries the frame count); onAdd goes to the Library group. */
function Cases(raw: Partial<ListNavigationProps> & Partial<ItemCaseProps> & Pick<ListNavigationGroupProps, 'onAdd'>) {
  const label = `Workspace ${useId()}`;
  {
    const { current, hot, expanded, defaultExpanded, status, meta, onClick, onSelect, onExpandedChange, onAdd, ...rest } = raw;
    return (
      <ListNavigation aria-label={label} {...rest}>
        <ListNavigationGroup>
          <ListNavigationItem
            icon={<Folder />} href="#projects" current={current} hot={hot} count={hot ? 3 : rest.kind === 'pages' ? '4 frames' : undefined} status={status} meta={meta}
            expanded={expanded} defaultExpanded={defaultExpanded ?? true}
            onClick={onClick} onSelect={onSelect} onExpandedChange={onExpandedChange} sub={projectsSub}
          >Projects</ListNavigationItem>
          <ListNavigationItem icon={<House />} href="#home">Home</ListNavigationItem>
          <ListNavigationItem icon={<SwatchBook />} count={128}>Themes</ListNavigationItem>
        </ListNavigationGroup>
        <ListNavigationGroup heading="Library" addLabel="Add" onAdd={onAdd}>
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
    // Three levels (owner 2026-10-28): Projects > Orbit Pay > its pages; each nested list draws its guide.
    nested: () => (
      <div className="mx-auto w-full max-w-[calc(var(--spacing)*65)]">
        <ListNavigation aria-label="Workspace">
          <ListNavigationGroup>
            <ListNavigationItem icon={<House />}>Home</ListNavigationItem>
            <ListNavigationItem
              icon={<Folder />} defaultExpanded
              sub={(
                <>
                  <ListNavigationSubItem
                    defaultExpanded
                    sub={(
                      <>
                        <ListNavigationSubItem href="#pricing" current>Pricing</ListNavigationSubItem>
                        <ListNavigationSubItem href="#checkout">Checkout</ListNavigationSubItem>
                      </>
                    )}
                  >Orbit Pay</ListNavigationSubItem>
                  <ListNavigationSubItem href="#field-notes">Field Notes</ListNavigationSubItem>
                </>
              )}
            >Projects</ListNavigationItem>
            <ListNavigationItem icon={<SwatchBook />} count={128}>Themes</ListNavigationItem>
          </ListNavigationGroup>
          <ListNavigationGroup heading="Library" headingAction={<IconButton size="xs" label="Add"><Plus /></IconButton>}>
            <ListNavigationItem icon={<Component />} count={42}>Components</ListNavigationItem>
          </ListNavigationGroup>
        </ListNavigation>
      </div>
    ),
    // Was page-list (zoom-menu-and-pages): kind pages, the zoom menu above it as in the specimen.
    'page-list-zoom-menu-and-pages': () => (
      <div className="grid gap-3.5">
        <Menu aria-label="Zoom" inline defaultOpen className="min-w-0">
          <MenuItem icon={<ZoomIn />} end={<><Kbd>⌘</Kbd><Kbd>+</Kbd></>}>Zoom in</MenuItem>
          <MenuItem icon={<ZoomOut />} end={<><Kbd>⌘</Kbd><Kbd>−</Kbd></>}>Zoom out</MenuItem>
          <MenuItem data-highlighted="" icon={<Maximize />} end={<><Kbd>⇧</Kbd><Kbd>1</Kbd></>}>Fit all</MenuItem>
          <MenuItem icon={<Scan />} end={<><Kbd>⇧</Kbd><Kbd>2</Kbd></>}>Fit selection</MenuItem>
          <MenuItem icon={<SquareDashed />} end={<><Kbd>⇧</Kbd><Kbd>0</Kbd></>}>100%</MenuItem>
        </Menu>
        <ListNavigation aria-label="Pages" kind="pages">
          <ListNavigationGroup heading="Pages" addLabel="Add page">
            <ListNavigationItem icon={<File />} current count="4 frames">Pricing</ListNavigationItem>
            <ListNavigationItem icon={<File />} count="7 frames">Checkout</ListNavigationItem>
            <ListNavigationItem icon={<File />} count="12 frames">Explorations</ListNavigationItem>
          </ListNavigationGroup>
        </ListNavigation>
      </div>
    ),
    // Was session-list (sessions): kind sessions in a div group (not a landmark); the list fills the frame width.
    'session-list-sessions': () => (
      <ListNavigation aria-label="Sessions" kind="sessions" as="div">
        <ListNavigationGroup>
          <ListNavigationItem status="running" current meta="now">Make pricing feel premium</ListNavigationItem>
          <ListNavigationItem status="review" meta="Review">Dark variant for Lagoon</ListNavigationItem>
          <ListNavigationItem status="failed" meta="Failed">Export checkout to React</ListNavigationItem>
          <ListNavigationItem status="done" meta="2h">Onboarding empty states</ListNavigationItem>
          <ListNavigationItem status="done" meta="Mon">Audit tap targets on iOS</ListNavigationItem>
        </ListNavigationGroup>
      </ListNavigation>
    ),
  },
});
