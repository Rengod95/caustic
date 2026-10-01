'use client';
import { ArrowDown, ArrowRight, LayoutGrid, Move, MoveHorizontal, MoveVertical, Space } from 'lucide-react';
import type { ComponentProps, CSSProperties } from 'react';
import { cn } from '../../lib/cn.ts';
import { InspectorChoice } from '../../lib/inspector-choice.tsx';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { AlignmentPad, type AlignmentPosition } from '../alignment-pad/alignment-pad.tsx';
import { GridTracks, type TrackList } from '../grid-tracks/grid-tracks.tsx';
import { NumberField } from '../number-field/number-field.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import { Switch } from '../switch/switch.tsx';
import { autoLayoutHeading, autoLayoutPreview, autoLayoutPreviewItem, autoLayoutRow, autoLayoutVariants } from './auto-layout.variants.ts';

export type LayoutFlow = 'free' | 'row' | 'column' | 'grid';
export type PaddingMode = 'all' | 'axes' | 'sides';
export interface Padding { top: number; right: number; bottom: number; left: number }
export interface AutoLayoutValue {
  flow: LayoutFlow;
  /** An AlignmentPad value such as "middle-left". */
  align: string;
  gap: number;
  distribution: 'packed' | 'space-between';
  wrap: boolean;
  paddingMode: PaddingMode;
  padding: Padding;
  clip: boolean;
  tracks: TrackList;
}

export const defaultAutoLayout: AutoLayoutValue = {
  flow: 'row', align: 'middle-left', gap: 8, distribution: 'packed', wrap: false, paddingMode: 'axes',
  padding: { top: 12, right: 16, bottom: 12, left: 16 }, clip: true,
  tracks: [{ size: 1, unit: 'fr' }, { size: 240, unit: 'px' }, { size: null, unit: 'auto' }],
};

const DISTRIBUTION = [['packed', 'Packed'], ['space-between', 'Space between']] as const;
const FREE_POSITIONS = [['14px', '10px'], ['70px', '40px'], ['130px', '20px']] as const;

export interface AutoLayoutProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange' | 'children'> {
  /** Controlled layout. */
  value?: AutoLayoutValue;
  /** Uncontrolled initial layout: the specimen state. */
  defaultValue?: AutoLayoutValue;
  onValueChange?: (value: AutoLayoutValue) => void;
  /** Shows the live preview above the tracks. */
  preview?: boolean;
  disabled?: boolean;
}

