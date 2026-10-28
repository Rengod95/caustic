'use client';
import type { ComponentProps } from 'react';
import { Dialog, DialogClose, type DialogProps } from '../dialog/dialog.tsx';

export interface SheetProps extends Omit<DialogProps, 'placement' | 'kind' | 'title' | 'icon' | 'modal'> {
  /** Which edge the sheet is attached to: right = Dialog placement="right", bottom = placement="bottom" with the grabber. */
  side?: 'right' | 'bottom';
  /** Header title. */
  title: DialogProps['title'];
}

/** Closes the sheet. Use inside the footer. */
export function SheetClose(props: ComponentProps<typeof DialogClose>) { return <DialogClose {...props} />; }

/**
 * Preset over Dialog: an edge-attached sheet. side picks the placement; the close button is on and named "Close" unless
 * told otherwise. Surface, overlay, bands, grabber and dividers all come from Dialog.
 */
export function Sheet({ side = 'right', showClose = true, closeLabel = 'Close', ...props }: SheetProps) {
  return <Dialog data-slot="sheet" placement={side} showClose={showClose} closeLabel={closeLabel} {...props} />;
}
