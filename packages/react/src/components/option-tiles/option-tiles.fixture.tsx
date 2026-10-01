import { Braces, CodeXml, FileCode, FileImage, FileUp, Link } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { OptionTiles, OptionTilesItem, type OptionTilesProps } from './option-tiles.tsx';

const formats: [string, string, string][] = [
  ['svg', 'SVG', 'vector'], ['png', 'PNG', '2×'], ['jpg', 'JPG', 'quality'], ['webp', 'WebP', 'quality'],
  ['pdf', 'PDF', 'print'], ['fig', 'FIG', 'selection'], ['jsx', 'JSX', 'React'], ['tokens', 'Tokens', 'DTCG'],
];

const sources = [
  { id: 'url', label: 'URL', icon: <Link /> },
  { id: 'file', label: 'File', icon: <FileUp /> },
  { id: 'html', label: 'HTML', icon: <CodeXml /> },
  { id: 'jsx', label: 'JSX', icon: <FileCode /> },
  { id: 'workspace', label: 'Workspace', icon: <Braces /> },
];

const Tiles = ({ checked, ...props }: Partial<OptionTilesProps> & { checked?: boolean }) =>
  props.layout === 'icon' ? (
    <OptionTiles aria-label="Import source" defaultValue="file" columns="5" {...props}>
      {sources.map((s, i) => <OptionTilesItem key={s.id} itemId={s.id} label={s.label} icon={s.icon} checked={i === 0 ? checked : undefined} />)}
    </OptionTiles>
  ) : (
    <OptionTiles aria-label="Export format" defaultValue="png" {...props}>
      {formats.map(([id, label, caption], i) => <OptionTilesItem key={id} itemId={id} label={label} caption={caption} icon={i === 0 ? <FileImage /> : undefined} checked={i === 0 ? checked : undefined} />)}
    </OptionTiles>
  );

export default defineFixture({
  id: 'option-tiles',
  frame: children => <div className="w-100">{children}</div>,
  render: props => <Tiles {...(props as Partial<OptionTilesProps>)} />,
  examples: {},
});
