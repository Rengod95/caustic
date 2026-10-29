import { Plus } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { SectionHeader, SectionHeaderLink, type SectionHeaderProps } from './section-header.tsx';

export default defineFixture({
  id: 'section-header',
  render: props => (
    <SectionHeader
      eyebrow="Recommended"
      title="Start from a theme"
      description="Prebuilt themes pass AA in light and dark."
      action={<SectionHeaderLink href="#">See all</SectionHeaderLink>}
      {...(props as Partial<SectionHeaderProps>)}
    />
  ),
  examples: {
    sizes: () => (
      <div className="grid w-full gap-7">
        <SectionHeader
          size="lg" title="Projects" headingLevel={1} description="Everything your team is designing, newest first."
          action={<Button size="sm" iconStart={<Plus />}>New project</Button>}
        />
        <SectionHeader
          eyebrow="Recommended" title="Start from a theme" description="Prebuilt themes pass AA in light and dark."
          action={<SectionHeaderLink href="#">See all</SectionHeaderLink>}
        />
        <SectionHeader
          size="sm" divided title="Recent sessions" headingLevel={3} description="Agent work from the last 7 days."
          action={
            <SegmentedControl size="xs" aria-label="Sessions" defaultValue="all">
              <SegmentedControlItem value="all">All</SegmentedControlItem>
              <SegmentedControlItem value="mine">Mine</SegmentedControlItem>
            </SegmentedControl>
          }
        />
      </div>
    ),
    'section-header-eyebrow': () => (
      <div className="grid w-full gap-7">
        <SectionHeader
          eyebrow="Recommended" title="Start from a theme" description="Prebuilt themes pass AA in light and dark."
          action={<SectionHeaderLink href="#">See all</SectionHeaderLink>}
        />
        <SectionHeader
          eyebrowStyle="accent" eyebrow="Recommended" title="Start from a theme" description="Prebuilt themes pass AA in light and dark."
          action={<SectionHeaderLink href="#">See all</SectionHeaderLink>}
        />
      </div>
    ),
  },
});
