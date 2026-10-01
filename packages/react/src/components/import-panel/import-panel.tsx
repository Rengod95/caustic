'use client';
import { Braces, CodeXml, FileCode, FileUp, Globe, Link, Monitor, Smartphone, Tv } from 'lucide-react';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Button } from '../button/button.tsx';
import { Input } from '../input/input.tsx';
import { OptionTiles, OptionTilesItem } from '../option-tiles/option-tiles.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import {
  importPanelDeviceVariants, importPanelFooterVariants, importPanelNoteVariants, importPanelOptionsVariants, importPanelVariants,
} from './import-panel.variants.ts';

type Scope = 'full' | 'selector';
type Device = 'desktop' | 'wide' | 'mobile';

export interface ImportPanelProps extends Omit<ComponentProps<'div'>, 'defaultValue'> {
  /** Controlled id of the chosen source. */
  source?: string;
  defaultSource?: string;
  onSourceChange?: (source: string) => void;
  /** Controlled value of the field. */
  url?: string;
  defaultUrl?: string;
  onUrlChange?: (url: string) => void;
  /** Capture scope. */
  scope?: Scope;
  onScopeChange?: (scope: Scope) => void;
  /** Capture device size. */
  device?: Device;
  onDeviceChange?: (device: Device) => void;
  /** Footer note. */
  note?: ReactNode;
  previewLabel?: ReactNode;
  /** Preview is activated. */
  onPreview?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Replaces the URL field for the other sources (file drop, code editor). */
  children?: ReactNode;
}

const SOURCES = [
  { id: 'url', label: 'URL', icon: <Link /> },
  { id: 'file', label: 'File', icon: <FileUp /> },
  { id: 'html', label: 'HTML', icon: <CodeXml /> },
  { id: 'jsx', label: 'JSX', icon: <FileCode /> },
  { id: 'workspace', label: 'Workspace', icon: <Braces /> },
];

/** The body of the import dialog: source, field, capture options and a Preview action. It never imports by itself. */
export function ImportPanel({
  source, defaultSource = 'url', onSourceChange, url, defaultUrl = '', onUrlChange, scope, onScopeChange, device, onDeviceChange,
  note = 'Previews the conversion. Nothing is added until Import.', previewLabel = 'Preview', onPreview, children, className, ...props
}: ImportPanelProps) {
  const [currentSource, setSource] = useControllableState({ value: source, defaultValue: defaultSource, onChange: onSourceChange });
  const [currentUrl, setUrl] = useControllableState({ value: url, defaultValue: defaultUrl, onChange: onUrlChange });
  const [currentScope, setScope] = useControllableState<Scope>({ value: scope, defaultValue: 'full', onChange: onScopeChange });
  const [currentDevice, setDevice] = useControllableState<Device>({ value: device, defaultValue: 'desktop', onChange: onDeviceChange });
  const isUrl = currentSource === 'url';
  return (
    <div data-slot="import-panel" className={cn(importPanelVariants(), className)} {...props}>
      <OptionTiles data-slot="import-panel-sources" aria-label="Import source" layout="icon" columns="5" value={currentSource} onValueChange={setSource}>
        {SOURCES.map(s => <OptionTilesItem key={s.id} itemId={s.id} label={s.label} icon={s.icon} />)}
      </OptionTiles>
      <div data-slot="import-panel-field">
        {children ?? (
          <Input aria-label="URL" prefix={<Globe />} value={currentUrl} onValueChange={setUrl} />
        )}
      </div>
      {isUrl && (
        <div data-slot="import-panel-options" className={importPanelOptionsVariants()}>
          <SegmentedControl data-slot="import-panel-scope" aria-label="Capture" size="xs" value={currentScope} onValueChange={v => setScope(v as Scope)}>
            <SegmentedControlItem value="full">Full page</SegmentedControlItem>
            <SegmentedControlItem value="selector">Selector</SegmentedControlItem>
          </SegmentedControl>
          <SegmentedControl
            data-slot="import-panel-device" aria-label="Device size" size="xs" content="icon" className={importPanelDeviceVariants()}
            value={currentDevice} onValueChange={v => setDevice(v as Device)}
          >
            <SegmentedControlItem value="desktop" aria-label="Desktop" icon={<Monitor />} />
            <SegmentedControlItem value="wide" aria-label="Wide" icon={<Tv />} />
            <SegmentedControlItem value="mobile" aria-label="Mobile" icon={<Smartphone />} />
          </SegmentedControl>
        </div>
      )}
      <div data-slot="import-panel-footer" className={importPanelFooterVariants()}>
        <span data-slot="import-panel-note" className={importPanelNoteVariants()}>{note}</span>
        <Button data-slot="import-panel-preview" size="sm" onClick={onPreview}>{previewLabel}</Button>
      </div>
    </div>
  );
}
