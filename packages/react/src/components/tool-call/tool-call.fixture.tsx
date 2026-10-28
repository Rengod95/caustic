import { Blend, Contrast, FileCode, SwatchBook } from 'lucide-react';
import { Fragment } from 'react';
import { defineFixture } from '../../lib/fixture.ts';
import { ToolCall } from './tool-call.tsx';

const progressLabel = (n: string) => `${n} progress`;
const diff: [string, string, string][] = [['accent/solid', 'lagoon/600', 'lagoon/400'], ['surface/base', 'n/0', 'n/900'], ['text/primary', 'n/950', 'n/25']];

export default defineFixture({
  id: 'tool-call',
  render: props => (
    <div className="w-100"><ToolCall name="update_tokens" detail="4 changes" icon={<SwatchBook />} duration="0.4s" activity="Running" failedLabel="Failed" progressLabel={progressLabel} {...props}>Changed 4 tokens in theme/lagoon.</ToolCall></div>
  ),
  examples: {
    states: () => (
      <>
        <ToolCall status="running" name="derive_theme" detail="lagoon → lagoon-dark" icon={<Blend />} activity="Deriving" progress={58} progressLabel={progressLabel} />
        <ToolCall name="audit_contrast" detail="42 pairs · 3 themes" icon={<Contrast />} duration="1.2s" />
        <ToolCall name="update_tokens" detail="4 changes" icon={<SwatchBook />} duration="0.4s">
          <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-x-2 gap-y-1 font-mono text-mono leading-5">
            {diff.map(([k, a, b]) => (
              <Fragment key={k}>
                <span className="truncate text-text-secondary">{k}</span>
                <del className="rounded-xs bg-diff-remove-bg px-1 text-diff-remove-text">{a}</del>
                <span className="text-text-tertiary">→</span>
                <ins className="rounded-xs bg-diff-add-bg px-1 text-diff-add-text no-underline">{b}</ins>
              </Fragment>
            ))}
          </div>
        </ToolCall>
        <ToolCall status="failed" failedLabel="Failed" name="export_code" detail="react · tailwind" icon={<FileCode />}>Button.tsx has unsaved edits from Mina. Save or discard them, then retry.</ToolCall>
      </>
    ),
  },
});
