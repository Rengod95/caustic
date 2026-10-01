import { Eye, Grid3x3, Lock, Ellipsis, Redo2, Undo2 } from 'lucide-react';
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
            <IconButton label="Grid" defaultPressed><Grid3x3 /></IconButton>
            <IconButton label="Visibility"><Eye /></IconButton>
            <IconButton label="Lock"><Lock /></IconButton>
            <IconButton label="More"><Ellipsis /></IconButton>
          </div>
        </Tooltip>
      </div>
    ),
  },
});
