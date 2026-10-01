'use client';
import { Pause, Play } from 'lucide-react';
import { useEffect, useRef, type ComponentProps, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
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
  /** Bar start, percent of the duration. */
  start: number;
  /** Bar end, percent of the duration. */
  end: number;
  /** Keyframe positions, percent of the duration. */
  keyframes: number[];
}
export interface KeyframeRef { lane: number; index: number }
export type MotionMode = 'easing' | 'spring';

export interface MotionTimelineProps extends Omit<ComponentProps<'div'>, 'children' | 'onChange'> {
  lanes: TimelineLane[];
  /** Total duration in ms. */
  duration?: number;
  /** Playhead position 0-1 (controlled). */
  time?: number;
  defaultTime?: number;
  playing?: boolean;
  selectedKeyframe?: KeyframeRef | null;
  mode?: MotionMode;
  disabled?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  onTimeChange?: (time: number) => void;
  onKeyframeSelect?: (keyframe: KeyframeRef) => void;
  onModeChange?: (mode: MotionMode) => void;
  onApply?: () => void;
}

const RULER_MARKS = [0, 25, 50, 75, 99];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const vars = (o: Record<string, string | number>) => o as CSSProperties;

/** A keyframe timeline: ruler, lanes with bars and keyframes, a playhead and a player bar. */
export function MotionTimeline({
  lanes, duration = 800, time, defaultTime = 0.32, playing, selectedKeyframe, mode, disabled = false,
  onPlayingChange, onTimeChange, onKeyframeSelect, onModeChange, onApply, className, ...props
}: MotionTimelineProps) {
  const [t, setT] = useControllableState<number>({ value: time, defaultValue: defaultTime, onChange: onTimeChange });
  const [isPlaying, setPlaying] = useControllableState<boolean>({ value: playing, defaultValue: false, onChange: onPlayingChange });
  const [selected, setSelected] = useControllableState<KeyframeRef | null>({ value: selectedKeyframe, defaultValue: null, onChange: v => { if (v) onKeyframeSelect?.(v); } });
  const [motion, setMotion] = useControllableState<MotionMode>({ value: mode, defaultValue: 'easing', onChange: onModeChange });
  const rulerRef = useRef<HTMLDivElement>(null);
  const scrubbing = useRef(false);
  const tRef = useRef(t); tRef.current = t;
  const setTRef = useRef(setT); setTRef.current = setT;

  // Playback advances by real elapsed time and loops; under reduced motion the playhead steps (~8 per second).
  useEffect(() => {
    if (!isPlaying) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0; let last = performance.now(); let acc = 0;
    const tick = (now: number) => {
      acc += now - last; last = now;
      if (!reduced || acc >= 125) {
        const next = tRef.current + acc / duration;
        acc = 0;
        setTRef.current(next >= 1 ? next - 1 : next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, duration]);

  const scrubTo = (clientX: number) => {
    const r = rulerRef.current?.getBoundingClientRect();
    if (!r || r.width === 0) return;
    setT(clamp01((clientX - r.left) / r.width));
  };
  const scrub = {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (disabled || (e.target as HTMLElement).closest('[data-slot="motion-timeline-keyframe"]')) return;
      scrubbing.current = true; e.currentTarget.setPointerCapture(e.pointerId); scrubTo(e.clientX);
    },
    onPointerMove: (e: PointerEvent<HTMLElement>) => { if (scrubbing.current) scrubTo(e.clientX); },
    onPointerUp: () => { scrubbing.current = false; },
    onPointerCancel: () => { scrubbing.current = false; },
  };
  const keyframeKeys = (e: KeyboardEvent<HTMLElement>, ref: KeyframeRef) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(ref); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); if (!disabled) setT(clamp01(t + (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 0.1 : 0.01))); }
  };

  const ms = Math.round(t * duration);
  const seconds = (pct: number) => ((pct / 100) * duration) / 1000;
  const text = (n: ReactNode) => (typeof n === 'string' || typeof n === 'number' ? String(n) : 'Layer');

  return (
    <div data-slot="motion-timeline" className={cn(motionTimelineVariants(), className)} {...props}>
      <div data-slot="motion-timeline-body" className={motionTimelineBodyVariants()} style={vars({ '--t': t })}>
        <div data-slot="motion-timeline-ruler" ref={rulerRef} aria-hidden className={motionTimelineRulerVariants()} {...scrub}>
          {RULER_MARKS.map(pos => (
            <span key={pos} data-slot="motion-timeline-ruler-label" className={motionTimelineRulerLabelVariants()} style={vars({ '--x': `${pos}%` })}>
              {pos === 0 ? '0s' : seconds(pos).toFixed(1)}
            </span>
          ))}
        </div>
        {lanes.map((lane, li) => (
          <div key={lane.id} data-slot="motion-timeline-lane" className={motionTimelineLaneVariants()}>
            <span data-slot="motion-timeline-lane-label" className={motionTimelineLaneLabelVariants()}>{lane.icon}<span className="truncate">{lane.label}</span></span>
            <span data-slot="motion-timeline-track" className={motionTimelineTrackVariants()} {...scrub}>
              <span data-slot="motion-timeline-bar" aria-hidden className={motionTimelineBarVariants()} style={vars({ '--l': `${lane.start}%`, '--w': `${lane.end - lane.start}%` })} />
              {lane.keyframes.map((pos, ki) => {
                const isSel = selected?.lane === li && selected.index === ki;
                return (
                  <span
                    key={ki} data-slot="motion-timeline-keyframe" role="button" tabIndex={0} aria-pressed={isSel}
                    aria-label={`${text(lane.label)} keyframe ${ki + 1} at ${seconds(pos).toFixed(2)} s`}
                    className={motionTimelineKeyframeVariants()} style={vars({ '--l': `${pos}%` })}
                    onClick={() => setSelected({ lane: li, index: ki })}
                    onKeyDown={e => keyframeKeys(e, { lane: li, index: ki })}
                  />
                );
              })}
            </span>
          </div>
        ))}
        <div data-slot="motion-timeline-playhead" aria-hidden className={motionTimelinePlayheadVariants()} />
      </div>
      <div data-slot="motion-timeline-player" className={motionTimelinePlayerVariants()}>
        <IconButton data-slot="motion-timeline-play" size="sm" label={isPlaying ? 'Pause' : 'Play'} disabled={disabled} onClick={() => setPlaying(!isPlaying)}>
          {isPlaying ? <Pause /> : <Play />}
        </IconButton>
        <span data-slot="motion-timeline-time" aria-live={isPlaying ? 'off' : 'polite'} className={motionTimelineTimeVariants()}>{ms} / {duration} ms</span>
        <span className="flex-1" />
        <SegmentedControl data-slot="motion-timeline-mode" size="xs" aria-label="Motion type" value={motion} disabled={disabled} onValueChange={v => setMotion(v as MotionMode)}>
          <SegmentedControlItem value="easing">Easing</SegmentedControlItem>
          <SegmentedControlItem value="spring">Spring</SegmentedControlItem>
        </SegmentedControl>
        <Button data-slot="motion-timeline-apply" tone="ink" size="xs" disabled={disabled} onClick={() => onApply?.()}>Apply</Button>
      </div>
    </div>
  );
}
