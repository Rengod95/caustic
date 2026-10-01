'use client';
import { Unlink } from 'lucide-react';
import { useId, useRef, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { ColorWell } from '../color-well/color-well.tsx';
import { HexInput } from '../hex-input/hex-input.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { NumberField } from '../number-field/number-field.tsx';

export interface PaintValue { hex: string; alpha: number }

export interface PaintWellProps extends Omit<ComponentProps<'div'>, 'defaultValue' | 'onChange'> {
  /** Controlled paint: hex digits without # and alpha 0-100. */
  value?: PaintValue;
  /** Uncontrolled initial paint. */
  defaultValue?: PaintValue;
  /** Token path the paint is bound to; shows the bound chip and Detach. */
  token?: string;
  /** CSS color of the bound token, painted in the well while bound. */
  tokenColor?: string;
  /** Differing paints in the selection. */
  mixed?: boolean;
  /** The typed hex is not 3, 4, 6 or 8 digits. */
  invalid?: boolean;
  /** Error text for an invalid row. */
  message?: ReactNode;
  disabled?: boolean;
  onValueChange?: (value: PaintValue) => void;
  onWellClick?: () => void;
  onDetach?: () => void;
}

const fallback: PaintValue = { hex: 'E2763F', alpha: 100 };
const validHex = (v: string) => /^[0-9a-fA-F]+$/.test(v) && [3, 4, 6, 8].includes(v.length);

/** One solid paint in a row: color well, hex digits and alpha. Bound to a token it shows the token and Detach instead. */
export function PaintWell({ value, defaultValue = fallback, token, tokenColor, mixed = false, invalid = false, message = 'Use 3, 4, 6 or 8 hex digits.', disabled = false, onValueChange, onWellClick, onDetach, className, ...props }: PaintWellProps) {
  const [paint, setPaint] = useControllableState<PaintValue>({ value, defaultValue, onChange: v => onValueChange?.(v) });
  const messageId = useId();
  const lastValid = useRef(fallback.hex);
  if (validHex(paint.hex)) lastValid.current = paint.hex;
  const bound = token != null;
  const solid = `#${lastValid.current}`;
  const translucent = !bound && !mixed && paint.alpha < 100;
  const wellColor = bound ? tokenColor : translucent ? `color-mix(in oklab, ${solid} ${paint.alpha}%, transparent)` : solid;
  const hasMessage = invalid && message != null && message !== false;
  return (
    <div data-slot="paint-well" data-bound={bound || undefined} data-mixed={mixed || undefined} data-invalid={invalid || undefined} className={cn('flex min-w-0 flex-col gap-2', className)} {...props}>
      <div data-slot="paint-well-row" className="grid h-control-md grid-cols-[auto_1fr_var(--cs-size-field-alpha-w)] items-center gap-1.5">
        <div data-slot="paint-well-well" className="flex">
          <ColorWell
            aria-label={bound ? `Fill color ${token}` : mixed ? 'Fill color mixed' : `Fill color ${lastValid.current.toUpperCase()}`}
            appearance={bound || mixed ? 'flat' : 'checker'}
            color={mixed ? undefined : wellColor}
            solidColor={translucent ? solid : undefined}
            split={translucent}
            mixed={mixed}
            onClick={onWellClick ?? (() => {})}
          />
        </div>
        <div data-slot="paint-well-hex" className="min-w-0">
          <HexInput
            aria-label="Hex" value={paint.hex} token={token} mixed={mixed} invalid={invalid} disabled={disabled}
            aria-describedby={hasMessage ? messageId : undefined}
            onValueChange={hex => setPaint({ ...paint, hex })}
          />
        </div>
        {bound ? (
          <div data-slot="paint-well-detach" className="inline-flex justify-self-start">
            <IconButton label="Detach" size="xs" disabled={disabled} onClick={() => onDetach?.()}><Unlink /></IconButton>
          </div>
        ) : (
          <div data-slot="paint-well-alpha" className="w-field-alpha-w">
            <NumberField aria-label="Alpha" unit="%" min={0} max={100} mixed={mixed} locked={disabled} value={paint.alpha} onValueChange={alpha => setPaint({ ...paint, alpha })} />
          </div>
        )}
      </div>
      {hasMessage ? <span data-slot="paint-well-message" id={messageId} className="text-hint text-danger-text">{message}</span> : null}
    </div>
  );
}
