import { Component, Image, Square, Type } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { MotionTimeline, type TimelineLane } from './motion-timeline.tsx';

const lanes: TimelineLane[] = [
  { id: 'card', icon: <Square />, label: 'Card', start: 0, end: 40, keyframes: [0, 40] },
  { id: 'title', icon: <Type />, label: 'Title · opacity', start: 15, end: 50, keyframes: [15, 50] },
  { id: 'button', icon: <Component />, label: 'Button · y', start: 30, end: 85, keyframes: [30, 60, 85] },
  { id: 'photo', icon: <Image />, label: 'Photo · scale', start: 5, end: 95, keyframes: [5, 95] },
];

export default defineFixture({
  id: 'motion-timeline',
  render: props => <MotionTimeline lanes={lanes} defaultTime={0.32} {...props} />,
  examples: {
    timeline: () => <MotionTimeline lanes={lanes} defaultTime={0.32} selectedKeyframe={{ lane: 0, index: 1 }} />,
  },
});
