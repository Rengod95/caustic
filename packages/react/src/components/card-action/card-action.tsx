'use client';
import { ArrowUpRight } from 'lucide-react';
import type { ComponentProps, MouseEvent } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { cardVariants } from '../card/index.ts';
import { cardActionArrowVariants, cardActionIndicatorVariants, cardActionVariants } from './card-action.variants.ts';

export interface CardActionProps extends Omit<ComponentProps<'a'>, 'onChange'> {
  /** link = the whole card navigates; radio = the whole card is one choice. */
  kind?: 'link' | 'radio';
  href?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'regular' | 'compact';
}

/** A card that is one target: a link (use CardActionArrow) or one choice (use CardActionIndicator inside a role="radiogroup"). Nothing interactive goes inside. */
export function CardAction({ kind = 'link', href, checked, defaultChecked = false, onCheckedChange, size, className, onClick, ...props }: CardActionProps) {
  const [on, setOn] = useControllableState({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange });
  const cls = cn(cardVariants({ size }), cardActionVariants({ kind }), className);
  if (kind === 'radio') {
    return (
      <button
        type="button" role="radio" data-slot="card-action" data-kind="radio" data-size={size ?? 'regular'} data-state={on ? 'checked' : 'unchecked'}
        aria-checked={on} className={cls}
        onClick={e => { (onClick as unknown as ((e: MouseEvent<HTMLButtonElement>) => void) | undefined)?.(e); if (!e.defaultPrevented) setOn(true); }}
        {...(props as ComponentProps<'button'>)}
      />
    );
  }
  return <a data-slot="card-action" data-kind="link" data-size={size ?? 'regular'} href={href} className={cls} onClick={onClick} {...props} />;
}

/** Link kind: arrow-up-right at the trailing end of the header; nudges on hover. */
export function CardActionArrow({ className, ...props }: ComponentProps<'span'>) {
  return <span aria-hidden data-slot="card-action-arrow" className={cn(cardActionArrowVariants(), className)} {...props}><ArrowUpRight /></span>;
}

/** Radio kind: decorative radio mark at the trailing end of the header. */
export function CardActionIndicator({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span aria-hidden data-slot="card-action-indicator" className={cn(cardActionIndicatorVariants(), className)} {...props}>
      <span className="size-radio-dot rounded-full bg-accent-on opacity-0 group-data-[state=checked]/card:opacity-100" />
    </span>
  );
}
