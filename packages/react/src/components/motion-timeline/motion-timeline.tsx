'use client';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn.ts';
import { useControllableState } from '../../hooks/use-controllable-state.ts';
import { Button } from '../button/button.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { SegmentedControl, SegmentedControlItem } from '../segmented-control/segmented-control.tsx';
import {
  motionTimelineBarVariants, motionTimelineBodyVariants, motionTimelineKeyframeVariants, motionTimelineLaneLabelVariants, motionTimelineLaneVariants,
  motionTimelinePlayerVariants, motionTimelinePlayheadVariants, motionTimelineRulerLabelVariants, motionTimelineRulerVariants,
  motionTimelineTimeVariants, motionTimelineTrackVariants, motionTimelineVariants,
} from './motion-timeline.variants.ts';

export interface TimelineLane {
  id: string;
  icon: ReactNode;
  label: ReactNode;
  /** Plain text passed to labels.keyframe when label is not a string. */
  name?: string | undefined;
  /** Bar start, percent of the duration. */
  start: number;
  /** Bar end, percent of the duration. */
  end: number;
  /** Keyframe positions, percent of the duration. */
  keyframes: number[];
}
export interface KeyframeRef { lane: number; index: number }
export interface KeyframeMove extends KeyframeRef { position: number }
export type MotionMode = 'easing' | 'spring';
export type MotionTimelineField = 'play' | 'time' | 'keyframes' | 'mode' | 'apply';
export type MotionTimelineFieldFlags = Partial<Record<MotionTimelineField, boolean>>;
export interface MotionTimelineLabels {
  play: string;
  pause: string;
  time: (milliseconds: number, total: number) => string;
  ruler: (milliseconds: number) => string;
  /** index is the 0-based position of the keyframe in its lane. */
  keyframe: (laneName: string, index: number, milliseconds: number) => string;
  modeGroup: string;
  mode: Record<MotionMode, string>;
  apply: string;
}

export interface MotionTimelineProps extends Omit<ComponentProps<'div'>, 'children' | 'onChange'> {
  lanes: TimelineLane[];
  /** Total duration in ms. */
  duration?: number | undefined;
  /** Playhead position 0-1 (controlled). */
  time?: number | undefined;
  defaultTime?: number | undefined;
  playing?: boolean | undefined;
  selectedKeyframe?: KeyframeRef | null | undefined;
  mode?: MotionMode | undefined;
  /** true disables the player; a record disables the named parts (keyframes covers selection and keyboard moves). */
  disabled?: boolean | MotionTimelineFieldFlags | undefined;
  /** Parts being written or held by another window. */
  reserved?: MotionTimelineFieldFlags | undefined;
  /** Playback loops at the end (default). false stops at the end: time stays at 1 and onPlayingChange(false) is raised. */
  loop?: boolean | undefined;
  /** The component advances time itself while playing (default). false: the owner drives the playhead. */
  autoAdvance?: boolean | undefined;
  /** live (default): unchanged. release: a keyframe drag previews and raises onKeyframeMove once on release. */
  commitMode?: 'live' | 'release' | undefined;
  /** Every text and accessible name; no English default. */
  labels: MotionTimelineLabels;
  onPlayingChange?: ((playing: boolean) => void) | undefined;
  onTimeChange?: ((time: number) => void) | undefined;
  onKeyframeSelect?: ((keyframe: KeyframeRef) => void) | undefined;
  /** A keyframe moved by arrow key or drag; position is the new whole lane percentage. */
  onKeyframeMove?: ((move: KeyframeMove) => void) | undefined;
  /** release mode: a keyframe drag is in progress with the value being previewed; null when it ends or is cancelled. */
  onPreviewChange?: ((move: KeyframeMove | null) => void) | undefined;
  onModeChange?: ((mode: MotionMode) => void) | undefined;
  onApply?: (() => void) | undefined;
}

const RULER_MARKS = [0, 25, 50, 75, 99];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const clampPct = (v: number) => Math.min(100, Math.max(0, Math.round(v)));
const vars = (o: Record<string, string | number>) => o as CSSProperties;
const flagged = (flags: boolean | MotionTimelineFieldFlags | undefined, field: MotionTimelineField) => flags === true || (typeof flags === 'object' && flags[field] === true);
/** Attributes of a control whose part is being written elsewhere. */
const busy = { 'aria-busy': true, 'aria-readonly': true, 'data-reserved': true } as const;

