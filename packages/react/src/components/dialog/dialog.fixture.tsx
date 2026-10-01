import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { Dialog, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog.tsx';

export default defineFixture({
  id: 'dialog',
  render: props => (
    <Dialog inline defaultOpen {...props}>
      <DialogHeader><DialogTitle>Detach from component?</DialogTitle><DialogDescription>This layer stops receiving updates from Button / Primary.</DialogDescription></DialogHeader>
      <DialogFooter><DialogClose asChild><Button tone="ghost" size="sm">Cancel</Button></DialogClose><Button size="sm">Detach</Button></DialogFooter>
    </Dialog>
  ),
  examples: {
    compact: () => (
      <div className="grid place-items-center gap-3 rounded-xl bg-[oklch(0.2_0.01_260/0.1)] p-4">
        <Dialog inline defaultOpen size="sm">
          <DialogTitle>Detach from component?</DialogTitle>
          <DialogDescription>This layer stops receiving updates from Button / Primary. You can reattach it from the history panel.</DialogDescription>
          <DialogFooter><DialogClose asChild><Button tone="ghost" size="sm">Cancel</Button></DialogClose><Button size="sm">Detach</Button></DialogFooter>
        </Dialog>
      </div>
    ),
  },
});
