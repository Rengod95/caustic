import { defineFixture } from '../../lib/fixture.ts';
import { ModelMenu, ModelMenuConnect, ModelMenuGroup, ModelMenuItem } from './model-menu.tsx';

export default defineFixture({
  id: 'model-menu',
  // Item-level props (selected, disabled) apply to the first model; onConnect to the connect row. Always rendered in place.
  render: ({ selected, disabled, onConnect, initial: _i, name: _n, description: _d, provider: _p, connected: _c, ...menu }) => (
    <ModelMenu {...menu} inline>
      <ModelMenuGroup provider="Anthropic" connected>
        <ModelMenuItem value="claude-opus" initial="A" name="Claude Opus" description="Deep · 1M context" selected={selected as boolean} disabled={disabled as boolean} />
        <ModelMenuItem value="claude-sonnet" initial="A" name="Claude Sonnet" description="Balanced" />
      </ModelMenuGroup>
      <ModelMenuGroup provider="OpenAI" connected={false}>
        <ModelMenuConnect initial="O" onConnect={onConnect as never}>Connect provider…</ModelMenuConnect>
      </ModelMenuGroup>
    </ModelMenu>
  ),
  examples: {
    'model-menu': () => (
      <ModelMenu inline>
        <ModelMenuGroup provider="Anthropic" connected>
          <ModelMenuItem value="claude-opus" initial="A" name="Claude Opus" description="Deep · 1M context" selected />
          <ModelMenuItem value="claude-sonnet" initial="A" name="Claude Sonnet" description="Balanced" />
        </ModelMenuGroup>
        <ModelMenuGroup provider="OpenAI" connected={false}>
          <ModelMenuConnect initial="O">Connect provider…</ModelMenuConnect>
        </ModelMenuGroup>
      </ModelMenu>
    ),
  },
});