/** A keyframe timeline: ruler, lanes with bars and keyframes, a playhead and a player bar. */
export function MotionTimeline({
  lanes, duration = 800, time, defaultTime = 0.32, playing, selectedKeyframe, mode, disabled = false, reserved, loop = true, autoAdvance = true, commitMode = 'live', labels,
  onPlayingChange, onTimeChange, onKeyframeSelect, onKeyframeMove, onPreviewChange, onModeChange, onApply, className, ...props
}: MotionTimelineProps) {
  const [t, setT] = useControllableState<number>({ value: time, defaultValue: defaultTime, onChange: onTimeChange });
  const [isPlaying, setPlaying] = useControllableState<boolean>({ value: playing, defaultValue: false, onChange: onPlayingChange });
  const [selected, setSelected] = useControllableState<KeyframeRef | null>({ value: selectedKeyframe, defaultValue: null, onChange: v => { if (v) onKeyframeSelect?.(v); } });
  const [motion, setMotion] = useControllableState<MotionMode>({ value: mode, defaultValue: 'easing', onChange: onModeChange });
  const release = commitMode === 'release';
  const rulerRef = useRef<HTMLDivElement>(null);
  const scrubbing = useRef(false);
  const tRef = useRef(t); tRef.current = t;
  const setTRef = useRef(setT); setTRef.current = setT;
  const setPlayingRef = useRef(setPlaying); setPlayingRef.current = setPlaying;
  const timeInert = flagged(disabled, 'time') || flagged(reserved, 'time');
  const keysInert = flagged(disabled, 'keyframes') || flagged(reserved, 'keyframes');
  const keysReserved = flagged(reserved, 'keyframes');
  const [preview, setPreview] = useState<KeyframeMove | null>(null);
  const dragging = useRef<{ lane: number; index: number; from: number; moved: boolean; last: number } | null>(null);

  // Playback advances by real elapsed time; under reduced motion the playhead steps (~8 per second). The owner may drive the playhead instead.
  useEffect(() => {
    if (!isPlaying || !autoAdvance || timeInert) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0; let last = performance.now(); let acc = 0;
    const tick = (now: number) => {
      acc += now - last; last = now;
      if (!reduced || acc >= 125) {
        const next = tRef.current + acc / duration;
        acc = 0;
        if (next >= 1 && !loop) { setTRef.current(1); setPlayingRef.current(false); return; }
        setTRef.current(next >= 1 ? next - 1 : next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, duration, autoAdvance, loop, timeInert]);

  const scrubTo = (clientX: number) => {
    const r = rulerRef.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    setT(clamp01((clientX - r.left) / r.width));
  };
  const scrub = {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (timeInert || (e.target as HTMLElement).closest('[data-slot="motion-timeline-keyframe"]')) return;
      scrubbing.current = true; e.currentTarget.setPointerCapture(e.pointerId); scrubTo(e.clientX);
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => { if (scrubbing.current) scrubTo(e.clientX); },
    onPointerUp: () => { scrubbing.current = false; },
    onPointerCancel: () => { scrubbing.current = false; },
  };

  const cancelDrag = () => {
    const d = dragging.current; dragging.current = null;
    if (d?.moved && release) { setPreview(null); onPreviewChange?.(null); }
  };
  const keyframePointer = (lane: number, index: number, from: number) => ({
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (keysInert) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      dragging.current = { lane, index, from, moved: false, last: from };
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      const d = dragging.current; const track = e.currentTarget.parentElement;
      if (!d || !track) return;
      const r = track.getBoundingClientRect();
      if (r.width === 0) return;
      const position = clampPct(((e.clientX - r.left) / r.width) * 100);
      if (position === d.last) return;
      d.last = position; d.moved = true;
      const move = { lane, index, position };
      if (release) { setPreview(move); onPreviewChange?.(move); } else onKeyframeMove?.(move);
    },
    onPointerUp: (e: PointerEvent<HTMLElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
      const d = dragging.current; dragging.current = null;
      if (!d?.moved || !release) return;
      setPreview(null);
      if (d.last !== d.from) onKeyframeMove?.({ lane, index, position: d.last });
      onPreviewChange?.(null);
    },
    onPointerCancel: () => cancelDrag(),
  });
  const keyframeKeys = (e: KeyboardEvent<HTMLElement>, ref: KeyframeRef, pos: number) => {
    if (keysInert) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(ref); }
    else if (e.key === 'Escape') { if (dragging.current) { e.preventDefault(); cancelDrag(); } }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const position = clampPct(pos + (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 10 : 1));
      if (position !== pos) onKeyframeMove?.({ ...ref, position });
    }
  };

  const ms = Math.round(t * duration);
  const at = (pct: number) => Math.round((pct / 100) * duration);
  const playReserved = flagged(reserved, 'play');
  const modeReserved = flagged(reserved, 'mode');
  const applyReserved = flagged(reserved, 'apply');

  return (
    <div data-slot="motion-timeline" className={cn(motionTimelineVariants(), className)} {...props}>
      <div data-slot="motion-timeline-body" className={motionTimelineBodyVariants()} style={vars({ '--t': t })}>
        <div data-slot="motion-timeline-ruler" ref={rulerRef} aria-hidden className={motionTimelineRulerVariants()} {...scrub}>
          {RULER_MARKS.map(pos => (
            <span key={pos} data-slot="motion-timeline-ruler-label" className={motionTimelineRulerLabelVariants()} style={vars({ '--x': `${pos}%` })}>
              {labels.ruler(at(pos))}
            </span>
          ))}
        </div>
        {lanes.map((lane, li) => (
          <div key={lane.id} data-slot="motion-timeline-lane" className={motionTimelineLaneVariants()}>
            <span data-slot="motion-timeline-lane-label" className={motionTimelineLaneLabelVariants()}>{lane.icon}<span className="truncate">{lane.label}</span></span>
            <span data-slot="motion-timeline-track" className={motionTimelineTrackVariants()} {...scrub}>
              <span data-slot="motion-timeline-bar" aria-hidden className={motionTimelineBarVariants()} style={vars({ '--l': `${lane.start}%`, '--w': `${lane.end - lane.start}%` })} />
              {lane.keyframes.map((stored, ki) => {
                const isSel = selected?.lane === li && selected.index === ki;
                const pos = preview?.lane === li && preview.index === ki ? preview.position : stored;
                return (
                  <span
                    key={ki} data-slot="motion-timeline-keyframe" role="button" tabIndex={0} aria-pressed={isSel}
                    aria-label={labels.keyframe(lane.name ?? (typeof lane.label === 'string' ? lane.label : ''), ki, at(pos))}
                    aria-disabled={flagged(disabled, 'keyframes') || undefined}
                    className={motionTimelineKeyframeVariants()} style={vars({ '--l': `${pos}%` })}
                    onClick={() => { if (!keysInert) setSelected({ lane: li, index: ki }); }}
                    onKeyDown={e => keyframeKeys(e, { lane: li, index: ki }, stored)}
                    {...keyframePointer(li, ki, stored)}
                    {...(keysReserved ? busy : {})}
                  />
                );
              })}
            </span>
          </div>
        ))}
        <div data-slot="motion-timeline-playhead" aria-hidden className={motionTimelinePlayheadVariants()} />
      </div>
      <div data-slot="motion-timeline-player" className={motionTimelinePlayerVariants()}>
        <IconButton
          data-slot="motion-timeline-play" size="sm" label={isPlaying ? labels.pause : labels.play} disabled={flagged(disabled, 'play')}
          onClick={() => { if (!playReserved) setPlaying(!isPlaying); }} {...(playReserved ? busy : {})}
        >
          {isPlaying ? <Pause /> : <Play />}
        </IconButton>
        <span
          data-slot="motion-timeline-time" aria-live={isPlaying ? 'off' : 'polite'} className={motionTimelineTimeVariants()}
          {...(flagged(reserved, 'time') ? { 'aria-busy': true as const, 'data-reserved': true as const } : {})}
        >
          {labels.time(ms, duration)}
        </span>
        <span className="flex-1" />
        <SegmentedControl
          data-slot="motion-timeline-mode" size="xs" aria-label={labels.modeGroup} value={motion} disabled={flagged(disabled, 'mode')}
          onValueChange={v => { if (!modeReserved) setMotion(v as MotionMode); }} {...(modeReserved ? busy : {})}
        >
          <SegmentedControlItem value="easing">{labels.mode.easing}</SegmentedControlItem>
          <SegmentedControlItem value="spring">{labels.mode.spring}</SegmentedControlItem>
        </SegmentedControl>
        <Button
          data-slot="motion-timeline-apply" tone="ink" size="xs" disabled={flagged(disabled, 'apply')}
          onClick={() => { if (!applyReserved) onApply?.(); }} {...(applyReserved ? busy : {})}
        >
          {labels.apply}
        </Button>
      </div>
    </div>
  );
}
