import { AlignCenterVertical, AlignEndVertical, AlignStartVertical, Check, Minimize2, MoveHorizontal, Plus } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { AlignBar, AlignBarItem } from '../align-bar/align-bar.tsx';
import { InspectorPanel, InspectorSection, InspectorSectionHeader } from '../inspector-panel/inspector-panel.tsx';
import { Menu, MenuItem, MenuSeparator } from '../menu/menu.tsx';
import { PositionSize, type PositionSizeProps } from './position-size.tsx';

const value = { x: 360, y: 96, width: 640, height: 420, rotation: 0 };

export default defineFixture({
  id: 'position-size',
  render: props => (
    <div className="w-68">
      <PositionSize defaultValue={value} {...(props as Partial<PositionSizeProps>)} />
    </div>
  ),
  examples: {
    'position-and-size': () => (
      <InspectorPanel aria-label="Inspector">
        <InspectorSection>
          <InspectorSectionHeader
            title="Frame"
            actions={(
              <AlignBar density="tight" aria-label="Align">
                <AlignBarItem label="Align left"><AlignStartVertical /></AlignBarItem>
                <AlignBarItem label="Align center"><AlignCenterVertical /></AlignBarItem>
                <AlignBarItem label="Align right"><AlignEndVertical /></AlignBarItem>
              </AlignBar>
            )}
          />
          <PositionSize defaultValue={value} widthMode="fill" heightMode="hug" lockRatio />
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
