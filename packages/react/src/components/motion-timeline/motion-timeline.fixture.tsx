import { Component, Image, Square, Type } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { MotionTimeline, type MotionTimelineLabels, type MotionTimelineProps, type TimelineLane } from './motion-timeline.tsx';

const lanes: TimelineLane[] = [
  { id: 'card', icon: <Square />, label: 'Card', start: 0, end: 40, keyframes: [0, 40] },
  { id: 'title', icon: <Type />, label: 'Title · opacity', start: 15, end: 50, keyframes: [15, 50] },
  { id: 'button', icon: <Component />, label: 'Button · y', start: 30, end: 85, keyframes: [30, 60, 85] },
  { id: 'photo', icon: <Image />, label: 'Photo · scale', start: 5, end: 95, keyframes: [5, 95] },
];

const labels: MotionTimelineLabels = {
  play: 'Play',
  pause: 'Pause',
  time: (milliseconds, total) => `${milliseconds} / ${total} ms`,
  ruler: milliseconds => (milliseconds === 0 ? '0s' : (milliseconds / 1000).toFixed(1)),
  keyframe: (laneName, index, milliseconds) => `${laneName} keyframe ${index + 1} at ${(milliseconds / 1000).toFixed(2)} s`,
  modeGroup: 'Motion type',
  mode: { easing: 'Easing', spring: 'Spring' },
  apply: 'Apply',
};

export default defineFixture({
  id: 'motion-timeline',
  render: props => <MotionTimeline lanes={lanes} defaultTime={0.32} labels={labels} {...(props as Partial<MotionTimelineProps>)} />,
  examples: {
    timeline: () => <MotionTimeline lanes={lanes} defaultTime={0.32} labels={labels} selectedKeyframe={{ lane: 0, index: 1 }} />,
  },
});
