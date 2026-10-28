import { Eye, Grid3x3, Link, Lock, Ellipsis, Redo2, Scan, Undo2 } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Tooltip } from '../tooltip/tooltip.tsx';
import { IconButton } from './icon-button.tsx';

export default defineFixture({
  id: 'icon-button',
  render: props => <IconButton label="Undo" {...props}><Undo2 /></IconButton>,
  examples: {
    toolbar: () => (
      <div className="grid place-items-center gap-3 rounded-xl bg-bg-inset p-4 pt-10">
        <Tooltip content="Undo" shortcut="⌘Z" inline defaultOpen>
          <div className="relative mt-1 flex gap-0.5">
            <IconButton label="Undo"><Undo2 /></IconButton>
            <IconButton label="Redo"><Redo2 /></IconButton>
            <IconButton label="Grid" size="md" defaultPressed><Grid3x3 /></IconButton>
            <IconButton label="Visibility"><Eye /></IconButton>
            <IconButton label="Lock"><Lock /></IconButton>
            <IconButton label="More"><Ellipsis /></IconButton>
          </div>
        </Tooltip>
      </div>
    ),
    // The former IconToggle (it had no example of its own): toggles at their default size sm (28px; owner 2026-10-28) off
    // (on the neutral well) and on (inverted), and a disabled pair. Inspector rows pass size="xs".
    'icon-toggle-states': () => (
      <div className="flex items-center gap-3">
        <IconButton label="Lock aspect ratio" pressed={false}><Link /></IconButton>
        <IconButton label="Lock aspect ratio" pressed><Link /></IconButton>
        <IconButton label="Independent corners" pressed={false}><Scan /></IconButton>
        <IconButton label="Independent corners" pressed><Scan /></IconButton>
        <IconButton label="Lock aspect ratio" pressed={false} disabled><Link /></IconButton>
        <IconButton label="Lock aspect ratio" pressed disabled><Link /></IconButton>
      </div>
    ),
  },
});
