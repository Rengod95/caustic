import {
  AlignCenterHorizontal, AlignCenterVertical, AlignEndHorizontal, AlignEndVertical, AlignHorizontalDistributeCenter,
  AlignStartHorizontal, AlignStartVertical, AlignVerticalDistributeCenter, Scan,
} from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { AlignBar, AlignBarItem, AlignBarSeparator } from '../align-bar/align-bar.tsx';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import { ConstraintsControl, type ConstraintsControlProps } from './constraints-control.tsx';

export default defineFixture({
  id: 'constraints-control',
  render: props => (
    <div className="w-68">
      <ConstraintsControl note="Resizing the parent keeps the frame in proportion." {...(props as Partial<ConstraintsControlProps>)} />
    </div>
  ),
  examples: {
    'alignment-and-constraints': () => (
      <>
        <div className="flex items-center justify-between gap-2">
          <AlignBar aria-label="Align">
            <AlignBarItem label="Align left"><AlignStartVertical /></AlignBarItem>
            <AlignBarItem label="Align horizontal centers"><AlignCenterVertical /></AlignBarItem>
            <AlignBarItem label="Align right"><AlignEndVertical /></AlignBarItem>
            <AlignBarSeparator />
            <AlignBarItem label="Align top"><AlignStartHorizontal /></AlignBarItem>
            <AlignBarItem label="Align vertical centers"><AlignCenterHorizontal /></AlignBarItem>
            <AlignBarItem label="Align bottom"><AlignEndHorizontal /></AlignBarItem>
          </AlignBar>
          <Badge>3 frames</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button tone="secondary" size="xs" iconStart={<AlignHorizontalDistributeCenter />}>Distribute H</Button>
          <Button tone="secondary" size="xs" iconStart={<AlignVerticalDistributeCenter />}>Distribute V</Button>
          <Button tone="ghost" size="xs" iconStart={<Scan />}>Fit to selection</Button>
        </div>
        <ConstraintsControl
          defaultValue={{ horizontal: 'left-right', vertical: 'center' }}
          note="Resizing the parent stretches width and keeps the frame centered vertically."
        />
      </>
    ),
  },
});
