import { defineFixture } from '../../lib/fixture.ts';
import { ExportControls, type ExportControlsProps } from './export-controls.tsx';

const formats = [
  { id: 'svg', label: 'SVG', caption: 'vector' },
  { id: 'png', label: 'PNG', caption: '2×' },
  { id: 'jpg', label: 'JPG', caption: 'quality' },
  { id: 'webp', label: 'WebP', caption: 'quality' },
  { id: 'pdf', label: 'PDF', caption: 'print' },
  { id: 'fig', label: 'FIG', caption: 'selection' },
  { id: 'jsx', label: 'JSX', caption: 'React' },
  { id: 'tokens', label: 'Tokens', caption: 'DTCG' },
];

const Export = (props: Partial<ExportControlsProps>) => (
  <ExportControls
    formats={formats} defaultFormat="png" defaultScale="2×" copyLabel="Copy PNG" exportLabel="Export 3 frames"
    status="Exported pricing@2x.png · 1.2 MB" {...props}
  />
);

export default defineFixture({
  id: 'export-controls',
  frame: children => <div className="w-200">{children}</div>,
  render: props => <Export {...(props as Partial<ExportControlsProps>)} />,
  examples: {
    export: () => <Export />,
  },
});
