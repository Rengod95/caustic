import { Search } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { Input } from '../input/index.ts';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/index.ts';
import { ThemeGallery, ThemeGalleryItem, type ThemeGalleryItemProps, type ThemeGalleryProps } from './theme-gallery.tsx';

const themes: [string, string, string, [string, string, string, string, string], string][] = [
  ['lagoon', 'Lagoon', 'Caustic default', ['#f7f8fa', '#ffffff', '#0e7f93', '#191c20', '#e1e4e9'], '8px'],
  ['swiss', 'Swiss', 'International style', ['#f2f0eb', '#ffffff', '#e2231a', '#111111', '#dcd8cf'], '0px'],
  ['bauhaus', 'Bauhaus', 'Primary geometry', ['#f4efe3', '#fffaf0', '#1d4fb8', '#141414', '#e8c547'], '999px'],
  ['nocturne', 'Nocturne', 'Dark editorial', ['#141519', '#1e2026', '#c7a2ff', '#f2f2f5', '#34363e'], '10px'],
  ['terrazzo', 'Terrazzo', 'Warm material', ['#f3ece4', '#fffaf5', '#b4532a', '#2b1d14', '#e5d6c6'], '14px'],
  ['memphis', 'Memphis', 'Loud pattern', ['#fff4d6', '#ffffff', '#ff4f9a', '#1b1b1b', '#47c7c0'], '6px'],
  ['brutal', 'Brutal', 'Raw web', ['#ffffff', '#ffffff', '#0000ee', '#000000', '#d9d9d9'], '0px'],
  ['aurora', 'Aurora', 'Soft gradients', ['#eef1fb', '#ffffff', '#6a5cf6', '#1a1830', '#d9ddf5'], '16px'],
];

const Gallery = ({ checked, ...props }: Partial<ThemeGalleryProps> & { checked?: boolean }) => (
  <ThemeGallery aria-label="Themes" defaultValue="lagoon" {...props}>
    {themes.map(([themeId, name, description, [background, surface, accent, ink, muted], radius], i) => (
      <ThemeGalleryItem
        key={themeId} themeId={themeId} name={name} description={description}
        preview={{ background, surface, accent, ink, muted, radius }}
        {...(i === 0 && checked !== undefined ? ({ checked } as Partial<ThemeGalleryItemProps>) : {})}
      />
    ))}
  </ThemeGallery>
);

export default defineFixture({
  id: 'theme-gallery',
  frame: children => <div className="w-200">{children}</div>,
  render: props => <Gallery {...(props as Partial<ThemeGalleryProps>)} />,
  examples: {
    'theme-gallery': () => (
      <div className="grid gap-3.5">
        <div className="flex items-center justify-between gap-2">
          <Input appearance="sunken" containerClassName="max-w-60" prefix={<Search />} placeholder="Search 128 themes" aria-label="Search themes" />
          <SegmentedControl size="xs" aria-label="Theme filter" defaultValue="all">
            <SegmentedControlItem value="all">All</SegmentedControlItem>
            <SegmentedControlItem value="isms">Isms</SegmentedControlItem>
            <SegmentedControlItem value="brands">Brands</SegmentedControlItem>
            <SegmentedControlItem value="mine">Mine</SegmentedControlItem>
          </SegmentedControl>
        </div>
        <Gallery />
      </div>
    ),
  },
});
