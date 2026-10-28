'use client';
import { isValidElement, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import type { Radius, Shadow, Size, Tone, Variant } from '../../lib/common-props.ts';
import { Button, type ButtonProps } from '../button/index.ts';
import {
  emptyStateActions, emptyStateDescription, emptyStateIcon, emptyStateMedia, emptyStateOrb, emptyStateText, emptyStateTitle, emptyStateVariants,
} from './empty-state.variants.ts';

/** One structured action: a Button with a label and an optional leading icon. Unset tone / variant follow its position. */
export interface EmptyStateAction extends Omit<ButtonProps, 'children' | 'iconStart'> {
  label: ReactNode;
  icon?: ReactNode;
}

/** One, two or three actions. */
export type EmptyStateActions = [EmptyStateAction] | [EmptyStateAction, EmptyStateAction] | [EmptyStateAction, EmptyStateAction, EmptyStateAction];

/** What sits above the title: the icon tile, the agent orb, or any node (drawn in the media row). */
export type EmptyStateMark = 'icon' | 'orb';
export type EmptyStateSurface = 'dashed' | 'grid' | 'none';

export interface EmptyStateProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** Padding, tile, gaps and title step: xs inline, sm an empty list result, md (default) an empty page or panel, lg a hero. */
  size?: Size | undefined;
  /** Colour family of the icon tile. */
  tone?: Tone | undefined;
  /**
   * Preset or tile emphasis. dashed (default) = today: icon tile, interface title, dashed outline. agent = the orb,
   * the serif voice and the canvas dot grid (a blank canvas). solid / soft / outline / ghost = the dashed preset with
   * that tile emphasis (soft is the same as dashed). An explicit mark, voice or surface wins over the preset.
   */
  variant?: Variant | 'dashed' | 'agent' | undefined;
  /** Corner radius of the region; unset = 2xl (xl on the grid surface). */
  radius?: Radius | undefined;
  /** Elevation of the region; unset = none. */
  shadow?: Shadow | undefined;
  /** What sits above the title: 'icon' (the tile with `icon`), 'orb' (the agent orb), any element (drawn in the media row) or null (nothing). Unset follows the preset. */
  mark?: EmptyStateMark | Exclude<ReactNode, string>;
  /** The agent voice: serif title, tertiary one-line description, and the agent Button first among action objects. Unset follows the preset. */
  voice?: boolean | undefined;
  /** Background of the region: dashed outline, the canvas dot grid, or none. Unset follows the preset. */
  surface?: EmptyStateSurface | undefined;
  /** Glyph inside the tile. */
  icon?: ReactNode;
  /** Replaces the tile or orb: icons or images (one or several, a fragment) drawn bare in a centered row. Decorative images take alt="". */
  media?: ReactNode;
  /** Short statement of what is missing (or, in the agent voice, the prompt). */
  title: ReactNode;
  /** One or two sentences: the reason and what to do. */
  description?: ReactNode;
  /**
   * One to three actions. Button elements as before, or 1–3 action objects: the first is the primary Button (ink, or
   * agent under the voice), the second secondary (neutral outline), the third quiet (neutral ghost), at the size's
   * button step. An object's own tone / variant / size win.
   */
  actions?: ReactNode | EmptyStateActions;
}

/** The presets: what mark, voice and surface each one sets (owner 2026-10-28). */
const emptyStatePresets = {
  dashed: { mark: 'icon', voice: false, surface: 'dashed' },
  agent: { mark: 'orb', voice: true, surface: 'grid' },
} as const;

/** Emphasis ladders for action objects: primary, secondary, quiet (at most one primary action). */
const LADDER: Pick<ButtonProps, 'tone' | 'variant'>[] = [{ tone: 'neutral', variant: 'solid' }, { tone: 'neutral', variant: 'outline' }, { tone: 'neutral', variant: 'ghost' }];
const AGENT_LADDER: Pick<ButtonProps, 'tone' | 'variant'>[] = [{ tone: 'agent' }, { tone: 'neutral', variant: 'outline' }, { tone: 'neutral', variant: 'ghost' }];
const BUTTON_SIZE: Record<Size, Size> = { xs: 'xs', sm: 'xs', md: 'sm', lg: 'md' };

const isActionList = (a: EmptyStateProps['actions']): a is EmptyStateActions =>
  Array.isArray(a) && a.length > 0 && a.every(x => x != null && typeof x === 'object' && !isValidElement(x) && 'label' in x);

const shown = (n: ReactNode) => n != null && n !== false;

/** Fills a region that has no content yet, or no results: a mark (icon tile, orb or media), title, reason and one to three next actions. */
export function EmptyState({
  size, tone, variant, radius, shadow, mark, voice, surface, icon, media, title, description, actions, className, ...props
}: EmptyStateProps) {
  const preset = emptyStatePresets[variant === 'agent' ? 'agent' : 'dashed'];
  const m = mark === undefined ? preset.mark : mark;
  const v = voice ?? preset.voice;
  const s = surface ?? preset.surface;
  const list = isActionList(actions) ? actions.slice(0, 3) : undefined;
  const ladder = v ? AGENT_LADDER : LADDER;
  const markNode = shown(media)
    ? <div data-slot="empty-state-media" className={emptyStateMedia({ size })}>{media}</div>
    : m === 'orb'
      ? <span data-slot="empty-state-orb" aria-hidden="true" className={emptyStateOrb({ mark: m as EmptyStateMark })} />
      : m === 'icon'
        ? (icon != null ? <span data-slot="empty-state-icon" aria-hidden="true" className={cn(emptyStateIcon({ size, tone, variant }))}>{icon}</span> : null)
        : shown(m as ReactNode)
          ? <div data-slot="empty-state-media" className={emptyStateMedia({ size })}>{m as ReactNode}</div>
          : null;
  return (
    <div
      data-slot="empty-state" data-size={size ?? 'md'} data-variant={variant ?? 'dashed'} data-surface={s} data-voice={v ? '' : undefined}
      className={cn(emptyStateVariants({ size, surface: s, radius: radius ?? (s === 'grid' ? 'xl' : '2xl'), shadow }), className)} {...props}
    >
      {markNode}
      <div data-slot="empty-state-text" className={emptyStateText({ size })}>
        <b data-slot="empty-state-title" className={emptyStateTitle({ size, voice: v })}>{title}</b>
        {description != null && <p data-slot="empty-state-description" className={emptyStateDescription({ voice: v })}>{description}</p>}
      </div>
      {actions != null && (
        <div data-slot="empty-state-actions" data-count={list?.length} className={emptyStateActions()}>
          {list
            ? list.map(({ label, icon: glyph, ...a }, i) => <Button key={i} size={BUTTON_SIZE[size ?? 'md']} {...ladder[i]} {...a} iconStart={glyph}>{label}</Button>)
            : (actions as ReactNode)}
        </div>
      )}
    </div>
  );
}
