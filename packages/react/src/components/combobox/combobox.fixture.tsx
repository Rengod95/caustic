import { Plus, Ruler, TriangleAlert } from 'lucide-react';
import type { CSSProperties } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { Badge } from '../badge/badge.tsx';
import { Field } from '../field/field.tsx';
import { Select, SelectOption } from '../select/select.tsx';
import { Combobox, ComboboxRow, ComboboxTile, type ComboboxGroupData, type ComboboxOptionData } from './combobox.tsx';

// A bare 16px colour dot with the swatch edge. (It was a label-less TokenChip, now Badge mono: the chip's own pill edge drew a second
// ring around the swatch's edge, the doubled ring the owner saw on 2026-10-27.)
const swatch = (color: string) => <span data-slot="combobox-swatch" className="inline-flex size-icon-md shrink-0 rounded-full bg-(--swatch) shadow-[inset_0_0_0_1px_var(--cs-color-swatch-edge)]" style={{ '--swatch': `var(--cs-color-${color})` } as CSSProperties} />;
const resultsLabel = (n: number) => `${n} results`;
const tokens = [
  { value: 'color/accent/solid', label: 'color/accent/solid', meta: 'color', leading: swatch('accent-solid') },
  { value: 'color/accent/soft', label: 'color/accent/soft', meta: 'color', leading: swatch('accent-soft') },
  { value: 'color/accent/text', label: 'color/accent/text', meta: 'color', leading: swatch('accent-text') },
  { value: 'space/accent-gap', label: 'space/accent-gap', meta: 'dimension', leading: <Ruler /> },
];

// Font picker (was FontPicker): every family is previewed in its own face (the face is the runtime --face variable).
const face = (family: string) => ({ '--face': family }) as CSSProperties;
const FONTS: Record<string, { css: string; meta: string; italic?: boolean }> = {
  Newsreader: { css: 'Newsreader, serif', meta: 'Variable · opsz wght' },
  Geist: { css: 'Geist, sans-serif', meta: 'Variable · wght' },
  'Pretendard Variable': { css: "'Pretendard Variable', sans-serif", meta: 'Pretendard · 9 weights' },
  'Tiempos Text': { css: 'Georgia, serif', meta: 'Previewing with Georgia', italic: true },
};
const fonts: ComboboxOptionData[] = [
  { value: 'Newsreader', label: 'Newsreader' },
  { value: 'Geist', label: 'Geist', badge: <Badge radius="xs">Project</Badge> },
  { value: 'Pretendard Variable', label: '프리텐다드' },
  { value: 'Tiempos Text', label: 'Tiempos Text', badge: <Badge tone="warning" icon={<TriangleAlert />}>Missing</Badge> },
];
const fontRow = (o: ComboboxOptionData) => {
  const f = FONTS[o.value];
  return (
    <span className="block min-w-0 py-1.5">
      <span data-italic={f?.italic || undefined} className="block truncate text-title-overlay font-normal text-text-primary [font-family:var(--face)] data-[italic]:italic" style={face(f?.css ?? '')}>{o.label}</span>
      <span className="block text-ui-xs text-text-tertiary">{f?.meta}</span>
    </span>
  );
};
const fontTrigger = (o: ComboboxOptionData | undefined, { mixed }: { mixed: boolean }) => {
  const f = o ? FONTS[o.value] : undefined;
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span aria-hidden="true" data-italic={f?.italic || undefined} className="w-control-compact-xs shrink-0 text-center text-title-3 font-normal [font-family:var(--face)] data-[italic]:italic" style={face(f?.css ?? '')}>Aa</span>
      <span data-mixed={mixed || undefined} className="min-w-0 truncate text-ui-strong data-[mixed]:italic data-[mixed]:text-text-secondary">{mixed ? 'Mixed' : o?.label}</span>
    </span>
  );
};
const fontPicker = {
  mode: 'popup', variant: 'soft', radius: 'md', 'aria-label': 'Font', triggerLabel: (f: string | undefined) => (f ? `Font: ${f}` : 'Font'),
  searchLabel: 'Search fonts', placeholder: 'Search fonts', listLabel: 'Fonts', popupLabel: 'Font list', emptyMessage: 'No matching fonts',
  options: fonts, renderOption: fontRow, triggerContent: fontTrigger,
} as const;

