'use client';
import { Braces, CodeXml, FileCode, FileUp, Globe, Link, Monitor, Smartphone, Tv } from '../../icons/index.ts';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Button } from '../button/button.tsx';
import { Input } from '../input/input.tsx';
import { ChoiceGroup, ChoiceGroupItem } from '../choice-group/choice-group.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import type { CommonProps, Size } from '../../lib/common-props.ts';
import {
  importPanelDeviceVariants, importPanelFieldVariants, importPanelFooterVariants, importPanelFrameVariants, importPanelNoteVariants, importPanelOptionsVariants, importPanelVariants,
} from './import-panel.variants.ts';

type Scope = 'full' | 'selector';
type Device = 'desktop' | 'wide' | 'mobile';

export interface ImportPanelProps extends Omit<ComponentProps<'div'>, 'defaultValue'>, CommonProps {
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

/**
 * size steps the child controls together: source tiles, field, capture switches, Preview. md: tiles lg, field md,
 * switches sm, Preview sm (the tiles and switches one step larger than before, owner 2026-10-27).
 */
const CONTROL_SIZES: Record<Size, { tiles: Size; field: Size; option: Size; action: Size }> = {
  xs: { tiles: 'sm', field: 'xs', option: 'xs', action: 'xs' },
  sm: { tiles: 'md', field: 'sm', option: 'xs', action: 'xs' },
  md: { tiles: 'lg', field: 'md', option: 'sm', action: 'sm' },
  lg: { tiles: 'lg', field: 'lg', option: 'md', action: 'md' },
};

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
  note = 'Previews the conversion. Nothing is added until Import.', previewLabel = 'Preview', onPreview, children,
  tone, variant, radius, shadow, size, className, ...props
}: ImportPanelProps) {
  const sizes = CONTROL_SIZES[size ?? 'md'];
  const [currentSource, setSource] = useControllableState({ value: source, defaultValue: defaultSource, onChange: onSourceChange });
  const [currentUrl, setUrl] = useControllableState({ value: url, defaultValue: defaultUrl, onChange: onUrlChange });
  const [currentScope, setScope] = useControllableState<Scope>({ value: scope, defaultValue: 'full', onChange: onScopeChange });
  const [currentDevice, setDevice] = useControllableState<Device>({ value: device, defaultValue: 'desktop', onChange: onDeviceChange });
  const isUrl = currentSource === 'url';
  return (
    <div data-slot="import-panel" className={cn(importPanelVariants({ tone, variant }), importPanelFrameVariants({ radius, shadow, size }), className)} {...props}>
      <ChoiceGroup data-slot="import-panel-sources" appearance="tile" aria-label="Import source" layout="icon" columns="5" size={sizes.tiles} value={currentSource} onValueChange={v => setSource(v as string)}>
        {SOURCES.map(s => <ChoiceGroupItem key={s.id} value={s.id} title={s.label} icon={s.icon} />)}
      </ChoiceGroup>
      <div data-slot="import-panel-field" className={importPanelFieldVariants()}>
        {children ?? (
          <Input aria-label="URL" size={sizes.field} prefix={<Globe />} value={currentUrl} onValueChange={setUrl} />
        )}
      </div>
      {isUrl && (
        <div data-slot="import-panel-options" className={importPanelOptionsVariants()}>
          <SegmentedControl data-slot="import-panel-scope" aria-label="Capture" size={sizes.option} value={currentScope} onValueChange={v => setScope(v as Scope)}>
            <SegmentedControlItem value="full">Full page</SegmentedControlItem>
            <SegmentedControlItem value="selector">Selector</SegmentedControlItem>
          </SegmentedControl>
          <SegmentedControl
            data-slot="import-panel-device" aria-label="Device size" size={sizes.option} content="icon" className={importPanelDeviceVariants()}
            value={currentDevice} onValueChange={v => setDevice(v as Device)}
          >
            <SegmentedControlItem value="desktop" aria-label="Desktop" icon={<Monitor />} />
            <SegmentedControlItem value="wide" aria-label="Wide" icon={<Tv />} />
            <SegmentedControlItem value="mobile" aria-label="Mobile" icon={<Smartphone />} />
          </SegmentedControl>
        </div>
      )}
      <div data-slot="import-panel-footer" className={importPanelFooterVariants()}>
        <span data-slot="import-panel-note" className={importPanelNoteVariants({ tone })}>{note}</span>
        <Button data-slot="import-panel-preview" size={sizes.action} onClick={onPreview}>{previewLabel}</Button>
      </div>
    </div>
  );
}
