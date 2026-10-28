import { Laptop, Monitor, Play, Smartphone, Tablet } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { ZoomControl, type ZoomControlProps } from './zoom-control.tsx';

export default defineFixture({
  id: 'zoom-control',
  render: props => <ZoomControl value="100%" label="Zoom" zoomOutLabel="Zoom out" zoomInLabel="Zoom in" {...(props as Partial<ZoomControlProps>)} />,
  examples: {
    'breakpoints-and-zoom': () => (
      <>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl aria-label="Breakpoint" content="icon" defaultValue="1280">
            <SegmentedControlItem value="1440" icon={<Monitor />}>1440</SegmentedControlItem>
            <SegmentedControlItem value="1280" icon={<Laptop />}>1280</SegmentedControlItem>
            <SegmentedControlItem value="834" icon={<Tablet />}>834</SegmentedControlItem>
            <SegmentedControlItem value="390" icon={<Smartphone />}>390</SegmentedControlItem>
          </SegmentedControl>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ZoomControl value="64%" variant="glass" readout="static" size="sm" label="Zoom" zoomOutLabel="Zoom out" zoomInLabel="Zoom in" />
          <Button tone="secondary" size="sm" shape="pill" iconStart={<Play />}>Preview</Button>
        </div>
      </>
    ),
  },
});
