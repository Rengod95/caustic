import { Monitor, Palette, Smartphone, Tablet } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { Tabs, TabsList, TabsTrigger } from '../tabs/tabs.tsx';
import { SegmentedControl, SegmentedControlItem } from './segmented-control.tsx';

export default defineFixture({
  id: 'segmented-control',
  render: props => (
    <SegmentedControl aria-label="View" defaultValue="prototype" {...props}>
      <SegmentedControlItem value="design" aria-label="Design" icon={<Palette />}>Design</SegmentedControlItem>
      <SegmentedControlItem value="prototype" aria-label="Prototype">Prototype</SegmentedControlItem>
      <SegmentedControlItem value="code" aria-label="Code" count="14">Code</SegmentedControlItem>
    </SegmentedControl>
  ),
  examples: {
    'segmented-and-tabs': () => (
      <>
        <SegmentedControl aria-label="View" defaultValue="design">
          <SegmentedControlItem value="design">Design</SegmentedControlItem>
          <SegmentedControlItem value="prototype">Prototype</SegmentedControlItem>
          <SegmentedControlItem value="code">Code</SegmentedControlItem>
        </SegmentedControl>
        <SegmentedControl aria-label="Mode" shape="pill" defaultValue="build">
          <SegmentedControlItem value="ask">Ask</SegmentedControlItem>
          <SegmentedControlItem value="plan">Plan</SegmentedControlItem>
          <SegmentedControlItem value="build">Build</SegmentedControlItem>
        </SegmentedControl>
        <SegmentedControl aria-label="Device" content="icon" defaultValue="desktop">
          <SegmentedControlItem value="desktop" aria-label="Desktop" icon={<Monitor />} />
          <SegmentedControlItem value="tablet" aria-label="Tablet" icon={<Tablet />} />
          <SegmentedControlItem value="phone" aria-label="Phone" icon={<Smartphone />} />
        </SegmentedControl>
        <Tabs defaultValue="tokens">
          <TabsList aria-label="Library">
            <TabsTrigger value="tokens" count="128">Tokens</TabsTrigger>
            <TabsTrigger value="components" count="42">Components</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
          </TabsList>
        </Tabs>
      </>
    ),
  },
});
