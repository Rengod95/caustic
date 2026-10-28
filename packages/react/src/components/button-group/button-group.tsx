'use client';
import { Children, createContext, isValidElement, useContext, type ComponentProps, type ReactElement, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { CommonProps, Size } from '../../lib/common-props.ts';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { buttonGroupSeparatorVariants, buttonGroupVariants, type ButtonGroupVariantProps } from './button-group.variants.ts';

const GroupCtx = createContext<{ size: Size }>({ size: 'md' });

/** Common props: variant / tone / radius / shadow style the track; size steps the items and the separator. */
export interface ButtonGroupProps extends ComponentProps<'div'>, ButtonGroupVariantProps, CommonProps {
  /** Names the group (aria-label), e.g. "Align". */
  'aria-label'?: string;
  /** IconButton or Button elements, with ButtonGroupSeparator between runs. */
  children: ReactNode;
}

/**
 * Inset track holding a row of plain actions (IconButtons or Buttons). It keeps no state: each item runs its own
 * action. For a row of toggles use ToggleGroup; for one choice among modes use SegmentedControl.
 */
export function ButtonGroup({ density, tone, variant, radius, shadow, size, className, children, ...props }: ButtonGroupProps) {
  const step = size ?? 'md';
  // Items take the group slot and, unless they set their own, the group size. Wrapped items (a Tooltip around an
  // IconButton) keep their own size and still get the track's hover through the direct-child rule.
  const items = Children.map(children, child => {
    if (!isValidElement(child) || (child.type !== IconButton && child.type !== Button)) return child;
    const el = child as ReactElement<ComponentProps<typeof IconButton>>;
    const Item = el.type as typeof IconButton;
    return <Item {...el.props} data-slot="button-group-item" size={el.props.size ?? step} />;
  });
  return (
    <GroupCtx.Provider value={{ size: step }}>
      <div
        data-slot="button-group"
        role="group"
        data-density={density ?? 'regular'}
        className={cn(buttonGroupVariants({ density, tone, variant, radius, shadow }), className)}
        {...props}
      >
        {items}
      </div>
    </GroupCtx.Provider>
  );
}

export type ButtonGroupSeparatorProps = ComponentProps<'span'>;

/** Vertical hairline between two runs of actions (left / center / right | top / middle / bottom). */
export function ButtonGroupSeparator({ className, ...props }: ButtonGroupSeparatorProps) {
  const { size } = useContext(GroupCtx);
  return <span data-slot="button-group-separator" aria-hidden className={cn(buttonGroupSeparatorVariants({ size }), className)} {...props} />;
}
