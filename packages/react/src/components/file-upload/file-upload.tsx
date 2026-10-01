'use client';
import { FileText, FileX, Image, Trash2, Upload, X } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type ComponentProps, type DragEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { Progress } from '../progress/progress.tsx';
import { dropzoneVariants, fileItemVariants } from './file-upload.variants.ts';

export interface FileUploadItem {
  id: string;
  name: string;
  status: 'uploading' | 'done' | 'error';
  /** 0–100 while uploading; omit when unknown (the bar becomes indeterminate). */
  progress?: number;
  /** Size, remaining time, "Uploaded" or the failure reason. */
  description?: ReactNode;
  /** Overrides the file-type icon. */
  icon?: ReactNode;
}

export interface FileUploadProps extends Omit<ComponentProps<'div'>, 'children' | 'onDrop'> {
  files?: FileUploadItem[];
  /** Text before the accent "browse" word. */
  label?: ReactNode;
  /** The accent word. */
  browseLabel?: ReactNode;
  /** Allowed formats and maximum size, written inside the dropzone. */
  hint?: ReactNode;
  /** Native accept list for the picker. */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Forces the drag-over look. Set internally while a file is dragged over the zone. */
  dragOver?: boolean;
  /** aria-label of the dropzone button. */
  uploadLabel?: string;
  /** Files dropped on the zone or chosen in the picker. */
  onFilesSelected?: (files: File[]) => void;
  /** A row action was pressed: cancel while uploading, remove otherwise. */
  onRemove?: (id: string) => void;
}

const IMAGE = /\.(png|jpe?g|gif|avif|webp|svg|heic|bmp)$/i;
const rowIcon = (f: FileUploadItem) => f.icon ?? (f.status === 'error' ? <FileX /> : IMAGE.test(f.name) ? <Image /> : <FileText />);

/** Dashed dropzone plus the file list. The host app uploads and feeds the rows back through `files`. */
export function FileUpload({
  files = [], label = 'Drop files or', browseLabel = 'browse', hint, accept, multiple = true, disabled = false, dragOver, uploadLabel = 'Upload files',
  onFilesSelected, onRemove, className, ...props
}: FileUploadProps) {
  const picker = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const over = dragOver ?? dragging;
  const report = (list: FileList | null) => {
    const picked = Array.from(list ?? []);
    if (picked.length) onFilesSelected?.(multiple ? picked : picked.slice(0, 1));
  };
  const open = () => { if (!disabled) picker.current?.click(); };
  const keyDown = (e: KeyboardEvent<HTMLDivElement>) => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(); } };
  const drag = (e: DragEvent<HTMLDivElement>, on: boolean) => { if (disabled) return; e.preventDefault(); if (on || !e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(on); };
  const drop = (e: DragEvent<HTMLDivElement>) => { if (disabled) return; e.preventDefault(); setDragging(false); report(e.dataTransfer.files); };
  const change = (e: ChangeEvent<HTMLInputElement>) => { report(e.target.files); e.target.value = ''; };
  return (
    <div data-slot="file-upload" className={cn('grid min-w-0 gap-4', className)} {...props}>
      <div
        data-slot="file-upload-dropzone"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={uploadLabel}
        aria-disabled={disabled || undefined}
        data-dragging={over || undefined}
        data-disabled={disabled || undefined}
        className={dropzoneVariants()}
        onClick={open}
        onKeyDown={keyDown}
        onDragEnter={e => drag(e, true)}
        onDragOver={e => drag(e, true)}
        onDragLeave={e => drag(e, false)}
        onDrop={drop}
      >
        <span data-slot="file-upload-dropzone-icon" aria-hidden className="grid size-control-lg place-items-center rounded-xl bg-control-raised shadow-[0_0_0_1px_var(--cs-color-control-edge),var(--cs-elevation-1)] [&_svg]:size-icon-md [&_svg]:stroke-[1.75]"><Upload /></span>
        <b data-slot="file-upload-dropzone-label" className="text-ui-strong text-text-primary">{label}{' '}<u data-slot="file-upload-dropzone-browse" className="text-accent-text no-underline">{browseLabel}</u></b>
        {hint != null && <span data-slot="file-upload-dropzone-hint" className="text-ui-sm font-normal text-text-tertiary group-hover:text-text-secondary group-data-[dragging]:text-text-secondary">{hint}</span>}
        <input ref={picker} type="file" hidden accept={accept} multiple={multiple} disabled={disabled} onChange={change} onClick={e => e.stopPropagation()} />
      </div>
      {files.length > 0 && (
        <ul data-slot="file-upload-list" className="grid gap-2">
          {files.map(f => (
            <li key={f.id} data-slot="file-upload-item" data-status={f.status} className={fileItemVariants({ status: f.status })}>
              <span data-slot="file-upload-item-icon" aria-hidden className="grid size-control-md place-items-center rounded-md bg-fill-pressed text-text-secondary [&_svg]:size-icon-sm [&_svg]:stroke-[1.75]">{rowIcon(f)}</span>
              <div data-slot="file-upload-item-text" className="grid min-w-0 gap-1">
                <b data-slot="file-upload-item-name" className="truncate text-ui-strong">{f.name}</b>
                {f.status === 'uploading' && <Progress data-slot="file-upload-item-progress" value={f.progress} aria-label={`Uploading ${f.name}`} />}
                {f.description != null && <span data-slot="file-upload-item-meta" className={cn('text-hint', f.status === 'error' ? 'text-danger-text' : 'text-text-tertiary')}>{f.description}</span>}
              </div>
              {f.status === 'uploading' ? (
                <IconButton data-slot="file-upload-item-action" label="Cancel upload" size="xs" onClick={() => onRemove?.(f.id)}><X /></IconButton>
              ) : f.status === 'done' ? (
                <IconButton data-slot="file-upload-item-action" label="Remove" size="xs" onClick={() => onRemove?.(f.id)}><Trash2 /></IconButton>
              ) : (
                <Button data-slot="file-upload-item-action" tone="ghost" size="xs" onClick={() => onRemove?.(f.id)}>Remove</Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
