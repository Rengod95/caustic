import { Link, Maximize2, Trash2 } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { Field } from '../field/field.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { TagInput } from '../tag-input/tag-input.tsx';
import { Dialog, DialogAction, DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle, type DialogProps } from './dialog.tsx';

// Sectioned centre case: a fixed-width scrim band (the widest surface plus the 16px overlay padding), so case widths do
// not depend on the harness wrapper. The band carries the overlay slot so the scrim can be measured.
const caseOverlay = 'relative grid w-[calc(var(--cs-size-dialog-lg)+var(--cs-space-8))] place-items-center bg-bg-scrim p-4';
// Edge case: a canvas stage with a scrim over it; the inline sheet sits absolutely inside it.
const edgeStage = 'relative h-[calc(var(--cs-size-dialog-sm)-var(--cs-space-5))] w-[calc(var(--cs-size-sheet-md)*2)] overflow-hidden rounded-xl bg-bg-canvas canvas-grid [background-size:var(--cs-space-4)_var(--cs-space-4)]';
// Former Modal examples: a scrim stage.
const stage = 'relative grid w-full place-items-center overflow-hidden rounded-xl bg-bg-scrim px-4 py-7';

export default defineFixture({
  id: 'dialog',
  // Three renders by frame: an edge placement (the sheet band layout), the title prop (the sectioned centre) and the
  // compact parts-only dialog (the default case).
  render: props => {
    const p = props as DialogProps;
    if (p.placement === 'right' || p.placement === 'bottom') return (
      <div className={edgeStage}>
        <div data-slot="dialog-overlay" aria-hidden className="absolute inset-0 bg-bg-scrim" />
        <Dialog
          inline defaultOpen title="Filters" showClose closeLabel="Close"
          footer={<><Button tone="ghost" size="sm">Reset</Button><Button size="sm">Apply</Button></>}
          {...props}
        >
          <p className="text-ui text-text-secondary">Components</p>
        </Dialog>
      </div>
    );
    if (p.title != null) return (
      <div data-slot="dialog-overlay" className={caseOverlay}>
        <Dialog
          inline defaultOpen closeLabel="Close" icon={<Trash2 />} description="The URL stays the same."
          footer={<><DialogClose asChild><Button tone="secondary" size="sm">Cancel</Button></DialogClose><DialogAction>Delete</DialogAction></>}
          {...props}
        >
          <p className="text-ui-dense text-text-secondary">Orbit Pay</p>
        </Dialog>
      </div>
    );
    return (
      <Dialog inline defaultOpen closeLabel="Close" {...props}>
        <DialogHeader><DialogTitle>Detach from component?</DialogTitle><DialogDescription>This layer stops receiving updates from Button / Primary.</DialogDescription></DialogHeader>
        <DialogFooter><DialogClose asChild><Button tone="ghost" size="sm">Cancel</Button></DialogClose><Button size="sm">Detach</Button></DialogFooter>
      </Dialog>
    );
  },
  examples: {
    compact: () => (
      <div className="grid place-items-center gap-3 rounded-xl bg-bg-canvas p-4">
        <Dialog inline defaultOpen size="sm">
          <DialogTitle>Detach from component?</DialogTitle>
          <DialogDescription>This layer stops receiving updates from Button / Primary. You can reattach it from the history panel.</DialogDescription>
          <DialogFooter><DialogClose asChild><Button tone="ghost" size="sm">Cancel</Button></DialogClose><Button size="sm">Detach</Button></DialogFooter>
        </Dialog>
      </div>
    ),
    // Former Modal "modal": the sectioned centre with a body and a footer that keeps one action on the start edge.
    'modal-modal': () => (
      <>
        <div className={stage}>
          <Dialog
            inline defaultOpen title="Invite people" description="They join Orbit Pay as editors." showClose closeLabel="Close"
            footer={
              <>
                <Button tone="ghost" size="sm" iconStart={<Link />}>Copy link</Button>
                <span className="flex-1" />
                <Button tone="secondary" size="sm">Cancel</Button>
                <Button size="sm">Send invites</Button>
              </>
            }
          >
            <Field label="Email addresses">
              <TagInput defaultValue={['jun@orbit.co']} placeholder="Add email" />
            </Field>
            <div className="flex items-center justify-between gap-2">
              <span className="text-footnote text-text-tertiary">Role</span>
              <SegmentedControl aria-label="Role" size="xs" defaultValue="editor">
                <SegmentedControlItem value="viewer">Viewer</SegmentedControlItem>
                <SegmentedControlItem value="editor">Editor</SegmentedControlItem>
                <SegmentedControlItem value="admin">Admin</SegmentedControlItem>
              </SegmentedControl>
            </div>
          </Dialog>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button tone="secondary" size="sm" iconStart={<Maximize2 />}>Open modal</Button>
          <Button tone="secondary" size="sm">Open alert dialog</Button>
        </div>
      </>
    ),
    // Former Modal "alert-dialog": kind="alert", danger icon tile, no body, outcome-named buttons.
    'modal-alert-dialog': () => (
      <div className={stage}>
        <Dialog
          inline defaultOpen kind="alert" size="sm" icon={<Trash2 />}
          title="Delete “Lagoon Dark”?"
          description="14 tokens and 3 bindings are removed. You can restore it from history for 30 days."
          footer={<><DialogClose asChild><Button tone="secondary" size="sm">Keep theme</Button></DialogClose><DialogAction>Delete theme</DialogAction></>}
        />
      </div>
    ),
  },
});
