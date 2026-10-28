import type { CSSProperties } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { FrameLabel } from '../frame-label/frame-label.tsx';
import { CanvasComment, type CanvasCommentProps } from './canvas-comment.tsx';

// The specimen places pins by percent of the frame width; the host converts to px. The sheet stands in for an artboard.
const at = (v: Record<string, string>) => v as CSSProperties;

export default defineFixture({
  id: 'canvas-comment',
  // The canvas host positions the comment; the frame stands in for it.
  render: props => (
    <CanvasComment label="Comment by Mina Kim" authorName="Mina" body="Total should be bold, not the label." {...(props as Partial<CanvasCommentProps>)} />
  ),
  examples: {
    // The open human comment draws its bubble 6px right of the pin and 2px above it: the old CommentBubble at
    // left calc(60% + 34px), top 44 beside the pin at 60%, 46.
    'comments-and-frame-labels': () => (
      <div className="relative block h-37.5 overflow-hidden rounded-xl bg-bg-canvas">
        <FrameLabel kind="frame" name="Checkout / iOS" size="390 × 844" rect={{ left: 16, top: 12 }} />
        <div className="absolute top-8 right-4 bottom-4 left-4 rounded-sm bg-canvas-artboard shadow-[0_0_0_1px_var(--cs-color-border-subtle)]" />
        <CanvasComment
          label="Comment by Mina Kim" initials="MK" open authorName="Mina" body="Total should be bold, not the label."
          className="absolute top-(--rect-t) left-(--rect-l)" style={at({ '--rect-l': '60%', '--rect-t': '46px' })}
        />
        <CanvasComment label="Comment by Caustic" author="agent" className="absolute top-(--rect-t) left-(--rect-l)" style={at({ '--rect-l': '28%', '--rect-t': '80px' })} />
      </div>
    ),
  },
});
