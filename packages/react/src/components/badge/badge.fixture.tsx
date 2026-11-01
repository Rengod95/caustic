import { Check, FileCode, Frame } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { Chip } from '../chip/chip.tsx';
import { Kbd } from '../kbd/kbd.tsx';
import { Badge } from './badge.tsx';

const noop = () => {};

export default defineFixture({
  id: 'badge',
  render: ({ dot, ...props }) => <Badge icon={<Check />} dot={dot as boolean | undefined} {...props}>Passed</Badge>,
  examples: {
    'badges-chips-keys': () => (
      <>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Draft</Badge>
          <Badge tone="accent" dot>Live</Badge>
          <Badge tone="success" icon={<Check />}>Passed</Badge>
          <Badge tone="warning">3 warnings</Badge>
          <Badge tone="danger">Failed</Badge>
          <Badge tone="info">In review</Badge>
          <Badge tone="solid">v2.4</Badge>
          <Badge tone="outline" shape="square">Instance</Badge>
          <Badge tone="agent">Agent edit</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Chip shape="rounded" icon={<Frame />} onRemove={noop}>Pricing / Desktop</Chip>
          <Chip shape="rounded" icon={<FileCode />} onRemove={noop}>Button.tsx</Chip>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Kbd>⌘</Kbd><Kbd>⇧</Kbd><Kbd>P</Kbd>
          <span className="text-footnote text-text-tertiary">Command palette</span>
        </div>
      </>
    ),
    // From TokenChip (mono): a long path truncates from the front (the end ".solid" stays) and a white swatch keeps its
    // border.default ring.
    'token-chip-long-path': () => (
      <div className="flex flex-col items-start gap-2">
        <Badge mono size="md" swatch="oklch(0.62 0.16 250)">color.semantic.accent.interactive.solid</Badge>
        <Badge mono size="md" swatch="oklch(1 0 0)">color.surface.paper</Badge>
        <Badge mono swatch="oklch(0.98 0.01 90)">color.semantic.surface.paper.raised</Badge>
      </div>
    ),
    // From ContrastChip (lead): pass, large-text-only and fail at md, then the solid, outline and ghost emphasis.
    'contrast-chip-results': () => (
      <div className="flex flex-col items-start gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge size="md" tone="success" lead="AA">5.1 : 1</Badge>
          <Badge size="md" tone="warning" lead="AA">3.4 : 1 · large text</Badge>
          <Badge size="md" tone="danger" lead="AA">2.9 : 1 · fails</Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge size="md" tone="success" variant="solid" lead="AAA">7.2 : 1</Badge>
          <Badge size="md" tone="success" variant="outline" lead="AA">5.1 : 1</Badge>
          <Badge size="md" tone="danger" variant="ghost" lead="UI">2.1 : 1 · fails</Badge>
        </div>
      </div>
    ),
  },
});
