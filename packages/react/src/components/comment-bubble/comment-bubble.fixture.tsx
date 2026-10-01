import { defineFixture } from '../../lib/fixture.ts';
import { CommentBubble, type CommentBubbleProps } from './comment-bubble.tsx';

export default defineFixture({
  id: 'comment-bubble',
  render: props => <CommentBubble author="Mina" {...(props as Partial<CommentBubbleProps>)}>Total should be bold, not the label.</CommentBubble>,
  examples: {},
});
