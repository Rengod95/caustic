import { AlignCenterVertical, AlignEndVertical, AlignStartVertical, Check, Minimize2, MoveHorizontal, Plus } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { ButtonGroup } from '../button-group/button-group.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { InspectorPanel, InspectorSection, InspectorSectionHeader } from '../inspector-panel/inspector-panel.tsx';
import { Menu, MenuItem, MenuSeparator } from '../menu/menu.tsx';
import { PositionSize, type PositionSizeLabels, type PositionSizeProps } from './position-size.tsx';

const value = { x: 360, y: 96, width: 640, height: 420, rotation: 0 };

const labels: PositionSizeLabels = {
  x: 'X',
  y: 'Y',
  width: 'Width',
  height: 'Height',
  rotation: 'Rotation',
  xShort: 'X',
  yShort: 'Y',
  widthShort: 'W',
  heightShort: 'H',
  lockRatio: 'Lock aspect ratio',
  flipX: 'Flip horizontal',
  flipY: 'Flip vertical',
  flipXShort: 'H',
  flipYShort: 'V',
  constraints: 'Constraints',
  mode: { fixed: 'Fixed', hug: 'Hug', fill: 'Fill' },
  widthSizing: mode => `Width sizing: ${mode === 'fill' ? 'Fill' : mode === 'hug' ? 'Hug' : 'Fixed'}`,
  heightSizing: mode => `Height sizing: ${mode === 'fill' ? 'Fill' : mode === 'hug' ? 'Hug' : 'Fixed'}`,
  mixed: 'Mixed',
};

export default defineFixture({
  id: 'position-size',
  render: props => (
    <div className="w-68">
      <PositionSize defaultValue={value} labels={labels} {...(props as Partial<PositionSizeProps>)} />
    </div>
  ),
  examples: {
    'position-and-size': () => (
      <InspectorPanel aria-label="Inspector">
        <InspectorSection>
          <InspectorSectionHeader
            title="Frame"
            actions={(
              <ButtonGroup density="tight" aria-label="Align">
                <IconButton label="Align left"><AlignStartVertical /></IconButton>
                <IconButton label="Align center"><AlignCenterVertical /></IconButton>
                <IconButton label="Align right"><AlignEndVertical /></IconButton>
              </ButtonGroup>
            )}
          />
          <PositionSize defaultValue={value} labels={labels} widthMode="fill" heightMode="hug" lockRatio />
        </InspectorSection>
        <InspectorSection>
          <Menu inline aria-label="Width sizing" className="min-w-0 glass-shadow-3">
            <MenuItem icon={<MoveHorizontal />} end={<span className="font-mono">640</span>}>Fixed width</MenuItem>
            <MenuItem icon={<Minimize2 />}>Hug contents</MenuItem>
            <MenuItem selected icon={<Check />}>Fill container</MenuItem>
            <MenuSeparator />
            <MenuItem icon={<Plus />}>Add min width…</MenuItem>
          </Menu>
        </InspectorSection>
      </InspectorPanel>
    ),
  },
});
