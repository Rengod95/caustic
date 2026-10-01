'use client';
import { ChevronDown, Link2, Plus, Unlink } from 'lucide-react';
import { useId, type ComponentProps, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Badge } from '../badge/badge.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import {
  inspectorBindingsActionVariants, inspectorBindingsAddVariants, inspectorBindingsChevronVariants, inspectorBindingsContextVariants, inspectorBindingsLinkVariants,
  inspectorBindingsNameVariants, inspectorBindingsPropertyIconVariants, inspectorBindingsPropertyVariants, inspectorBindingsRowVariants, inspectorBindingsSelectorVariants,
  inspectorBindingsSwatchVariants, inspectorBindingsVariants, type InspectorBindingsVariantProps,
} from './inspector-bindings.variants.ts';

export interface InspectorBindingsRowProps extends Omit<ComponentProps<'div'>, 'children' | 'property'>, InspectorBindingsVariantProps {
  /** Property label ("Fill"). */
  property: ReactNode;
  /** Glyph of the property. */
  icon?: ReactNode;
  /** Token path or "Mixed tokens". */
  token: ReactNode;
  /** Swatch for color tokens: a CSS color (or var()) string, or an element. */
  swatch?: ReactNode;
  /** One entry per context fact. */
  context?: ReactNode[];
  /** Mixed rows: the "3 / 5" badge text. */
  count?: ReactNode;
  /** aria-label of the Unbind button. */
  unbindLabel?: string;
  /** Unbind is activated. */
  onUnbind?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** The selector is activated, to open the token picker. */
  onPick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface InspectorBindingsProps extends ComponentProps<'div'> {
  /** Label of the add row. */
  addLabel?: ReactNode;
  /** The add row is activated. */
  onAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** The stack of binding rows, ending with a dashed row to bind another property. */
export function InspectorBindings({ addLabel = 'Bind a property', onAdd, className, children, ...props }: InspectorBindingsProps) {
  return (
    <div data-slot="inspector-bindings" className={cn(inspectorBindingsVariants(), className)} {...props}>
      {children}
      <button type="button" data-slot="inspector-bindings-add" className={inspectorBindingsAddVariants()} onClick={onAdd}>
        <Plus aria-hidden />
        {addLabel}
      </button>
    </div>
  );
}

/** One bound property: its token in an accent selector, a context line, and Unbind (or a count when the selection is mixed). */
export function InspectorBindingsRow({
  binding, property, icon, token, swatch, context, count, unbindLabel = 'Unbind', onUnbind, onPick, className, ...props
}: InspectorBindingsRowProps) {
  const propertyId = useId();
  const tokenId = useId();
  const mixed = binding === 'mixed';
  const color = typeof swatch === 'string' ? swatch : undefined;
  const name = typeof property === 'string' ? property : undefined;
  return (
    <div
      data-slot="inspector-bindings-row" role="group" data-binding={binding ?? 'bound'}
      aria-label={name} aria-labelledby={name ? undefined : propertyId}
      className={cn(inspectorBindingsRowVariants(), className)} {...props}
    >
      <span data-slot="inspector-bindings-property" id={propertyId} className={inspectorBindingsPropertyVariants()}>
        {icon != null && <span aria-hidden className={inspectorBindingsPropertyIconVariants()}>{icon}</span>}
        {property}
      </span>
      <span data-slot="inspector-bindings-action" className={inspectorBindingsActionVariants()}>
        {mixed
          ? <Badge tone="warning">{count}</Badge>
          : <IconButton size="xs" label={name ? `${unbindLabel} ${name}` : unbindLabel} onClick={onUnbind}><Unlink /></IconButton>}
      </span>
      <button
        type="button" data-slot="inspector-bindings-selector" aria-haspopup="dialog" aria-labelledby={`${propertyId} ${tokenId}`}
        className={inspectorBindingsSelectorVariants({ binding })} onClick={onPick}
      >
        <Link2 data-slot="inspector-bindings-link" aria-hidden className={inspectorBindingsLinkVariants({ binding })} />
        {swatch != null && (
          <span
            data-slot="inspector-bindings-swatch" aria-hidden className={inspectorBindingsSwatchVariants()}
            style={color ? ({ '--swatch': color } as CSSProperties) : undefined}
          >
            {color ? null : swatch}
          </span>
        )}
        <span data-slot="inspector-bindings-name" id={tokenId} className={inspectorBindingsNameVariants()}>{token}</span>
        <ChevronDown data-slot="inspector-bindings-chevron" aria-hidden className={inspectorBindingsChevronVariants()} />
      </button>
      {context != null && context.length > 0 && (
        <div data-slot="inspector-bindings-context" className={inspectorBindingsContextVariants()}>
          {context.map((fact, i) => <span key={i}>{fact}</span>)}
        </div>
      )}
    </div>
  );
}
