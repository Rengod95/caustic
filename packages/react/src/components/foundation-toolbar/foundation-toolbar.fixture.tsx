import { Eye, Frame, Layers, Minus, Palette, Ruler, Settings, SquareDashed, Type } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { FoundationToolbar, type FoundationToolbarProps } from './foundation-toolbar.tsx';

const stage = 'canvas-grid flex flex-col items-center gap-3.5 rounded-xl px-4 py-7 [background-size:var(--cs-space-4)_var(--cs-space-4)]';

const noop = () => {};
const families = [
  { value: 'presentation', label: 'Presentation' },
  { value: 'behavioral', label: 'Motion' },
  { value: 'relationship', label: 'Relationship' },
];
const domains = [
  { value: 'color', label: 'Color', icon: <Palette /> },
  { value: 'spacing', label: 'Spacing', icon: <Ruler /> },
  { value: 'sizing', label: 'Sizing', icon: <Frame /> },
  { value: 'radius', label: 'Radius', icon: <SquareDashed /> },
  { value: 'stroke', label: 'Stroke', icon: <Minus /> },
  { value: 'shadow', label: 'Shadow', icon: <Layers /> },
  { value: 'typography', label: 'Type', icon: <Type /> },
  { value: 'opacity', label: 'Opacity', icon: <Eye /> },
];

const Toolbar = (props: Partial<FoundationToolbarProps>) => (
  <FoundationToolbar
    label="Domain toolbar" familyLabel="Domain family" domainsLabel="Token domain" searchLabel="Search domains" searchPlaceholder="Find a domain" addLabel="Add domain"
    families={families} defaultFamily="presentation" domains={domains} onAdd={noop}
    actions={<IconButton size="xs" label="Foundation administration"><Settings /></IconButton>}
    {...props}
  >
    <Button tone="ghost" size="sm">Themes</Button>
  </FoundationToolbar>
);

export default defineFixture({
  id: 'foundation-toolbar',
  frame: children => <div className="w-140">{children}</div>,
  render: props => <Toolbar {...(props as Partial<FoundationToolbarProps>)} />,
  examples: {
    row: () => <div className={stage}><Toolbar defaultDomain="color" /></div>,
    compact: () => <div className="w-75"><Toolbar layout="compact" defaultDomain="color" /></div>,
  },
});
