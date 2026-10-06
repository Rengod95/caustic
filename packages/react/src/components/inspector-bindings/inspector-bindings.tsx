'use client';
import { ChevronDown, Link2, Plus, Unlink } from 'lucide-react';
import { cloneElement, Fragment, isValidElement, type ComponentProps, type CSSProperties, type MouseEvent, type ReactElement, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { Badge } from '../badge/badge.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { Select, SelectHeading, SelectOption } from '../select/select.tsx';
import {
  inspectorBindingsActionVariants, inspectorBindingsAddVariants, inspectorBindingsChevronVariants, inspectorBindingsContextVariants, inspectorBindingsLinkVariants,
  inspectorBindingsNameVariants, inspectorBindingsPropertyIconVariants, inspectorBindingsPropertyVariants, inspectorBindingsRowVariants, inspectorBindingsSelectorVariants,
  inspectorBindingsSwatchVariants, inspectorBindingsVariants, type InspectorBindingsVariantProps,
} from './inspector-bindings.variants.ts';

export interface BindingOption { value: string; label: ReactNode; disabled?: boolean | undefined; group?: string | undefined }
export interface InspectorBindingsRowProps extends Omit<ComponentProps<'div'>, 'property'>, InspectorBindingsVariantProps {
  /** Property label ("Fill"). */
  property: ReactNode;
  /** Glyph of the property. */
  icon?: ReactNode;
  /** Token path or "Mixed tokens". */
  token: ReactNode;
  /** aria-label of the selector ("Fill, color/accent/solid"). Required; no built-in pattern. */
  selectorLabel: string;
  /** Render the single child (e.g. a Select trigger) with the selector styling instead of the built-in button. Then onPick is not used: the child owns opening. */
  selectorAsChild?: boolean | undefined;
  /** With selectorAsChild: the single child (its own children replace the token text). */
  children?: ReactNode;
  /** Disables the selector and Unbind of the row. */
  disabled?: boolean | undefined;
  /** The property is held by another window: selector and Unbind are inert, the row stays readable. */
  reserved?: boolean | undefined;
  /** Text of the Mixed tokens name and the mixed badge aria-label. Required whenever binding can be mixed; no built-in default. */
  mixedLabel?: string | undefined;
  /** Swatch for color tokens: a CSS color (or var()) string, or an element. */
  swatch?: ReactNode;
  /** One entry per context fact. */
  context?: ReactNode[];
  /** Mixed rows: the "3 / 5" badge text. */
  count?: ReactNode;
  /** aria-label of the Unbind button ("Unbind Fill"). Required; no built-in default. */
  unbindLabel: string;
  /** K2e: the selector is a Select over these options (role combobox); onPick is not used. */
  options?: BindingOption[] | undefined;
  /** K2e: the chosen option value; omit it (or use binding mixed) for no choice. */
  value?: string | undefined;
  /** K2e: shown while no option is chosen and the row is not mixed. */
  placeholder?: ReactNode;
  /** K2e: an option was chosen. */
  onValueChange?: ((value: string) => void) | undefined;
  /** K2e: disables Unbind only. */
  unbindDisabled?: boolean | undefined;
  /** Unbind is activated. */
  onUnbind?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** The selector is activated, to open the token picker. */
  onPick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface InspectorBindingsProps extends ComponentProps<'div'> {
  /** Label of the add row ("Bind a property"). Required; no built-in default. */
  addLabel: ReactNode;
  /** Disables the add row. */
  addDisabled?: boolean | undefined;
  /** The add row is activated. */
  onAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** The stack of binding rows, ending with a dashed row to bind another property. */
export function InspectorBindings({ addLabel, addDisabled = false, onAdd, className, children, ...props }: InspectorBindingsProps) {
  return (
    <div data-slot="inspector-bindings" className={cn(inspectorBindingsVariants(), className)} {...props}>
      {children}
      <button type="button" data-slot="inspector-bindings-add" disabled={addDisabled} className={inspectorBindingsAddVariants()} onClick={onAdd}>
        <Plus aria-hidden />
        {addLabel}
      </button>
    </div>
  );
}

/** One bound property: its token in an accent selector, a context line, and Unbind (or a count when the selection is mixed). */
export function InspectorBindingsRow({
  binding, property, icon, token, selectorLabel, selectorAsChild = false, disabled = false, reserved = false, mixedLabel, swatch, context, count, unbindLabel, onUnbind, onPick,
  options, value, placeholder, onValueChange, unbindDisabled = false, className, children, ...props
}: InspectorBindingsRowProps) {
  const mixed = binding === 'mixed';
  const color = typeof swatch === 'string' ? swatch : undefined;
  const name = typeof property === 'string' ? property : selectorLabel.split(',')[0]?.trim();
  const inert = disabled || reserved;
  const selectorProps = {
    'data-slot': 'inspector-bindings-selector',
    'aria-label': selectorLabel,
    'aria-disabled': reserved || undefined,
    disabled: disabled || undefined,
    className: inspectorBindingsSelectorVariants({ binding }),
  };
  const nameText = mixed && mixedLabel ? mixedLabel : undefined;
  const selectorBody = (label: ReactNode) => (
    <>
      <Link2 data-slot="inspector-bindings-link" aria-hidden className={inspectorBindingsLinkVariants({ binding })} />
      {swatch != null && (
        <span
          data-slot="inspector-bindings-swatch" aria-hidden className={inspectorBindingsSwatchVariants()}
          style={color ? ({ '--swatch': color } as CSSProperties) : undefined}
        >
          {color ? null : swatch}
        </span>
      )}
      <span data-slot="inspector-bindings-name" className={inspectorBindingsNameVariants()}>{nameText ?? label}</span>
      <ChevronDown data-slot="inspector-bindings-chevron" aria-hidden className={inspectorBindingsChevronVariants()} />
    </>
  );
  return (
    <div
      data-slot="inspector-bindings-row" role="group" data-binding={binding ?? 'bound'}
      aria-label={name} aria-busy={reserved || undefined} data-reserved={reserved || undefined}
      className={cn(inspectorBindingsRowVariants(), className)} {...props}
    >
      <span data-slot="inspector-bindings-property" className={inspectorBindingsPropertyVariants()}>
        {icon != null && <span aria-hidden className={inspectorBindingsPropertyIconVariants()}>{icon}</span>}
        {property}
      </span>
      <span data-slot="inspector-bindings-action" className={inspectorBindingsActionVariants()}>
        {mixed
          ? <Badge tone="warning" role={mixedLabel ? 'img' : undefined} aria-label={mixedLabel}>{count}</Badge>
          : <IconButton size="xs" label={unbindLabel} disabled={disabled || unbindDisabled} onClick={reserved ? undefined : onUnbind}><Unlink /></IconButton>}
      </span>
      {options !== undefined ? (
        <Select
          {...selectorProps} aria-disabled={undefined} aria-busy={undefined}
          value={mixed || value === undefined ? '' : value} placeholder={mixed && mixedLabel ? mixedLabel : placeholder}
          disabled={disabled || reserved}
          onValueChange={next => { if (!inert) onValueChange?.(next); }}
          {...({ leading: (
            <>
              <Link2 data-slot="inspector-bindings-link" aria-hidden className={inspectorBindingsLinkVariants({ binding })} />
              {swatch != null && (
                <span data-slot="inspector-bindings-swatch" aria-hidden className={inspectorBindingsSwatchVariants()} style={color ? ({ '--swatch': color } as CSSProperties) : undefined}>{color ? null : swatch}</span>
              )}
            </>
          ) } as object)}
        >
          {options.map((option, i) => (
            <Fragment key={option.value}>
              {option.group !== undefined && option.group !== options[i - 1]?.group && <SelectHeading>{option.group}</SelectHeading>}
              <SelectOption value={option.value} {...(option.disabled !== undefined ? { disabled: option.disabled } : {})}>{option.label}</SelectOption>
            </Fragment>
          ))}
        </Select>
      ) : selectorAsChild && isValidElement(children)
        ? cloneElement(children as ReactElement<ComponentProps<'button'>>, selectorProps, selectorBody((children as ReactElement<{ children?: ReactNode }>).props.children ?? token))
        : (
          <button type="button" aria-haspopup="dialog" {...selectorProps} data-slot="inspector-bindings-selector" onClick={inert ? undefined : onPick}>
            {selectorBody(token)}
          </button>
        )}
      {context != null && context.length > 0 && (
        <div data-slot="inspector-bindings-context" className={inspectorBindingsContextVariants()}>
          {context.map((fact, i) => <span key={i}>{fact}</span>)}
        </div>
      )}
    </div>
  );
}
