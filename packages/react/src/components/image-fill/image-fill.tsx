'use client';
import { Upload } from 'lucide-react';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Button } from '../button/button.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import {
  imageFillControlsVariants, imageFillCropFrameVariants, imageFillFileVariants, imageFillImageVariants, imageFillStageVariants, imageFillVariants,
} from './image-fill.variants.ts';

export type ImageFillMode = 'fill' | 'fit' | 'crop' | 'tile';

export interface ImageFillProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** Fit mode (controlled). */
  mode?: ImageFillMode;
  /** Uncontrolled initial mode. */
  defaultMode?: ImageFillMode;
  /** The image as a CSS image value (url(...) or gradients). */
  src?: string;
  fileName?: ReactNode;
  fileMeta?: ReactNode;
  disabled?: boolean;
  onModeChange?: (mode: ImageFillMode) => void;
  onReplace?: () => void;
}

const MODES: { value: ImageFillMode; label: string }[] = [
  { value: 'fill', label: 'Fill' },
  { value: 'fit', label: 'Fit' },
  { value: 'crop', label: 'Crop' },
  { value: 'tile', label: 'Tile' },
];

/** An image paint: a preview of how the image sits in its shape, the fit mode, Replace and the file facts. */
export function ImageFill({ mode, defaultMode = 'fill', src, fileName, fileMeta, disabled = false, onModeChange, onReplace, className, ...props }: ImageFillProps) {
  const [current, setCurrent] = useControllableState<ImageFillMode>({ value: mode, defaultValue: defaultMode, onChange: onModeChange });
  const vars = { ['--img' as string]: src } as CSSProperties;
  return (
    <div data-slot="image-fill" data-mode={current} className={cn(imageFillVariants(), className)} {...props}>
      <div data-slot="image-fill-stage" aria-hidden data-mode={current} className={imageFillStageVariants()}>
        <span data-slot="image-fill-image" className={imageFillImageVariants({ mode: current })} style={vars} />
        <span data-slot="image-fill-crop-frame" className={imageFillCropFrameVariants({ mode: current })} />
      </div>
      <div data-slot="image-fill-controls" className={imageFillControlsVariants()}>
        <SegmentedControl
          data-slot="image-fill-mode" size="xs" aria-label="Image fill mode" value={current} disabled={disabled}
          onValueChange={v => setCurrent(v as ImageFillMode)}
        >
          {MODES.map(m => <SegmentedControlItem key={m.value} value={m.value}>{m.label}</SegmentedControlItem>)}
        </SegmentedControl>
        <Button data-slot="image-fill-replace" tone="secondary" size="xs" disabled={disabled} iconStart={<Upload aria-hidden />} onClick={() => onReplace?.()}>Replace</Button>
      </div>
      <div data-slot="image-fill-file" className={imageFillFileVariants()}>
        <span data-slot="image-fill-file-name" className="font-mono text-mono text-text-tertiary">{fileName}</span>
        <span data-slot="image-fill-file-meta" className="text-ui-sm font-normal text-text-tertiary">{fileMeta}</span>
      </div>
    </div>
  );
}
