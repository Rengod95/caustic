import { AlignCenterVertical, AlignEndVertical, AlignStartVertical, Droplet, Plus, Sparkles, SquareStack } from 'lucide-react';
import { useId } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { ButtonGroup } from '../button-group/button-group.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { PositionSize, type PositionSizeLabels } from '../position-size/position-size.tsx';
import { PropertyStack, type PropertyItem, type PropertyStackLabels } from '../property-stack/property-stack.tsx';
import { StrokeEditor, type StrokeEditorLabels } from '../stroke-editor/stroke-editor.tsx';
import { InspectorPanel, InspectorSection, InspectorSectionHeader, type InspectorPanelProps } from './inspector-panel.tsx';

/**
 * One panel per case; the harness shows many cases on one page, so the panel and its sections (named regions) get a
 * unique accessible name per case. The visible titles stay "Fill" and "Effects".
 */
function Panel(props: Partial<InspectorPanelProps>) {
  const id = useId();
  return (
    <InspectorPanel aria-label={`Inspector ${id}`} {...props}>
      <InspectorSection aria-labelledby={undefined} aria-label={`Fill ${id}`}>
        <InspectorSectionHeader
          title="Fill"
          actions={<><IconButton size="xs" label="Styles"><Sparkles /></IconButton><IconButton size="xs" label="Add fill"><Plus /></IconButton></>}
        />
        <div className="h-control-md" />
      </InspectorSection>
      <InspectorSection aria-labelledby={undefined} aria-label={`Effects ${id}`}>
        <InspectorSectionHeader title="Effects" />
        <div className="h-control-md" />
      </InspectorSection>
    </InspectorPanel>
  );
}

// A whole inspector (Frame, Fill, Stroke, Effects, Export) in a 480px scroller, to judge section headers in context and
// to show them sticking. Not a spec example (no baseline); the audit page previews it.
const geometry = { x: 360, y: 96, width: 640, height: 420, rotation: 0 };
const positionLabels: PositionSizeLabels = {
  x: 'X', y: 'Y', width: 'Width', height: 'Height', rotation: 'Rotation', xShort: 'X', yShort: 'Y', widthShort: 'W', heightShort: 'H',
  lockRatio: 'Lock aspect ratio', flipX: 'Flip horizontal', flipY: 'Flip vertical', flipXShort: 'H', flipYShort: 'V', constraints: 'Constraints',
  mode: { fixed: 'Fixed', hug: 'Hug', fill: 'Fill' },
  widthSizing: mode => `Width sizing: ${mode}`, heightSizing: mode => `Height sizing: ${mode}`, mixed: 'Mixed',
};
const paints: PropertyItem[] = [
  { id: 'token', color: 'var(--cs-color-accent-solid)', label: 'accent/solid', mono: true, meta: 'token', opacity: 100 },
  { id: 'base', color: 'var(--cs-color-surface-raised)', label: 'surface/raised', mono: true, meta: 'token', opacity: 100 },
];
const paintLabels: PropertyStackLabels = {
  list: 'Fill layers', styles: 'Styles', add: 'Add fill', mixedPaints: 'Mixed paints', replaceAll: 'Replace all',
  hide: 'Hide', show: 'Show', remove: 'Remove', moveUp: 'Move up', moveDown: 'Move down', opacity: 'Opacity', mixed: 'Mixed',
};
const strokeLabels: StrokeEditorLabels = {
  color: { well: 'Stroke color', hex: 'Stroke hex', alpha: 'Opacity', detach: 'Detach', mixed: 'Mixed' },
  weight: 'Weight', positionGroup: 'Stroke position', position: { inside: 'In', center: 'Center', outside: 'Out' }, details: 'Stroke details',
  dash: 'Dash', gap: 'Gap', capsGroup: 'Line cap', caps: { butt: 'Butt cap', round: 'Round cap', arrow: 'Arrow cap' },
  independent: 'Independent stroke widths', independentSwitch: 'Independent widths', sidesGroup: 'Side widths',
  sides: { top: 'Top', right: 'Right', bottom: 'Bottom', left: 'Left' }, sidesShort: { top: 'T', right: 'R', bottom: 'B', left: 'L' }, mixed: 'Mixed',
};
const effects: PropertyItem[] = [
  { id: 'shadow', icon: <SquareStack />, label: 'Drop shadow', meta: '24 px' },
  { id: 'blur', icon: <Droplet />, label: 'Background blur', meta: 'hidden', hidden: true },
];
const effectLabels: PropertyStackLabels = {
  list: 'Effects', hide: n => `Hide ${n}`, show: n => `Show ${n}`, remove: n => `Remove ${n}`, moveUp: n => `Move ${n} up`, moveDown: n => `Move ${n} down`,
};

const FullInspector = () => (
  <div className="h-120 w-68 overflow-y-auto">
    <InspectorPanel aria-label="Inspector">
      <InspectorSection>
        <InspectorSectionHeader
          title="Frame"
          actions={(
            <ButtonGroup density="tight" aria-label="Align">
              <IconButton label="Align left"><AlignStartVertical /></IconButton>
              <IconButton label="Align center"><AlignCenterVertical /></IconButton>
              <IconButton label="Align right"><AlignEndVertical /></IconButton>
            </ButtonGroup>
          )}
        />
        <PositionSize defaultValue={geometry} labels={positionLabels} />
      </InspectorSection>
      <PropertyStack title="Fill" labels={paintLabels} items={paints} onStylesClick={() => {}} />
      <InspectorSection>
        <InspectorSectionHeader title="Stroke" actions={<IconButton size="xs" label="Add stroke"><Plus /></IconButton>} />
        <StrokeEditor labels={strokeLabels} />
      </InspectorSection>
      <InspectorSection>
        <InspectorSectionHeader title="Effects" actions={<IconButton size="xs" label="Add effect"><Plus /></IconButton>} />
        <PropertyStack kind="effect" items={effects} labels={effectLabels} />
      </InspectorSection>
      <InspectorSection>
        <InspectorSectionHeader title="Export" actions={<IconButton size="xs" label="Add export"><Plus /></IconButton>} />
      </InspectorSection>
    </InspectorPanel>
  </div>
);

export default defineFixture({
  id: 'inspector-panel',
  render: props => <Panel {...(props as Partial<InspectorPanelProps>)} />,
  examples: { 'full-inspector': () => <FullInspector /> },
  frame: children => <div className="w-68">{children}</div>,
});
