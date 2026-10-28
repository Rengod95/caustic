import { Component, Frame, Image, LayoutGrid, Eye, EyeOff, Lock, Rows3, Search, Square, Type } from 'lucide-react';
import type { CSSProperties } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { Input } from '../input/input.tsx';
import { LayerTree, LayerTreeItem, type LayerDropPosition, type LayerTreeAnnouncement, type LayerTreeProps } from './layer-tree.tsx';

type StateProps = { selected?: boolean; secondary?: boolean; invisible?: boolean; locked?: boolean; component?: boolean; drop?: LayerDropPosition };

const noun = (names: string[]) => (names.length === 1 ? names[0]! : `${names.length} layers`);
const announce = (e: LayerTreeAnnouncement) => {
  switch (e.type) {
    case 'selected': return e.names.length === 1 ? `Selected ${e.names[0]}` : `${noun(e.names)} selected`;
    case 'expanded': return `Expanded ${noun(e.names)}`;
    case 'collapsed': return `Collapsed ${noun(e.names)}`;
    case 'hid': return `Hid ${noun(e.names)}`;
    case 'showed': return `Showed ${noun(e.names)}`;
    case 'locked': return `Locked ${noun(e.names)}`;
    case 'unlocked': return `Unlocked ${noun(e.names)}`;
    case 'moved': return e.position === 'inside' ? `Moved ${noun(e.names)} into ${e.target}` : `Moved ${noun(e.names)} ${e.position} ${e.target}`;
    case 'cancelled': return 'Move cancelled';
  }
};
const labels = {
  announce,
  visibilityLabel: (name: string, hidden: boolean) => `${hidden ? 'Show' : 'Hide'} ${name}`,
  lockLabel: (name: string, locked: boolean) => `${locked ? 'Unlock' : 'Lock'} ${name}`,
  stateLabels: { hidden: 'hidden', locked: 'locked', agent: 'edited by the agent' },
};

const ghostAt = { '--ghost-x': '150px', '--ghost-y': '44px' } as CSSProperties;

export default defineFixture({
  id: 'layer-tree',
  render: props => {
    // Item-level state props apply to the first row; the last row is hidden and locked.
    const { selected, secondary, invisible, locked, component, drop, ...rest } = props as Partial<LayerTreeProps> & StateProps;
    return (
      <LayerTree {...labels} aria-label="Layers" defaultValue={['price', 'button-primary']} dragLabel="Badge" dragIcon={<Component />} {...rest}>
        <LayerTreeItem itemId="frame" depth={0} icon={<Frame />} label="Pricing / Desktop" expandable open selected={selected} secondary={secondary} invisible={invisible} locked={locked} component={component} drop={drop} />
        <LayerTreeItem itemId="cards" depth={1} icon={<Rows3 />} label="Cards" expandable open caption="auto · 12" />
        <LayerTreeItem itemId="starter" depth={2} icon={<Square />} label="Starter" expandable />
        <LayerTreeItem itemId="pro" depth={2} icon={<Square />} label="Pro" expandable open />
        <LayerTreeItem itemId="button-primary" depth={3} icon={<Component />} label="Button / Primary" tag="Instance" />
        <LayerTreeItem itemId="price" depth={3} icon={<Type />} label="Price" />
        <LayerTreeItem itemId="team" depth={2} icon={<Square />} label="Team" expandable agent />
        <LayerTreeItem itemId="background" depth={1} icon={<Image />} label="Background photo" invisible locked />
      </LayerTree>
    );
  },
  frame: children => <div className="w-72">{children}</div>,
  examples: {
    'layer-tree': () => (
      <>
        <Input variant="sunken" prefix={<Search aria-hidden className="size-icon-sm" />} placeholder="Filter layers" aria-label="Filter layers" />
        <LayerTree {...labels} aria-label="Layers" dragLabel="Badge" dragIcon={<Component />} style={ghostAt}>
          <LayerTreeItem itemId="frame" depth={0} icon={<Frame />} label="Pricing / Desktop" expandable open />
          <LayerTreeItem itemId="cards" depth={1} icon={<Rows3 />} label="Cards" expandable open caption="auto · 12" />
          <LayerTreeItem itemId="starter" depth={2} icon={<Square />} label="Starter" expandable drop="before" />
          <LayerTreeItem itemId="pro" depth={2} icon={<Square />} label="Pro" expandable open drop="inside" />
          <LayerTreeItem itemId="button-primary" depth={3} icon={<Component />} label="Button / Primary" tag="Instance" selected />
          <LayerTreeItem itemId="price" depth={3} icon={<Type />} label="Price" selected secondary />
          <LayerTreeItem itemId="team" depth={2} icon={<Square />} label="Team" expandable agent />
          <LayerTreeItem itemId="background" depth={1} icon={<Image />} label="Background photo" invisible locked end={<><EyeOff /><Lock /></>} />
        </LayerTree>
      </>
    ),
    layers: () => (
      <LayerTree {...labels} aria-label="Layers">
        <LayerTreeItem itemId="frame" depth={0} icon={<Frame />} label="Pricing / Desktop" expandable open />
        <LayerTreeItem itemId="cards" depth={1} icon={<LayoutGrid />} label="Cards" expandable open caption="auto · 12" />
        <LayerTreeItem itemId="starter" depth={2} icon={<Square />} label="Starter" expandable />
        <LayerTreeItem itemId="pro" depth={2} icon={<Square />} label="Pro" expandable open />
        <LayerTreeItem itemId="button-primary" depth={3} icon={<Component />} label="Button / Primary" selected end={<Eye />} />
        <LayerTreeItem itemId="team" depth={2} icon={<Square />} label="Team" expandable agent />
        <LayerTreeItem itemId="header" depth={1} icon={<Component />} label="Header" component end={<Lock className="text-disabled-text" />} />
      </LayerTree>
    ),
  },
});
