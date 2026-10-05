import { Link, Maximize2, Trash2 } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Button } from '../button/button.tsx';
import { Field } from '../field/field.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { TagInput } from '../tag-input/tag-input.tsx';
import { Modal, ModalAction, ModalClose } from './modal.tsx';

// A fixed-width scrim band (the widest surface plus the 16px overlay padding), so case widths do not depend on the harness wrapper.
const caseOverlay = 'relative grid w-[calc(var(--cs-size-dialog-lg)+var(--cs-space-8))] place-items-center bg-bg-scrim p-4';
const stage = 'relative grid w-full place-items-center overflow-hidden rounded-xl bg-bg-scrim px-4 py-7';

export default defineFixture({
  id: 'modal',
  // The overlay band is part of the case so the scrim slot can be measured; the surface is inline.
  render: props => (
    <div data-slot="modal-overlay" className={caseOverlay}>
      <Modal
        inline defaultOpen closeLabel="Close" icon={<Trash2 />} title="Rename project" description="The URL stays the same."
        footer={<><ModalClose asChild><Button tone="secondary" size="sm">Cancel</Button></ModalClose><ModalAction>Delete</ModalAction></>}
        {...props}
      >
        <p className="text-ui-dense text-text-secondary">Orbit Pay</p>
      </Modal>
    </div>
  ),
  examples: {
    modal: () => (
      <>
        <div className={stage}>
          <Modal
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
          </Modal>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button tone="secondary" size="sm" iconStart={<Maximize2 />}>Open modal</Button>
          <Button tone="secondary" size="sm">Open alert dialog</Button>
        </div>
      </>
    ),
    'alert-dialog': () => (
      <div className={stage}>
        <Modal
          inline defaultOpen kind="alert" size="sm" icon={<Trash2 />}
          title="Delete “Lagoon Dark”?"
          description="14 tokens and 3 bindings are removed. You can restore it from history for 30 days."
          footer={<><ModalClose asChild><Button tone="secondary" size="sm">Keep theme</Button></ModalClose><ModalAction>Delete theme</ModalAction></>}
        />
      </div>
    ),
  },
});
