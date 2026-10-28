import {
  AlignCenterHorizontal, AlignCenterVertical, AlignEndHorizontal, AlignEndVertical, AlignHorizontalDistributeCenter,
  AlignStartHorizontal, AlignStartVertical, AlignVerticalDistributeCenter, Scan,
} from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { ButtonGroup, ButtonGroupSeparator } from '../button-group/button-group.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { Badge } from '../badge/badge.tsx';
import { Button } from '../button/button.tsx';
import { ConstraintsControl, type ConstraintsControlLabels, type ConstraintsControlProps } from './constraints-control.tsx';

const labels: ConstraintsControlLabels = {
  group: 'Constraints',
  pins: { top: 'Top', bottom: 'Bottom', left: 'Left', right: 'Right', centerX: 'Center X', centerY: 'Center Y' },
  horizontal: 'Horizontal constraint',
  vertical: 'Vertical constraint',
  horizontalOptions: { left: 'Left', right: 'Right', 'left-right': 'Left & right', center: 'Center', scale: 'Scale' },
  verticalOptions: { top: 'Top', bottom: 'Bottom', 'top-bottom': 'Top & bottom', center: 'Center', scale: 'Scale' },
  mixed: 'Mixed',
};

export default defineFixture({
  id: 'constraints-control',
  render: props => (
    <div className="w-68">
      <ConstraintsControl labels={labels} note="Resizing the parent keeps the frame in proportion." {...(props as Partial<ConstraintsControlProps>)} />
    </div>
  ),
  examples: {
    'alignment-and-constraints': () => (
      <>
        <div className="flex items-center justify-between gap-2">
          <ButtonGroup aria-label="Align">
            <IconButton label="Align left"><AlignStartVertical /></IconButton>
            <IconButton label="Align horizontal centers"><AlignCenterVertical /></IconButton>
            <IconButton label="Align right"><AlignEndVertical /></IconButton>
            <ButtonGroupSeparator />
            <IconButton label="Align top"><AlignStartHorizontal /></IconButton>
            <IconButton label="Align vertical centers"><AlignCenterHorizontal /></IconButton>
            <IconButton label="Align bottom"><AlignEndHorizontal /></IconButton>
          </ButtonGroup>
          <Badge>3 frames</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button tone="secondary" size="xs" iconStart={<AlignHorizontalDistributeCenter />}>Distribute H</Button>
          <Button tone="secondary" size="xs" iconStart={<AlignVerticalDistributeCenter />}>Distribute V</Button>
          <Button tone="ghost" size="xs" iconStart={<Scan />}>Fit to selection</Button>
        </div>
        {/* The constraints are their own section: a divider and room above it (owner 2026-10-27). */}
        <div className="mt-1.5 border-t border-divider-line pt-5">
          <ConstraintsControl
            labels={labels}
            defaultValue={{ horizontal: 'left-right', vertical: 'center' }}
            note="Resizing the parent stretches width and keeps the frame centered vertically."
          />
        </div>
      </>
    ),
  },
});
