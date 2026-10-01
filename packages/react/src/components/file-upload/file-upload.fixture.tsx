import { defineFixture } from '../../lib/fixture.ts';
import { FileUpload, type FileUploadItem } from './file-upload.tsx';

const rows: Record<FileUploadItem['status'], FileUploadItem> = {
  uploading: { id: 'u1', name: 'hero-photo.avif', status: 'uploading', progress: 64, description: '2.6 of 4.1 MB · 4s left' },
  done: { id: 'd1', name: 'brand-guidelines.pdf', status: 'done', description: '1.2 MB · Uploaded' },
  error: { id: 'e1', name: 'export-final-final.fig', status: 'error', description: '72 MB is over the 50 MB limit.' },
};
const hint = 'PNG, SVG, PDF or Figma file · up to 50 MB';

export default defineFixture({
  id: 'file-upload',
  render: props => {
    // `status` is the row-status axis: the generated cases render one row of that status.
    const { status = 'done', ...rest } = props as { status?: FileUploadItem['status'] } & Record<string, unknown>;
    return <FileUpload hint={hint} files={[rows[status]]} {...rest} />;
  },
  examples: {
    'file-upload': () => (
      <div className="grid w-full max-w-[calc(var(--cs-size-dialog-md)+var(--cs-size-control-lg))] gap-4">
        <FileUpload hint={hint} files={[rows.uploading, rows.done, rows.error]} />
      </div>
    ),
  },
});
