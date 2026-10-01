import { Check, Palette, Paperclip, Plus, Ruler, Type } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { Chip } from './chip.tsx';

const noop = () => {};

export default defineFixture({
  id: 'chip',
  // A case chip is not interactive unless a toggle prop says so (the harness injects onClick for
  // every event), and carries a remove button so the remove slot can be measured.
  render: ({ onClick: _onClick, onRemove, ...props }) => (
    <Chip icon={<Paperclip />} onRemove={typeof onRemove === 'function' ? (onRemove as () => void) : noop} {...props}>Button.tsx</Chip>
  ),
  examples: {
    'chips-and-segmented': () => (
      <>
        <div className="flex flex-wrap items-center gap-2">
          <Chip>Soft</Chip>
          <Chip appearance="outline">Outline</Chip>
          <Chip appearance="solid">Solid</Chip>
          <Chip appearance="dashed" icon={<Plus />}>Dashed</Chip>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="info" dot>Review</Chip>
          <Chip tone="success" icon={<Check />}>Passed</Chip>
          <Chip tone="warning">Draft</Chip>
          <Chip tone="danger">Broken ref</Chip>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip size="sm">sm</Chip>
          <Chip>md</Chip>
          <Chip size="lg">lg</Chip>
          <Chip appearance="outline" defaultPressed>Toggle on</Chip>
          <Chip appearance="outline" defaultPressed={false}>Toggle off</Chip>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <div className="grid gap-2">
            <SegmentedControl aria-label="Outline" appearance="outline" defaultValue="a">
              <SegmentedControlItem value="a">Outline</SegmentedControlItem>
              <SegmentedControlItem value="b">B</SegmentedControlItem>
            </SegmentedControl>
            <SegmentedControl aria-label="Subtle" appearance="subtle" defaultValue="a">
              <SegmentedControlItem value="a">Subtle</SegmentedControlItem>
              <SegmentedControlItem value="b">B</SegmentedControlItem>
            </SegmentedControl>
          </div>
          <SegmentedControl aria-label="Library" orientation="vertical" defaultValue="color">
            <SegmentedControlItem value="color" icon={<Palette />}>Color</SegmentedControlItem>
            <SegmentedControlItem value="type" icon={<Type />}>Type</SegmentedControlItem>
            <SegmentedControlItem value="space" icon={<Ruler />} count="14">Space</SegmentedControlItem>
          </SegmentedControl>
        </div>
      </>
    ),
  },
});
