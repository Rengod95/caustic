import { defineFixture } from '../../lib/fixture.ts';
import { ResizeHandle, type ResizeHandleProps } from './resize-handle.tsx';

type Props = Partial<Omit<ResizeHandleProps, 'formatValueText'>> & { formatValueText?: string | ResizeHandleProps['formatValueText'] };

/** Scenario props are JSON, so a function prop arrives as source text. */
const toFormatter = (f: Props['formatValueText']): ResizeHandleProps['formatValueText'] =>
  typeof f === 'string' ? (new Function(`return (${f})`)() as (v: number) => string) : f;

const frames = {
  vertical: { block: 'absolute inset-y-0 left-0 w-40 bg-surface-base', handle: 'absolute inset-y-0 left-40 -ml-1' },
  verticalReverse: { block: 'absolute inset-y-0 right-0 w-40 bg-surface-base', handle: 'absolute inset-y-0 right-40 -mr-1' },
  horizontal: { block: 'absolute inset-x-0 top-0 h-24 bg-surface-base', handle: 'absolute inset-x-0 top-24 -mt-1' },
  horizontalReverse: { block: 'absolute inset-x-0 bottom-0 h-24 bg-surface-base', handle: 'absolute inset-x-0 bottom-24 -mb-1' },
} as const;

function Stage({ frameClass = 'w-80', ...p }: Props & { frameClass?: string }) {
  const horizontal = p.orientation === 'horizontal';
  const f = frames[`${horizontal ? 'horizontal' : 'vertical'}${p.reverse ? 'Reverse' : ''}` as keyof typeof frames];
  const { formatValueText, className: handleClass, ...rest } = p;
  return (
    <div className={`relative h-50 rounded-lg bg-bg-canvas ${frameClass}`}>
      <div className={f.block} />
      <ResizeHandle
        min={240}
        max={480}
        label="Panel width"
        {...rest}
        formatValueText={toFormatter(formatValueText)}
        className={`${f.handle} ${handleClass ?? ''}`}
      />
    </div>
  );
}

export default defineFixture({
  id: 'resize-handle',
  render: props => {
    const p = props as Props;
    const horizontal = p.orientation === 'horizontal';
    return <Stage {...p} {...(horizontal ? { min: p.min ?? 120, max: p.max ?? 400, label: p.label ?? 'Panel height' } : {})} />;
  },
  examples: {
    edges: () => (
      <div className="flex flex-wrap items-start gap-6">
        <Stage defaultValue={320} className="*:bg-accent-solid" />
        <Stage orientation="horizontal" min={120} max={400} defaultValue={200} label="Panel height" className="shadow-focus" />
      </div>
    ),
  },
});
