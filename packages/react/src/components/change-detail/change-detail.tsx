'use client';
import { ArrowRight } from 'lucide-react';
import { createContext, useContext, type ComponentProps, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Size, Tone, Variant } from '../../lib/common-props.ts';
import {
  changeDetailArrowVariants, changeDetailFromVariants, changeDetailItemVariants, changeDetailKindVariants, changeDetailPathVariants,
  changeDetailShapeVariants, changeDetailSwatchVariants, changeDetailToVariants, changeDetailValuesVariants, changeDetailVariants,
} from './change-detail.variants.ts';

/** tone / variant / size of the list, read by every item. */
const ChangeDetailContext = createContext<{ tone?: Tone; variant?: Variant; size?: Size }>({});

export interface ChangeDetailProps extends ComponentProps<'ul'>, CommonProps {
  /** Accessible name of the list. */
  'aria-label'?: string;
}

/** The changes of one revision: kind, layer path and old / new values. Machine output, read-only. */
export function ChangeDetail({ tone, variant, radius, shadow, size, className, ...props }: ChangeDetailProps) {
  return (
    <ChangeDetailContext.Provider value={{ tone, variant, size }}>
      <ul data-slot="change-detail" className={cn(changeDetailVariants({ tone, variant, size }), changeDetailShapeVariants({ radius, shadow }), className)} {...props} />
    </ChangeDetailContext.Provider>
  );
}

type Kind = 'mod' | 'add' | 'del';
const KIND_TEXT: Record<Kind, string> = { mod: 'MOD', add: 'ADD', del: 'DEL' };
const KIND_WORD: Record<Kind, string> = { mod: 'Modified', add: 'Added', del: 'Deleted' };

export interface ChangeDetailItemProps extends Omit<ComponentProps<'li'>, 'children'> {
  /** Kind of change; selects the tag text and tint. */
  kind?: Kind;
  /** Where the change is. */
  path: ReactNode;
  /** Old value (mod, del). */
  from?: ReactNode;
  /** New value (mod, add). */
  to?: ReactNode;
  /** Swatch before the old value: a CSS color (set as --swatch) or a ready element. */
  fromSwatch?: ReactNode;
  /** Swatch before the new value: a CSS color (set as --swatch) or a ready element. */
  toSwatch?: ReactNode;
}

const swatch = (value: ReactNode) => (typeof value === 'string'
  ? <span data-slot="change-detail-swatch" aria-hidden="true" className={changeDetailSwatchVariants()} style={{ '--swatch': value } as CSSProperties} />
  : value);

const text = (node: ReactNode) => (typeof node === 'string' || typeof node === 'number' ? String(node) : null);

export function ChangeDetailItem({ kind = 'mod', path, from, to, fromSwatch, toSwatch, className, ...props }: ChangeDetailItemProps) {
  const { tone, variant, size } = useContext(ChangeDetailContext);
  const p = text(path), f = text(from), t = text(to);
  const label = p == null ? undefined : `${KIND_WORD[kind]} ${p.replace(/\s*›\s*/g, ' ')}${f != null ? `, from ${f}` : ''}${t != null ? `${f != null ? ' to' : ', to'} ${t}` : ''}`;
  return (
    <li data-slot="change-detail-item" data-kind={kind} aria-label={label} className={cn(changeDetailItemVariants({ tone, size }), className)} {...props}>
      <span data-slot="change-detail-kind" data-kind={kind} aria-hidden="true" className={cn(changeDetailKindVariants({ kind, variant, size }))}>{KIND_TEXT[kind]}</span>
      <span data-slot="change-detail-path" className={cn(changeDetailPathVariants({ size }))}>{path}</span>
      <span data-slot="change-detail-values" className={cn(changeDetailValuesVariants({ size }))}>
        {from != null && <del data-slot="change-detail-from" className={changeDetailFromVariants()}>{swatch(fromSwatch)}{from}</del>}
        {from != null && to != null && <span data-slot="change-detail-arrow" aria-hidden="true" className={cn(changeDetailArrowVariants({ tone }))}><ArrowRight /></span>}
        {to != null && <ins data-slot="change-detail-to" className={changeDetailToVariants()}>{swatch(toSwatch)}{to}</ins>}
      </span>
    </li>
  );
}
