import { defineFixture } from '../../lib/fixture.ts';
import { ScrollArea, type ScrollAreaProps } from './scroll-area.tsx';

const rows = Array.from({ length: 20 }, (_, i) => `Layer ${i + 1}`);
const tokens = Array.from({ length: 30 }, (_, i) => `color.accent.${(i + 1) * 10}`);

function Frame(props: ScrollAreaProps) {
  const horizontal = props.orientation === 'horizontal';
  return (
    <div className="h-40 w-60 rounded-lg bg-surface-base">
      <ScrollArea {...props}>
        {horizontal ? (
          <div className="flex items-center gap-2 whitespace-nowrap px-3 py-3 font-ui text-ui-md text-text-primary">
            {tokens.map(t => <span key={t} className="flex-none rounded-md bg-neutral-track px-2 py-1">{t}</span>)}
          </div>
        ) : (
          <div className="grid">
            {rows.map(r => <div key={r} className="px-3 py-1.5 font-ui text-ui-md text-text-primary">{r}</div>)}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default defineFixture({
  id: 'scroll-area',
  render: props => <Frame {...(props as ScrollAreaProps)} />,
  examples: {
    vertical: () => <Frame scrollbar="always" fade label="Layers" />,
  },
});
