import { defineFixture } from '../../lib/fixture.ts';
import { Thinking } from '../thinking/thinking.tsx';
import { Message, MessageCode } from './message.tsx';

export default defineFixture({
  id: 'message',
  render: props => {
    if (props.author === 'user') {
      return <div className="w-100 grid"><Message {...props}>Generate a dark variant of Lagoon. Keep the accent recognizable.</Message></div>;
    }
    return (
      <div className="w-100 grid">
        <Message meta="Caustic · 3 tool calls · 12s" onCopy={() => {}} onRetry={() => {}} {...props}>
          <p>I derived 14 tokens for dark. The accent moves from <MessageCode>lagoon/600</MessageCode> to <MessageCode>lagoon/400</MessageCode>.</p>
          <p>Buttons stay recognizable and pass AA on every surface.</p>
        </Message>
      </div>
    );
  },
  examples: {
    'messages-and-thinking': () => (
      <div className="grid gap-3">
        <Message author="user">Generate a dark variant of Lagoon. Keep the accent recognizable.</Message>
        <Thinking defaultOpen>Dark surfaces need a lighter accent step to hold contrast. Moving accent/solid from 600 to 400 keeps the hue and passes on surface.</Thinking>
        <Message meta="Caustic · 3 tool calls · 12s" onCopy={() => {}} onRetry={() => {}}>
          <p>I derived 14 tokens for dark. The accent moves from <MessageCode>lagoon/600</MessageCode> to <MessageCode>lagoon/400</MessageCode>, so buttons stay recognizable and pass AA on every surface.</p>
        </Message>
      </div>
    ),
  },
});