// Model menu (was ModelMenu): models grouped by provider, a provider tile in its identity colour, the description on the
// name's line, and a shimmering connect row with a + tile.
const tile = (initial: string) => <ComboboxTile tint="iris">{initial}</ComboboxTile>;
const models = (sonnet: string): ComboboxGroupData[] => [
  {
    label: 'Anthropic · connected',
    options: [
      { value: 'claude-opus', label: 'Claude Opus', description: 'Deep · 1M context', leading: tile('A') },
      { value: 'claude-sonnet', label: 'Claude Sonnet', description: sonnet, leading: tile('A') },
    ],
  },
  { label: 'OpenAI · not connected', options: [] },
];
const connect = (shimmer = true, onSelect?: never) => (
  <ComboboxRow shimmer={shimmer} onSelect={onSelect} leading={<ComboboxTile tint="neutral"><Plus /></ComboboxTile>}>Connect provider…</ComboboxRow>
);

export default defineFixture({
  id: 'combobox',
  // inline mode (default): the list is always in place. Cases (inline = false) show the specimen text “acc”; scenario
  // instances start empty unless they set defaultInputValue. Item-level props apply to the first option.
  // popup mode: the panel is rendered in place and open, under a default PickerTrigger, with the model groups (Claude
  // Sonnet chosen), a badge on the first model and the connect row. onSelect is injected on the connect row;
  // optionDisabled disables the first model.
  render: ({ inline, defaultInputValue, mode, onSelect, optionDisabled, ...props }) => (mode === 'popup' ? (
    <div className="w-80">
      <Combobox
        mode="popup" inline defaultOpen aria-label="Model" searchLabel="Search models" placeholder="Search models" listLabel="Models" popupLabel="Models"
        resultsLabel={resultsLabel} triggerLabel={l => (l ? `Model: ${l}` : 'Model')} defaultValue="claude-sonnet"
        groups={[
          {
            label: 'Anthropic · connected',
            options: [
              { value: 'claude-opus', label: 'Claude Opus', description: 'Deep · 1M context', leading: tile('A'), badge: <Badge radius="xs">New</Badge>, disabled: optionDisabled === true },
              { value: 'claude-sonnet', label: 'Claude Sonnet', description: 'Balanced', leading: tile('A') },
            ],
          },
          { label: 'OpenAI · not connected', options: [] },
        ]}
        footer={connect(true, onSelect as never)}
        {...props}
      />
    </div>
  ) : (
    <div className="w-80">
      <Combobox aria-label="Search tokens" resultsLabel={resultsLabel} options={tokens} {...props} defaultInputValue={(defaultInputValue as string | undefined) ?? (inline ? '' : 'acc')} inline />
    </div>
  )),
  examples: {
    'select-and-combobox': () => (
      <div className="grid w-full max-w-110 gap-4">
        <Field label="Role">
          <Select aria-label="Role" defaultValue="editor">
            <SelectOption value="editor">Editor</SelectOption>
            <SelectOption value="viewer">Viewer</SelectOption>
            <SelectOption value="admin">Admin</SelectOption>
          </Select>
        </Field>
        <Field label="Country">
          <Select aria-label="Country" placeholder="Select a country">
            <SelectOption value="kr">South Korea</SelectOption>
            <SelectOption value="us">United States</SelectOption>
          </Select>
        </Field>
        <Field label="Bind to token" className="max-w-80">
          <Combobox aria-label="Search tokens" resultsLabel={resultsLabel} inline defaultInputValue="acc" selected options={tokens} />
        </Field>
      </div>
    ),
    // Was the FontPicker example: the soft (inspector) trigger with "Aa" in the face, then the open 280px panel.
    'font-picker-open': () => <Combobox {...fontPicker} inline defaultOpen defaultValue="Newsreader" />,
    // Was the ModelMenu example: the panel alone (no trigger), 300px, centred.
    'model-menu': () => (
      <Combobox
        mode="popup" inline trigger={null} popupWidth="lg" aria-label="Models" searchLabel="Search models" placeholder="Search models" defaultValue="claude-opus"
        groups={models('Balanced')} footer={connect()}
      />
    ),
  },
});