/** The auto-layout block of the inspector: flow, alignment pad, gap, distribution, wrap, padding, clip and grid tracks. */
export function AutoLayout({ value, defaultValue = defaultAutoLayout, onValueChange, preview = false, disabled = false, className, ...props }: AutoLayoutProps) {
  const [v, setV] = useControllableState<AutoLayoutValue>({ value, defaultValue, onChange: onValueChange });
  const patch = (next: Partial<AutoLayoutValue>) => setV({ ...v, ...next });
  const setPad = (sides: (keyof Padding)[]) => (n: number) => patch({ padding: { ...v.padding, ...Object.fromEntries(sides.map(s => [s, n])) } });

  const [row = 'middle', col = 'left'] = v.align.split('-');
  const column = v.flow === 'column';
  const main = column ? row : col;
  const cross = column ? col : row;
  const edge = { top: 'start', left: 'start', middle: 'center', center: 'center', bottom: 'end', right: 'end' } as const;
  const justify = v.distribution === 'space-between' ? 'between' : (edge[main as keyof typeof edge] ?? 'start');
  const align = edge[cross as keyof typeof edge] ?? 'center';

  return (
    <div data-slot="auto-layout" aria-disabled={disabled || undefined} className={cn(autoLayoutVariants(), className)} {...props}>
      <div data-slot="auto-layout-controls" className="grid gap-3">
        <SegmentedControl data-slot="auto-layout-flow" aria-label="Flow" content="icon" className="w-full" value={v.flow} disabled={disabled} onValueChange={flow => patch({ flow: flow as LayoutFlow })}>
          <SegmentedControlItem value="free" aria-label="Free" icon={<Move />} className="flex-1" />
          <SegmentedControlItem value="row" aria-label="Horizontal" icon={<ArrowRight />} className="flex-1" />
          <SegmentedControlItem value="column" aria-label="Vertical" icon={<ArrowDown />} className="flex-1" />
          <SegmentedControlItem value="grid" aria-label="Grid" icon={<LayoutGrid />} className="flex-1" />
        </SegmentedControl>
        <div data-slot="auto-layout-arrange" className="flex items-start gap-2.5">
          <AlignmentPad
            data-slot="auto-layout-pad"
            orientation={v.flow === 'row' ? 'row' : 'column'}
            value={v.align as AlignmentPosition}
            disabled={disabled || v.flow === 'free'}
            onValueChange={align => patch({ align })}
          />
          <div data-slot="auto-layout-options" className="grid min-w-0 flex-1 gap-2">
            <div data-slot="auto-layout-gap" className="min-w-0">
              <NumberField aria-label="Gap" label={<Space />} unit="px" min={0} value={v.gap} disabled={disabled} onValueChange={gap => patch({ gap })} />
            </div>
            <div data-slot="auto-layout-distribution" className="min-w-0">
              <InspectorChoice
                label="Distribution"
                options={DISTRIBUTION}
                value={v.distribution}
                disabled={disabled}
                onValueChange={distribution => patch({ distribution })}
              />
            </div>
            <div data-slot="auto-layout-wrap" className={autoLayoutRow()}>
              <span>Wrap</span>
              <Switch size="sm" aria-label="Wrap" checked={v.wrap} disabled={disabled} onCheckedChange={wrap => patch({ wrap })} />
            </div>
          </div>
        </div>
        <div data-slot="auto-layout-padding" className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <span data-slot="auto-layout-padding-title" className={autoLayoutHeading()}>Padding</span>
            <SegmentedControl data-slot="auto-layout-padding-mode" aria-label="Padding mode" size="xs" value={v.paddingMode} disabled={disabled} onValueChange={paddingMode => patch({ paddingMode: paddingMode as PaddingMode })}>
              <SegmentedControlItem value="all">All</SegmentedControlItem>
              <SegmentedControlItem value="axes">Axes</SegmentedControlItem>
              <SegmentedControlItem value="sides">Sides</SegmentedControlItem>
            </SegmentedControl>
          </div>
          <div data-slot="auto-layout-padding-fields" className="grid grid-cols-2 gap-1.5">
            {v.paddingMode === 'all' && (
              <NumberField aria-label="Padding" label={<Space />} min={0} value={v.padding.top} disabled={disabled} onValueChange={setPad(['top', 'right', 'bottom', 'left'])} />
            )}
            {v.paddingMode === 'axes' && (
              <>
                <NumberField aria-label="Horizontal padding" label={<MoveHorizontal />} min={0} value={v.padding.left} disabled={disabled} onValueChange={setPad(['left', 'right'])} />
                <NumberField aria-label="Vertical padding" label={<MoveVertical />} min={0} value={v.padding.top} disabled={disabled} onValueChange={setPad(['top', 'bottom'])} />
              </>
            )}
            {v.paddingMode === 'sides' && (
              <>
                <NumberField aria-label="Top padding" label="T" min={0} value={v.padding.top} disabled={disabled} onValueChange={setPad(['top'])} />
                <NumberField aria-label="Right padding" label="R" min={0} value={v.padding.right} disabled={disabled} onValueChange={setPad(['right'])} />
                <NumberField aria-label="Bottom padding" label="B" min={0} value={v.padding.bottom} disabled={disabled} onValueChange={setPad(['bottom'])} />
                <NumberField aria-label="Left padding" label="L" min={0} value={v.padding.left} disabled={disabled} onValueChange={setPad(['left'])} />
              </>
            )}
          </div>
        </div>
        <div data-slot="auto-layout-clip" className={autoLayoutRow()}>
          <span>Clip content</span>
          <Switch size="sm" aria-label="Clip content" checked={v.clip} disabled={disabled} onCheckedChange={clip => patch({ clip })} />
        </div>
      </div>
      <div data-slot="auto-layout-side" className="grid content-start gap-3">
        {preview && (
          <div
            data-slot="auto-layout-preview"
            aria-hidden
            className={autoLayoutPreview({ flow: v.flow, justify, align })}
            style={{ '--gap': `${v.gap}px` } as CSSProperties}
          >
            {(['a', 'b', 'c'] as const).map((size, i) => (
              <span
                key={size}
                data-slot="auto-layout-preview-item"
                className={autoLayoutPreviewItem({ size, free: v.flow === 'free' })}
                style={{ '--x': FREE_POSITIONS[i]![0], '--y': FREE_POSITIONS[i]![1] } as CSSProperties}
              />
            ))}
          </div>
        )}
        <GridTracks data-slot="auto-layout-tracks" heading="Grid tracks" tracks={v.tracks} disabled={disabled} onTracksChange={tracks => patch({ tracks })} />
      </div>
    </div>
  );
}
