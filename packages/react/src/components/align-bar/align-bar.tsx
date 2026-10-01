'use client';
import { createContext, useContext, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { IconButton, type IconButtonProps } from '../icon-button/icon-button.tsx';
import { alignBarVariants, type AlignBarVariantProps } from './align-bar.variants.ts';

const DensityCtx = createContext<'regular' | 'tight'>('regular');

export interface AlignBarProps extends ComponentProps<'div'>, AlignBarVariantProps {
  /** AlignBarItem and AlignBarSeparator elements. */
  children: ReactNode;
}

/** Inset track of icon buttons that align the selection. It holds actions, not state. */
export function AlignBar({ density, className, children, ...props }: AlignBarProps) {
  return (
    <DensityCtx.Provider value={density ?? 'regular'}>
      <div data-slot="align-bar" role="group" data-density={density ?? 'regular'} className={cn(alignBarVariants({ density }), className)} {...props}>
        {children}
      </div>
    </DensityCtx.Provider>
  );
}

export type AlignBarItemProps = Omit<IconButtonProps, 'size' | 'tone' | 'shape' | 'pressed' | 'defaultPressed' | 'onPressedChange'>;

/** One alignment action: a 32px IconButton. Needs a label. */
export function AlignBarItem({ className, ...props }: AlignBarItemProps) {
  const density = useContext(DensityCtx);
  return (
    <IconButton
      data-slot="align-bar-item"
      size="md"
      className={cn(density === 'tight' && '[&_[data-slot=icon-button-icon]]:size-icon-sm', className)}
      {...props}
    />
  );
}

export type AlignBarSeparatorProps = ComponentProps<'span'>;

/** Vertical hairline between the horizontal and the vertical group. */
export function AlignBarSeparator({ className, ...props }: AlignBarSeparatorProps) {
  return <span data-slot="align-bar-separator" aria-hidden className={cn('mx-0.5 my-1 h-6 w-px self-center bg-border-default', className)} {...props} />;
}
