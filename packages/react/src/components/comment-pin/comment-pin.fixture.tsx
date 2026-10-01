import type { CSSProperties } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { CommentBubble } from '../comment-bubble/comment-bubble.tsx';
import { FrameLabel } from '../frame-label/frame-label.tsx';
import { CommentPin, type CommentPinProps } from './comment-pin.tsx';

// The specimen places pins by percent of the frame width; the host converts to px. The sheet colors are scaffolding.
const at = (v: Record<string, string>) => v as CSSProperties;
const sheet = at({ '--c': 'oklch(.99 .004 70)', '--hair': '0 0 0 1px oklch(0 0 0 / .06)' });

export default defineFixture({
  id: 'comment-pin',
  // The canvas host positions the pin; the frame stands in for it.
  render: props => <CommentPin label="Comment by Mina Kim" {...(props as Partial<CommentPinProps>)} />,
  examples: {
    'comments-and-frame-labels': () => (
      <div className="relative block h-37.5 overflow-hidden rounded-xl bg-bg-canvas">
        <FrameLabel kind="frame" name="Checkout / iOS" size="390 × 844" rect={{ left: 16, top: 12 }} />
        <div className="absolute top-8 right-4 bottom-4 left-4 rounded-sm bg-(--c) shadow-(--hair)" style={sheet} />
        <CommentPin label="Comment by Mina Kim" initials="MK" className="absolute top-(--rect-t) left-(--rect-l)" style={at({ '--rect-l': '60%', '--rect-t': '46px' })} />
        <CommentPin label="Comment by Caustic" author="agent" className="absolute top-(--rect-t) left-(--rect-l)" style={at({ '--rect-l': '28%', '--rect-t': '80px' })} />
        <CommentBubble author="Mina" className="absolute top-(--rect-t) left-(--rect-l)" style={at({ '--rect-l': 'calc(60% + 34px)', '--rect-t': '44px' })}>Total should be bold, not the label.</CommentBubble>
      </div>
    ),
  },
});
