'use client';
import { CircleCheck, Clipboard, Download } from 'lucide-react';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Button } from '../button/button.tsx';
import { OptionTiles, OptionTilesItem } from '../option-tiles/option-tiles.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import {
  exportControlsActionsVariants, exportControlsScaleLabelVariants, exportControlsScaleVariants, exportControlsStatusIconVariants,
  exportControlsStatusVariants, exportControlsVariants,
} from './export-controls.variants.ts';

export interface ExportFormat {
  id: string;
  label: string;
  caption: string;
}

export interface ExportControlsProps extends Omit<ComponentProps<'div'>, 'children' | 'onCopy'> {
  /** The format tiles. */
  formats: ExportFormat[];
  /** Controlled id of the chosen format. */
  format?: string;
  defaultFormat?: string;
  onFormatChange?: (id: string) => void;
  /** Controlled scale ("1×", "2×", "3×"). */
  scale?: string;
  defaultScale?: string;
  /** Scale options; an empty list hides the scale row. */
  scales?: string[];
  onScaleChange?: (scale: string) => void;
  copyLabel: ReactNode;
  exportLabel: ReactNode;
  onCopy?: (event: MouseEvent<HTMLButtonElement>) => void;
  onExport?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Result line of the last export (a polite live region). */
  status?: ReactNode;
  /** Disables copy and export while an export runs. */
  disabled?: boolean;
}

const DEFAULT_SCALES = ['1×', '2×', '3×'];

/** Exports the selection: a format grid, a scale, Copy and Export, and a status line. */
export function ExportControls({
  formats, format, defaultFormat = 'png', onFormatChange, scale, defaultScale = '2×', scales = DEFAULT_SCALES, onScaleChange,
  copyLabel, exportLabel, onCopy, onExport, status, disabled = false, className, ...props
}: ExportControlsProps) {
  const [currentFormat, setFormat] = useControllableState({ value: format, defaultValue: defaultFormat, onChange: onFormatChange });
  const [currentScale, setScale] = useControllableState({ value: scale, defaultValue: defaultScale, onChange: onScaleChange });
  return (
    <div data-slot="export-controls" className={cn(exportControlsVariants(), className)} {...props}>
      <OptionTiles data-slot="export-controls-formats" aria-label="Export format" value={currentFormat} onValueChange={setFormat}>
        {formats.map(f => <OptionTilesItem key={f.id} itemId={f.id} label={f.label} caption={f.caption} />)}
      </OptionTiles>
      {scales.length > 0 && (
        <div data-slot="export-controls-scale" className={exportControlsScaleVariants()}>
          <span data-slot="export-controls-scale-label" className={exportControlsScaleLabelVariants()}>Scale</span>
          <SegmentedControl data-slot="export-controls-scale-control" aria-label="Scale" size="xs" value={currentScale} onValueChange={setScale}>
            {scales.map(s => <SegmentedControlItem key={s} value={s}>{s}</SegmentedControlItem>)}
          </SegmentedControl>
        </div>
      )}
      <div data-slot="export-controls-actions" className={exportControlsActionsVariants()}>
        <Button data-slot="export-controls-copy" tone="ghost" size="xs" disabled={disabled} onClick={onCopy} iconStart={<Clipboard />}>{copyLabel}</Button>
        <Button data-slot="export-controls-export" size="sm" disabled={disabled} onClick={onExport} iconStart={<Download />}>{exportLabel}</Button>
      </div>
      {status != null && (
        <div role="status" aria-live="polite" data-slot="export-controls-status" className={exportControlsStatusVariants()}>
          <CircleCheck aria-hidden="true" className={exportControlsStatusIconVariants()} />
          {status}
        </div>
      )}
    </div>
  );
}
