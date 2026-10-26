'use client';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/cn.ts';
import { avatarCore, avatarVariants, type AvatarVariantProps } from './avatar.variants.ts';

export interface AvatarProps extends Omit<ComponentProps<'span'>, 'children' | 'color'>, AvatarVariantProps {
  /** Person name; initials are derived from it and it becomes the accessible label. */
  name: string;
  /** Show a presence dot. */
  presence?: boolean;
}

const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join('');

/** A person (identity color + initials) or the agent (spectrum core). */
export function Avatar({ name, kind, color, size, presence = false, className, ...props }: AvatarProps) {
  const agent = kind === 'agent';
  return (
    <span role="img" aria-label={name} data-slot="avatar" data-kind={kind ?? 'person'} className={cn(avatarVariants({ kind, color, size }), className)} {...props}>
      {agent ? <span aria-hidden className={avatarCore({ kind })} /> : initials(name)}
      {presence && <span data-slot="avatar-presence" aria-hidden className="absolute -bottom-px -right-px size-presence rounded-full bg-success-solid shadow-[0_0_0_2px_var(--cs-focus-offset,var(--cs-color-focus-offset))]" />}
    </span>
  );
}
