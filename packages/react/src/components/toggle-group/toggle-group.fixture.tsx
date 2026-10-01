import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Strikethrough, Underline } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { ToggleGroup, ToggleGroupItem, type ToggleGroupProps } from './toggle-group.tsx';

export default defineFixture({
  id: 'toggle-group',
  render: props => {
    const p = props as Partial<ToggleGroupProps>;
    if (p.type === 'single') {
      return (
        <ToggleGroup aria-label="Alignment" {...(p as ToggleGroupProps)}>
          <ToggleGroupItem value="left" aria-label="Left" icon={<AlignLeft />} />
          <ToggleGroupItem value="center" aria-label="Center" icon={<AlignCenter />} />
          <ToggleGroupItem value="right" aria-label="Right" icon={<AlignRight />} />
        </ToggleGroup>
      );
    }
    return (
      <ToggleGroup aria-label="Text style" {...(p as ToggleGroupProps)}>
        <ToggleGroupItem value="bold" aria-label="Bold" icon={<Bold />} />
        <ToggleGroupItem value="italic" aria-label="Italic" icon={<Italic />} />
        <ToggleGroupItem value="underline" aria-label="Underline" icon={<Underline />} />
        <ToggleGroupItem value="strikethrough" aria-label="Strikethrough" icon={<Strikethrough />} />
      </ToggleGroup>
    );
  },
  examples: {
    'toggle-group': () => (
      <div className="flex flex-wrap items-center gap-3">
        <ToggleGroup aria-label="Text style" defaultValue={['bold', 'underline']}>
          <ToggleGroupItem value="bold" aria-label="Bold" icon={<Bold />} />
          <ToggleGroupItem value="italic" aria-label="Italic" icon={<Italic />} />
          <ToggleGroupItem value="underline" aria-label="Underline" icon={<Underline />} />
          <ToggleGroupItem value="strikethrough" aria-label="Strikethrough" icon={<Strikethrough />} />
        </ToggleGroup>
        <ToggleGroup type="single" appearance="outline" aria-label="Alignment" defaultValue="left">
          <ToggleGroupItem value="left" aria-label="Left" icon={<AlignLeft />} />
          <ToggleGroupItem value="center" aria-label="Center" icon={<AlignCenter />} />
          <ToggleGroupItem value="right" aria-label="Right" icon={<AlignRight />} />
        </ToggleGroup>
      </div>
    ),
  },
});
