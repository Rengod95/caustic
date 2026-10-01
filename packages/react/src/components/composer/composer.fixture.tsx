import { Contrast, FileCode, Frame, Image, SwatchBook, WandSparkles } from 'lucide-react';
import { defineFixture } from '../../lib/fixture.ts';
import { Chip } from '../chip/chip.tsx';
import { Suggestions, SuggestionsItem } from '../suggestions/suggestions.tsx';
import { Composer } from './composer.tsx';

const noop = () => {};
const text = 'Add a saved-cards list above the form, max 3, with an "Add card" row';
const chips = (
  <>
    <Chip shape="rounded" appearance="surface" icon={<Frame />} onRemove={noop}>Checkout / iOS</Chip>
    <Chip shape="rounded" appearance="surface" icon={<SwatchBook />} onRemove={noop}>Theme · Lagoon</Chip>
    <Chip shape="rounded" appearance="surface" icon={<Image />} onRemove={noop}>ref-stripe.png</Chip>
  </>
);

export default defineFixture({
  id: 'composer',
  render: props => (
    <div className="w-150">
      <Composer context={chips} defaultValue={text} defaultMode="Plan" modelLabel="Claude · Deep" usage={42} onAttach={noop} {...props} />
    </div>
  ),
  examples: {
    composer: () => (
      <div className="grid gap-3.5">
        <Composer context={chips} defaultValue={text} defaultMode="Plan" modelLabel="Claude · Deep" usage={42} onAttach={noop} />
        <Suggestions>
          <SuggestionsItem icon={<WandSparkles />} hint="from current theme">Generate 3 hero variants</SuggestionsItem>
          <SuggestionsItem icon={<Contrast />} hint="all frames · 3 themes">Audit contrast</SuggestionsItem>
          <SuggestionsItem icon={<FileCode />} hint="Tailwind tokens">Export to React</SuggestionsItem>
        </Suggestions>
      </div>
    ),
  },
});
