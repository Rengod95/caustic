'use client';
import { FileText, FileX, Image, Trash2, Upload, X } from 'lucide-react';
import {
  useRef, useState, type AnimationEvent, type ChangeEvent, type ComponentProps, type DragEvent, type KeyboardEvent, type ReactNode,
} from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { useFlip } from '../../hooks/use-flip.ts';
import { usePresence } from '../../hooks/use-presence.ts';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { Progress } from '../progress/progress.tsx';
import { dropzoneIconVariants, dropzoneVariants, fileItemIconVariants, fileItemVariants, fileUploadVariants } from './file-upload.variants.ts';

export interface FileUploadItem {
  id: string;
  name: string;
  /** warning: uploaded with a caveat (the description says what); error: the upload failed. */
  status: 'uploading' | 'done' | 'warning' | 'error';
  /** 0–100 while uploading; omit when unknown (the bar becomes indeterminate). */
  progress?: number;
  /** Size, remaining time, "Uploaded", the caveat or the failure reason. */
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
  /** Colour family of the dropzone (dashes, hover tint, browse word). */
  tone?: Tone | undefined;
  /** Emphasis of the dropzone; outline (default) is the dashed target. */
  variant?: Variant | undefined;
  /** Corner radius of the root; unset = none. */
  radius?: Radius | undefined;
  /** Elevation of the root; unset = none. */
  shadow?: Shadow | undefined;
  /** Gap between the dropzone and the list: xs 8, sm 12, md 16, lg 20. */
  size?: Size | undefined;
}

const IMAGE = /\.(png|jpe?g|gif|avif|webp|svg|heic|bmp)$/i;
const rowIcon = (f: FileUploadItem) => f.icon ?? (f.status === 'error' ? <FileX /> : IMAGE.test(f.name) ? <Image /> : <FileText />);

/** Dashed dropzone plus the file list. The host app uploads and feeds the rows back through `files`. */
export function FileUpload({
  files = [], label = 'Drop files or', browseLabel = 'browse', hint, accept, multiple = true, disabled = false, dragOver, uploadLabel = 'Upload files',
  onFilesSelected, onRemove, tone, variant, radius, shadow, size, className, ref, ...props
}: FileUploadProps) {
  const picker = useRef<HTMLInputElement>(null);
  const root = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const over = dragOver ?? dragging;
  // Rows there at the first paint do not rise; a file added later does. A removed row stays drawn, leaving, until its exit has
  // played, and the rows after it then slide up (useFlip).
  const [mounted] = useState(() => new Set(files.map(f => f.id)));
  const { entries, exited } = usePresence(files, f => f.id);
  useFlip(root, ':scope > ul > [data-flip-id]', 'flipId');
  const setRoot = (el: HTMLDivElement | null) => {
    root.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  };
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
    <div ref={setRoot} data-slot="file-upload" className={cn(fileUploadVariants({ radius, shadow, size }), className)} {...props}>
      <div
        data-slot="file-upload-dropzone"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={uploadLabel}
        aria-disabled={disabled || undefined}
        data-dragging={over || undefined}
        data-disabled={disabled || undefined}
        className={cn(dropzoneVariants({ tone, variant }))}
        onClick={open}
        onKeyDown={keyDown}
        onDragEnter={e => drag(e, true)}
        onDragOver={e => drag(e, true)}
        onDragLeave={e => drag(e, false)}
        onDrop={drop}
      >
        <span data-slot="file-upload-dropzone-icon" aria-hidden className={dropzoneIconVariants()}><Upload /></span>
        <b data-slot="file-upload-dropzone-label" className="text-ui-lg text-text-primary">{label}{' '}<u data-slot="file-upload-dropzone-browse" className="text-accent-text no-underline">{browseLabel}</u></b>
        {hint != null && <span data-slot="file-upload-dropzone-hint" className="mt-1 text-ui-sm font-normal text-text-tertiary group-hover:text-text-secondary group-data-[dragging]:text-text-secondary">{hint}</span>}
        <input ref={picker} type="file" hidden accept={accept} multiple={multiple} disabled={disabled} onChange={change} onClick={e => e.stopPropagation()} />
      </div>
      {entries.length > 0 && (
        <ul data-slot="file-upload-list" className="grid gap-2">
          {entries.map(({ key, item: f, present }) => (
            <li
              key={key} data-flip-id={key} data-state={present ? undefined : 'closed'} aria-hidden={!present || undefined} inert={!present || undefined}
              onAnimationEnd={(e: AnimationEvent<HTMLLIElement>) => { if (e.target === e.currentTarget) exited(key); }}
              data-slot="file-upload-item" data-status={f.status} className={fileItemVariants({ status: f.status, enter: !mounted.has(key) })}
            >
              <span data-slot="file-upload-item-icon" aria-hidden className={fileItemIconVariants({ status: f.status })}>{rowIcon(f)}</span>
              <div data-slot="file-upload-item-text" className="grid min-w-0 gap-1">
                <b data-slot="file-upload-item-name" className="truncate text-ui-strong">{f.name}</b>
                {f.status === 'uploading' && <Progress data-slot="file-upload-item-progress" value={f.progress} aria-label={`Uploading ${f.name}`} />}
                {f.description != null && <span data-slot="file-upload-item-meta" className={cn('text-hint', f.status === 'error' ? 'text-danger-text' : f.status === 'warning' ? 'text-warning-text' : 'text-text-tertiary')}>{f.description}</span>}
              </div>
              {f.status === 'uploading' ? (
                <IconButton data-slot="file-upload-item-action" label="Cancel upload" size="xs" onClick={() => onRemove?.(f.id)}><X /></IconButton>
              ) : f.status === 'done' || f.status === 'warning' ? (
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
