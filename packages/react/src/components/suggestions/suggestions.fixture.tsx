import { Contrast, FileCode, WandSparkles } from '../../icons/index.ts';
import { defineFixture } from '../../lib/fixture.ts';
import { SuggestionsItem, Suggestions } from './suggestions.tsx';

export default defineFixture({
  id: 'suggestions',
  render: ({ onClick, ...props }) => (
    <Suggestions {...props}>
      <SuggestionsItem icon={<WandSparkles />} hint="from current theme" onClick={onClick as (() => void) | undefined}>Generate 3 hero variants</SuggestionsItem>
      <SuggestionsItem icon={<Contrast />} hint="all frames · 3 themes">Audit contrast</SuggestionsItem>
      <SuggestionsItem icon={<FileCode />} hint="Tailwind tokens">Export to React</SuggestionsItem>
    </Suggestions>
  ),
  examples: {},
});
