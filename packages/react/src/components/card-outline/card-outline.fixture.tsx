import { Pencil, Plus } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { CardDescription, CardHeader, CardHeading, CardTitle, CardTrailing } from '../card/card.tsx';
import { IconButton } from '../icon-button/icon-button.tsx';
import { CardOutline, type CardOutlineProps } from './card-outline.tsx';

const axes = [
  { id: 'size', title: 'Variant axis · Size', values: 'sm, md, lg' },
  { id: 'tone', title: 'Variant axis · Tone', values: 'ink, accent, secondary' },
];

export default defineFixture({
  id: 'card-outline',
  frame: children => <div className="w-80 bg-surface-base p-1">{children}</div>,
  render: props => {
    const p = props as CardOutlineProps;
    if (p.border === 'dashed') return <CardOutline {...p}><Plus className="size-icon-sm" aria-hidden />Add axis</CardOutline>;
    return (
      <CardOutline {...p}>
        <CardHeader>
          <CardHeading><CardTitle>Variant axis · Size</CardTitle><CardDescription>sm, md, lg</CardDescription></CardHeading>
          <CardTrailing><IconButton size="sm" label="Edit"><Pencil /></IconButton></CardTrailing>
        </CardHeader>
      </CardOutline>
    );
  },
  examples: {
    'outline-card': () => (
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,calc(var(--spacing)*65)),1fr))] items-start gap-3.5">
        {axes.map(a => (
          <CardOutline key={a.id}>
            <CardHeader>
              <CardHeading><CardTitle>{a.title}</CardTitle><CardDescription>{a.values}</CardDescription></CardHeading>
              <CardTrailing><IconButton size="sm" label="Edit"><Pencil /></IconButton></CardTrailing>
            </CardHeader>
          </CardOutline>
        ))}
        <CardOutline border="dashed"><Plus className="size-icon-sm" aria-hidden />Add axis</CardOutline>
      </div>
    ),
  },
});
