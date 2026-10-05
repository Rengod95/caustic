import { useId } from 'react';
import { Maximize, Scan, SquareDashed, ZoomIn, ZoomOut } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Kbd } from '../kbd/kbd.tsx';
import { Menu, MenuItem } from '../menu/menu.tsx';
import { PageList, PageListRow, type PageListProps, type PageListRowProps } from './page-list.tsx';

// Each generated case renders its own landmark, so the label is made unique to keep landmarks distinguishable.
// Row-level props (current, count, onSelect) apply to the first PageListRow.
function CasePages(props: Partial<PageListProps> & PageListRowProps) {
  const { current, count, onSelect, ...list } = props;
  const label = `Pages ${useId()}`;
  return (
    <PageList label={label} addLabel="Add page" {...list}>
      <PageListRow current={current} count={count ?? '4 frames'} onSelect={onSelect}>Pricing</PageListRow>
      <PageListRow count="7 frames">Checkout</PageListRow>
      <PageListRow count="12 frames">Explorations</PageListRow>
    </PageList>
  );
}

export default defineFixture({
  id: 'page-list',
  render: props => <CasePages {...(props as Partial<PageListProps> & PageListRowProps)} />,
  examples: {
    'zoom-menu-and-pages': () => (
      <div className="grid gap-3.5">
        <Menu aria-label="Zoom" inline defaultOpen className="min-w-0">
          <MenuItem icon={<ZoomIn />} end={<><Kbd>⌘</Kbd><Kbd>+</Kbd></>}>Zoom in</MenuItem>
          <MenuItem icon={<ZoomOut />} end={<><Kbd>⌘</Kbd><Kbd>−</Kbd></>}>Zoom out</MenuItem>
          <MenuItem data-highlighted="" icon={<Maximize />} end={<><Kbd>⇧</Kbd><Kbd>1</Kbd></>}>Fit all</MenuItem>
          <MenuItem icon={<Scan />} end={<><Kbd>⇧</Kbd><Kbd>2</Kbd></>}>Fit selection</MenuItem>
          <MenuItem icon={<SquareDashed />} end={<><Kbd>⇧</Kbd><Kbd>0</Kbd></>}>100%</MenuItem>
        </Menu>
        <PageList label="Pages" addLabel="Add page">
          <PageListRow current count="4 frames">Pricing</PageListRow>
          <PageListRow count="7 frames">Checkout</PageListRow>
          <PageListRow count="12 frames">Explorations</PageListRow>
        </PageList>
      </div>
    ),
  },
});
