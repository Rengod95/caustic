import { defineFixture } from '../../lib/fixture.ts';
import { FontPicker, type FontOption } from './font-picker.tsx';

const options: FontOption[] = [
  { family: 'Newsreader', meta: 'Variable · opsz wght', cssFamily: 'Newsreader, serif' },
  { family: 'Geist', meta: 'Variable · wght', cssFamily: 'Geist, sans-serif', project: true },
  { family: 'Pretendard Variable', label: '프리텐다드', meta: 'Pretendard · 9 weights', cssFamily: "'Pretendard Variable', sans-serif" },
  { family: 'Tiempos Text', meta: 'Previewing with Georgia', cssFamily: 'Georgia, serif', italic: true, missing: true },
];

const labels = {
  triggerLabel: (f: string | undefined) => (f ? `Font: ${f}` : 'Font'), sampleText: 'Aa', searchLabel: 'Search fonts', searchPlaceholder: 'Search fonts',
  listLabel: 'Fonts', popupLabel: 'Font list', mixedLabel: 'Mixed', missingLabel: 'Missing', projectLabel: 'Project', emptyMessage: 'No matching fonts',
};

export default defineFixture({
  id: 'font-picker',
  render: props => <FontPicker {...labels} options={options} inline defaultOpen defaultValue="Geist" {...props} />,
  examples: {
    'font-picker-open': () => <FontPicker {...labels} options={options} inline defaultOpen defaultValue="Newsreader" />,
  },
});
